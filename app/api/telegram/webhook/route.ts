/**
 * Telegram webhook — nhận tin nhắn admin gửi tới @ofina_alerts_bot.
 * Nếu tin nhắn chứa URL → auto trigger import-product (theo flow đã build).
 * Chỉ chấp nhận chat của admin (anh Vinh) theo TELEGRAM_CHAT_ID.
 *
 * Security: Telegram gửi header X-Telegram-Bot-Api-Secret-Token,
 * khớp với TELEGRAM_WEBHOOK_SECRET đã set khi đăng ký webhook.
 *
 * Setup 1 lần: gọi /api/telegram/webhook/setup?key=CRON_SECRET để đăng ký.
 */
import { NextRequest, NextResponse } from 'next/server'
import { sendTelegram } from '@/lib/telegram'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://ofina.vn'

export async function POST(req: NextRequest) {
  // Verify secret token
  const expectedSecret = process.env.TELEGRAM_WEBHOOK_SECRET
  const gotSecret = req.headers.get('x-telegram-bot-api-secret-token')
  if (!expectedSecret || gotSecret !== expectedSecret) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const adminChatId = process.env.TELEGRAM_CHAT_ID
  if (!adminChatId) return NextResponse.json({ ok: true }) // không config thì bỏ qua

  let update: any
  try {
    update = await req.json()
  } catch {
    return NextResponse.json({ ok: true })
  }

  const msg = update?.message
  if (!msg) return NextResponse.json({ ok: true })

  // Chỉ chấp nhận từ admin
  const fromChatId = String(msg.chat?.id || '')
  if (fromChatId !== adminChatId) {
    // Lạ — log + reply nhẹ
    console.warn(`[telegram-webhook] tin nhắn từ chat lạ: ${fromChatId}`)
    return NextResponse.json({ ok: true })
  }

  const text: string = msg.text || ''
  if (!text) return NextResponse.json({ ok: true })

  // Tìm URL đầu tiên trong tin nhắn
  const urlMatch = text.match(/https?:\/\/[^\s]+/)
  if (!urlMatch) {
    // Tin nhắn không có URL — chỉ ack
    await sendTelegram('💬 Mình hiểu tin nhắn rồi, nhưng cần URL sản phẩm để import. Paste URL của 1 SP nội thất web khác vào đây nhé.')
    return NextResponse.json({ ok: true })
  }

  const sourceUrl = urlMatch[0].replace(/[.,;)]+$/, '') // strip trailing punctuation

  // Báo nhận trước (Claude mất 20-40s)
  await sendTelegram(`⏳ Đang xử lý URL...\n${sourceUrl}\n\nTầm 20-40 giây nữa SP sẽ sẵn sàng để bạn duyệt.`)

  // Gọi import-product endpoint nội bộ (cùng deploy)
  const cronSecret = process.env.CRON_SECRET
  if (!cronSecret) {
    await sendTelegram('❌ Chưa cấu hình CRON_SECRET ở Vercel.')
    return NextResponse.json({ ok: true })
  }

  // Fire-and-forget — Telegram cần 200 nhanh
  const importUrl = `${SITE_URL}/api/seo/import-product?key=${cronSecret}&url=${encodeURIComponent(sourceUrl)}`
  // Không await — chạy background, kết quả sẽ ra qua sendTelegram trong handler
  fetch(importUrl).catch((err) => {
    sendTelegram(`❌ Import lỗi mạng: ${err instanceof Error ? err.message : err}`).catch(() => {})
  })

  return NextResponse.json({ ok: true })
}

// GET = endpoint dùng để setup webhook 1 lần
export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get('key')
  if (key !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const token = process.env.TELEGRAM_BOT_TOKEN
  const secret = process.env.TELEGRAM_WEBHOOK_SECRET
  if (!token) return NextResponse.json({ error: 'thiếu TELEGRAM_BOT_TOKEN' }, { status: 500 })
  if (!secret) return NextResponse.json({ error: 'thiếu TELEGRAM_WEBHOOK_SECRET (tạo string ngẫu nhiên + thêm vào Vercel env)' }, { status: 500 })

  const webhookUrl = `${SITE_URL}/api/telegram/webhook`
  const res = await fetch(`https://api.telegram.org/bot${token}/setWebhook`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      url: webhookUrl,
      secret_token: secret,
      allowed_updates: ['message'],
    }),
  })
  const data = await res.json()
  return NextResponse.json({ webhookUrl, telegram: data })
}
