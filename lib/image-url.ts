/**
 * Đổi URL ảnh Supabase Storage sang proxy trên ofina.vn (/img/...).
 *
 * Supabase Storage gắn `x-robots-tag: none` nên Google Images bỏ qua ảnh.
 * Route app/img/[...path] phục vụ cùng byte ảnh mà không có header đó.
 * Dùng cho cả thẻ <img> lẫn URL ảnh trong JSON-LD/OG để Google thấy nhất quán.
 */

const PUBLIC_PREFIX = '/storage/v1/object/public/'
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://ofina.vn'

/** Trả URL tuyệt đối vì còn dùng trong JSON-LD và thẻ OG (Google cần URL đầy đủ). */
export function publicImageUrl(url: string | null | undefined): string {
  if (!url) return ''
  const i = url.indexOf(PUBLIC_PREFIX)
  if (i === -1 || !url.includes('.supabase.co')) return url
  return `${SITE_URL}/img/${url.slice(i + PUBLIC_PREFIX.length)}`
}
