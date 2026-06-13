/**
 * Xem trước bài nháp từ Telegram (không cần đăng nhập admin).
 * GET /api/seo/preview?id=<postId>&t=<token>
 * Token ký HMAC như approve. Chỉ hiển thị nội dung, không sửa.
 */
import { NextRequest } from 'next/server'
import { createAdminClient } from '@/lib/supabase-admin'
import { verifyApproveToken, approveToken } from '@/lib/approve-token'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://ofina.vn'

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id') || ''
  const token = req.nextUrl.searchParams.get('t') || ''

  if (!id || !token || !verifyApproveToken(id, token)) {
    return new Response('Link không hợp lệ.', { status: 403 })
  }

  const admin = createAdminClient()
  const { data: post } = await admin
    .from('blog_posts')
    .select('title, excerpt, content, category, is_published, slug')
    .eq('id', id)
    .maybeSingle()

  if (!post) return new Response('Không tìm thấy bài.', { status: 404 })

  const approveUrl = `${SITE_URL}/api/seo/approve?id=${id}&t=${approveToken(id)}`
  const statusBanner = post.is_published
    ? `<div class="banner live">✅ Bài này đã được đăng — <a href="${SITE_URL}/blog/${post.slug}">xem trên web</a></div>`
    : `<div class="banner draft">📝 Bản nháp — đọc xong nếu ưng thì bấm nút bên dưới để đăng</div>`

  const html = `<!doctype html><html lang="vi"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>Xem trước: ${post.title}</title>
<style>
  body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#1c1917;background:#fafaf9;margin:0;padding:0 0 96px}
  .wrap{max-width:680px;margin:0 auto;padding:20px}
  .banner{padding:12px 16px;border-radius:12px;font-size:14px;margin-bottom:20px}
  .banner.draft{background:#fef3c7;color:#92400e}
  .banner.live{background:#dcfce7;color:#166534}
  .cat{display:inline-block;background:#f0fdfa;color:#0f766e;font-size:13px;font-weight:600;padding:4px 10px;border-radius:8px;margin-bottom:10px}
  h1{font-size:26px;line-height:1.25;margin:0 0 10px}
  .excerpt{color:#57534e;font-size:17px;margin:0 0 24px}
  .content{font-size:16px;line-height:1.7}
  .content h2{font-size:21px;margin:28px 0 10px}
  .content h3{font-size:18px;margin:22px 0 8px}
  .content p{margin:0 0 14px}
  .content ul,.content ol{margin:0 0 14px;padding-left:22px}
  .content li{margin-bottom:6px}
  .content table{border-collapse:collapse;width:100%;margin:14px 0;font-size:14px}
  .content th,.content td{border:1px solid #e7e5e4;padding:8px;text-align:left}
  .content a{color:#0f766e}
  .bar{position:fixed;bottom:0;left:0;right:0;background:#fff;border-top:1px solid #e7e5e4;padding:14px;display:flex;justify-content:center}
  .bar a{background:#16a34a;color:#fff;text-decoration:none;padding:14px 28px;border-radius:12px;font-weight:700;font-size:16px;width:100%;max-width:400px;text-align:center}
</style></head><body><div class="wrap">
  ${statusBanner}
  <span class="cat">${post.category || 'Blog'}</span>
  <h1>${post.title}</h1>
  ${post.excerpt ? `<p class="excerpt">${post.excerpt}</p>` : ''}
  <div class="content">${post.content || ''}</div>
</div>
${post.is_published ? '' : `<div class="bar"><a href="${approveUrl}">✅ Duyệt & Đăng bài này</a></div>`}
</body></html>`

  return new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } })
}
