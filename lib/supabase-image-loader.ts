/**
 * Custom loader cho next/image.
 *
 * Supabase Image Transformation chỉ available ở Pro tier ($25/m). Hiện tại
 * Free → trả về URL gốc /object/public/. Ảnh được CDN cache nhưng không
 * resize. Khi upgrade Supabase Pro, đổi `ENABLE_TRANSFORM = true`.
 */

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
  return src
}
