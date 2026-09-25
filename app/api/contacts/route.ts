import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { sendNotifyEmail, contactEmailHtml } from '@/lib/email'
import { sendTelegram } from '@/lib/telegram'

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

    // Skip notifications for newsletter subscribe (nhiều, không cần alert)
    if (!isNewsletter) {
      // Telegram notify (gửi tới mọi chat quản trị — xem lib/telegram.ts)
      await sendTelegram(
        `📬 YÊU CẦU LIÊN HỆ MỚI\n\n` +
          (name ? `👤 ${name}\n` : '') +
          (phone ? `📞 ${phone}\n` : '') +
          (email ? `📧 ${email}\n` : '') +
          `📝 Nguồn: ${source || 'general'}\n` +
          (message ? `\n💬 ${message}` : '')
      )

      // Email notify
      await sendNotifyEmail(
        `[OFINA] Liên hệ mới từ ${name || email || 'khách'}`,
        contactEmailHtml({ name, phone, email, subject, message, source, product_id }),
      )
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
