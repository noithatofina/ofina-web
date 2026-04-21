import { createAdminClient } from './supabase-admin'

export type SiteSettingKey =
  | 'home.topbar'
  | 'home.hero'
  | 'home.stats'
  | 'home.faq'
  | 'home.brand_story'
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

/** Read 1 setting. Returns `fallback` if not found. */
export async function getSetting<T = any>(
  key: SiteSettingKey,
  fallback: T,
): Promise<T> {
  const admin = createAdminClient()
  const { data } = await admin
    .from('site_settings')
    .select('value')
    .eq('key', key)
    .maybeSingle()
  return (data?.value as T) ?? fallback
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

/** Write 1 setting. Checks role before write. */
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

  // Admin can edit anything; editor can only edit editor-level settings
  if (existing.role_required === 'admin' && userRole !== 'admin') {
    throw new Error('Bạn không có quyền sửa setting này')
  }

  const { error } = await admin
    .from('site_settings')
    .update({ value, updated_by: userEmail })
    .eq('key', key)

  if (error) throw new Error(error.message)
}
