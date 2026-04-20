import nodemailer from 'nodemailer'

const SMTP_HOST = process.env.SMTP_HOST || 'smtp.zoho.com'
const SMTP_PORT = Number(process.env.SMTP_PORT) || 465
const SMTP_USER = process.env.SMTP_USER
const SMTP_PASS = process.env.SMTP_PASS
const NOTIFY_TO = process.env.NOTIFY_EMAIL || SMTP_USER

function getTransport() {
  if (!SMTP_USER || !SMTP_PASS) return null
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  })
}

export async function sendNotifyEmail(subject: string, html: string) {
  const transport = getTransport()
  if (!transport || !NOTIFY_TO) return
  try {
    await transport.sendMail({
      from: `"OFINA Alerts" <${SMTP_USER}>`,
      to: NOTIFY_TO,
      subject,
      html,
    })
  } catch (err) {
    console.error('sendNotifyEmail failed:', err)
  }
}

function escapeHtml(s: string | null | undefined) {
  if (!s) return ''
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export function contactEmailHtml(data: {
  name?: string
  phone?: string
  email?: string
  subject?: string
  message?: string
  source?: string
  product_id?: string
}) {
  const rows: [string, string | undefined][] = [
    ['Họ tên', data.name],
    ['Điện thoại', data.phone],
    ['Email', data.email],
    ['Tiêu đề', data.subject],
    ['Nguồn', data.source],
    ['Product ID', data.product_id],
  ]
  const body = rows
    .filter(([, v]) => v)
    .map(([k, v]) => `<tr><td style="padding:6px 12px;color:#666">${k}</td><td style="padding:6px 12px"><b>${escapeHtml(v)}</b></td></tr>`)
    .join('')
  const msgBlock = data.message
    ? `<div style="margin-top:16px;padding:12px;background:#f5f5f5;border-radius:6px"><b>Nội dung:</b><br>${escapeHtml(data.message).replace(/\n/g, '<br>')}</div>`
    : ''
  return `<div style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;max-width:600px">
    <h2 style="color:#0a2540">📬 Yêu cầu liên hệ mới</h2>
    <table style="border-collapse:collapse;width:100%">${body}</table>
    ${msgBlock}
    <p style="color:#999;font-size:12px;margin-top:24px">— OFINA Alerts · ${new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}</p>
  </div>`
}

export function orderEmailHtml(data: {
  order_number: string
  customer_name: string
  customer_phone: string
  customer_email?: string
  address_line: string
  ward?: string
  district?: string
  city: string
  note?: string
  payment_method: string
  items: Array<{ name: string; sku?: string; price: number; quantity: number }>
  subtotal: number
  shipping_fee: number
  discount: number
  total: number
  coupon_code?: string
}) {
  const addr = [data.address_line, data.ward, data.district, data.city].filter(Boolean).join(', ')
  const itemRows = data.items
    .map(
      (i) =>
        `<tr>
          <td style="padding:8px;border-bottom:1px solid #eee">${escapeHtml(i.name)}${i.sku ? `<br><span style="color:#999;font-size:12px">${escapeHtml(i.sku)}</span>` : ''}</td>
          <td style="padding:8px;border-bottom:1px solid #eee;text-align:center">${i.quantity}</td>
          <td style="padding:8px;border-bottom:1px solid #eee;text-align:right">${i.price.toLocaleString('vi-VN')}đ</td>
          <td style="padding:8px;border-bottom:1px solid #eee;text-align:right"><b>${(i.price * i.quantity).toLocaleString('vi-VN')}đ</b></td>
        </tr>`,
    )
    .join('')
  return `<div style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;max-width:640px">
    <h2 style="color:#0a2540">🛒 Đơn hàng mới #${escapeHtml(data.order_number)}</h2>
    <table style="border-collapse:collapse;width:100%;margin-bottom:16px">
      <tr><td style="padding:6px 12px;color:#666">Khách hàng</td><td style="padding:6px 12px"><b>${escapeHtml(data.customer_name)}</b></td></tr>
      <tr><td style="padding:6px 12px;color:#666">Điện thoại</td><td style="padding:6px 12px"><b>${escapeHtml(data.customer_phone)}</b></td></tr>
      ${data.customer_email ? `<tr><td style="padding:6px 12px;color:#666">Email</td><td style="padding:6px 12px">${escapeHtml(data.customer_email)}</td></tr>` : ''}
      <tr><td style="padding:6px 12px;color:#666">Địa chỉ</td><td style="padding:6px 12px">${escapeHtml(addr)}</td></tr>
      <tr><td style="padding:6px 12px;color:#666">Thanh toán</td><td style="padding:6px 12px">${escapeHtml(data.payment_method)}</td></tr>
      ${data.coupon_code ? `<tr><td style="padding:6px 12px;color:#666">Mã giảm</td><td style="padding:6px 12px">${escapeHtml(data.coupon_code)}</td></tr>` : ''}
      ${data.note ? `<tr><td style="padding:6px 12px;color:#666">Ghi chú</td><td style="padding:6px 12px">${escapeHtml(data.note)}</td></tr>` : ''}
    </table>
    <table style="border-collapse:collapse;width:100%;border:1px solid #eee">
      <thead><tr style="background:#f5f5f5">
        <th style="padding:8px;text-align:left">Sản phẩm</th>
        <th style="padding:8px">SL</th>
        <th style="padding:8px;text-align:right">Đơn giá</th>
        <th style="padding:8px;text-align:right">Thành tiền</th>
      </tr></thead>
      <tbody>${itemRows}</tbody>
    </table>
    <table style="margin-top:12px;margin-left:auto;border-collapse:collapse">
      <tr><td style="padding:4px 12px;color:#666">Tạm tính</td><td style="padding:4px 12px;text-align:right">${data.subtotal.toLocaleString('vi-VN')}đ</td></tr>
      <tr><td style="padding:4px 12px;color:#666">Phí ship</td><td style="padding:4px 12px;text-align:right">${data.shipping_fee.toLocaleString('vi-VN')}đ</td></tr>
      ${data.discount > 0 ? `<tr><td style="padding:4px 12px;color:#666">Giảm</td><td style="padding:4px 12px;text-align:right">-${data.discount.toLocaleString('vi-VN')}đ</td></tr>` : ''}
      <tr><td style="padding:8px 12px;font-size:16px"><b>Tổng cộng</b></td><td style="padding:8px 12px;text-align:right;font-size:18px;color:#d32f2f"><b>${data.total.toLocaleString('vi-VN')}đ</b></td></tr>
    </table>
    <p style="color:#999;font-size:12px;margin-top:24px">— OFINA Alerts · ${new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}</p>
  </div>`
}
