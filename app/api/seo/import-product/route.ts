/**
 * Auto Product Import endpoint — input URL của 1 sản phẩm web khác,
 * tự động extract FACTS + Claude viết MỚI trang OFINA + lưu DRAFT +
 * báo Telegram cho anh Vinh duyệt.
 *
 * Trigger:
 *  - GET /api/seo/import-product?key=CRON_SECRET&url=<encoded_source_url>
 *  - hoặc POST { url } với Authorization: Bearer CRON_SECRET
 *
 * Luồng:
 *  1. Validate URL + auth
 *  2. Extract FACTS bằng product-extractor (KHÔNG paraphrase)
 *  3. Claude viết MỚI (system prompt cấm paraphrase rawDescription)
 *  4. Lưu products row status='draft', log source_url
 *  5. Telegram báo anh Vinh: list ảnh URLs + nút Đọc trước / Duyệt & Đăng
 *
 * Lưu ý quan trọng (safeguard):
 *  - status mặc định LUÔN 'draft' — không bao giờ tự active.
 *  - Ảnh CHỈ list URL trong Telegram, KHÔNG tự upload lên Supabase.
 *    Anh Vinh tự download + upload qua admin/products/[id].
 *  - source_url được lưu để có audit trail.
 *  - Rate limit: 5 import / giờ.
 */

import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-admin'
import { sanitizeHtml } from '@/lib/sanitize-html'
import { sendTelegram } from '@/lib/telegram'
import { extractProduct } from '@/lib/product-extractor'
import { generateProductPage } from '@/lib/product-writer'
import { approveToken } from '@/lib/approve-token'

export const maxDuration = 120

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://ofina.vn'
const RATE_LIMIT_PER_HOUR = 30

function unauthorized() {
  return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
}

function isAuthed(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET
  if (!secret) return false
  const auth = req.headers.get('authorization')
  if (auth === `Bearer ${secret}`) return true
  const key = req.nextUrl.searchParams.get('key')
  return key === secret
}

/** Rate limit dựa trên số product có source_url được import trong 1h qua. */
async function checkRateLimit(): Promise<{ ok: boolean; count: number }> {
  const admin = createAdminClient()
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()
  const { count } = await admin
    .from('products')
    .select('id', { count: 'exact', head: true })
    .not('source_url', 'is', null)
    .gte('imported_at', oneHourAgo)
  const used = count ?? 0
  return { ok: used < RATE_LIMIT_PER_HOUR, count: used }
}

async function handle(req: NextRequest, urlInput?: string) {
  if (!isAuthed(req)) return unauthorized()
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: 'Chưa cấu hình ANTHROPIC_API_KEY' }, { status: 500 })
  }

  const sourceUrl = urlInput || req.nextUrl.searchParams.get('url') || ''
  if (!sourceUrl) return NextResponse.json({ error: 'Thiếu tham số url' }, { status: 400 })
  const fromTelegram = req.nextUrl.searchParams.get('from') === 'telegram'

  // 1a. Dedup: cùng source_url đã có draft trong 1h qua → reuse, không tạo mới
  const adminDedup = createAdminClient()
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()
  const { data: existing } = await adminDedup
    .from('products')
    .select('id, slug, name')
    .eq('source_url', sourceUrl)
    .eq('status', 'draft')
    .gte('imported_at', oneHourAgo)
    .order('imported_at', { ascending: false })
    .limit(1)
    .maybeSingle()
  if (existing) {
    const tok = approveToken(existing.id)
    if (fromTelegram) {
      await sendTelegram(
        `♻️ ĐÃ CÓ DRAFT URL NÀY\n\n📝 ${existing.name}\n\nGửi ảnh tiếp, hoặc /done để duyệt.`,
        { buttons: [[{ text: '👀 Xem content', url: `${SITE_URL}/api/seo/preview-product?id=${existing.id}&t=${tok}` }]] },
      )
    }
    return NextResponse.json({
      ok: true,
      reused: true,
      id: existing.id,
      slug: existing.slug,
      name: existing.name,
    })
  }

  // 1b. Rate limit (chỉ tính khi tạo NEW draft)
  const rl = await checkRateLimit()
  if (!rl.ok) {
    await sendTelegram(`🤖⏱️ Auto Import bị chặn rate limit: đã import ${rl.count} SP trong 1 giờ (max ${RATE_LIMIT_PER_HOUR}). Đợi 1 giờ hoặc xoá draft cũ.`)
    return NextResponse.json({ error: `rate-limit: ${rl.count}/${RATE_LIMIT_PER_HOUR}/giờ` }, { status: 429 })
  }

  // 2. Extract FACTS
  let extracted
  try {
    extracted = await extractProduct(sourceUrl)
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    await sendTelegram(`🤖❌ Auto Import LỖI extract: ${msg}\n\nURL: ${sourceUrl}`)
    return NextResponse.json({ error: msg }, { status: 400 })
  }

  if (!extracted.name) {
    await sendTelegram(`🤖❌ Auto Import: không tìm được tên sản phẩm trong URL\n\n${sourceUrl}`)
    return NextResponse.json({ error: 'Không extract được tên sản phẩm' }, { status: 400 })
  }

  // 3. Claude viết MỚI từ facts
  let generated
  try {
    generated = await generateProductPage(extracted)
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    await sendTelegram(`🤖❌ Auto Import LỖI Claude: ${msg}\n\nURL: ${sourceUrl}`)
    return NextResponse.json({ error: msg }, { status: 500 })
  }

  const admin = createAdminClient()

  // 4. Lookup category dựa trên categoryHint (best-effort)
  let categoryId: string | null = null
  if (extracted.categoryHint) {
    const { data: cats } = await admin
      .from('categories')
      .select('id, name')
      .ilike('name', `%${extracted.categoryHint.slice(0, 30)}%`)
      .limit(1)
    if (cats && cats[0]) categoryId = cats[0].id
  }
  if (!categoryId) {
    // Fallback: ghế công thái học (đa số import là ghế)
    const { data: cat } = await admin
      .from('categories')
      .select('id')
      .eq('slug', 'ghe-cong-thai-hoc')
      .maybeSingle()
    if (cat) categoryId = cat.id
  }

  // 5. Đảm bảo slug + SKU duy nhất
  let slug = generated.slug
  const { data: dup } = await admin.from('products').select('id').eq('slug', slug).maybeSingle()
  if (dup) slug = `${slug}-${Date.now().toString(36).slice(-4)}`

  const skuPrefix = `OFN-IMP-${slug.slice(0, 12).toUpperCase()}`
  const sku = `${skuPrefix}-${Date.now().toString(36).slice(-4).toUpperCase()}`

  // 6. Ghép META + body để hợp format OFINA
  const meta = {
    specs: generated.specs,
    highlights: generated.highlights,
    faq: generated.faq,
  }
  const fullDescription = `<!--META\n${JSON.stringify(meta)}\n-->\n\n${sanitizeHtml(generated.description)}`

  // 7. Lưu DRAFT
  const { data: created, error } = await admin
    .from('products')
    .insert({
      name: generated.name,
      slug,
      ofina_sku: sku,
      brand: extracted.brand || null,
      category_id: categoryId,
      price: extracted.price || 0,
      compare_price: extracted.originalPrice || null,
      is_price_hidden: !extracted.price,
      in_stock: true,
      stock_quantity: 0,
      status: 'draft', // ← QUAN TRỌNG: luôn draft, anh Vinh duyệt
      is_new: true,
      short_description: generated.short_description,
      description: fullDescription,
      seo_title: generated.seo_title,
      seo_description: generated.seo_description,
      seo_keywords: generated.seo_keywords,
      source_url: sourceUrl, // ← Audit trail
      imported_at: new Date().toISOString(),
    })
    .select('id, slug, name')
    .single()

  if (error || !created) {
    const msg = error?.message || 'insert failed'
    await sendTelegram(`🤖❌ Auto Import: viết xong nhưng LƯU LỖI: ${msg}`)
    return NextResponse.json({ error: msg }, { status: 500 })
  }

  // 8. Báo Telegram
  const tok = approveToken(created.id)
  const previewUrl = `${SITE_URL}/api/seo/preview-product?id=${created.id}&t=${tok}`
  const approveUrl = `${SITE_URL}/api/seo/approve-product?id=${created.id}&t=${tok}`
  const adminUrl = `${SITE_URL}/admin/products/${created.id}`

  const priceStr = extracted.price
    ? `${extracted.price.toLocaleString('vi-VN')}đ${extracted.originalPrice ? ` (gốc ${extracted.originalPrice.toLocaleString('vi-VN')}đ)` : ''}`
    : '— (chưa extract được)'

  if (fromTelegram) {
    // Workflow tích hợp: user sẽ gửi ảnh tiếp + /done
    await sendTelegram(
      `✅ CONTENT XONG\n\n` +
        `📝 ${generated.name}\n` +
        `💰 ${priceStr}\n` +
        `🔗 Nguồn: ${sourceUrl}\n\n` +
        `📸 Giờ gửi 5-6 ảnh sản phẩm:\n` +
        `  📷 Photo  = nén (nhanh)\n` +
        `  📎 File   = chất lượng gốc (recommended)\n\n` +
        `Khi xong gõ /done để show nút Duyệt & Đăng.`,
      { buttons: [[{ text: '👀 Xem content trước', url: previewUrl }]] },
    )
  } else {
    // Workflow cũ (trigger qua URL/curl): show full approve buttons ngay
    const imgList = (extracted.imageUrls || []).slice(0, 8).map((u, i) => `${i + 1}. ${u}`).join('\n')
    await sendTelegram(
      `🤖📦 SP MỚI ĐÃ VIẾT (DRAFT)\n\n` +
        `📝 ${generated.name}\n` +
        `💰 ${priceStr}\n` +
        `🔗 Nguồn: ${sourceUrl}\n\n` +
        `🖼️ Ảnh từ nguồn:\n${imgList || '(không có)'}\n\n` +
        `Upload ảnh qua admin rồi bấm Duyệt.`,
      {
        buttons: [
          [{ text: '👀 Đọc trước', url: previewUrl }],
          [{ text: '✅ Duyệt & Đăng', url: approveUrl }],
          [{ text: '✏️ Sửa trong admin', url: adminUrl }],
        ],
      },
    )
  }

  return NextResponse.json({
    ok: true,
    id: created.id,
    slug: created.slug,
    name: created.name,
    sourceUrl,
    extractedImageCount: extracted.imageUrls?.length || 0,
    adminUrl,
    previewUrl,
    approveUrl,
  })
}

export async function GET(req: NextRequest) {
  return handle(req)
}

export async function POST(req: NextRequest) {
  let url: string | undefined
  try {
    const body = await req.json()
    url = body?.url
  } catch {}
  return handle(req, url)
}
