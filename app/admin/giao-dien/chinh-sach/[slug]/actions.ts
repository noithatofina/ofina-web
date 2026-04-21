'use server'

import { revalidatePath } from 'next/cache'
import { requireStaff } from '@/lib/auth-guard'
import { createAdminClient } from '@/lib/supabase-admin'
import { sanitizeHtml } from '@/lib/sanitize-html'

const ALLOWED_SLUGS = new Set(['doi-tra', 'bao-hanh', 'van-chuyen', 'thanh-toan', 'bao-mat', 'dieu-khoan'])

export async function updatePolicyAction(slug: string, formData: FormData) {
  const { email } = await requireStaff({ requireAdmin: true })
  if (!ALLOWED_SLUGS.has(slug)) throw new Error('Slug không hợp lệ')

  const title = String(formData.get('title') || '').trim()
  const content = sanitizeHtml(String(formData.get('content') || '').trim())
  if (!title) throw new Error('Thiếu tiêu đề')

  const admin = createAdminClient()
  const key = `policy.${slug}`
  const { error } = await admin
    .from('site_settings')
    .update({ value: { title, content }, updated_by: email })
    .eq('key', key)

  if (error) throw new Error(error.message)

  revalidatePath(`/chinh-sach/${slug}`)
  revalidatePath('/admin/giao-dien/chinh-sach')
}
