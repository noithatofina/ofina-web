/**
 * Token duyệt bài one-click từ Telegram.
 *
 * Tạo chữ ký HMAC trên post id bằng CRON_SECRET → link "Duyệt & Đăng" trong
 * tin Telegram không thể bị người lạ đoán. Bấm link = đăng bài, không cần
 * đăng nhập admin.
 */
import crypto from 'crypto'

export function approveToken(id: string): string {
  const secret = process.env.CRON_SECRET || ''
  return crypto.createHmac('sha256', secret).update(`approve:${id}`).digest('hex').slice(0, 24)
}

export function verifyApproveToken(id: string, token: string): boolean {
  const expected = approveToken(id)
  // so sánh an toàn theo thời gian
  if (token.length !== expected.length) return false
  return crypto.timingSafeEqual(Buffer.from(token), Buffer.from(expected))
}
