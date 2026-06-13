/**
 * Duyệt & đăng bài one-click từ Telegram.
 * GET /api/seo/approve?id=<postId>&t=<token>
 *
 * Token ký HMAC bằng CRON_SECRET (xem lib/approve-token). Bấm link = đăng bài.
 * Trả về trang HTML xác nhận thân thiện mobile (vì mở từ Telegram).
 */
import { NextRequest } from 'next/server'
import { createAdminClient } from '@/lib/supabase-admin'
import { verifyApproveToken } from '@/lib/approve-token'
import { pingIndexNow } from '@/lib/indexnow'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://ofina.vn'

function page(title: string, message: string, link?: { href: string; label: string }, ok = true): Response {
  const html = `<!doctype html><html lang="vi"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>${title} | OFINA</title>
<style>
  body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#f5f5f4;margin:0;padding:24px;display:flex;min-height:90vh;align-items:center;justify-content:center}
  .card{background:#fff;max-width:420px;width:100%;border-radius:20px;padding:32px 24px;box-shadow:0 8px 30px rgba(0,0,0,.08);text-align:center}
  .emoji{font-size:56px;line-height:1;margin-bottom:12px}
  h1{font-size:20px;margin:0 0 8px;color:#1c1917}
  p{color:#57534e;font-size:15px;line-height:1.5;margin:0 0 20px}
  a.btn{display:inline-block;background:${ok ? '#16a34a' : '#0f766e'};color:#fff;text-decoration:none;padding:12px 24px;border-radius:12px;font-weight:600;font-size:15px}
</style></head><body><div class="card">
  <div class="emoji">${ok ? '✅' : '⚠️'}</div>
  <h1>${title}</h1>
  <p>${message}</p>
  ${link ? `<a class="btn" href="${link.href}">${link.label}</a>` : ''}
</div></body></html>`
  return new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } })
}

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id') || ''
  const token = req.nextUrl.searchParams.get('t') || ''

  if (!id || !token || !verifyApproveToken(id, token)) {
    return page('Link không hợp lệ', 'Link duyệt bài không đúng hoặc đã hết hiệu lực.', undefined, false)
  }

  const admin = createAdminClient()
  const { data: post } = await admin
    .from('blog_posts')
    .select('id, slug, title, is_published')
    .eq('id', id)
    .maybeSingle()

  if (!post) {
    return page('Không tìm thấy bài', 'Bài viết có thể đã bị xoá.', undefined, false)
  }

  const liveUrl = `${SITE_URL}/blog/${post.slug}`

  if (post.is_published) {
    return page('Bài đã được đăng', `"${post.title}" đã ở trạng thái công khai.`, { href: liveUrl, label: '👀 Xem bài trên web' })
  }

  const { error } = await admin
    .from('blog_posts')
    .update({ is_published: true, published_at: new Date().toISOString() })
    .eq('id', id)

  if (error) {
    return page('Có lỗi khi đăng', error.message, undefined, false)
  }

  // Ping Google/Bing index ngay
  await pingIndexNow([`/blog/${post.slug}`, '/blog'])

  return page('Đã đăng bài thành công!', `"${post.title}" đã lên web và đang được gửi tới Google để lập chỉ mục.`, {
    href: liveUrl,
    label: '👀 Xem bài trên web',
  })
}
