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

/**
 * Check if email is in ADMIN_EMAILS whitelist.
 * ADMIN_EMAILS="admin@ofina.vn,content@ofina.vn"
 */
export function isStaffEmail(email: string | null | undefined): boolean {
  if (!email) return false
  const allowed = (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map(e => e.trim().toLowerCase())
    .filter(Boolean)
  return allowed.includes(email.toLowerCase())
}
