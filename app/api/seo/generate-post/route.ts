/**
 * AI Content Bot endpoint — sinh 1 bài blog DRAFT chuẩn SEO rồi báo Telegram
 * cho anh Vinh duyệt.
 *
 * Trigger:
 *  - Vercel Cron (lịch trong vercel.json) — tự gửi header Authorization: Bearer CRON_SECRET
 *  - Thủ công: GET/POST /api/seo/generate-post?key=CRON_SECRET[&topic=<index>][&publish=1]
 *
 * Luồng: chọn chủ đề chưa viết → Claude viết → lưu blog_posts (is_published=false)
 *        → Telegram báo link duyệt tại /admin/blog/[id].
 *
 * Env cần có: ANTHROPIC_API_KEY, CRON_SECRET, (TELEGRAM_* để báo).
 */

import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-admin'
import { sanitizeHtml } from '@/lib/sanitize-html'
import { sendTelegram } from '@/lib/telegram'
import { generateBlogPost } from '@/lib/ai-writer'
import { SEO_TOPICS, type SeoTopic } from '@/lib/seo-topics'
import { pingIndexNow } from '@/lib/indexnow'

export const maxDuration = 120 // sinh bài có thể mất ~30–60s

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://ofina.vn'

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

/** Slug hoá để đối chiếu chủ đề đã viết */
function topicSlug(t: SeoTopic): string {
  return t.keyword
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

async function handle(req: NextRequest) {
  if (!isAuthed(req)) return unauthorized()

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: 'Chưa cấu hình ANTHROPIC_API_KEY' }, { status: 500 })
  }

  const admin = createAdminClient()
  const sp = req.nextUrl.searchParams
  const shouldPublish = sp.get('publish') === '1'
  const forcedIdx = sp.get('topic') ? parseInt(sp.get('topic')!, 10) : null

  // 1. Chọn chủ đề chưa viết
  let topic: SeoTopic | undefined
  if (forcedIdx !== null && SEO_TOPICS[forcedIdx]) {
    topic = SEO_TOPICS[forcedIdx]
  } else {
    const { data: existing } = await admin.from('blog_posts').select('slug')
    const usedSlugs = new Set((existing || []).map((r: any) => r.slug))
    // chủ đề coi như "đã viết" nếu slug-hoá keyword trùng tiền tố slug đã có
    topic = SEO_TOPICS.find((t) => {
      const ts = topicSlug(t)
      for (const s of usedSlugs) {
        if (s === ts || s.startsWith(ts.slice(0, 30))) return false
      }
      return true
    })
  }

  if (!topic) {
    await sendTelegram('🤖 OFINA Content Bot: đã viết hết chủ đề trong hàng đợi. Thêm chủ đề mới vào lib/seo-topics.ts nhé.')
    return NextResponse.json({ message: 'Hết chủ đề trong hàng đợi' })
  }

  // 2. Sinh bài
  let post
  try {
    post = await generateBlogPost(topic)
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    await sendTelegram(`🤖 OFINA Content Bot LỖI khi viết "${topic.keyword}":\n${msg}`)
    return NextResponse.json({ error: msg }, { status: 500 })
  }

  // 3. Đảm bảo slug không trùng
  let slug = post.slug
  const { data: dup } = await admin.from('blog_posts').select('id').eq('slug', slug).maybeSingle()
  if (dup) slug = `${slug}-${Date.now().toString(36).slice(-4)}`

  // 4. Lưu DRAFT
  const { data: created, error } = await admin
    .from('blog_posts')
    .insert({
      title: post.title,
      slug,
      excerpt: post.excerpt,
      content: sanitizeHtml(post.content),
      category: post.category,
      tags: post.tags,
      seo_title: post.seo_title,
      seo_description: post.seo_description,
      author: 'OFINA',
      is_published: shouldPublish,
      published_at: shouldPublish ? new Date().toISOString() : null,
    })
    .select('id, slug')
    .single()

  if (error || !created) {
    const msg = error?.message || 'insert failed'
    await sendTelegram(`🤖 OFINA Content Bot: viết xong nhưng LƯU LỖI: ${msg}`)
    return NextResponse.json({ error: msg }, { status: 500 })
  }

  const adminUrl = `${SITE_URL}/admin/blog/${created.id}`
  const liveUrl = `${SITE_URL}/blog/${created.slug}`

  // 5. Báo Telegram cho anh Vinh duyệt
  if (shouldPublish) {
    await pingIndexNow([`/blog/${created.slug}`, '/blog'])
    await sendTelegram(
      `🤖✅ BÀI MỚI ĐÃ ĐĂNG\n\n📝 ${post.title}\n🏷️ ${post.category}\n\nXem bài: ${liveUrl}\nSửa: ${adminUrl}`,
      { buttons: [[{ text: '👀 Xem bài', url: liveUrl }, { text: '✏️ Sửa', url: adminUrl }]] }
    )
  } else {
    await sendTelegram(
      `🤖📝 BÀI NHÁP CHỜ DUYỆT\n\n📝 ${post.title}\n🏷️ ${post.category}\n📄 ${post.excerpt}\n\n👉 Mở để đọc & bấm "Đăng" nếu OK:\n${adminUrl}`,
      { buttons: [[{ text: '✍️ Duyệt bài ngay', url: adminUrl }]] }
    )
  }

  return NextResponse.json({
    ok: true,
    topic: topic.keyword,
    id: created.id,
    slug: created.slug,
    published: shouldPublish,
    adminUrl,
  })
}

export async function GET(req: NextRequest) {
  return handle(req)
}

export async function POST(req: NextRequest) {
  return handle(req)
}
