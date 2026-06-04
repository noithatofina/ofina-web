import { unstable_cache, revalidateTag } from 'next/cache'
import { createAdminClient } from './supabase-admin'
import { createPublicSupabase } from './supabase-public'

export type SiteSettingKey =
  | 'home.topbar'
  | 'home.hero'
  | 'home.stats'
  | 'home.faq'
  | 'home.brand_story'
  | 'home.trust_bar'
  | 'home.collections'
  | 'home.why_us'
  | 'page.khuyen_mai'
  | 'contact.info'
  | 'contact.branches'
  | 'branding'
  | 'page.gioi_thieu'

export type RoleRequired = 'admin' | 'editor'

type SettingRow<T = any> = {
  key: string
  value: T
  role_required: RoleRequired
  description: string | null
  updated_at: string
  updated_by: string | null
}

export const SETTINGS_CACHE_TAG = 'site-settings'

/**
 * Fetch ALL settings 1 lần / giờ. 22 settings tổng → ~vài KB, fetch luôn cả bảng
 * rẻ hơn nhiều so với eq('key', X) × N lần.
 */
export const getAllSettings = unstable_cache(
  async (): Promise<Record<string, any>> => {
    const sb = createPublicSupabase()
    const { data } = await sb.from('site_settings').select('key, value')
    const map: Record<string, any> = {}
    for (const row of data || []) map[row.key] = row.value
    return map
  },
  ['site-settings-all'],
  { tags: [SETTINGS_CACHE_TAG], revalidate: 3600 },
)

/** Read 1 setting. Returns `fallback` if not found. */
export async function getSetting<T = any>(
  key: SiteSettingKey,
  fallback: T,
): Promise<T> {
  const all = await getAllSettings()
  return (all[key] as T) ?? fallback
}

/** Read all settings the current role can edit. Used in admin UI. */
export async function listSettingsForRole(role: RoleRequired | null): Promise<SettingRow[]> {
  if (!role) return []
  const admin = createAdminClient()
  let q = admin.from('site_settings').select('*').order('key')
  if (role === 'editor') q = q.eq('role_required', 'editor')
  const { data } = await q
  return (data || []) as SettingRow[]
}

export async function getSettingRow(key: SiteSettingKey): Promise<SettingRow | null> {
  const admin = createAdminClient()
  const { data } = await admin
    .from('site_settings')
    .select('*')
    .eq('key', key)
    .maybeSingle()
  return (data as SettingRow) || null
}

/** Write 1 setting. Checks role before write. Invalidates public cache. */
export async function setSetting(
  key: SiteSettingKey,
  value: any,
  userEmail: string,
  userRole: RoleRequired,
): Promise<void> {
  const admin = createAdminClient()
  const { data: existing } = await admin
    .from('site_settings')
    .select('role_required')
    .eq('key', key)
    .single()

  if (!existing) throw new Error(`Setting ${key} không tồn tại`)

  if (existing.role_required === 'admin' && userRole !== 'admin') {
    throw new Error('Bạn không có quyền sửa setting này')
  }

  const { error } = await admin
    .from('site_settings')
    .update({ value, updated_by: userEmail })
    .eq('key', key)

  if (error) throw new Error(error.message)

  revalidateTag(SETTINGS_CACHE_TAG)
}
