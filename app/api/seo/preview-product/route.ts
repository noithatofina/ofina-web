/**
 * Preview product draft — render trang sản phẩm dạng mobile-friendly
 * không cần login admin. Để anh Vinh đọc trước khi bấm "Duyệt & Đăng".
 *
 * GET /api/seo/preview-product?id=<productId>&t=<token>
 */
import { NextRequest } from 'next/server'
import { createAdminClient } from '@/lib/supabase-admin'
import { verifyApproveToken } from '@/lib/approve-token'
import { formatPrice } from '@/lib/utils'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://ofina.vn'

function errorPage(title: string, message: string): Response {
  const html = `<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex"><title>${title}</title>
<style>body{font-family:-apple-system,sans-serif;background:#f5f5f4;margin:0;padding:24px;display:flex;min-height:90vh;align-items:center;justify-content:center}.card{background:#fff;max-width:420px;border-radius:20px;padding:32px 24px;text-align:center;box-shadow:0 8px 30px rgba(0,0,0,.08)}</style>
</head><body><div class="card"><div style="font-size:56px">⚠️</div><h1 style="margin:8px 0">${title}</h1><p style="color:#57534e">${message}</p></div></body></html>`
  return new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } })
}

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id') || ''
  const token = req.nextUrl.searchParams.get('t') || ''
  if (!id || !token || !verifyApproveToken(id, token)) {
    return errorPage('Link không hợp lệ', 'Link xem trước không đúng hoặc đã hết hiệu lực.')
  }

  const admin = createAdminClient()
  const { data: p } = await admin.from('products').select('*').eq('id', id).maybeSingle()
  if (!p) return errorPage('Không tìm thấy SP', 'SP đã bị xoá hoặc id sai.')

  // Parse META từ description
  let meta: any = { specs: {}, highlights: [], faq: [] }
  let body = p.description || ''
  const metaMatch = body.match(/<!--META\s*([\s\S]*?)-->/)
  if (metaMatch) {
    try { meta = JSON.parse(metaMatch[1]) } catch {}
    body = body.replace(/<!--META[\s\S]*?-->/, '').trim()
  }

  const approveUrl = `${SITE_URL}/api/seo/approve-product?id=${id}&t=${token}`
  const adminUrl = `${SITE_URL}/admin/products/${id}`

  const html = `<!doctype html><html lang="vi"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex">
<title>Đọc trước: ${p.name}</title>
<style>
*{box-sizing:border-box}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#f5f5f4;margin:0;color:#1c1917;padding-bottom:120px;line-height:1.5}
.container{max-width:720px;margin:0 auto;padding:20px}
.banner{background:#fef3c7;border:1px solid #fcd34d;border-radius:12px;padding:14px 16px;margin-bottom:20px;font-size:13px;color:#92400e}
.card{background:#fff;border-radius:16px;padding:20px;margin-bottom:16px;box-shadow:0 1px 3px rgba(0,0,0,.04)}
h1{font-size:24px;margin:0 0 10px;line-height:1.25}
h2{font-size:20px;margin:24px 0 12px;color:#0f172a}
h3{font-size:16px;margin:18px 0 6px;color:#155EEF}
p{margin:0 0 12px;color:#374151}
ul,ol{padding-left:22px;margin:0 0 12px}li{margin:5px 0;color:#374151}
.price{font-size:28px;font-weight:700;color:#155EEF}.price-old{font-size:14px;color:#94a3b8;text-decoration:line-through;margin-left:8px}
.specs{width:100%;border-collapse:collapse}.specs td{padding:8px 0;border-bottom:1px solid #e5e7eb;font-size:14px;vertical-align:top}.specs td:first-child{color:#6b7280;width:45%;padding-right:8px}
details{border:1px solid #e5e7eb;border-radius:10px;margin:8px 0;background:#fff}details>summary{cursor:pointer;padding:10px 12px;font-weight:600;font-size:14px;list-style:none}details>div{padding:0 12px 12px;font-size:14px;color:#374151}
.bottom-bar{position:fixed;bottom:0;left:0;right:0;background:#fff;border-top:1px solid #e5e7eb;padding:10px 16px;display:flex;gap:8px;box-shadow:0 -4px 12px rgba(0,0,0,.04);padding-bottom:calc(10px + env(safe-area-inset-bottom))}
.btn{flex:1;display:inline-flex;align-items:center;justify-content:center;padding:12px;border-radius:12px;font-weight:600;text-decoration:none;font-size:14px}
.btn-approve{background:#16a34a;color:#fff}.btn-edit{background:#155EEF;color:#fff}.btn-secondary{background:#f1f5f9;color:#0f172a}
.tag{display:inline-block;background:#e0e7ff;color:#3730a3;padding:3px 10px;border-radius:99px;font-size:12px;font-weight:600;margin-right:6px;margin-bottom:6px}
.source{font-size:12px;color:#6b7280;word-break:break-all;background:#f9fafb;padding:8px;border-radius:8px}
</style></head><body>
<div class="container">
  <div class="banner">📝 <strong>BẢN NHÁP</strong> — chưa hiện trên web. Đọc kỹ rồi bấm nút "Duyệt &amp; Đăng" ở chân trang.</div>

  <div class="card">
    <div style="font-size:11px;color:#9ca3af;text-transform:uppercase;letter-spacing:.5px;margin-bottom:4px">SKU ${p.ofina_sku}${p.brand ? ` · ${p.brand}` : ''}</div>
    <h1>${escapeHtml(p.name)}</h1>
    <div style="margin:8px 0">
      ${p.price ? `<span class="price">${formatPrice(p.price)}</span>` : `<span class="price">Liên hệ</span>`}
      ${p.compare_price ? `<span class="price-old">${formatPrice(p.compare_price)}</span>` : ''}
    </div>
    ${p.short_description ? `<p style="color:#4b5563">${escapeHtml(p.short_description)}</p>` : ''}
  </div>

  ${(meta.highlights || []).length > 0 ? `
  <div class="card">
    <h2 style="margin-top:0">Điểm nổi bật</h2>
    <ul>${meta.highlights.map((h: string) => `<li>${escapeHtml(h)}</li>`).join('')}</ul>
  </div>` : ''}

  <div class="card">${body}</div>

  ${Object.keys(meta.specs || {}).length > 0 ? `
  <div class="card">
    <h2 style="margin-top:0">Thông số kỹ thuật</h2>
    <table class="specs">${Object.entries(meta.specs).map(([k, v]) => `<tr><td>${escapeHtml(k)}</td><td><strong>${escapeHtml(String(v))}</strong></td></tr>`).join('')}</table>
  </div>` : ''}

  ${(meta.faq || []).length > 0 ? `
  <div class="card">
    <h2 style="margin-top:0">FAQ</h2>
    ${meta.faq.map((f: any) => `<details><summary>${escapeHtml(f.q)}</summary><div>${escapeHtml(f.a)}</div></details>`).join('')}
  </div>` : ''}

  <div class="card">
    <h2 style="margin-top:0">SEO</h2>
    <p><strong>Title:</strong> ${escapeHtml(p.seo_title || '')}</p>
    <p><strong>Description:</strong> ${escapeHtml(p.seo_description || '')}</p>
    <p><strong>Keywords:</strong></p>
    <div>${(p.seo_keywords || []).map((k: string) => `<span class="tag">${escapeHtml(k)}</span>`).join('')}</div>
  </div>

  ${p.source_url ? `<div class="card"><h2 style="margin-top:0">Nguồn tham khảo</h2><div class="source">${escapeHtml(p.source_url)}</div></div>` : ''}
</div>

<div class="bottom-bar">
  <a href="${adminUrl}" class="btn btn-secondary">✏️ Sửa</a>
  <a href="${approveUrl}" class="btn btn-approve">✅ Duyệt &amp; Đăng</a>
</div>
</body></html>`
  return new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } })
}

function escapeHtml(s: string): string {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!))
}
