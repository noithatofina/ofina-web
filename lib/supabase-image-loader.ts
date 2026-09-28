/**
 * Custom loader cho next/image.
 *
 * Supabase Image Transformation chỉ available ở Pro tier ($25/m). Hiện tại
 * Free → trả về URL gốc /object/public/. Ảnh được CDN cache nhưng không
 * resize. Khi upgrade Supabase Pro, đổi `ENABLE_TRANSFORM = true`.
 */

import { publicImageUrl } from './image-url'

const ENABLE_TRANSFORM = false

export default function supabaseImageLoader({
  src,
  width,
  quality,
}: {
  src: string
  width: number
  quality?: number
}): string {
  if (ENABLE_TRANSFORM && src.includes('/storage/v1/object/public/')) {
    const transformed = src.replace(
      '/storage/v1/object/public/',
      '/storage/v1/render/image/public/',
    )
    const params = new URLSearchParams({
      width: String(width),
      quality: String(quality ?? 75),
      resize: 'contain',
    })
    return `${transformed}?${params.toString()}`
  }
  // Lưới an toàn: URL Supabase lọt qua đây (không đi qua mapProduct) vẫn được
  // đổi sang proxy /img để không dính x-robots-tag: none.
  return publicImageUrl(src)
}
