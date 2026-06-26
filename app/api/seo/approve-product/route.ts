/**
 * Duyệt & đăng SP one-click từ Telegram.
 * GET /api/seo/approve-product?id=<productId>&t=<token>
 *
 * Set status='active' + revalidate + IndexNow ping.
 * Token ký HMAC bằng CRON_SECRET (reuse lib/approve-token).
 */
import { NextRequest } from 'next/server'
import { createAdminClient } from '@/lib/supabase-admin'
import { verifyApproveToken } from '@/lib/approve-token'
import { pingIndexNow } from '@/lib/indexnow'
import { revalidatePath } from 'next/cache'

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
    return page('Link không hợp lệ', 'Link duyệt SP không đúng hoặc đã hết hiệu lực.', undefined, false)
  }

  const admin = createAdminClient()
  const { data: product } = await admin
    .from('products')
    .select('id, slug, name, status')
    .eq('id', id)
    .maybeSingle()

  if (!product) {
    return page('Không tìm thấy SP', 'SP có thể đã bị xoá.', undefined, false)
  }

  const liveUrl = `${SITE_URL}/san-pham/${product.slug}`

  if (product.status === 'active') {
    return page('SP đã ở trạng thái LIVE', `"${product.name}" đã hiện trên web.`, { href: liveUrl, label: '👀 Xem SP' })
  }

  // Set active
  const { error } = await admin
    .from('products')
    .update({ status: 'active', updated_at: new Date().toISOString() })
    .eq('id', id)

  if (error) {
    return page('Lỗi khi đăng SP', `Lỗi: ${error.message}`, undefined, false)
  }

  // Revalidate + IndexNow
  try {
    revalidatePath(`/san-pham/${product.slug}`)
    revalidatePath('/danh-muc/ghe-cong-thai-hoc')
    revalidatePath('/')
  } catch {}
  await pingIndexNow([`/san-pham/${product.slug}`])

  return page(
    'Đã đăng SP thành công!',
    `"${product.name}" đã hiện công khai trên ofina.vn. Đã ping IndexNow cho Google/Bing.`,
    { href: liveUrl, label: '👀 Xem SP trên web' },
  )
}
