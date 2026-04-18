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

export const CONTACT = {
  hotline: process.env.NEXT_PUBLIC_HOTLINE || '0909.xxx.xxx',
  email: process.env.NEXT_PUBLIC_EMAIL || 'contact@ofina.vn',
  address: process.env.NEXT_PUBLIC_ADDRESS || '123 Nguyễn Văn A, Q.1, TP.HCM',
  zaloUrl: process.env.NEXT_PUBLIC_ZALO_URL || '#',
  facebookUrl: process.env.NEXT_PUBLIC_FACEBOOK_URL || '#',
}
