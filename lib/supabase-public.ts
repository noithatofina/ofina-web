import { createClient } from '@supabase/supabase-js'

/**
 * Anon-key client KHÔNG đọc cookies. Dùng cho mọi public read query
 * trong Server Components để Next.js có thể static-cache page.
 * `createServerSupabase()` (lib/supabase.ts) dùng cookies → force dynamic.
 */
export function createPublicSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  )
}
