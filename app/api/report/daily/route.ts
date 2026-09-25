/**
 * Báo cáo vận hành hàng ngày — gửi Telegram 21h giờ VN (Vercel Cron 14:00 UTC).
 *
 * Trigger:
 *  - Vercel Cron (lịch trong vercel.json) — header Authorization: Bearer CRON_SECRET
 *  - Thủ công: GET /api/report/daily?key=CRON_SECRET[&silent=1]
 *    (silent=1: chỉ trả JSON, không gửi Telegram — để kiểm tra số liệu)
 *
 * Nội dung: đơn hàng trong ngày + tồn đọng, liên hệ mới, bot viết bài,
 * web sống/chết, tổng kho. Mốc "trong ngày" tính theo giờ VN (UTC+7).
 */

import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-admin'
import { sendTelegram } from '@/lib/telegram'

export const maxDuration = 60

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://ofina.vn'
const VN_OFFSET_MS = 7 * 60 * 60 * 1000

function unauthorized() {
  return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
}

function isAuthed(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET
  if (!secret) return false
  const auth = req.headers.get('authorization')
  if (auth === `Bearer ${secret}`) return true
  return req.nextUrl.searchParams.get('key') === secret
}

const fmtVnd = (n: number) => `${n.toLocaleString('vi-VN')}đ`

function fmtVnDate(iso: string): string {
  const d = new Date(new Date(iso).getTime() + VN_OFFSET_MS)
  return `${String(d.getUTCDate()).padStart(2, '0')}/${String(d.getUTCMonth() + 1).padStart(2, '0')}`
}

async function handle(req: NextRequest) {
  if (!isAuthed(req)) return unauthorized()

  const admin = createAdminClient()
  const now = new Date()
  // 00:00 hôm nay theo giờ VN, đổi về UTC để so với created_at
  const vnNow = new Date(now.getTime() + VN_OFFSET_MS)
  const startOfVnDay = new Date(
    Date.UTC(vnNow.getUTCFullYear(), vnNow.getUTCMonth(), vnNow.getUTCDate()) - VN_OFFSET_MS
  ).toISOString()

  // 1. Đơn hàng trong ngày
  const { data: ordersToday } = await admin
    .from('orders')
    .select('order_number, customer_name, customer_phone, total, payment_method')
    .gte('created_at', startOfVnDay)
    .order('created_at', { ascending: false })

  // 2. Tồn đọng: mọi đơn còn status "new"
  const { data: backlog } = await admin
    .from('orders')
    .select('created_at, payment_method')
    .eq('status', 'new')
    .order('created_at', { ascending: true })

  // 3. Liên hệ mới trong ngày (bỏ newsletter cho đỡ nhiễu)
  const { data: contactsToday } = await admin
    .from('contacts')
    .select('source')
    .gte('created_at', startOfVnDay)
    .neq('source', 'newsletter')

  // 4. Bot viết bài: bài sinh hôm nay + nháp chờ duyệt
  const { data: postsToday } = await admin
    .from('blog_posts')
    .select('title, is_published')
    .gte('created_at', startOfVnDay)
  const { count: draftCount } = await admin
    .from('blog_posts')
    .select('*', { count: 'exact', head: true })
    .eq('is_published', false)

  // 5. Tổng kho
  const { count: productCount } = await admin
    .from('products')
    .select('*', { count: 'exact', head: true })

  // 6. Web sống/chết
  let siteStatus = 'KHÔNG PHẢN HỒI'
  let siteMs = 0
  try {
    const t0 = Date.now()
    const res = await fetch(SITE_URL, { signal: AbortSignal.timeout(10000), cache: 'no-store' })
    siteMs = Date.now() - t0
    siteStatus = res.ok ? `OK ${res.status}` : `LỖI ${res.status}`
  } catch {
    // giữ mặc định KHÔNG PHẢN HỒI
  }

  // Soạn báo cáo
  const d = vnNow
  const dateStr = `${String(d.getUTCDate()).padStart(2, '0')}/${String(d.getUTCMonth() + 1).padStart(2, '0')}/${d.getUTCFullYear()} ${String(d.getUTCHours()).padStart(2, '0')}:${String(d.getUTCMinutes()).padStart(2, '0')}`

  const lines: string[] = [`📊 BÁO CÁO NGÀY — OFINA.VN`, `🕘 ${dateStr} (giờ VN)`, '']

  const todayTotal = (ordersToday || []).reduce((s, o) => s + (o.total || 0), 0)
  lines.push(`🛒 ĐƠN HÔM NAY: ${ordersToday?.length || 0} đơn${todayTotal ? ` · ${fmtVnd(todayTotal)}` : ''}`)
  for (const o of ordersToday || []) {
    lines.push(`  • #${o.order_number} ${o.customer_name} · ${o.customer_phone} · ${fmtVnd(o.total)} (${o.payment_method})`)
  }

  const bankPending = (backlog || []).filter((o) => o.payment_method === 'bank').length
  lines.push('')
  lines.push(`⏳ Tồn chưa xử lý: ${backlog?.length || 0} đơn${backlog?.length ? ` (cũ nhất ${fmtVnDate(backlog[0].created_at)})` : ''}`)
  if (bankPending) lines.push(`⚠️ Trong đó ${bankPending} đơn CHUYỂN KHOẢN chưa xác nhận`)

  const bySource = new Map<string, number>()
  for (const c of contactsToday || []) {
    const k = c.source || 'khác'
    bySource.set(k, (bySource.get(k) || 0) + 1)
  }
  const srcTxt = [...bySource.entries()].map(([k, v]) => `${k} ${v}`).join(', ')
  lines.push('')
  lines.push(`📬 Liên hệ mới: ${contactsToday?.length || 0}${srcTxt ? ` (${srcTxt})` : ''}`)

  lines.push('')
  lines.push(`🤖 Bot viết bài: hôm nay ${postsToday?.length || 0} bài · ${draftCount ?? '?'} nháp chờ duyệt`)

  lines.push('')
  lines.push(`🌐 Web: ${siteStatus}${siteMs ? ` · ${(siteMs / 1000).toFixed(1)}s` : ''}`)
  lines.push(`📦 Kho: ${productCount ?? '?'} sản phẩm`)

  const report = lines.join('\n')
  const silent = req.nextUrl.searchParams.get('silent') === '1'
  const telegramSent = silent ? false : await sendTelegram(report)

  return NextResponse.json({
    ok: true,
    silent,
    telegramSent,
    ordersToday: ordersToday?.length || 0,
    backlog: backlog?.length || 0,
    contactsToday: contactsToday?.length || 0,
    postsToday: postsToday?.length || 0,
    draftCount,
    productCount,
    siteStatus,
    report,
  })
}

export async function GET(req: NextRequest) {
  return handle(req)
}

export async function POST(req: NextRequest) {
  return handle(req)
}
