/**
 * Telegram helper dùng chung — gửi thông báo tới chat của admin (anh Vinh).
 * Env: TELEGRAM_BOT_TOKEN + TELEGRAM_CHAT_ID (đã set ở Vercel).
 * Bot @ofina_alerts_bot.
 */

interface TelegramButton {
  text: string
  url: string
}

export async function sendTelegram(
  text: string,
  opts: { buttons?: TelegramButton[][]; parseMode?: 'HTML' | 'Markdown' } = {}
): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID
  if (!token || !chatId) {
    console.warn('[telegram] thiếu TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID')
    return false
  }

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
    return res.ok
  } catch (err) {
    console.warn('[telegram] gửi thất bại:', err instanceof Error ? err.message : err)
    return false
  }
}
