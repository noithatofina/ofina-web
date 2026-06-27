/**
 * Telegram webhook — workflow tích hợp Auto Product Import.
 *
 * Flow:
 *  1. User paste URL  → bot extract + Claude viết content + save DRAFT
 *  2. User gửi ảnh   → bot upload vào draft mới nhất (compressed photo HOẶC document quality cao)
 *  3. User /done     → bot reply với nút Đọc trước / Duyệt & Đăng
 *
 * Security:
 *  - X-Telegram-Bot-Api-Secret-Token khớp TELEGRAM_WEBHOOK_SECRET
 *  - Chỉ chấp nhận chat của admin (anh Vinh) theo TELEGRAM_CHAT_ID
 *
 * Setup: GET /api/telegram/webhook?key=CRON_SECRET để register.
 */
import { NextRequest, NextResponse } from 'next/server'
import { sendTelegram } from '@/lib/telegram'
import { createAdminClient } from '@/lib/supabase-admin'
import { approveToken } from '@/lib/approve-token'

export const maxDuration = 120

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://ofina.vn'

/** Lấy draft mới nhất của admin (status='draft', có source_url, import < 60 phút) */
async function getLatestDraft() {
  const admin = createAdminClient()
  const sixtyMinAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()
  const { data } = await admin
    .from('products')
    .select('id, slug, name, ofina_sku')
    .eq('status', 'draft')
    .not('source_url', 'is', null)
    .gte('imported_at', sixtyMinAgo)
    .order('imported_at', { ascending: false })
    .limit(1)
    .maybeSingle()
  return data
}

/** Download file từ Telegram (compressed photo HOẶC document) → upload Supabase Storage + insert product_images */
async function handleImageUpload(fileId: string, isDocument: boolean, draft: { id: string; name: string; ofina_sku: string }) {
  const token = process.env.TELEGRAM_BOT_TOKEN
  if (!token) throw new Error('Thiếu TELEGRAM_BOT_TOKEN')

  // 1. getFile để lấy file_path
  const infoRes = await fetch(`https://api.telegram.org/bot${token}/getFile?file_id=${fileId}`, {
    signal: AbortSignal.timeout(15000),
  })
  const info = await infoRes.json()
  if (!info.ok) throw new Error(`getFile fail: ${JSON.stringify(info)}`)
  const filePath = info.result.file_path
  const fileSize = info.result.file_size || 0
  if (fileSize > 20 * 1024 * 1024) throw new Error(`File quá lớn (${Math.round(fileSize/1024/1024)}MB > 20MB)`)

  // 2. Download file content
  const fileUrl = `https://api.telegram.org/file/bot${token}/${filePath}`
  const fileRes = await fetch(fileUrl, { signal: AbortSignal.timeout(30000) })
  if (!fileRes.ok) throw new Error(`Download fail HTTP ${fileRes.status}`)
  const fileBuf = Buffer.from(await fileRes.arrayBuffer())

  // 3. Suy luận extension từ file_path
  const ext = (filePath.match(/\.([a-z0-9]+)$/i)?.[1] || 'jpg').toLowerCase()
  const validExt = ['jpg', 'jpeg', 'png', 'webp'].includes(ext) ? ext : 'jpg'
  const contentType = validExt === 'png' ? 'image/png' : validExt === 'webp' ? 'image/webp' : 'image/jpeg'

  // 4. Lấy số ảnh hiện tại của draft → position kế tiếp
  const admin = createAdminClient()
  const { count } = await admin
    .from('product_images')
    .select('id', { count: 'exact', head: true })
    .eq('product_id', draft.id)
  const position = count ?? 0
  const fileName = `${String(position + 1).padStart(2, '0')}.${validExt}`
  const storagePath = `${draft.ofina_sku}/${fileName}`

  // 5. Upload Supabase Storage
  const { error: upErr } = await admin.storage.from('products').upload(storagePath, fileBuf, {
    contentType,
    upsert: true,
  })
  if (upErr) throw new Error(`Upload storage fail: ${upErr.message}`)

  // 6. Insert product_images row
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const publicUrl = `${supabaseUrl}/storage/v1/object/public/products/${storagePath}`
  const altText = `${draft.name} - ảnh ${position + 1} chính hãng OFINA`
  const { error: insErr } = await admin.from('product_images').insert({
    product_id: draft.id,
    url: publicUrl,
    alt_text: altText,
    position,
    is_primary: position === 0,
  })
  if (insErr) throw new Error(`Insert image fail: ${insErr.message}`)

  return { position, fileName, isDocument, fileSize }
}

export async function POST(req: NextRequest) {
  const expectedSecret = process.env.TELEGRAM_WEBHOOK_SECRET
  const gotSecret = req.headers.get('x-telegram-bot-api-secret-token')
  if (!expectedSecret || gotSecret !== expectedSecret) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const adminChatId = process.env.TELEGRAM_CHAT_ID
  if (!adminChatId) return NextResponse.json({ ok: true })

  let update: any
  try { update = await req.json() } catch { return NextResponse.json({ ok: true }) }
  const msg = update?.message
  if (!msg) return NextResponse.json({ ok: true })

  const fromChatId = String(msg.chat?.id || '')
  if (fromChatId !== adminChatId) {
    console.warn(`[telegram-webhook] chat lạ: ${fromChatId}`)
    return NextResponse.json({ ok: true })
  }

  // === FLOW 1: Ảnh (photo hoặc document image) ===
  const photoArr: any[] | undefined = msg.photo
  const doc: any | undefined = msg.document
  const isDocumentImage = doc && typeof doc.mime_type === 'string' && doc.mime_type.startsWith('image/')

  if ((photoArr && photoArr.length > 0) || isDocumentImage) {
    const draft = await getLatestDraft()
    if (!draft) {
      await sendTelegram('⚠️ Không tìm thấy draft đang chờ ảnh. Hãy gửi URL sản phẩm trước nhé.\n\nFlow: /import URL → gửi ảnh → /done')
      return NextResponse.json({ ok: true })
    }

    try {
      let result
      if (isDocumentImage) {
        // Document (gốc, chất lượng cao hơn)
        result = await handleImageUpload(doc.file_id, true, draft)
      } else {
        // Photo (compressed) — lấy size lớn nhất
        const largest = photoArr![photoArr!.length - 1]
        result = await handleImageUpload(largest.file_id, false, draft)
      }
      const sizeKB = Math.round(result.fileSize / 1024)
      const qualityNote = result.isDocument ? ' (chất lượng cao)' : ' (đã nén)'
      await sendTelegram(
        `✅ Ảnh ${result.position + 1} OK${qualityNote} — ${result.fileName} (${sizeKB}KB)\n\nGửi tiếp ảnh tiếp theo, hoặc /done để xem trước & duyệt.`,
      )
    } catch (err) {
      const m = err instanceof Error ? err.message : String(err)
      await sendTelegram(`❌ Lỗi xử lý ảnh: ${m}`)
    }
    return NextResponse.json({ ok: true })
  }

  // === FLOW 2: Text command ===
  const text: string = msg.text || ''
  if (!text) return NextResponse.json({ ok: true })

  // /done — finalize draft
  if (text.trim().toLowerCase() === '/done') {
    const draft = await getLatestDraft()
    if (!draft) {
      await sendTelegram('⚠️ Không có draft nào đang chờ. Gửi URL trước nhé.')
      return NextResponse.json({ ok: true })
    }

    const admin = createAdminClient()
    const { count } = await admin
      .from('product_images')
      .select('id', { count: 'exact', head: true })
      .eq('product_id', draft.id)
    const imgCount = count ?? 0

    if (imgCount === 0) {
      await sendTelegram(`⚠️ Draft "${draft.name}" chưa có ảnh nào. Gửi ít nhất 1 ảnh trước rồi /done.`)
      return NextResponse.json({ ok: true })
    }

    const tok = approveToken(draft.id)
    const previewUrl = `${SITE_URL}/api/seo/preview-product?id=${draft.id}&t=${tok}`
    const approveUrl = `${SITE_URL}/api/seo/approve-product?id=${draft.id}&t=${tok}`
    const adminUrl = `${SITE_URL}/admin/products/${draft.id}`

    await sendTelegram(
      `📦 DRAFT SẴN SÀNG\n\n📝 ${draft.name}\n🖼️ ${imgCount} ảnh đã upload\n\nBấm nút bên dưới để duyệt:`,
      {
        buttons: [
          [{ text: '👀 Đọc trước', url: previewUrl }],
          [{ text: '✅ Duyệt & Đăng', url: approveUrl }],
          [{ text: '✏️ Sửa trong admin', url: adminUrl }],
        ],
      },
    )
    return NextResponse.json({ ok: true })
  }

  // /help
  if (text.trim().toLowerCase() === '/help' || text.trim().toLowerCase() === '/start') {
    await sendTelegram(
      `🤖 OFINA Auto Product Import Bot\n\n` +
      `Workflow:\n` +
      `1️⃣ Paste URL sản phẩm web khác\n` +
      `   → Bot extract content + Claude viết lại theo OFINA voice\n` +
      `   → Lưu DRAFT (chưa hiện trên web)\n\n` +
      `2️⃣ Gửi 5-6 ảnh sản phẩm (đã chỉnh sửa)\n` +
      `   📷 Gửi như Photo  = nén (nhanh, OK cho hầu hết)\n` +
      `   📎 Gửi như File   = chất lượng gốc (recommended)\n\n` +
      `3️⃣ /done → bot show nút Duyệt & Đăng\n\n` +
      `Lệnh khác:\n` +
      `  /status  — xem draft hiện tại\n` +
      `  /help    — xem help`,
    )
    return NextResponse.json({ ok: true })
  }

  // /status — current draft
  if (text.trim().toLowerCase() === '/status') {
    const draft = await getLatestDraft()
    if (!draft) {
      await sendTelegram('📋 Không có draft nào đang chờ.\n\nGửi URL để bắt đầu.')
      return NextResponse.json({ ok: true })
    }
    const admin = createAdminClient()
    const { count } = await admin
      .from('product_images')
      .select('id', { count: 'exact', head: true })
      .eq('product_id', draft.id)
    await sendTelegram(`📋 Draft hiện tại:\n📝 ${draft.name}\n🖼️ ${count ?? 0} ảnh\n\nGửi ảnh thêm, hoặc /done để duyệt.`)
    return NextResponse.json({ ok: true })
  }

  // URL — flow import (như cũ)
  const urlMatch = text.match(/https?:\/\/[^\s]+/)
  if (!urlMatch) {
    await sendTelegram('💬 Mình hiểu, nhưng cần URL sản phẩm. Paste URL hoặc gõ /help.')
    return NextResponse.json({ ok: true })
  }

  const sourceUrl = urlMatch[0].replace(/[.,;)]+$/, '')
  await sendTelegram(`⏳ Đang xử lý URL...\n${sourceUrl}\n\n20-40 giây nữa sẽ xong. Sau đó gửi ảnh tiếp.`)

  const cronSecret = process.env.CRON_SECRET
  if (!cronSecret) {
    await sendTelegram('❌ Thiếu CRON_SECRET ở Vercel.')
    return NextResponse.json({ ok: true })
  }

  const importUrl = `${SITE_URL}/api/seo/import-product?key=${cronSecret}&url=${encodeURIComponent(sourceUrl)}&from=telegram`
  try {
    const res = await fetch(importUrl, { signal: AbortSignal.timeout(110000) })
    if (!res.ok) {
      const txt = await res.text().catch(() => '')
      await sendTelegram(`❌ Import lỗi HTTP ${res.status}: ${txt.slice(0, 300)}`)
    }
  } catch (err) {
    await sendTelegram(`❌ Import lỗi: ${err instanceof Error ? err.message : err}`)
  }

  return NextResponse.json({ ok: true })
}

export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get('key')
  if (key !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }
  const token = process.env.TELEGRAM_BOT_TOKEN
  const secret = process.env.TELEGRAM_WEBHOOK_SECRET
  if (!token) return NextResponse.json({ error: 'thiếu TELEGRAM_BOT_TOKEN' }, { status: 500 })
  if (!secret) return NextResponse.json({ error: 'thiếu TELEGRAM_WEBHOOK_SECRET' }, { status: 500 })

  const webhookUrl = `${SITE_URL}/api/telegram/webhook`
  const res = await fetch(`https://api.telegram.org/bot${token}/setWebhook`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      url: webhookUrl,
      secret_token: secret,
      allowed_updates: ['message'],
    }),
  })
  const data = await res.json()
  return NextResponse.json({ webhookUrl, telegram: data })
}
