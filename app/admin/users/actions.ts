'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { requireStaff } from '@/lib/auth-guard'
import { createAdminClient } from '@/lib/supabase-admin'

export async function addUserAction(formData: FormData) {
  await requireStaff({ requireAdmin: true })

  const email = String(formData.get('email') || '').trim().toLowerCase()
  const role = String(formData.get('role') || 'editor')

  if (!email || !email.includes('@')) {
    redirect('/admin/users?error=invalid_email')
  }
  if (role !== 'admin' && role !== 'editor') {
    redirect('/admin/users?error=invalid_role')
  }

  const admin = createAdminClient()
  const { error } = await admin
    .from('admin_users')
    .upsert({ email, role }, { onConflict: 'email' })

  if (error) {
    const msg = encodeURIComponent(error.message)
    redirect(`/admin/users?error=db&msg=${msg}`)
  }

  revalidatePath('/admin/users')
  redirect('/admin/users?ok=added')
}

export async function updateUserRoleAction(formData: FormData) {
  const { email: currentEmail } = await requireStaff({ requireAdmin: true })

  const email = String(formData.get('email') || '').trim().toLowerCase()
  const role = String(formData.get('role') || '')

  if (role !== 'admin' && role !== 'editor') {
    throw new Error('Role không hợp lệ')
  }

  // Ngăn tự downgrade mình thành editor (tránh lockout)
  if (email === currentEmail.toLowerCase() && role !== 'admin') {
    throw new Error('Không thể tự đổi role của chính mình thành editor')
  }

  const admin = createAdminClient()
  const { error } = await admin
    .from('admin_users')
    .update({ role })
    .eq('email', email)

  if (error) throw new Error(error.message)

  revalidatePath('/admin/users')
}

export async function deleteUserAction(formData: FormData) {
  const { email: currentEmail } = await requireStaff({ requireAdmin: true })

  const email = String(formData.get('email') || '').trim().toLowerCase()
  if (!email) throw new Error('Thiếu email')

  // Ngăn tự xóa mình
  if (email === currentEmail.toLowerCase()) {
    throw new Error('Không thể tự xóa chính mình')
  }

  // Ngăn xóa admin cuối cùng
  const admin = createAdminClient()
  const { data: adminCount } = await admin
    .from('admin_users')
    .select('email', { count: 'exact', head: true })
    .eq('role', 'admin')
  const count = (adminCount as any)?.count ?? 0
  // Không dùng count ở đây, dùng query khác
  const { count: adminN } = await admin
    .from('admin_users')
    .select('*', { count: 'exact', head: true })
    .eq('role', 'admin')

  const { data: target } = await admin
    .from('admin_users')
    .select('role')
    .eq('email', email)
    .single()

  if (target?.role === 'admin' && (adminN || 0) <= 1) {
    throw new Error('Không thể xóa admin cuối cùng')
  }

  const { error } = await admin.from('admin_users').delete().eq('email', email)
  if (error) throw new Error(error.message)

  revalidatePath('/admin/users')
}
