# Audit Sitemap — ofina.vn

**Ngày kiểm:** 2026-09-25
**Nguồn:** Live `https://ofina.vn/sitemap.xml` (fetch 200, 535.949 bytes) + mã nguồn local `/Users/admin/ofina-web`
**File sinh sitemap:** `app/sitemap.ts` (Next.js 15 App Router — `MetadataRoute.Sitemap`, `next-sitemap` có cài trong `package.json` nhưng **không được dùng** để sinh sitemap chính; sitemap thực tế do `app/sitemap.ts` sinh động qua Supabase)
**robots.txt:** `app/robots.ts` → khai báo đúng `Sitemap: https://ofina.vn/sitemap.xml`

## ĐIỂM SITEMAP: 55/100

| Hạng mục | Trọng số | Điểm đạt | Lý do |
|---|---|---|---|
| XML hợp lệ + khai báo robots.txt | 10 | **10** | Well-formed, encoding UTF-8 đúng, `<urlset>` chuẩn, robots.txt trỏ đúng URL |
| Giới hạn 50k URL + kiến trúc | 10 | **6** | 2.788 URL, còn xa hạn mức 50k (Critical không kích hoạt) nhưng gộp 1 file duy nhất cho 4 loại trang khác nhau → khó theo dõi coverage riêng trong GSC |
| HTTP status URL trong sitemap (mẫu kiểm) | 15 | **13** | 67/67 URL mẫu = 200, nhưng còn lỗ hổng lý thuyết do độ trễ ISR (xem Medium #1) |
| Noindex/canonical xung đột | 10 | **10** | 100% mẫu kiểm có `index, follow` + canonical tự trỏ đúng, không xung đột |
| Độ chính xác `lastmod` | 20 | **3** | 4,4% URL (danh mục + bộ sưu tập + static) là "dấu thời gian fetch" xoay vòng mỗi giờ; phần còn lại (sản phẩm) là dấu thời gian **seed 1 lần**, không phải ngày sửa nội dung thật |
| Độ phủ so với crawl thực tế (blog, /nhom) | 25 | **5** | Thiếu hoàn toàn 16 slug blog (bên trong lại lộ bug nội dung trùng lặp nghiêm trọng) + thiếu 5 trang `/nhom/*` sống, có nội dung riêng |
| `priority`/`changefreq` lỗi thời | 5 | **3** | Có mặt trên toàn bộ 2.788 URL — vô hại nhưng nên dọn (Google bỏ qua từ lâu) |
| Quality gate location/doorway page | 5 | **5** | N/A — không có location page kiểu doorway, 13 trang bộ sưu tập có nội dung riêng + FAQ + guard `MIN_PRODUCTS` |
| **TỔNG** | **100** | **55** | |

---

## 1. Tổng quan số liệu đã xác minh

```
Tổng số <url>           : 2.788   (curl trực tiếp https://ofina.vn/sitemap.xml, 200)
├─ /san-pham/{slug}      : 2.664  (trang chi tiết sản phẩm — status='active' tại query)
├─ /san-pham (listing)   : 1
├─ /danh-muc/{slug}      : 95     (danh mục)
├─ /bo-suu-tap/{slug}    : 13     (bộ sưu tập — KHÔNG phải 14 như số đã biết trước; đếm lại trực
│                                   tiếp trong lib/collections.ts ra đúng 13 slug, khớp 13 URL live)
├─ /bo-suu-tap (listing) : 1
├─ /chinh-sach/{slug}    : 6      (khớp 100% với POLICY_SLUGS trong app/chinh-sach/[slug]/page.tsx)
└─ Trang tĩnh khác       : 8      (/, /san-pham-moi-2026, /khuyen-mai, /showroom, /gioi-thieu,
                                    /blog, /tu-van, /bao-gia-b2b)

priority có mặt         : 2.788/2.788 (100%)
changefreq có mặt       : 2.788/2.788 (100%)
lastmod duy nhất (toàn bộ): 2.435/2.788 giá trị khác nhau — NHƯNG con số này gây hiểu lầm, xem mục 3.
```

Ghi chú chênh lệch với số "đã biết trước": số bộ sưu tập thực tế là **13**, không phải 14 (đếm lại bằng `grep -c "slug: '" lib/collections.ts` = 13, khớp với 13 URL `/bo-suu-tap/*` — không phải 14 — trên sitemap live). Chênh lệch nhỏ, không ảnh hưởng kết luận.

---

## 2. Bảng kiểm theo khung chuẩn

| Check | Kết quả | Mức độ | Ghi chú |
|---|---|---|---|
| XML hợp lệ | ✅ PASS | — | `<?xml version="1.0" encoding="UTF-8"?>`, cấu trúc `urlset` chuẩn |
| >50k URL | ✅ PASS | — | 2.788 << 50.000, Critical không kích hoạt |
| Non-200 URL (mẫu 67 URL) | ✅ PASS | — | 0/67 lỗi — xem mục 4 để có danh sách mẫu đầy đủ |
| Noindexed URL (mẫu) | ✅ PASS | — | `<meta name="robots" content="index, follow"/>` trên toàn bộ mẫu kiểm |
| Redirected URL (mẫu) | ✅ PASS | — | `curl --max-redirs 0` không phát hiện 3xx nào trong 67 URL mẫu |
| Tất cả lastmod giống nhau | ⚠️ ONE HIỆN TƯỢNG KÉP | **High** (không phải Low như bảng gốc) | 124/2.788 URL (4,4%) — toàn bộ 95 danh mục + 13 bộ sưu tập + 16 trang tĩnh — dùng "now" xoay vòng mỗi giờ; phần sản phẩm còn lại thì "unique" nhưng là dấu vết seed 1 lần, không phải lastmod thật (xem mục 3) |
| priority/changefreq | ℹ️ INFO | Info | Có trên 100% URL, Google bỏ qua từ 2022 — nên gỡ để giảm dung lượng file |
| Trang có trong crawl nhưng thiếu sitemap | ❌ FAIL | **High/Critical** | 16 slug blog + 5 trang `/nhom/*` — xem mục 5 |
| Trang thừa trong sitemap (404/redirect) | ✅ PASS (mẫu) | — | Không phát hiện trong mẫu 67 URL, nhưng có rủi ro cấu trúc lý thuyết (Medium #1) |
| 1 file vs sitemap index theo loại | ⚠️ KHUYẾN NGHỊ | Medium | Chưa bắt buộc ở quy mô 2.788, nhưng nên tách ngay để dễ theo dõi GSC theo loại trang |
| Quality gate location page (30+/50+) | N/A | — | Không có location page kiểu doorway trong sitemap |

---

## 3. PHÁT HIỆN CRITICAL

### C1. 16 URL blog không có trong sitemap — và đằng sau đó là lỗi trùng lặp nội dung nghiêm trọng

`app/sitemap.ts` chỉ `fetchAll('categories')` và `fetchAll('products')` — **không hề query bảng `blog_posts`**, dù route `app/blog/[slug]/page.tsx` tồn tại và trang `/blog` liệt kê công khai 16 bài (đã xác nhận `is_published = true`).

Khi lấy toàn bộ 16 slug hiển thị trên `https://ofina.vn/blog` và so khớp tiêu đề/H1, phát hiện:

```
Nhóm 1 — "Cách Chọn Ghế Công Thái Học Chống Đau Lưng" (title/H1 GIỐNG HỆT NHAU 100%): 9 URL
  cach-chon-ghe-cong-thai-hoc-chong-dau-lung
  cach-chon-ghe-cong-thai-hoc-chong-dau-lung-h6mo
  cach-chon-ghe-cong-thai-hoc-chong-dau-lung-iy9c
  cach-chon-ghe-cong-thai-hoc-chong-dau-lung-lkln
  cach-chon-ghe-cong-thai-hoc-chong-dau-lung-n8q2
  cach-chon-ghe-cong-thai-hoc-chong-dau-lung-oims
  cach-chon-ghe-cong-thai-hoc-chong-dau-lung-pjwk
  cach-chon-ghe-cong-thai-hoc-chong-dau-lung-qa6h
  cach-chon-ghe-cong-thai-hoc-chong-dau-lung-xwco

Nhóm 2 — "...Phù Hợp Để Chống Đau Lưng" (biến thể gần giống nhóm 1): 5 URL
  cach-chon-ghe-cong-thai-hoc-phu-hop-de-chong-dau-lung-{cwyp,g2gh,mduc,r5ym,tncl}

Bài thực sự khác biệt: chỉ 2 URL
  ban-nang-ha-thong-minh-la-gi-co-nen-mua-ban-dung-lam-viec
  ghe-giam-doc-loai-nao-tot-kinh-nghiem-chon-mua-2026
```

Đã curl trực tiếp 3 URL trong nhóm 1 → `<title>` và `<h1>` **giống hệt nhau ký tự-đến-ký tự**: *"Cách Chọn Ghế Công Thái Học Chống Đau Lưng | OFINA Blog"* / *"Cách Chọn Ghế Công Thái Học Chống Đau Lưng Hiệu Quả"*. Tức là **chỉ có khoảng 4 chủ đề bài viết thật**, còn lại 12/16 URL là bản trùng lặp gần như tuyệt đối.

**Nguyên nhân kỹ thuật (đọc mã nguồn `app/api/seo/generate-post/route.ts`):**
- Đây là AI content bot chạy Cron (`vercel.json`: `0 1 * * 1,3,5` — thứ 2/4/6 lúc 01:00), gọi Claude sinh bài từ danh sách chủ đề `lib/seo-topics.ts`.
- Cơ chế chống trùng chủ đề (dòng ~65-77) so khớp `usedSlugs` (slug **thật đã lưu trong DB**) với `topicSlug(t)` (slug tự tính **từ câu keyword gốc** trong `lib/seo-topics.ts`) bằng cách so 30 ký tự đầu. Vấn đề: bài do Claude viết ra thường đặt tiêu đề/slug khác cách viết câu keyword gốc (bỏ chữ trong ngoặc, viết lại câu) → 30-ký-tự-đầu không khớp → thuật toán **không nhận ra chủ đề đã viết rồi**, tiếp tục sinh bài mới cho cùng 1 chủ đề.
- Khi slug trùng thẳng (bước "Đảm bảo slug không trùng", dòng ~97-100), code chỉ nối thêm 4 ký tự random (`Date.now().toString(36).slice(-4)`) — đây chính là nguồn gốc các hậu tố `h6mo`, `iy9c`, `cwyp`... quan sát được.
- 16 bài toàn bộ đang `is_published = true` (hiện công khai) — nghĩa là các bản trùng lặp đã được duyệt thủ công qua `/admin/blog/[id]` nhiều lần mà không đối chiếu bài đã có.

**Hệ quả:** Đây là lý do sitemap KHÔNG có blog **hiện đang vô tình che chắn** một vấn đề content nghiêm trọng hơn. Nếu thêm thẳng 16 URL này vào sitemap như đề xuất ban đầu, Google sẽ index 9 bản gần-trùng của cùng 1 bài — đúng loại lỗi "AI-generated mass content" / duplicate content trong bảng Penalty Risk.

**Hành động bắt buộc trước khi đưa blog vào sitemap:**
1. Trong bảng `blog_posts`, xác định 4 bài gốc còn lại (~2-4 chủ đề unique), `is_published = false` hoặc xoá 12 bản trùng lặp còn lại — ưu tiên giữ bản có `published_at` sớm nhất và nội dung dài/đầy đủ nhất.
2. Với các slug trùng đã từng được Google index (kiểm GSC coverage), dùng `301 redirect` từ bản trùng sang bản gốc thay vì xoá thẳng (`middleware.ts` hoặc route rewrite).
3. Vá lỗi dedup ở `app/api/seo/generate-post/route.ts`: nên so khớp theo **slug đã lưu DB thực tế của topic** (lưu `topic_index` hoặc `source_topic` cột riêng trong `blog_posts` khi tạo bài) thay vì so khớp chuỗi mờ 30 ký tự.
4. Sau khi dọn xong, thêm bảng `blog_posts` vào `app/sitemap.ts` với `lastModified: p.updated_at` thật (đã có sẵn field `updated_at` — xem `app/admin/blog/page.tsx` dùng `.order('updated_at')`).

---

## 4. PHÁT HIỆN HIGH

### H1. `lastmod` của TOÀN BỘ danh mục (95) + bộ sưu tập (13) + trang tĩnh (16) = 124 URL (4,4%) là dấu thời gian fetch, xoay vòng mỗi giờ

Đọc `app/sitemap.ts`:
```ts
export const revalidate = 3600
...
const now = new Date()
...
const staticEntries = STATIC_PAGES.map(p => ({ ..., lastModified: now, ... }))
const collectionEntries = COLLECTIONS.map(c => ({ ..., lastModified: now, ... }))  // hardcode `now`, KHÔNG đọc DB
...
const categoryEntries = cats.map(c => ({
  lastModified: c.updated_at ? new Date(c.updated_at) : now,  // fallback `now`
  ...
}))
```

Kiểm chứng trên sitemap live: **toàn bộ 95/95 URL `/danh-muc/*` mang đúng 1 giá trị `lastmod` = `2026-09-25T04:26:38.853Z`** (thời điểm sitemap được Next.js build/revalidate lần gần nhất) — nghĩa là cột `categories.updated_at` **đang NULL cho toàn bộ 95 dòng** trong DB (rơi vào nhánh fallback `now`). Tương tự, 13/13 URL bộ sưu tập và cả 16 trang tĩnh cũng mang đúng giá trị này — vì code hardcode `now`, không đọc DB.

Vì `revalidate = 3600`, giá trị này **dịch chuyển tới thời điểm hiện tại mỗi giờ** mỗi khi có request kích hoạt regenerate — tức Google sẽ thấy `lastmod` của 124 trang này "vừa mới đổi" liên tục dù nội dung không hề thay đổi. Đây chính xác là kiểu lastmod "vô nghĩa" cảnh báo trong khung kiểm — nhưng nghiêm trọng hơn mức "Low" trong bảng chuẩn vì nó ảnh hưởng **100% một loại trang** (toàn bộ danh mục — nhóm trang hub quan trọng cho crawl budget), không phải rải rác.

**Sửa:** thêm cột `updated_at` có giá trị mặc định `now()` + trigger `BEFORE UPDATE` cho bảng `categories`; với bộ sưu tập (13 trang định nghĩa cứng trong code, không có bảng DB) — thêm field `lastUpdated: 'YYYY-MM-DD'` thủ công vào từng object trong `lib/collections.ts`, cập nhật tay mỗi khi sửa nội dung landing page đó.

### H2. Thiếu 5 trang `/nhom/{group}` — có nội dung thật, canonical, index/follow, sống 200 — nhưng không có trong sitemap

`app/nhom/[group]/page.tsx` định nghĩa cứng 5 route qua `generateStaticParams()`: `ghe`, `ban`, `tu-ke`, `sofa`, `cafe-bar` — mỗi trang có `seoTitle`, `description`, `canonical` riêng (không phải thin/trùng lặp). Đã kiểm live:

```
200  https://ofina.vn/nhom/ghe        meta robots: index, follow   canonical: tự trỏ đúng
200  https://ofina.vn/nhom/ban        meta robots: index, follow   canonical: tự trỏ đúng
200  https://ofina.vn/nhom/tu-ke      meta robots: index, follow   canonical: tự trỏ đúng
200  https://ofina.vn/nhom/sofa       meta robots: index, follow   canonical: tự trỏ đúng
200  https://ofina.vn/nhom/cafe-bar   meta robots: index, follow   canonical: tự trỏ đúng
404  https://ofina.vn/nhom/khong-ton-tai   (kiểm đối chứng — 404 đúng như kỳ vọng cho route lạ)
```

5 trang này về bản chất giống hệt các trang trong `STATIC_PAGES` (cùng dạng landing/hub cấp cao, có `generateStaticParams` cố định, không phải nội dung động rủi ro) nhưng bị bỏ sót khi viết `app/sitemap.ts`. Đây là lỗi thiếu sót đơn giản, dễ sửa nhất trong toàn bộ audit — chỉ cần thêm 5 dòng vào mảng `STATIC_PAGES` hoặc một mảng `GROUP_PAGES` riêng.

---

## 5. PHÁT HIỆN MEDIUM

### M1. Cửa sổ trễ ISR giữa sitemap (revalidate=3600) và trạng thái sản phẩm thật

`app/sitemap.ts` và `getProductBySlug()` (trong `lib/queries.ts`) đều lọc `status = 'active'` nên về logic là nhất quán. Nhưng sitemap chỉ regenerate tối đa mỗi giờ (`revalidate = 3600`), trong khi trang sản phẩm truy vấn DB theo thời gian thực mỗi request. Nếu một sản phẩm bị đổi `status` khỏi `active` (ngừng bán/xoá), sản phẩm đó vẫn còn trong sitemap tối đa 1 giờ trong khi URL đã trả 404 — cửa sổ lỗi thoáng qua nhưng có thật về mặt cấu trúc. Mẫu kiểm 30 sản phẩm ngẫu nhiên hiện tại **không phát hiện trường hợp nào** (100% 200), nhưng đây là rủi ro tiềm ẩn cần biết, không phải bằng chứng đã xảy ra.

### M2. `lastmod` của 2.664 sản phẩm là dấu thời gian SEED 1 LẦN, không phải ngày cập nhật nội dung thật

Đào sâu phân phối `lastmod` toàn bộ 2.664 URL sản phẩm:

```
2.469 sản phẩm (92,7%) → lastmod nằm trong đúng 1 cửa sổ 3 phút 23 giây
                          (2026-04-19T09:48:36.385Z → 2026-04-19T09:52:00.184Z)
   95 sản phẩm          → 2026-04-18
  188 sản phẩm          → 2026-04-21
    2 sản phẩm          → 2026-04-20
    5 sản phẩm          → 2026-06-27
   29 sản phẩm          → 2026-09-25T04:26:38.853Z (= giờ fetch, tức updated_at NULL, rơi vào fallback)
```

Đối chiếu `scripts/seed-products.mjs`: script này `upsert` sản phẩm theo batch 100 dòng, **không hề set field `updated_at`** trong payload — giá trị `updated_at` hoàn toàn do default của cột DB tại thời điểm insert/upsert quyết định. 92,7% sản phẩm có `updated_at` dồn trong 3 phút 23 giây khớp chính xác với một lần chạy seed hàng loạt (batch size 100, ~27 batch chạy liên tục). Rà code toàn bộ repo (`grep -rn "updated_at"`) cho thấy **chỉ duy nhất** `app/api/seo/approve-product/route.ts` set `updated_at: new Date().toISOString()` một cách tường minh (khi duyệt sản phẩm mới `status: 'active'`) — không có nơi nào trong luồng sửa giá/mô tả/tồn kho ở `/admin/products` set lại `updated_at`.

**Kết luận:** 2.435 giá trị "unique" trong 2.788 lastmod **không đồng nghĩa** với "2.435 lần cập nhật nội dung thật" như số liệu thô có thể gợi ý. Đây gần như chắc chắn là dấu vết của 5-6 lần chạy script import dữ liệu (18/4, 19/4, 20/4, 21/4, 27/6), không phản ánh việc sửa giá/mô tả sau đó — trừ khi Supabase có `TRIGGER ON UPDATE` tự set `updated_at` mà repo không lộ ra (cần xác minh trực tiếp trong Supabase Studio → Table Editor → `products` → Triggers, không thể xác minh từ code local).

**Sửa:** (a) xác minh trigger DB có tồn tại không; nếu không có, thêm `TRIGGER BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION set_updated_at()`; (b) với admin edit form (giá/mô tả/tồn kho), set tường minh `updated_at: new Date().toISOString()` mỗi lần save, giống cách `approve-product/route.ts` đã làm.

### M3. Một file sitemap duy nhất gộp 4 loại trang khác nhau

2.788 URL còn cách xa giới hạn cứng 50.000 nên **không phải Critical**, nhưng gộp product/category/collection/static vào 1 `sitemap.xml` khiến Google Search Console chỉ hiển thị 1 dòng coverage duy nhất — không thể biết riêng "danh mục có bao nhiêu % được index" so với "sản phẩm có bao nhiêu % được index". Ở quy mô sắp tới (2.664 sản phẩm sẽ còn tăng), nên chuyển sang sitemap index ngay trong lần refactor tiếp theo (xem đề xuất mục 7).

---

## 6. PHÁT HIỆN LOW / INFO

- **`priority` + `changefreq`** có mặt trên toàn bộ 2.788 URL. Google chính thức bỏ qua cả 2 tag này từ 2022 (Bing/Yandex vẫn đọc `changefreq` phần nào nhưng ảnh hưởng rất nhỏ). Không gây hại, nhưng làm file nặng hơn không cần thiết (~40-50 byte/URL × 2.788 ≈ 120-140KB dư thừa trong tổng 536KB). Khuyến nghị gỡ bỏ khi refactor.
- **`next-sitemap`** có trong `package.json` (`^4.2.3`) nhưng không thấy config (`next-sitemap.config.js`) và không được dùng — sitemap thực tế 100% do `app/sitemap.ts` (Next.js Metadata API) sinh. Nên gỡ dependency `next-sitemap` khỏi `package.json` nếu chắc chắn không dùng, tránh gây nhầm lẫn cho dev sau.

---

## 7. Kết quả kiểm HTTP status — toàn bộ mẫu đã curl (67 URL, 0 lỗi)

**Sản phẩm — mẫu ngẫu nhiên 30/2.664 (random seed cố định để tái lập được):**

| Kết quả | Số lượng |
|---|---|
| 200 OK | 30/30 (100%) |
| 404 | 0 |
| 3xx redirect | 0 |

Danh sách 30 URL đã kiểm (trích, xem thêm ở cuối để tái lập): `ghe-lanh-dao-da-bo-leon-le-623a-be-ofn-gct-0006`, `ban-lam-viec-eos-ec05a-1412-ofn-blvs-0025`, `sofa-da-cao-cap-sf709-1-ofn-sfd1-0010`, `ghe-cong-thai-hoc-ergonomic-skyfall-black-ofn-gcth-0028`, `ghe-xoay-van-phong-plato-pl07a-black-ofn-gxlt-0001`, ... (đầy đủ 30 URL trong phụ lục).

**Danh mục — mẫu 8/95:** 8/8 = 200 (`ghe-xoay-luoi`, `cum-ban-lam-viec-8-nguoi`, `sofa-doi`, `tu-tai-lieu-sat`, `ban-hop-van-phong-cao-cap`, `ban-lanh-dao`, `cum-ban-lam-viec-6-nguoi`, `ban-tra`).

**Bộ sưu tập — mẫu 2/13:** 2/2 = 200 (`ghe-giam-doc-cao-cap`, `ghe-cong-thai-hoc`).

**Trang tĩnh — toàn bộ 16/16 + 6 chính sách/6:** 22/22 = 200 (đã curl từng URL, không redirect).

**`/nhom/*` — toàn bộ 5/5 route thật + 1 route giả để đối chứng:** 5/5 = 200, `/nhom/khong-ton-tai` = 404 đúng kỳ vọng (chứng minh route thật vs 404 phân biệt rõ, không bị middleware nuốt lỗi).

**Không phát hiện sản phẩm đã xoá còn sót trong sitemap** trong phạm vi mẫu 30 — nhưng lưu ý cửa sổ trễ 1 giờ ở mục M1, không loại trừ hoàn toàn khả năng này ngoài mẫu.

---

## 8. Quality Gate — Location Page (không áp dụng)

OFINA không có location page kiểu doorway (không có `/[city]/[product]` hay tương tự). 13 trang bộ sưu tập (`/bo-suu-tap/*`) là landing page theo **nhu cầu thương mại** (ghế giám đốc, ghế công thái học...), mỗi trang có:
- `intro` HTML riêng (2 đoạn `<p>` + `<strong>` không phải template rỗng)
- `faqs` riêng (2-3 câu hỏi/trang, nội dung khác nhau — đã đọc trực tiếp `lib/collections.ts`)
- Guard kỹ thuật `MIN_PRODUCTS = 3` — comment trong code ghi rõ: *"chỉ định nghĩa collection có ≥ ~10 sản phẩm thật... Trang nào ra < MIN_PRODUCTS sẽ 404"*

→ 13 trang này **không kích hoạt ngưỡng cảnh báo 30+/50+** của khung kiểm và về chất lượng nội dung đạt tiêu chuẩn "Safe at Scale" (không phải city-swap thuần).

---

## 9. Đề xuất cấu trúc sitemap chuẩn

### 9.1 Sitemap index tách theo loại trang

```
/sitemap.xml                  → sitemap index, trỏ tới các file con
/sitemap-static.xml           → trang tĩnh + chính sách + /nhom (22 URL)
/sitemap-categories.xml       → 95 danh mục
/sitemap-collections.xml      → 13 bộ sưu tập
/sitemap-products.xml         → 2.664 sản phẩm (nếu vượt 50k trong tương lai, chia
                                 /sitemap-products-1.xml, -2.xml... theo PAGE_SIZE)
/sitemap-blog.xml             → chỉ thêm SAU KHI dọn xong 12 bài trùng lặp (C1)
```

Next.js 15 hỗ trợ sitemap index native qua `generateSitemaps()`:

```ts
// app/sitemap.ts
export async function generateSitemaps() {
  return [
    { id: 'static' }, { id: 'categories' }, { id: 'collections' }, { id: 'products' }, { id: 'blog' },
  ]
}

export default async function sitemap({ id }: { id: string }): Promise<MetadataRoute.Sitemap> {
  switch (id) {
    case 'static': return buildStaticEntries()        // static + policy + /nhom
    case 'categories': return buildCategoryEntries()  // lastModified: c.updated_at thật
    case 'collections': return buildCollectionEntries()
    case 'products': return buildProductEntries()     // phân trang nếu > 50k
    case 'blog': return buildBlogEntries()             // CHỈ bật sau khi dọn trùng lặp
    default: return []
  }
}
```

### 9.2 `lastmod` thật — nguyên tắc bắt buộc

1. **Danh mục:** thêm trigger DB `updated_at` cho bảng `categories` (hiện đang NULL 100%).
2. **Bộ sưu tập:** thêm field tay `lastUpdated: '2026-04-19'` vào từng object trong `lib/collections.ts`, sửa `app/sitemap.ts` đọc field này thay vì hardcode `now`.
3. **Sản phẩm:** xác minh + thêm trigger `ON UPDATE` cho bảng `products`; đảm bảo mọi luồng sửa (admin panel, API duyệt sản phẩm, cập nhật giá hàng loạt) đều set `updated_at` tường minh nếu không có trigger DB.
4. **Trang tĩnh:** dùng ngày deploy/ngày sửa nội dung thật cuối cùng (có thể lấy từ `git log -1 --format=%aI -- app/gioi-thieu/page.tsx` build-time, hoặc field cấu hình tay), **không dùng `now()`** — nếu không có ngày thật, **bỏ hẳn thẻ `lastmod`** cho các URL đó còn tốt hơn là gắn ngày giả (Google phạt nặng hơn khi phát hiện lastmod giả mạo có hệ thống so với việc thiếu lastmod).
5. **Blog:** dùng `blog_posts.updated_at` (đã có sẵn field, đã được `/admin/blog` dùng để sort) — chỉ bật sau khi xử lý xong C1.

### 9.3 Bổ sung 5 route `/nhom/*` (sửa nhanh nhất, nên làm ngay)

```ts
const GROUP_PAGES = ['ghe', 'ban', 'tu-ke', 'sofa', 'cafe-bar'].map((g) => ({
  path: `/nhom/${g}`,
  priority: 0.75, // có thể bỏ nếu dọn priority/changefreq theo mục 6
}))
```

### 9.4 Dọn `priority`/`changefreq`

Loại bỏ 2 field này khỏi toàn bộ entry (Google ignore, Bing ảnh hưởng không đáng kể) — giảm ~130KB dung lượng file, không ảnh hưởng SEO.

---

## 10. Danh sách hành động ưu tiên

| # | Việc cần làm | Mức độ | Độ khó |
|---|---|---|---|
| 1 | Dọn 12/16 bài blog trùng lặp trong DB (giữ bản gốc, 301 redirect hoặc xoá bản trùng) | Critical | Trung bình — cần rà DB + quyết định redirect |
| 2 | Vá lỗi dedup trong `app/api/seo/generate-post/route.ts` (so khớp theo topic_id thay vì slug mờ) | Critical | Nhỏ |
| 3 | Thêm 5 route `/nhom/*` vào `app/sitemap.ts` | High | Rất nhỏ — 5 dòng code |
| 4 | Xác minh + thêm trigger `updated_at` cho bảng `categories` (đang NULL 100%) và `products` | High | Trung bình — cần quyền Supabase Studio |
| 5 | Sửa `collectionEntries` dùng ngày thật thay vì hardcode `now` | Medium | Nhỏ |
| 6 | Tách sitemap thành index theo loại trang (`generateSitemaps()`) | Medium | Trung bình |
| 7 | Thêm `blog_posts` vào sitemap — **chỉ sau khi hoàn thành #1, #2** | High (có điều kiện) | Nhỏ, phụ thuộc #1 |
| 8 | Gỡ `priority`/`changefreq` khỏi output | Low | Rất nhỏ |
| 9 | Gỡ dependency `next-sitemap` khỏi `package.json` nếu xác nhận không dùng | Info | Rất nhỏ |

---

## Phụ lục — Lệnh & dữ liệu thô để tái lập kiểm tra

```bash
# Tải sitemap live
curl -s -o sitemap.xml -w "HTTP_STATUS:%{http_code} SIZE:%{size_download}\n" https://ofina.vn/sitemap.xml
# → 200, 535949 bytes

# Đếm URL theo loại
grep -c "<url>" sitemap.xml   # 2788
grep -oP '(?<=<loc>)[^<]+' sitemap.xml | sed -E 's#https://ofina.vn##' | awk -F'/' '{print $2}' | sort | uniq -c

# robots.txt
curl -s https://ofina.vn/robots.txt
# → Sitemap: https://ofina.vn/sitemap.xml  (đúng)

# Mẫu 30 URL sản phẩm (random seed 42, python3 random.sample — không dùng shuf vì macOS không có sẵn)
# 30/30 = HTTP 200, 0 redirect (curl --max-redirs 0)

# Blog — trích toàn bộ slug từ trang listing
curl -s https://ofina.vn/blog | grep -oE 'href="/blog/[^"]+"' | sort -u
# → 16 slug, 14 trong đó là biến thể gần-trùng của 2 bài

# /nhom — kiểm 5 route thật + 1 route giả đối chứng
for g in ghe ban tu-ke sofa cafe-bar khong-ton-tai; do
  curl -s -o /dev/null -w "%{http_code}\n" "https://ofina.vn/nhom/$g"
done
# → 200 200 200 200 200 404
```

**Danh sách đầy đủ 30 URL sản phẩm đã kiểm (tất cả HTTP 200):**
```
ghe-lanh-dao-da-bo-leon-le-623a-be-ofn-gct-0006
ban-lam-viec-eos-ec05a-1412-ofn-blvs-0025
sofa-da-cao-cap-sf709-1-ofn-sfd1-0010
ghe-cong-thai-hoc-ergonomic-skyfall-black-ofn-gcth-0028
ban-lam-viec-oval-ov01a-khung-den-ofn-blvs-0065
ghe-cafe-monet-ofn-gcfc-0037
ban-training-tr-019at-ofn-btr-0033
ban-hop-sonic-s57-ofn-bhvc-0025
cum-ban-lam-viec-nhap-khau-4-nguoi-kemi-k-wd2412g-ofn-cbl4-0041
ban-giam-doc-eos-eutp02-1608-khung-trang-ofn-bgds-0015
tu-sat-dung-file-ho-so-gs3-ofn-ttls-0001
ghe-rap-chieu-phim-gv-608-ofn-grp-0008
ban-cafe-c110-5-ofn-bcfs-0026
ban-classic-s101-12-ofn-blvg-0025
ghe-cafe-cross-ofn-gcfc-0015
cum-ban-lam-viec-3-nguoi-eros-erc01-2623-ofn-cbl3-0009
cum-ban-lam-viec-6-nguoi-atlas-atc03-3612-khung-trang-ofn-cbl6-0005
ghe-xoay-van-phong-apollo-ap01a-bl-ofn-gxl-0001
tu-tai-lieu-go-tg02-3212a-ofn-thst-0021
ghe-xoay-van-phong-ryan-r28b-gr-ofn-gxl-0035
tu-sat-dung-do-lk7c2-ofn-tst-0020
tu-locker-go-8-canh-khoa-mat-ma-lkg8mm-tg-ofn-tlkg-0033
ban-hop-nhap-khau-benzi-bz08-ofn-bhvc-0002
tu-locker-sat-10-ngan-lk10-ofn-tst-0004
ghe-quy-da-f8773c-ofn-gcqd-0002
ban-lam-viec-eos-ec02-1212-ofn-blvs-0018
gia-sach-sat-gs4a-ofn-kstv-0004
tu-locker-go-12-canh-lkg12-tg-ofn-tlkg-0003
ghe-cafe-eames-j1-ofn-gcfc-0018
ghe-xoay-van-phong-plato-pl07a-black-ofn-gxlt-0001
```
