/**
 * Variant groups — gom các SP riêng biệt (mỗi phiên bản 1 product row)
 * vào một nhóm cùng dòng để render VariantSwitcher trên trang SP.
 *
 * Khi user vào 1 slug trong nhóm → trang SP detect → render thanh chọn
 * phiên bản với thumbnail + price. Click → navigate sang sibling URL
 * (Next prefetch nên cảm giác nhanh như chuyển variant client-side).
 */

export type VariantOption = {
  slug: string
  label: string
  badge?: string
  price: number
  compare_price?: number
  color_options: string[]
  thumb_url: string
}

const STORAGE = 'https://ivxdwqsqveqsjcsdvewq.supabase.co/storage/v1/object/public/products'

export const VARIANT_GROUPS: Record<string, VariantOption[]> = {
  'libernovo-omni': [
    {
      slug: 'ghe-cong-thai-hoc-libernovo-omni-se',
      label: 'Omni SE',
      badge: 'Entry-level',
      price: 6900000,
      compare_price: 8500000,
      color_options: ['Đen'],
      thumb_url: `${STORAGE}/OFN-LBN-OMNI-SE/01.png`,
    },
    {
      slug: 'ghe-cong-thai-hoc-libernovo-omni-oc1',
      label: 'Omni OC1',
      badge: 'Khuyến nghị',
      price: 12900000,
      compare_price: 15500000,
      color_options: ['Đen', 'Xám', 'Xanh'],
      thumb_url: `${STORAGE}/OFN-LBN-OMNI-OC1/01.png`,
    },
    {
      slug: 'ghe-cong-thai-hoc-libernovo-omni-pro',
      label: 'Omni Pro',
      badge: 'Cao cấp',
      price: 19900000,
      compare_price: 22900000,
      color_options: ['Đen', 'Xám'],
      thumb_url: `${STORAGE}/OFN-LBN-OMNI-PRO/01.png`,
    },
  ],
}

export type VariantGroupMatch = {
  groupKey: string
  options: VariantOption[]
  currentIdx: number
}

export function findVariantGroup(slug: string): VariantGroupMatch | null {
  for (const [groupKey, options] of Object.entries(VARIANT_GROUPS)) {
    const idx = options.findIndex(o => o.slug === slug)
    if (idx >= 0) return { groupKey, options, currentIdx: idx }
  }
  return null
}
