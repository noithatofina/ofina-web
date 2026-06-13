/**
 * Chẩn đoán Telegram — gửi 1 tin test và TRẢ VỀ NGUYÊN response của Telegram
 * để biết chính xác lỗi (token sai? chat chưa start? chat_id sai?).
 * Bảo vệ bằng CRON_SECRET. Xoá sau khi debug xong.
 */
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET
  if (!secret || req.nextUrl.searchParams.get('key') !== secret) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID

  const diag: Record<string, unknown> = {
    has_token: Boolean(token),
    token_preview: token ? `${token.slice(0, 10)}...${token.slice(-4)}` : null,
    chat_id: chatId || null,
  }

  // Ai là chủ bot? (xác minh token hợp lệ + đúng bot nào)
  if (token) {
    try {
      const me = await fetch(`https://api.telegram.org/bot${token}/getMe`)
      diag.getMe = await me.json()
    } catch (e) {
      diag.getMe_error = e instanceof Error ? e.message : String(e)
    }
  }

  // Thử gửi tin
  if (token && chatId) {
    try {
      const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text: '🔧 Test kết nối Telegram từ OFINA Content Bot. Nếu anh thấy tin này → Telegram OK!' }),
      })
      diag.sendMessage_status = res.status
      diag.sendMessage_response = await res.json()
    } catch (e) {
      diag.sendMessage_error = e instanceof Error ? e.message : String(e)
    }
  }

  return NextResponse.json(diag)
}
