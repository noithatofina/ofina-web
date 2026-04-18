import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const phone = searchParams.get('phone') || ''
  const order = searchParams.get('order') || ''

  if (!phone || !order) {
    return NextResponse.json({ error: 'Thiếu thông tin' }, { status: 400 })
  }

  const { data } = await supabase
    .from('orders')
    .select('*')
    .eq('order_number', order.toUpperCase())
    .eq('customer_phone', phone)
    .maybeSingle()

  if (!data) {
    return NextResponse.json({ error: 'Không tìm thấy đơn hàng' }, { status: 404 })
  }

  return NextResponse.json({ order: data })
}
