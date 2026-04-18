import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      customer_name,
      customer_phone,
      customer_email,
      address_line,
      city,
      district,
      ward,
      note,
      payment_method,
      items, // [{ id, sku, name, price, quantity }]
      subtotal,
      shipping_fee,
      discount,
      coupon_code,
    } = body

    if (!customer_name || !customer_phone || !address_line || !city || !items?.length) {
      return NextResponse.json({ error: 'Thiếu thông tin bắt buộc' }, { status: 400 })
    }

    const total = (subtotal || 0) + (shipping_fee || 0) - (discount || 0)
    const orderNumber = `OFN${Date.now().toString().slice(-8)}`

    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        order_number: orderNumber,
        customer_name,
        customer_phone,
        customer_email: customer_email || null,
        address_line,
        ward: ward || null,
        district: district || null,
        city,
        subtotal,
        shipping_fee: shipping_fee || 0,
        discount: discount || 0,
        total,
        payment_method,
        payment_status: payment_method === 'bank' || payment_method === 'cod' ? 'pending' : 'pending',
        status: 'new',
        note: note || null,
        coupon_code: coupon_code || null,
      })
      .select()
      .single()

    if (orderError) {
      console.error('Order insert error:', orderError)
      return NextResponse.json({ error: orderError.message }, { status: 500 })
    }

    // Create order items
    const orderItems = items.map((item: any) => ({
      order_id: order.id,
      product_id: item.id,
      product_name: item.name,
      product_sku: item.sku,
      price: item.price,
      quantity: item.quantity,
      subtotal: item.price * item.quantity,
    }))

    const { error: itemsError } = await supabase.from('order_items').insert(orderItems)
    if (itemsError) {
      console.error('Items insert error:', itemsError)
      // Rollback order
      await supabase.from('orders').delete().eq('id', order.id)
      return NextResponse.json({ error: itemsError.message }, { status: 500 })
    }

    // Send Telegram notification if configured
    if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID) {
      const msg = `🛒 ĐỞN HÀNG MỚI #${orderNumber}\n\n` +
        `👤 ${customer_name}\n📞 ${customer_phone}\n📍 ${address_line}, ${city}\n\n` +
        `💰 Tổng: ${total.toLocaleString('vi-VN')}đ\n💳 ${payment_method}\n\n` +
        items.map((i: any) => `- ${i.name} ×${i.quantity}`).join('\n')
      try {
        await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: process.env.TELEGRAM_CHAT_ID, text: msg }),
        })
      } catch {}
    }

    return NextResponse.json({
      success: true,
      order_number: orderNumber,
      order_id: order.id,
    })
  } catch (err: any) {
    console.error('Order error:', err)
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 })
  }
}
