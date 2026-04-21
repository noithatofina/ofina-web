'use server'

import { revalidatePath } from 'next/cache'
import { requireStaff } from '@/lib/auth-guard'
import { createAdminClient } from '@/lib/supabase-admin'

const VALID_STATUS = ['new', 'confirmed', 'shipping', 'delivered', 'cancelled']
const VALID_PAYMENT = ['pending', 'paid', 'failed']

export async function updateOrderAction(orderId: string, formData: FormData) {
  await requireStaff()
  const admin = createAdminClient()

  const status = String(formData.get('status') || '')
  const payment_status = String(formData.get('payment_status') || '')
  const admin_note = String(formData.get('admin_note') || '').trim() || null

  if (!VALID_STATUS.includes(status)) throw new Error('Status không hợp lệ')
  if (!VALID_PAYMENT.includes(payment_status)) throw new Error('Payment status không hợp lệ')

  const { error } = await admin
    .from('orders')
    .update({ status, payment_status, admin_note })
    .eq('id', orderId)

  if (error) throw new Error(error.message)

  revalidatePath(`/admin/orders/${orderId}`)
  revalidatePath('/admin/orders')
}
