import { createClient } from '@supabase/supabase-js'

/**
 * Anon-key client KHÔNG đọc cookies. Dùng cho mọi public read query
 * trong Server Components để Next.js có thể static-cache page.
 * `createServerSupabase()` (lib/supabase.ts) dùng cookies → force dynamic.
 */
/**
 * Thời gian giữ đệm cho dữ liệu đọc công khai (giây).
 * Next 15 mặc định KHÔNG đệm fetch → mỗi lượt xem (kể cả Googlebot cào
 * 2.664 trang sản phẩm) đều truy vấn DB lại, trang trả `no-store` và CDN
 * luôn MISS. Gắn revalidate vào chính fetch của supabase-js để trang được
 * đệm ở CDN. Sửa sản phẩm trong /admin vẫn hiện ngay vì có gọi
 * /api/revalidate cho từng path.
 */
const PUBLIC_READ_REVALIDATE = 3600

/**
 * Gắn NHÃN cho fetch, nếu không thì `revalidateTag` không xoá được lớp đệm này.
 * Đã mắc đúng lỗi đó ngày 05/10: sửa tên sản phẩm trong DB xong, gọi
 * revalidatePath('/') lẫn revalidateTag('products') đều không ăn thua vì fetch
 * của supabase-js chỉ khai revalidate mà không khai tags — trang chủ giữ tên cũ
 * tới hết 1 tiếng. Nhãn suy ra từ tên bảng trong URL PostgREST (/rest/v1/<bảng>).
 */
const TAG_ALL = 'supabase-public'

function tagsFor(input: RequestInfo | URL): string[] {
  const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url
  const table = url.match(/\/rest\/v1\/([A-Za-z0-9_]+)/)?.[1]
  return table ? [TAG_ALL, table] : [TAG_ALL]
}

export function createPublicSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: { persistSession: false, autoRefreshToken: false },
      global: {
        fetch: (input: RequestInfo | URL, init?: RequestInit) =>
          fetch(input, {
            ...init,
            next: { revalidate: PUBLIC_READ_REVALIDATE, tags: tagsFor(input) },
          } as RequestInit),
      },
    },
  )
}
