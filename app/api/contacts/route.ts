import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, phone, email, subject, message, source, product_id } = body

    const isNewsletter = source === 'newsletter'
    if (isNewsletter) {
      if (!email) {
        return NextResponse.json({ error: 'Thiếu email' }, { status: 400 })
      }
    } else {
      if (!name || !phone) {
        return NextResponse.json({ error: 'Thiếu họ tên hoặc số điện thoại' }, { status: 400 })
      }
    }

    const { error } = await supabase.from('contacts').insert({
      name: name || (isNewsletter ? 'Newsletter subscriber' : ''),
      phone: phone || '',
      email,
      subject,
      message,
      source,
      product_id,
    })

    if (error) {
      console.error(error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Telegram notify
    if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID) {
      const msg = `📬 YÊU CẦU LIÊN HỆ MỚI\n\n` +
        (name ? `👤 ${name}\n` : '') +
        (phone ? `📞 ${phone}\n` : '') +
        (email ? `📧 ${email}\n` : '') +
        `📝 Nguồn: ${source || 'general'}\n` +
        (message ? `\n💬 ${message}` : '')
      try {
        await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: process.env.TELEGRAM_CHAT_ID, text: msg }),
        })
      } catch {}
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
