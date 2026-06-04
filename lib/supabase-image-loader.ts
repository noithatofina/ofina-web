/**
 * Custom loader cho next/image:
 * - Supabase Storage URLs → dùng Image Transformation API (resize on-the-fly).
 * - URL ngoài (Unsplash, OG images, branding URLs khác) → trả nguyên (bypass).
 *
 * URL pattern Supabase:
 *   /storage/v1/object/public/<bucket>/<path>      ← raw object
 *   /storage/v1/render/image/public/<bucket>/<path> ← transformed image
 */

export default function supabaseImageLoader({
  src,
  width,
  quality,
}: {
  src: string
  width: number
  quality?: number
}): string {
  if (src.includes('/storage/v1/object/public/')) {
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
