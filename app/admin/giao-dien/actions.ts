'use server'

import { revalidatePath } from 'next/cache'
import { requireStaff } from '@/lib/auth-guard'
import { setSetting, type SiteSettingKey } from '@/lib/site-settings'

/** Đọc 1 field JSON từ FormData, parse số/bool. */
function field(fd: FormData, name: string): string {
  return String(fd.get(name) || '').trim()
}

function fieldAll(fd: FormData, name: string): string[] {
  return fd.getAll(name).map((v) => String(v).trim()).filter(Boolean)
}

/** Helper common — revalidate các public paths sau khi update content. */
function revalidateAll() {
  revalidatePath('/')
  revalidatePath('/khuyen-mai')
  revalidatePath('/gioi-thieu')
  revalidatePath('/showroom')
}

// ===== HOME =====

export async function updateHomeTopbarAction(formData: FormData) {
  const { email, role } = await requireStaff()
  const messages = fieldAll(formData, 'messages')
  await setSetting('home.topbar', { messages }, email, role)
  revalidateAll()
}

export async function updateHomeHeroAction(formData: FormData) {
  const { email, role } = await requireStaff()
  const stats = []
  for (let i = 0; i < 5; i++) {
    const label = field(formData, `stat_label_${i}`)
    const value = field(formData, `stat_value_${i}`)
    if (label && value) stats.push({ label, value })
  }
  const value = {
    headline: field(formData, 'headline'),
    subheadline: field(formData, 'subheadline'),
    tagline: field(formData, 'tagline'),
    cta_label: field(formData, 'cta_label'),
    cta_href: field(formData, 'cta_href'),
    stats,
    featured_product_slug: field(formData, 'featured_product_slug'),
  }
  await setSetting('home.hero', value, email, role)
  revalidateAll()
}

export async function updateHomeStatsAction(formData: FormData) {
  const { email, role } = await requireStaff()
  const items = []
  for (let i = 0; i < 8; i++) {
    const label = field(formData, `label_${i}`)
    const value = field(formData, `value_${i}`)
    const suffix = field(formData, `suffix_${i}`)
    if (label && value) items.push({ label, value, suffix })
  }
  await setSetting('home.stats', { items }, email, role)
  revalidateAll()
}

export async function updateHomeFaqAction(formData: FormData) {
  const { email, role } = await requireStaff()
  const items = []
  for (let i = 0; i < 20; i++) {
    const q = field(formData, `q_${i}`)
    const a = field(formData, `a_${i}`)
    if (q && a) items.push({ q, a })
  }
  await setSetting('home.faq', { items }, email, role)
  revalidateAll()
}

export async function updateHomeBrandStoryAction(formData: FormData) {
  const { email, role } = await requireStaff()
  const value = {
    title: field(formData, 'title'),
    content: field(formData, 'content'),
  }
  await setSetting('home.brand_story', value, email, role)
  revalidateAll()
}

// ===== KHUYẾN MÃI =====

export async function updateKhuyenMaiAction(formData: FormData) {
  const { email, role } = await requireStaff()
  const value = {
    title: field(formData, 'title'),
    banner_image: field(formData, 'banner_image'),
    content: field(formData, 'content'),
  }
  await setSetting('page.khuyen_mai', value, email, role)
  revalidatePath('/khuyen-mai')
}

// ===== ADMIN-ONLY sections =====

export async function updateContactInfoAction(formData: FormData) {
  const { email, role } = await requireStaff({ requireAdmin: true })
  const value = {
    hotline: field(formData, 'hotline'),
    email: field(formData, 'email'),
    zalo_url: field(formData, 'zalo_url'),
    facebook_url: field(formData, 'facebook_url'),
    working_hours: field(formData, 'working_hours'),
  }
  await setSetting('contact.info', value, email, role)
  revalidateAll()
}

export async function updateBranchesAction(formData: FormData) {
  const { email, role } = await requireStaff({ requireAdmin: true })
  const items = []
  for (let i = 0; i < 10; i++) {
    const name = field(formData, `name_${i}`)
    const address = field(formData, `address_${i}`)
    const phone = field(formData, `phone_${i}`)
    const maps_query = field(formData, `maps_query_${i}`)
    if (name && address) items.push({ name, address, phone, maps_query })
  }
  await setSetting('contact.branches', { items }, email, role)
  revalidateAll()
}

export async function updateGioiThieuAction(formData: FormData) {
  const { email, role } = await requireStaff({ requireAdmin: true })
  const value = {
    title: field(formData, 'title'),
    content: field(formData, 'content'),
  }
  await setSetting('page.gioi_thieu', value, email, role)
  revalidatePath('/gioi-thieu')
}

export async function updateBrandingAction(formData: FormData) {
  const { email, role } = await requireStaff({ requireAdmin: true })
  const value = {
    logo_url: field(formData, 'logo_url'),
    favicon_url: field(formData, 'favicon_url'),
    og_image_url: field(formData, 'og_image_url'),
  }
  await setSetting('branding', value, email, role)
  revalidateAll()
}
