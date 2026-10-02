# Audit kỹ thuật SEO — ofina.vn — Lần 2 (28/09/2026)

Lần 1: 25/09/2026 — 60/100. Audit này chỉ tập trung vào phần **còn tồn tại** hoặc **mới phát sinh** sau đợt sửa 25/09. Các mục đã sửa được xác minh lại bằng dữ liệu sống (curl + đọc mã nguồn `/Users/admin/ofina-web`), không suy đoán.

**Phạm vi đã quét:** 45 URL sống (curl trực tiếp `https://ofina.vn`, có timestamp 2026-09-28 ~11:08–11:22 UTC) + đối chiếu mã nguồn tương ứng trong repo local. Gồm: trang chủ, `/san-pham` (page 1, page 2, page 9999), 5 trang `/danh-muc/*` (+ biến thể `?sort=`, `?page=2`, `?min=`), `/bo-suu-tap` + 3 trang con, 3 trang `/san-pham/[slug]`, `/blog` + 2 bài, 5 trang `/nhom/*` (+ 1 biến thể `?page=2`), 6 trang chính sách/showroom/giới thiệu/quiz/thanh-toán/giỏ hàng, `/tim-kiem` (2 biến thể), `/khuyen-mai`, `/san-pham-moi-2026`, `/bao-gia-b2b`, `/tu-van`, 4 URL 404 giả lập, redirect http/https/www/trailing-slash/uppercase, 1 slug blog bị gộp trùng cũ.

**ĐIỂM KỸ THUẬT TỔNG: 80/100** (tăng từ 60/100 ngày 25/09)

---

## 1. Đã xác minh CÒN ĐÚNG — các mục đã sửa ngày 25/09

| Mục đã sửa | Xác minh | Bằng chứng |
|---|---|---|
| Bỏ canonical mặc định `'/'` ở layout | ĐÚNG | `app/layout.tsx` không còn `alternates.canonical`; 12/12 trang lấy mẫu có canonical riêng đúng URL của nó (vd. `/blog/kich-thuoc-ban-hop-chuan...` → canonical đúng chính nó, không phải `/`) |
| Soft-404 blog/sản phẩm/danh mục → `notFound()` | ĐÚNG | Live: `/blog/khong-ton-tai-xyz123`, `/san-pham/khong-ton-tai-xyz123`, `/danh-muc/khong-ton-tai-xyz123` đều trả **HTTP/2 404** thật (không phải 200 kèm nội dung rỗng) |
| `/tim-kiem` noindex | ĐÚNG | Live: `<meta name="robots" content="noindex, follow"/>`, canonical `/tim-kiem` |
| Sitemap có blog + 5 trang `/nhom` | ĐÚNG | sitemap.xml (2.799 URL) chứa 6 `/blog/*`, 5 `/nhom/*`, 95 `/danh-muc/*`, 2.664 `/san-pham/*`, 13 `/bo-suu-tap/*` |
| Ảnh sản phẩm qua proxy `/img`, bỏ `x-robots-tag` | ĐÚNG | `curl -I https://ofina.vn/img/products/S09/02.webp` → 200, **không có** header `x-robots-tag`, `cache-control: public, max-age=31536000, immutable` |
| Hero 8,1MB → WebP nhẹ | ĐÚNG, còn tốt hơn báo cáo | 5 ảnh hero thực tế 9,5KB–119KB (không phải 332KB như báo cáo lần 1), header `cache-control: public, max-age=2592000, stale-while-revalidate=86400` |
| `og-image.jpg` + ảnh showroom hết 404 | ĐÚNG (về mặt không-404) | `og-image.jpg` → 200, 71,6KB, `image/jpeg`. Trang `/showroom` không tham chiếu ảnh vỡ nào (nhưng xem mục Medium #6 — trang này chỉ có đúng 1 `<img>` = logo, chưa có ảnh chụp showroom thật) |
| JSON-LD cho mọi trang `/danh-muc` | ĐÚNG | 12 script `application/ld+json`/trang: BreadcrumbList + CollectionPage + FAQPage (khi có nội dung) + 3 schema toàn cục (Organization/WebSite/LocalBusiness×2 kế thừa từ layout) |

Không có mục nào trong 8 mục "đã sửa" bị hồi quy. Không báo lại các mục này thành lỗi mới.

---

## 2. Vấn đề CÒN TỒN TẠI / MỚI PHÁT HIỆN

### CRITICAL — không phát hiện
Không có lỗi chặn Googlebot hoàn toàn (không 5xx, không robots.txt chặn nhầm trang tiền, không redirect loop, không noindex nhầm trang tiền).

---

### HIGH

**H1. Canonical trang phân trang gộp hết về trang 1 — mất tín hiệu cho nội dung trang 2+**
Áp dụng cho **toàn bộ 3 loại listing có phân trang**: `/san-pham` (2.664 SP), 95 trang `/danh-muc/*`, 5 trang `/nhom/*`.

Bằng chứng đo được (tải trực tiếp HTML, không suy đoán):
- `/san-pham?page=2` → `<link rel="canonical" href="https://ofina.vn/san-pham"/>` — **giống hệt** trang 1, kèm `<title>` **giống hệt** trang 1 (`Tất cả sản phẩm nội thất văn phòng | OFINA`)
- `/danh-muc/ban-giam-doc?page=2` → canonical `https://ofina.vn/danh-muc/ban-giam-doc`, title giống hệt trang 1
- `/danh-muc/ban-giam-doc?sort=price-asc` → canonical vẫn `.../ban-giam-doc` (chấp nhận được vì đây là biến thể sắp xếp, không phải nội dung mới)
- `/nhom/ghe?page=2` → canonical `https://ofina.vn/nhom/ghe`, title giống hệt trang 1

Nguồn: `app/san-pham/page.tsx` dòng 6-9 (`alternates: { canonical: '/san-pham' }` cố định, không nhận biến `page`); `app/danh-muc/[slug]/page.tsx` dòng 29 và `app/nhom/[group]/page.tsx` dòng 64 — cùng pattern.

**Tác động:** Google coi trang 2+ là bản sao trang 1 → khả năng cao không index/crawl sâu các trang phân trang này như trang riêng biệt. Rủi ro được giảm nhẹ vì mỗi sản phẩm vẫn có URL `/san-pham/[slug]` riêng và nằm trong sitemap — **không mất index sản phẩm**, nhưng mất giá trị của chính trang danh mục/listing trang 2+ (không có cơ hội xếp hạng riêng, lãng phí crawl budget khi Googlebot phát hiện nhưng bị canonical "huỷ").

**Khuyến nghị:** Với `/san-pham` và `/nhom/*`: đổi canonical thành tự trỏ về chính nó kèm `?page=N` (self-referencing) khi `page>1`. Với `/danh-muc/*`: giữ canonical về trang 1 CHỈ cho biến thể `sort=`/`min=`/`max=`, nhưng tách riêng canonical tự tham chiếu cho `page=N`.

**H2. Trang danh mục + trang sản phẩm không được CDN cache — 100% SSR mỗi lượt truy cập**
Đo 3 lần liên tiếp (không phải 1 lần ngẫu nhiên):
```
/danh-muc/ban-giam-doc     → cache-control: private, no-cache, no-store, max-age=0, must-revalidate | x-vercel-cache: MISS  (×3/3)
/san-pham/ban-hop-sonic-...  → cache-control: private, no-cache, no-store, max-age=0, must-revalidate | x-vercel-cache: MISS  (×3/3)
```
So sánh với trang tĩnh (`/`, `/bo-suu-tap`, `/chinh-sach/*`, `/khuyen-mai`...): `cache-control: public, max-age=0, must-revalidate` + `x-vercel-cache: HIT/PRERENDER/STALE` + header `x-nextjs-prerender:1`.

**Nguyên nhân (đối chiếu mã nguồn):** `app/danh-muc/[slug]/page.tsx` có khai báo `export const revalidate = 3600` (dòng 18) nhưng route đọc `searchParams` (Dynamic API của Next.js) → buộc render động 100%, `revalidate` bị vô hiệu hoá. `app/san-pham/[slug]/page.tsx` và `app/san-pham/page.tsx` không khai báo `export const revalidate` nào; Next.js 15.1.0 (xem `package.json`) mặc định `fetch()` là `no-store` nên toàn bộ cây fetch tới Supabase trong các route này luôn bỏ qua cache.

**Tác động đo được:** TTFB hiện tại (lúc hàm đang "ấm", gọi liên tiếp) vẫn ở mức chấp nhận — `/danh-muc/ban-giam-doc` 330–400ms, `/san-pham/[slug]` 340–440ms, so với trang tĩnh `/` chỉ 200–400ms. Rủi ro thật không nằm ở TTFB hiện tại mà ở việc **2.664 trang sản phẩm + 95 danh mục + 5 nhóm không có lớp đệm CDN** — mỗi lượt Googlebot cào (và mỗi lượt khách thật) đều đánh thẳng vào Supabase + hàm serverless, không có gì hấp thụ tải khi crawl đồng thời tăng đột biến.

**Khuyến nghị:** Với `/san-pham/[slug]` (không cần `searchParams`) — thêm `export const revalidate = 3600` + đảm bảo Supabase fetch không ép `no-store`. Với `/danh-muc/[slug]` và `/nhom/[group]` — tách phần đọc dữ liệu category info ra khỏi phần phụ thuộc `searchParams`, hoặc dùng `generateStaticParams` + revalidate cho biến thể mặc định (không query string).

---

### MEDIUM

**M1. `/gio-hang` và `/thanh-toan` không có metadata riêng — chỉ được bảo vệ 1 lớp (robots.txt)**
Bằng chứng: `curl https://ofina.vn/gio-hang` → `<title>OFINA — Nội Thất Văn Phòng Cao Cấp Chính Hãng</title>` (title mặc định của trang chủ), `<meta name="robots" content="index, follow"/>` (mặc định từ layout), **không có** `<link rel="canonical">`. Giống hệt với `/thanh-toan`.

Nguồn: cả hai là `'use client'` component, không có `generateMetadata` → kế thừa 100% metadata mặc định ở `app/layout.tsx`. Hiện tại 2 trang này chỉ không bị crawl nhờ `Disallow: /gio-hang` và `Disallow: /thanh-toan` trong robots.txt — không có lớp phòng thủ thứ 2 (`meta robots noindex`). Nếu robots.txt bị sửa sai trong tương lai, 2 trang sẽ tự động lộ ra dưới title trùng trang chủ.

**Khuyến nghị:** Thêm `generateMetadata` với `robots: { index: false, follow: false }` tường minh cho cả 2 trang (defense-in-depth, không phụ thuộc một mình robots.txt).

**M2. Thiếu header `Content-Security-Policy` và `Permissions-Policy` trên toàn site**
Kiểm tra header của 14 loại route khác nhau (trang chủ, danh mục, sản phẩm, blog, nhóm, chính sách, showroom, quiz, thanh toán, giỏ hàng, proxy ảnh) — **không route nào** có 2 header này. `next.config.mjs` `headers()` chỉ set `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`. HSTS có (`strict-transport-security: max-age=63072000`, do Vercel tự thêm) nhưng thiếu `includeSubDomains` và `preload`.

**Khuyến nghị:** Thêm CSP tối thiểu (cho phép Google Analytics/Vercel Analytics/Supabase domains) và `Permissions-Policy: camera=(), microphone=(), geolocation=()` vào `next.config.mjs`.

**M3. `lastmod` trong sitemap.xml không phản ánh thời điểm sửa thật của 19 trang tĩnh**
Bằng chứng: tải sitemap lúc 11:08:25 UTC — toàn bộ 19 URL tĩnh (`/`, `/san-pham`, `/showroom`, `/chinh-sach/*`...) đều có `<lastmod>2026-09-28T11:08:25.873Z</lastmod>` — trùng khớp chính xác thời điểm request, không phải thời điểm nội dung đổi thật.

Nguồn: `app/sitemap.ts` dòng 34 (`const now = new Date()`) áp cho toàn bộ `STATIC_PAGES` mỗi lần route chạy lại (route có `revalidate = 3600` → mỗi giờ lastmod các trang tĩnh lại nhảy sang giờ hiện tại dù nội dung không đổi).

**Khuyến nghị:** Gắn `lastmod` cố định (ngày deploy hoặc ngày sửa nội dung thật) cho các trang tĩnh thay vì `new Date()` động.

**M4. `/showroom` không có ảnh thật nào của 2 chi nhánh**
Bằng chứng: toàn trang `/showroom` chỉ có **1 thẻ `<img>`** duy nhất = logo trong header. `LOCAL_BUSINESS_LD` trong `app/layout.tsx` (dòng 104, 121) dùng `logo.png` làm ảnh cho cả 2 `FurnitureStore`, kèm chú thích ngay trong code "tạm dùng logo vì showroom-hn.jpg không tồn tại". Không phải lỗi 404 (đã fix đúng theo yêu cầu lần 1), nhưng đây là trang có mục đích chính là giới thiệu địa điểm vật lý (Local SEO) mà chưa có ảnh chụp thật nào kể từ đợt sửa 25/09.

**Khuyến nghị:** Bổ sung ảnh chụp thật 2 showroom (không bắt buộc phải sửa gấp, nhưng ảnh hưởng tín hiệu E-E-A-T/Local SEO nếu để lâu).

**M5. `/san-pham?page=9999` (vượt tổng số trang) vẫn trả 200, không có thông báo rỗng**
Bằng chứng: live `curl` xác nhận `/san-pham?page=9999` → **HTTP 200** (không phải 404), cùng canonical `/san-pham` như trang 1 (theo H1). Đối chiếu mã nguồn `app/san-pham/page.tsx`: không có xử lý khi `page > totalPages` (không `notFound()`, không thông báo "không có sản phẩm" như `app/danh-muc/[slug]/page.tsx` dòng 178-181 đã làm cho trường hợp category rỗng). Rủi ro index thấp (canonical đã bảo vệ) nhưng vẫn là URL rỗng lãng phí crawl budget nếu bot tự đoán tham số `page`.

**Khuyến nghị:** Thêm `notFound()` hoặc thông báo rõ ràng khi `page > totalPages` trên `/san-pham` (đồng bộ với cách `/danh-muc/[slug]` đã xử lý).

---

### LOW

**L1. Title trang `/tim-kiem?q=...` bị lặp "| OFINA" hai lần**
Bằng chứng: `<title>Tìm kiếm: &quot;ghe&quot; | OFINA | OFINA</title>`. Nguồn: `app/tim-kiem/page.tsx` dòng 13 trả `title: \`Tìm kiếm: "${q}" | OFINA\`` dạng chuỗi thường (không bọc `{ absolute: ... }` như các trang khác), nên bị layout template `%s | OFINA` nối thêm lần 2. Trang đã `noindex` nên không ảnh hưởng index, chỉ ảnh hưởng hiển thị tab trình duyệt/khi chia sẻ link.

**Khuyến nghị:** Đổi `title: q ? { absolute: \`Tìm kiếm: "${q}" | OFINA\` } : ...`.

**L2. `app/san-pham/page.tsx` và `app/nhom/[group]/page.tsx` không khai báo `export const revalidate`**
Góp phần vào H2, nhưng tách riêng vì đây là chỗ sửa rẻ nhất — chỉ cần thêm dòng cache config, không cần refactor kiến trúc.

---

## 3. Các mảng đã kiểm và SẠCH (không phát hiện vấn đề)

- **Redirect/URL structure:** `http→https` (308, 1 hop), `www→non-www` (308, 1 hop, cả http và https), trailing-slash `/san-pham/→/san-pham` (308, 1 hop), URL viết hoa `/SAN-PHAM` → 404 thật (không silent-redirect gây trùng lặp), 13 redirect blog trùng cũ (`next.config.mjs`) vẫn hoạt động đúng 1 hop. Không phát hiện redirect chain >1 hop ở bất kỳ URL nào đã quét.
- **robots.txt:** hợp lệ, cho phép rõ ràng 9 bot AI (GPTBot, ClaudeBot, PerplexityBot, Google-Extended, Bingbot...), chặn đúng `/api/`, `/gio-hang`, `/thanh-toan`, `/tra-cuu-don-hang`, `/admin`; khai `Sitemap:` + `Host:` đúng.
- **sitemap.xml:** XML hợp lệ, 2.799 URL, dưới ngưỡng 50.000 URL/file, không cần chia sitemap index.
- **Hreflang:** không có thẻ nào — đúng với site 1 thị trường (vi-VN), không phải lỗi thiếu sót.
- **Mobile viewport:** `<meta name="viewport" content="width=device-width, initial-scale=1"/>` có mặt trên toàn bộ 14 trang đã kiểm.
- **Font loading:** dùng `next/font` (Be Vietnam Pro, self-hosted, `display: swap`), preload 10 file woff2 trên trang chủ — không có request Google Fonts render-blocking bên ngoài.
- **CLS ảnh sản phẩm:** `ProductImage` dùng Next/Image `fill` bên trong container `relative aspect-square` (`ProductCard.tsx`) — đúng pattern chống CLS dù thẻ `<img>` không có thuộc tính `width`/`height` tường minh trong HTML thô (dự kiến với `fill`, không phải lỗi).
- **Structured data hiện diện:** Organization + WebSite + LocalBusiness×2 (toàn site) + BreadcrumbList/Product/FAQPage/CollectionPage (theo trang) — có mặt đầy đủ trên tất cả trang lấy mẫu, cấu trúc JSON hợp lệ theo kiểm tra thủ công (chưa chạy Rich Results Test tự động — nên làm bổ sung ngoài audit này).
- **Ảnh hero, og-image, ảnh sản phẩm qua proxy:** tất cả 200 OK, cache-control hợp lý (xem mục 1).
- **JS rendering:** kiến trúc SSR/RSC (App Router) — nội dung chính (giá, mô tả, JSON-LD) đã có sẵn trong HTML nguồn ở mọi trang đã kiểm, không phụ thuộc client-side render để Googlebot đọc được nội dung.

## 4. Không đủ dữ liệu để kết luận (ngoài phạm vi audit nguồn)

- **IndexNow (Bing/Yandex/Naver):** không thể xác minh qua crawl HTML/header — cần kiểm tra riêng qua Bing Webmaster Tools/API key, ngoài khả năng của audit nguồn tĩnh này.
- **Touch target size chính xác (44×44px) và độ tương phản màu:** cần công cụ render thực (Lighthouse/PageSpeed Insights) để đo chính xác; đánh giá qua class Tailwind (`px-4 py-2`, `w-10 h-10`...) cho thấy kích thước hợp lý nhưng chưa phải phép đo trực tiếp.
- **LCP/INP/CLS thực tế (CrUX/RUM):** audit này chỉ suy ra rủi ro từ mã nguồn + TTFB tổng hợp (curl), không phải số đo RUM thật. Cần đối chiếu Vercel Speed Insights / PageSpeed Insights (site đã cài `@vercel/speed-insights` — có dữ liệu RUM thật, nên tham chiếu trực tiếp thay vì suy đoán).
- **Product schema `offers` khi `is_price_hidden=true`:** đọc mã (`app/san-pham/[slug]/page.tsx` dòng 83-91) cho thấy khi `is_price_hidden` true và không có review, khối `offers` sẽ `undefined` — Product JSON-LD lúc đó thiếu cả `offers`, `review`, `aggregateRating` (Google yêu cầu ít nhất 1 trong 3). Không có quyền truy vấn DB để đếm bao nhiêu sản phẩm rơi vào trường hợp này nên **không liệt kê thành issue có số liệu** — chỉ ghi chú làm điểm cần kiểm tiếp khi có quyền truy vấn Supabase.

---

*Audit thực hiện 28/09/2026, ~11:08–11:22 UTC, bằng curl trực tiếp `https://ofina.vn` (không cache proxy) + đối chiếu mã nguồn `/Users/admin/ofina-web` tại thời điểm audit. Kích thước HTML đo được là byte gốc chưa nén (curl không gửi `Accept-Encoding: gzip`); kích thước truyền thực tế tới trình duyệt sẽ nhỏ hơn nhờ `compress: true` trong `next.config.mjs`.*
