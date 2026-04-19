import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number | null | undefined): string {
  if (!price) return 'Liên hệ'
  return new Intl.NumberFormat('vi-VN').format(price) + 'đ'
}

export function formatPriceRange(low?: number | null, high?: number | null): string {
  if (low && high && low !== high) {
    return `${formatPrice(low)} – ${formatPrice(high)}`
  }
  return formatPrice(low || high)
}

export function calcDiscountPercent(original: number, sale: number): number {
  if (!original || !sale || sale >= original) return 0
  return Math.round(((original - sale) / original) * 100)
}

export function slugify(text: string): string {
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export const BRANCHES = [
  {
    name: 'Trụ sở Hà Nội',
    address: '135 đường K2, Phường Phú Đô, Hà Nội',
    mapsQuery: '135 K2 Phú Đô Hà Nội',
  },
  {
    name: 'Chi nhánh TP.HCM',
    address: 'Tầng 2, số 36 Lương Định Của, Quận 2, TP.HCM',
    mapsQuery: '36 Lương Định Của Quận 2 TP HCM',
  },
] as const

export const CONTACT = {
  hotline: process.env.NEXT_PUBLIC_HOTLINE || '0325669996',
  email: process.env.NEXT_PUBLIC_EMAIL || 'contact@ofina.vn',
  address: BRANCHES[0].address,
  branches: BRANCHES,
  zaloUrl: process.env.NEXT_PUBLIC_ZALO_URL || 'https://zalo.me/0325669996',
  facebookUrl: process.env.NEXT_PUBLIC_FACEBOOK_URL || '#',
}
