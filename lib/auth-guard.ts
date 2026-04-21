import { redirect } from 'next/navigation'
import { createServerSupabase } from './supabase'
import { getUserRole, type AdminRole } from './supabase-admin'

/**
 * Gọi đầu mỗi admin page/server action.
 * Returns user + role. Redirect về /admin/login nếu không có quyền.
 * Nếu requireAdmin=true, chỉ cho role='admin' đi qua.
 */
export async function requireStaff(opts?: { requireAdmin?: boolean }) {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  const role = await getUserRole(user?.email)

  if (!user || !role) {
    redirect('/admin/login')
  }

  if (opts?.requireAdmin && role !== 'admin') {
    redirect('/admin?error=admin_only')
  }

  return { user, role, email: user.email! }
}

export function hasRole(role: AdminRole | null, required: AdminRole): boolean {
  if (!role) return false
  if (required === 'editor') return true // admin cũng có quyền editor
  return role === 'admin'
}
