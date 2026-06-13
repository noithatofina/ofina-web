/**
 * IndexNow — ping Bing/Yandex/Seznam (và Google đang thử nghiệm) ngay khi
 * có URL mới/cập nhật, thay vì chờ crawler tự ghé (có thể mất nhiều tuần).
 *
 * Key được host công khai tại https://ofina.vn/<KEY>.txt (file trong /public).
 * Đổi key thì set env INDEXNOW_KEY và đổi tên file .txt cho khớp.
 *
 * Fire-and-forget: lỗi ping KHÔNG được làm hỏng luồng publish/lưu sản phẩm.
 */

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://ofina.vn'
const KEY = process.env.INDEXNOW_KEY || '12bd0505b5f5a126db4794dde75ee5a7'

function host(): string {
  try {
    return new URL(SITE_URL).host
  } catch {
    return 'ofina.vn'
  }
}

/** Chuẩn hoá path/URL tương đối thành URL tuyệt đối trên domain OFINA. */
function toAbsolute(u: string): string {
  if (u.startsWith('http://') || u.startsWith('https://')) return u
  return `${SITE_URL}${u.startsWith('/') ? '' : '/'}${u}`
}

/**
 * Báo cho search engine biết các URL vừa thay đổi.
 * Gọi sau khi publish bài blog, lưu sản phẩm, v.v.
 */
export async function pingIndexNow(urls: string | string[]): Promise<void> {
  const list = (Array.isArray(urls) ? urls : [urls])
    .filter(Boolean)
    .map(toAbsolute)
  if (list.length === 0) return

  try {
    const res = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify({
        host: host(),
        key: KEY,
        keyLocation: `${SITE_URL}/${KEY}.txt`,
        urlList: list,
      }),
      // Không để treo request người dùng vì việc ping
      signal: AbortSignal.timeout(5000),
    })
    if (!res.ok) {
      console.warn(`[IndexNow] ping trả về ${res.status} cho ${list.length} URL`)
    }
  } catch (err) {
    // Nuốt lỗi — ping chỉ là tối ưu, không phải critical path
    console.warn('[IndexNow] ping thất bại:', err instanceof Error ? err.message : err)
  }
}
