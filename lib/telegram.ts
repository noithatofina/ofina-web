/**
 * Telegram helper dùng chung — gửi thông báo tới các chat quản trị.
 * Env: TELEGRAM_BOT_TOKEN + TELEGRAM_CHAT_ID (đã set ở Vercel).
 * Bot @ofina_alerts_bot.
 */

/**
 * Người nhận bổ sung ngoài env TELEGRAM_CHAT_ID — chủ mới nhận bàn giao 09/2026.
 * (Đặt trong code vì Vercel env chỉ tài khoản noithatofina sửa được.)
 * Người nhận phải bấm Start với @ofina_alerts_bot trước thì bot mới gửi được.
 */
const EXTRA_CHAT_IDS = ['8718334022']

interface TelegramButton {
  text: string
  url: string
}

export async function sendTelegram(
  text: string,
  opts: { buttons?: TelegramButton[][]; parseMode?: 'HTML' | 'Markdown' } = {}
): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN
  if (!token) {
    console.warn('[telegram] thiếu TELEGRAM_BOT_TOKEN')
    return false
  }
  const chatIds = [...new Set([process.env.TELEGRAM_CHAT_ID, ...EXTRA_CHAT_IDS].filter(Boolean))]
  if (!chatIds.length) {
    console.warn('[telegram] không có chat id nào để gửi')
    return false
  }

  let anyOk = false
  for (const chatId of chatIds) {
    const body: Record<string, unknown> = {
      chat_id: chatId,
      text,
      disable_web_page_preview: true,
    }
    if (opts.parseMode) body.parse_mode = opts.parseMode
    if (opts.buttons) body.reply_markup = { inline_keyboard: opts.buttons }

    try {
      const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(8000),
      })
      if (res.ok) anyOk = true
      else console.warn(`[telegram] gửi tới ${chatId} lỗi HTTP ${res.status}`)
    } catch (err) {
      console.warn(`[telegram] gửi tới ${chatId} thất bại:`, err instanceof Error ? err.message : err)
    }
  }
  return anyOk
}
