import { createClient } from '@supabase/supabase-js'

/**
 * Server-only Supabase client with service role key.
 * Bypasses RLS. NEVER import from client components.
 */
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: { persistSession: false, autoRefreshToken: false },
    }
  )
}

export type AdminRole = 'admin' | 'editor'

/** Check email in ADMIN_EMAILS env (legacy fallback trước khi migrate DB). */
function isInEnvWhitelist(email: string): boolean {
  const allowed = (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map(e => e.trim().toLowerCase())
    .filter(Boolean)
  return allowed.includes(email.toLowerCase())
}

/**
 * Lấy role của user: 'admin' | 'editor' | null.
 * Đọc từ bảng admin_users. Fallback về ADMIN_EMAILS env (role='admin') nếu:
 *  - DB chưa migrate (bảng chưa tồn tại)
 *  - Email có trong env whitelist nhưng chưa có trong DB
 */
export async function getUserRole(email: string | null | undefined): Promise<AdminRole | null> {
  if (!email) return null
  const normalized = email.toLowerCase().trim()

  try {
    const admin = createAdminClient()
    const { data, error } = await admin
      .from('admin_users')
      .select('role')
      .eq('email', normalized)
      .maybeSingle()

    // Nếu bảng admin_users chưa được tạo → fallback
    if (error && /relation.*does not exist/i.test(error.message)) {
      return isInEnvWhitelist(normalized) ? 'admin' : null
    }

    if (data?.role === 'admin' || data?.role === 'editor') {
      return data.role as AdminRole
    }

    // Không có trong DB → fallback env (tương thích ngược)
    return isInEnvWhitelist(normalized) ? 'admin' : null
  } catch {
    return isInEnvWhitelist(normalized) ? 'admin' : null
  }
}

/** Check if email có quyền vào /admin (admin HOẶC editor). */
export async function isStaffEmail(email: string | null | undefined): Promise<boolean> {
  const role = await getUserRole(email)
  return role !== null
}

/** Sync version: chỉ check env whitelist, dùng ở middleware để tránh DB call. */
export function isStaffEmailSync(email: string | null | undefined): boolean {
  if (!email) return false
  return isInEnvWhitelist(email.toLowerCase().trim())
}
