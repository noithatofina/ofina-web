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
import { approveToken } from '@/lib/approve-token'

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

/** Sổ cái chủ đề đã viết — nguồn sự thật duy nhất, lưu site_settings. */
const USED_TOPICS_KEY = 'seo.bot.used_topics'
/** Quá ngưỡng nháp tồn đọng thì dừng sinh bài (chống chất đống khi không ai duyệt). */
const MAX_PENDING_DRAFTS = 10

async function handle(req: NextRequest) {
  if (!isAuthed(req)) return unauthorized()

  const admin = createAdminClient()
  const sp = req.nextUrl.searchParams
  const shouldPublish = sp.get('publish') === '1'
  const forcedIdx = sp.get('topic') ? parseInt(sp.get('topic')!, 10) : null
  const dryRun = sp.get('dry') === '1'
  const force = sp.get('force') === '1'

  // 0. Van an toàn: nháp tồn quá nhiều nghĩa là không ai duyệt — viết thêm chỉ chất đống
  const { count: pendingDrafts } = await admin
    .from('blog_posts')
    .select('*', { count: 'exact', head: true })
    .eq('is_published', false)
  if (!force && !dryRun && (pendingDrafts ?? 0) >= MAX_PENDING_DRAFTS) {
    await sendTelegram(
      `🤖⏸ OFINA Content Bot TẠM DỪNG: đang tồn ${pendingDrafts} bài nháp chưa duyệt (ngưỡng ${MAX_PENDING_DRAFTS}). Duyệt/dọn bớt nháp rồi bot tự chạy lại, hoặc chạy tay với &force=1.`
    )
    return NextResponse.json({ skipped: true, reason: 'quá nhiều nháp chưa duyệt', pendingDrafts })
  }

  // 1. Chọn chủ đề chưa viết — đối chiếu sổ cái, KHÔNG so slug mờ
  //    (bug cũ: so 30 ký tự đầu keyword slug-hoá với slug do AI tự đặt → lệch
  //     chuỗi → topic đầu không bao giờ bị đánh dấu đã viết → 42 bài trùng)
  const { data: ledgerRow } = await admin
    .from('site_settings')
    .select('value')
    .eq('key', USED_TOPICS_KEY)
    .maybeSingle()
  const usedKeys = new Set<string>(((ledgerRow?.value as any)?.keys as string[]) || [])

  let topic: SeoTopic | undefined
  if (forcedIdx !== null && SEO_TOPICS[forcedIdx]) {
    topic = SEO_TOPICS[forcedIdx]
  } else {
    topic = SEO_TOPICS.find((t) => !usedKeys.has(topicSlug(t)))
  }

  if (!topic) {
    await sendTelegram('🤖 OFINA Content Bot: đã viết hết chủ đề trong hàng đợi. Thêm chủ đề mới vào lib/seo-topics.ts nhé.')
    return NextResponse.json({ message: 'Hết chủ đề trong hàng đợi' })
  }

  // Chế độ xem trước: trả về chủ đề sẽ viết, không gọi AI, không ghi gì
  if (dryRun) {
    return NextResponse.json({
      dry: true,
      wouldWrite: topic.keyword,
      topicKey: topicSlug(topic),
      pendingDrafts,
      usedTopicCount: usedKeys.size,
    })
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

  // 4b. Ghi sổ cái chủ đề đã viết (kể cả khi chạy ép topic= để khỏi viết lại)
  const newKeys = [...usedKeys, topicSlug(topic)].filter((v, i, a) => a.indexOf(v) === i)
  await admin
    .from('site_settings')
    .upsert({ key: USED_TOPICS_KEY, value: { keys: newKeys } }, { onConflict: 'key' })

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
    const tok = approveToken(created.id)
    const previewUrl = `${SITE_URL}/api/seo/preview?id=${created.id}&t=${tok}`
    const approveUrl = `${SITE_URL}/api/seo/approve?id=${created.id}&t=${tok}`
    await sendTelegram(
      `🤖📝 BÀI NHÁP CHỜ DUYỆT\n\n📝 ${post.title}\n🏷️ ${post.category}\n📄 ${post.excerpt}\n\n• Bấm "Đọc trước" để xem toàn bài (cuối trang có nút Đăng)\n• Hoặc bấm "Duyệt & Đăng ngay" để đăng luôn`,
      {
        buttons: [
          [{ text: '👀 Đọc trước', url: previewUrl }],
          [{ text: '✅ Duyệt & Đăng ngay', url: approveUrl }],
        ],
      }
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
