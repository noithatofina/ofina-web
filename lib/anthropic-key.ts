import { createAdminClient } from '@/lib/supabase-admin'

/**
 * Lấy Anthropic API key cho các bot AI.
 *
 * Ưu tiên bảng site_settings (key `secrets.anthropic_api_key`, value dạng
 * `{"key": "sk-ant-..."}` hoặc chuỗi trần) rồi mới tới env ANTHROPIC_API_KEY.
 * DB đứng trước để chủ site đổi key mà không cần quyền Vercel env
 * (bàn giao 09/2026 — tài khoản Vercel gốc chưa chuyển giao được).
 */
export async function getAnthropicKey(): Promise<string | null> {
  try {
    const admin = createAdminClient()
    const { data } = await admin
      .from('site_settings')
      .select('value')
      .eq('key', 'secrets.anthropic_api_key')
      .maybeSingle()
    const v: unknown = data?.value
    const k = typeof v === 'string' ? v : (v as { key?: string } | null)?.key
    if (typeof k === 'string' && k.startsWith('sk-ant-')) return k
  } catch {
    // rơi xuống env
  }
  return process.env.ANTHROPIC_API_KEY || null
}
