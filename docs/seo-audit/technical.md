# Audit Kỹ thuật SEO — ofina.vn

Ngày quét: 2026-09-25 · Phương pháp: curl trực tiếp (User-Agent Chrome desktop) trên production `https://ofina.vn` + đối chiếu mã nguồn local `/Users/admin/ofina-web` (Next.js 15 App Router, Vercel). Không dùng số liệu suy đoán — mọi con số dưới đây lấy từ response HTTP/HTML thật hoặc đọc trực tiếp file code (đường dẫn + dòng cụ thể được trích kèm).

## ĐIỂM TECHNICAL SEO: 60/100

| Hạng mục | Điểm | Ghi chú |
|---|---|---|
| Crawlability | 90/100 | robots.txt sạch, sitemap tồn tại; chưa chặn 1 vài route thấp giá trị |
| Indexability | 30/100 | Lỗi canonical diện rộng + soft-404 blog + pagination không kiểm soát |
| Security headers | 70/100 | HTTPS/HSTS/3 header cơ bản tốt, thiếu CSP & Permissions-Policy |
| URL Structure | 85/100 | Sạch, redirect chuẩn 1-hop; 1 URL có "hạn dùng" (năm cứng) |
| Mobile | 80/100 | Viewport đúng, responsive tốt; 1 điểm chấm điều hướng quá nhỏ |
| Core Web Vitals (nguy cơ) | 45/100 | Ảnh hero LCP ~2MB không tối ưu là rủi ro lớn nhất |
| Structured Data | 90/100 | JSON-LD phong phú, đúng cấu trúc, đa loại schema |
| JS Rendering | 95/100 | SSR/RSC đầy đủ, nội dung có sẵn không cần JS |
| IndexNow | 90/100 | Đã triển khai đúng, key xác minh sống |

Điểm tổng phản ánh: **nền tảng kỹ thuật cơ bản tốt** (SSR thật, structured data phong phú, redirect chuẩn, IndexNow hoạt động) **nhưng bị một lỗi canonical hệ thống + soft-404 kéo điểm xuống nặng**, vì đây là lỗi ảnh hưởng trực tiếp tới việc Google có index đúng các trang hub quan trọng nhất (`/san-pham`, `/blog`) hay không.

---

## DANH SÁCH VẤN ĐỀ THEO MỨC ĐỘ

### CRITICAL

1. **Canonical trỏ nhầm về trang chủ trên ≥11 route quan trọng** — `/san-pham` (hub sản phẩm, priority 0.9 trong sitemap), `/san-pham?page=2+`, `/blog`, `/gioi-thieu`, `/khuyen-mai`, `/bao-gia-b2b`, `/tu-van`, `/tim-kiem` (kể cả `?q=...`), `/quiz`, và 6 trang `/chinh-sach/*` đều render `<link rel="canonical" href="https://ofina.vn"/>` thay vì tự trỏ chính nó. Bằng chứng: curl trực tiếp từng URL đều xác nhận. Nguyên nhân gốc: các file `page.tsx` này không set `metadata.alternates.canonical` nên kế thừa nguyên trạng default của `app/layout.tsx:34` (`alternates: { canonical: '/' }`) — Next.js không merge sâu, thiếu key nào là lấy nguyên object cha. Hậu quả: Google được phép coi các trang này là "bản sao trang chủ" và bỏ qua nội dung/không index đúng URL — nghiêm trọng nhất với `/san-pham` (cổng vào ~2.788 sản phẩm) và `/blog`.

2. **Soft-404 tại `/blog/[slug]`** — khi slug không tồn tại, `app/blog/[slug]/page.tsx` dòng 60 KHÔNG gọi `notFound()`, mà trả về trang "Bài viết đang được cập nhật" với **HTTP 200** (xác nhận: `curl -I https://ofina.vn/blog/xxx-khong-ton-tai` → `200`, trong khi `/san-pham/xxx-khong-ton-tai` và `/danh-muc/xxx-khong-ton-tai` đúng chuẩn trả `404`). Trang lỗi này còn dính bug #1 (canonical → trang chủ) nhưng vẫn `robots: index, follow` mặc định. Mọi slug rác gõ vào `/blog/*` đều tạo ra một trang 200 hợp lệ về mặt HTTP — rủi ro thin/duplicate content nếu bị crawl/backlink rác trỏ tới.

3. **Blog gần như vô hình với Google ở cả 3 lớp cùng lúc**: (a) sitemap.xml không chứa URL bài viết nào trong 16 bài đã đăng (bối cảnh đã biết, đã xác minh lại: `grep -c "/blog/" sitemap.xml` = 0); (b) `/blog` (trang danh sách) tự khai canonical về trang chủ (bug #1); (c) `/blog/[slug]` không tồn tại trả 200 thay vì 404 (bug #2). Ba lỗi cộng dồn khiến kênh blog gần như không có đường dẫn index hợp lệ nào ngoài liên kết nội bộ ngẫu nhiên.

### HIGH

4. **`/tim-kiem` (tìm kiếm nội bộ) không bị chặn và không noindex** — `app/tim-kiem/page.tsx` `generateMetadata` chỉ set `title`/`description`, không có `robots: { index: false }`, không nằm trong `DISALLOW` của `app/robots.ts`. Mọi query `?q=...` đều `index, follow` + canonical sai (bug #1). Rủi ro Google index hàng loạt trang kết quả tìm kiếm trùng lặp/thin content — nên thêm `noindex` (giữ `follow`) cho route này.

5. **Phân trang không kiểm tra vượt giới hạn → 200 rỗng thay vì 404/redirect** — Xác nhận trực tiếp: `https://ofina.vn/danh-muc/ban-cafe-gap-gon?page=2` (danh mục chỉ có 11 sản phẩm, 1 trang) trả **HTTP 200** với nội dung "Chưa có sản phẩm nào"; `https://ofina.vn/san-pham?page=9999` cũng trả **200** gần như rỗng. Cả hai file (`app/danh-muc/[slug]/page.tsx`, `app/san-pham/page.tsx`) không có guard `if (currentPage > totalPages) notFound()`.

6. **Rủi ro LCP nghiêm trọng — ảnh hero slider không tối ưu, ~2MB, preload + priority** — `components/home/HeroSlider.tsx` dòng 121-130 dùng `next/image` với prop `unoptimized` (bỏ qua hoàn toàn Next.js Image Optimization) và `priority={i === 0}`. Xác nhận qua `curl -I` ảnh gốc: `content-length: 2115297` (~2.07MB PNG), phục vụ **nguyên kích thước gốc cho mọi viewport kể cả mobile 375px** (không có srcset resize vì bị `unoptimized`). Ảnh này còn được `<link rel="preload" as="image">` trong `<head>` — gần như chắc chắn là phần tử LCP của trang chủ và đẩy LCP vào vùng "Cần cải thiện/Kém" trên mạng di động.

### MEDIUM

7. **Thiếu Content-Security-Policy và Permissions-Policy** — Header hiện có (xác nhận qua `curl -D -`): `x-content-type-options`, `x-frame-options: SAMEORIGIN`, `referrer-policy: strict-origin-when-cross-origin`, `strict-transport-security: max-age=63072000` (từ Vercel). Không có `Content-Security-Policy` hay `Permissions-Policy` trong `next.config.mjs` (hàm `headers()` dòng 17-28 chỉ set 3 header cơ bản). Giảm khả năng phòng vệ XSS/script injection theo chiều sâu.

8. **Canonical phân trang danh mục luôn trỏ về trang 1, không tự tham chiếu** — `app/danh-muc/[slug]/page.tsx` dòng 27: `alternates: { canonical: `/danh-muc/${slug}` }` áp dụng cho MỌI giá trị `page`, kể cả `?page=2,3...` (xác nhận: canonical của `?page=2` giống hệt trang 1). Trái khuyến nghị hiện hành của Google (mỗi trang phân trang nên tự canonical chính nó khi nội dung khác nhau thật) — rủi ro giảm nhưng không triệt tiêu vì sản phẩm từng trang vẫn có URL riêng trong sitemap.

9. **`/quiz` không có metadata riêng (component `'use client'`)** — không thể export `metadata`/`generateMetadata` vì là Client Component, nên kế thừa toàn bộ title/description/canonical mặc định của layout gốc (kể cả bug #1). Nội dung quiz tương tác có giá trị SEO thấp, nên cân nhắc `noindex` hoặc chuyển phần chọn ghế thành nội dung SSR có metadata riêng.

10. **HTML trang chủ nặng bất thường** — `content-length: 747,939 bytes` cho response HTML thô của `/`; trong đó có 242 thẻ `<script>` RSC inline (tổng ~485KB text) chứa dữ liệu flight/hydration. Payload lớn này tăng thời gian parse/hydrate trên thiết bị yếu, gián tiếp ảnh hưởng INP. Khuyến nghị: giảm số sản phẩm render sẵn ở các tab trang chủ, dùng `Suspense`/client-fetch cho phần dưới màn hình đầu.

11. **10 file font `.woff2` được preload đồng thời** — `Be_Vietnam_Pro` (5 weight `400/500/600/700/800`) × 2 subset (`latin`, `vietnamese`) trong `app/layout.tsx` dòng 18-23 → 10 `<link rel="preload" as="font">` trong `<head>`, cạnh tranh băng thông với ảnh LCP ngay từ request đầu tiên. Nên giảm số weight tải trước (chỉ preload weight dùng trên viewport đầu, còn lại lazy).

12. **Rating "5.0" + 5 sao tĩnh hiển thị cho MỌI sản phẩm** — `app/san-pham/[slug]/page.tsx` dòng 180-188 hard-code 5 sao vàng và số "5.0" bất kể sản phẩm có đánh giá thật hay không. Không đẩy vào JSON-LD (`productSchema` không có `aggregateRating` — không vi phạm chính sách structured data của Google) nhưng là nội dung hiển thị không trung thực với người dùng — nên gỡ bỏ nếu chưa có hệ thống review thật.

13. **Touch target chấm điều hướng hero slider quá nhỏ trên mobile** — `components/home/HeroSlider.tsx` dòng ~201-205: dot mobile có class `w-1.5 h-1.5` (~6×6px), dưới ngưỡng khuyến nghị 24×24px (Lighthouse Mobile Usability / WCAG 2.5.5) — ảnh hưởng điểm mobile-friendliness dù không phải lỗi crawl.

### LOW

14. **Đã xác minh lại giả định "sitemap toàn bộ lastmod = hôm nay" — KHÔNG còn đúng với dữ liệu hiện tại.** Tải trực tiếp `sitemap.xml` (2.788 URL, khớp bối cảnh đã biết) và phân tích toàn bộ `<lastmod>`: chỉ **29/2.788 URL (~1%)** có `lastmod = 2026-09-25` (hôm nay) — đây đúng là 16 trang tĩnh (`app/sitemap.ts` dòng 8-25, dùng `lastModified: now`) + 13 trang bộ sưu tập (`COLLECTIONS.map`, dòng 38-43, cũng dùng `now`). **2.759 URL sản phẩm/danh mục còn lại có `lastmod` thật lấy từ `updated_at` trong DB**, rải từ 18/04/2026 đến 27/06/2026 (phân phối: 18/4=95, 19/4=2.469, 20/4=2, 21/4=188, 27/6=5). Kết luận: rủi ro "lastmod giả toàn bộ" không còn xác đáng ở thời điểm quét này — chỉ còn vấn đề nhỏ ở 29 trang tĩnh dùng ngày build thay vì ngày nội dung thực sự đổi (không nghiêm trọng, Google thường tự bỏ qua lastmod không đáng tin).

15. **URL có "hạn dùng" cứng theo năm** — `/san-pham-moi-2026` bake cứng năm vào path vĩnh viễn (`STATIC_PAGES` trong `app/sitemap.ts` dòng 11, priority 0.9). Sang 2027 sẽ cần đổi tên + redirect, mất tín hiệu tích luỹ. Nên đổi thành `/san-pham-moi` không gắn năm, lọc "mới" theo dữ liệu nội bộ.

16. **Dấu vết script tự động sửa file không liên quan SEO** — comment `// rebuild 1782499667` ở cuối `app/danh-muc/[slug]/page.tsx` dòng 196, khả năng là artefact của cron/script ép rebuild Vercel. Không ảnh hưởng SEO nhưng nên dọn để tránh nhiễu diff khi review code.

17. **Tiêu đề lặp brand đuôi kép** (đối chiếu chéo với `docs/seo-audit/onpage.md`) — `/san-pham` ra `<title>Tất cả sản phẩm | OFINA | OFINA</title>`, `/blog` ra `<title>Blog — Kiến thức nội thất văn phòng | OFINA | OFINA</title>` — do title con đã tự thêm `| OFINA` cộng với `title.template: '%s | OFINA'` của layout. Lỗi on-page nhẹ, cùng gốc file với bug canonical #1 nên tiện sửa chung.

---

## CHI TIẾT THEO 9 HẠNG MỤC

### 1. Crawlability — PASS (có lưu ý)
- `robots.txt` (live, khớp `app/robots.ts`): `Allow: /`, disallow đúng 5 route nhạy cảm (`/api/`, `/gio-hang`, `/thanh-toan`, `/tra-cuu-don-hang`, `/admin`); có nhóm rule riêng tường minh chào đón `GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-Web, PerplexityBot, Google-Extended, Applebot-Extended, Bingbot`; có `Sitemap:` và `Host:`.
- `sitemap.xml` tồn tại, 2.788 URL, `revalidate = 3600` (`app/sitemap.ts` dòng 6).
- Lưu ý: `/tim-kiem` và `/quiz` không bị disallow dù giá trị SEO thấp/rủi ro trùng lặp (xem HIGH #4, MEDIUM #9).

### 2. Indexability — FAIL (nghiêm trọng)
- Xem CRITICAL #1, #2, #3 và HIGH #4, #5, MEDIUM #8 ở trên — đây là hạng mục kéo điểm tổng xuống mạnh nhất.
- Điểm tốt: `/san-pham/[slug]`, `/danh-muc/[slug]`, `/bo-suu-tap`, `/bo-suu-tap/[slug]`, `/san-pham-moi-2026`, `/showroom` đều tự canonical đúng (mỗi `generateMetadata` có set `alternates.canonical` tường minh). `/san-pham/[slug]` và `/danh-muc/[slug]` dùng `notFound()` chuẩn Next.js cho slug không tồn tại (404 thật, xác nhận qua `curl -I`). Trang collection có guard `MIN_PRODUCTS` chống thin/doorway page (`lib/collections.ts` dòng 15, `app/bo-suu-tap/[slug]/page.tsx` dòng 56).

### 3. Security — PASS (có lưu ý)
- HTTPS bắt buộc, HSTS `max-age=63072000` (2 năm) từ Vercel.
- Header cơ bản đủ: `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, `Referrer-Policy: strict-origin-when-cross-origin` (set trong `next.config.mjs` dòng 17-28).
- Thiếu: `Content-Security-Policy`, `Permissions-Policy` (MEDIUM #7).
- `poweredByHeader: false` đã tắt (`next.config.mjs` dòng 16) — tốt, không lộ version Next.js.

### 4. URL Structure — PASS (có lưu ý)
- Redirect xác nhận đều **1-hop 308 Permanent**, không có chain:
  - `http://ofina.vn/` → `https://ofina.vn/` (308)
  - `https://www.ofina.vn/` → `https://ofina.vn/` (308)
  - `http://www.ofina.vn/` → `https://www.ofina.vn/` (308, **lưu ý**: chưa gộp thẳng về non-www+https trong 1 hop — người dùng gõ `http://www` sẽ tốn 2 hop tới đích cuối, nhưng vẫn đúng đích, không phải lỗi vòng lặp)
  - `https://ofina.vn/san-pham/` (trailing slash) → `/san-pham` (308) — nhất quán, do Next.js mặc định `trailingSlash: false` (không có override trong `next.config.mjs`).
- Slug có cấu trúc rõ, không dấu, phân cấp hợp lý theo route segment (`/san-pham/`, `/danh-muc/`, `/bo-suu-tap/`, `/chinh-sach/`, `/blog/`).
- Trừ điểm nhẹ: LOW #15 (`/san-pham-moi-2026` gắn cứng năm).

### 5. Mobile — PASS (có lưu ý)
- `<meta name="viewport" content="width=device-width, initial-scale=1"/>` có mặt và đúng trên mọi trang đã quét.
- Layout responsive dùng Tailwind breakpoint đầy đủ (`sm/md/lg`), hero slider có chiều cao cố định theo breakpoint (`h-[320px] sm:h-[400px] md:h-[520px] lg:h-[580px]`) → tránh CLS khi đổi slide.
- `ProductCard` dùng container `aspect-square` cho ảnh → tránh layout shift khi ảnh tải (`components/product/ProductCard.tsx` dòng 21).
- Trừ điểm: MEDIUM #13 (touch target dot quá nhỏ).

### 6. Core Web Vitals (đánh giá nguy cơ từ source, không phải đo field-data thật) — FAIL nguy cơ cao
- **LCP**: nguy cơ cao — xem CRITICAL/HIGH #6 (ảnh hero 2.07MB, `unoptimized`, preload+priority).
- **CLS**: nguy cơ thấp — container ảnh có kích thước cố định (hero, product card) đúng best-practice.
- **INP**: nguy cơ trung bình — MEDIUM #10 (HTML/RSC payload nặng ~700KB + ~485KB script inline có thể kéo dài thời gian hydrate trên máy yếu); cần đo bằng PageSpeed Insights/CrUX thật để xác nhận số cụ thể (source-only inspection không thay thế được field data).
- Khuyến nghị ưu tiên: (1) bỏ `unoptimized` trên hero, dùng loader tối ưu sẵn có `lib/supabase-image-loader.ts` hoặc nén trước ảnh gốc xuống < 200KB WebP/AVIF; (2) giảm số weight font preload; (3) cân nhắc streaming/Suspense cho phần sản phẩm dưới màn hình đầu trang chủ.

### 7. Structured Data — PASS
JSON-LD phát hiện, đúng cấu trúc `@context`/`@type`, không lỗi cú pháp rõ ràng khi kiểm tra bằng mắt:
- `Organization` + `WebSite` (có `SearchAction`) — toàn site, `app/layout.tsx` dòng 58-96.
- `FurnitureStore` × 2 (Hà Nội + TP.HCM, multi-location đúng chuẩn Local Business) — `app/layout.tsx` dòng 98-133.
- `Product` + `Offer` (giá, tiền tệ VND, tình trạng kho) + `BreadcrumbList` + `FAQPage` (khi có FAQ) — `app/san-pham/[slug]/page.tsx` dòng 75-117. Lưu ý tích cực: không nhét `aggregateRating` giả dù UI có hiển thị rating tĩnh (MEDIUM #12) — tránh được lỗi structured data spam rating phổ biến.
- `BlogPosting` + `BreadcrumbList` — `app/blog/[slug]/page.tsx` dòng 111-137 (nhưng chỉ có ý nghĩa khi bài tồn tại; case not-found không có JSON-LD, đúng).
- `CollectionPage` + `ItemList` + `FAQPage` cho trang bộ sưu tập — `app/bo-suu-tap/[slug]/page.tsx` dòng 61-98.
- Khuyến nghị: chạy Google Rich Results Test trên vài URL mẫu để xác nhận không có warning field bắt buộc thiếu (không thể kiểm tra tự động qua source-only ở đây).

### 8. JavaScript Rendering — PASS
- Toàn bộ nội dung chính (text, giá, JSON-LD, breadcrumb, danh sách sản phẩm) xuất hiện đầy đủ trong response HTML thô từ `curl` (không cần thực thi JS) — xác nhận Next.js App Router đang SSR/ISR đúng cách, không phụ thuộc CSR để index.
- `x-nextjs-prerender: 1`, `x-vercel-cache: HIT` trên trang chủ — xác nhận cache tĩnh/ISR hoạt động, tốt cho TTFB.
- Client Components (`'use client'`) dùng đúng chỗ cho phần tương tác (slider, giỏ hàng, bộ lọc) — không lạm dụng CSR cho nội dung cần index.

### 9. IndexNow Protocol — PASS
- `lib/indexnow.ts` triển khai chuẩn: ping `https://api.indexnow.org/indexnow` (endpoint trung chuyển tới Bing/Yandex/Seznam), key host tại `/{KEY}.txt`, `keyLocation` khớp.
- Xác minh sống: `curl https://ofina.vn/12bd0505b5f5a126db4794dde75ee5a7.txt` → `200`, nội dung đúng bằng key trong code (`12bd0505b5f5a126db4794dde75ee5a7`).
- Được gọi tự động ở 4 điểm: publish/update bài blog (`app/admin/blog/actions.ts`), duyệt sản phẩm (`app/api/seo/approve-product/route.ts`), sinh bài SEO (`app/api/seo/generate-post/route.ts`), duyệt bài (`app/api/seo/approve/route.ts`). Thiết kế fire-and-forget, lỗi ping không chặn luồng chính — đúng khuyến nghị.
- Lưu ý: IndexNow chỉ giúp Bing/Yandex; Google chưa hỗ trợ chính thức giao thức này — không thay thế được việc sửa sitemap/canonical cho Google.

---

## FILE THAM CHIẾU CHÍNH (đường dẫn tuyệt đối)
- `/Users/admin/ofina-web/app/layout.tsx` — nguồn gốc canonical mặc định `'/'` (dòng 34) gây bug CRITICAL #1.
- `/Users/admin/ofina-web/app/san-pham/page.tsx`, `app/blog/page.tsx`, `app/gioi-thieu/page.tsx`, `app/khuyen-mai/page.tsx`, `app/bao-gia-b2b/page.tsx`, `app/tu-van/page.tsx`, `app/tim-kiem/page.tsx`, `app/quiz/page.tsx`, `app/chinh-sach/[slug]/page.tsx` — các trang thiếu `alternates.canonical`.
- `/Users/admin/ofina-web/app/blog/[slug]/page.tsx` (dòng 60) — soft-404.
- `/Users/admin/ofina-web/app/danh-muc/[slug]/page.tsx` (dòng 27, dòng 121-124, dòng 196), `app/san-pham/page.tsx` — canonical phân trang + pagination không kiểm tra vượt giới hạn.
- `/Users/admin/ofina-web/components/home/HeroSlider.tsx` (dòng 121-130, dòng ~201-205) — LCP risk + touch target.
- `/Users/admin/ofina-web/next.config.mjs` (dòng 17-28) — thiếu CSP/Permissions-Policy.
- `/Users/admin/ofina-web/lib/indexnow.ts` — IndexNow implementation (PASS).
- `/Users/admin/ofina-web/app/robots.ts`, `app/sitemap.ts` — crawlability (PASS, có lưu ý LOW #14).
- `/Users/admin/ofina-web/docs/seo-audit/onpage.md` — audit on-page song song, xác nhận chéo bug canonical (CRITICAL #1) và bổ sung phát hiện title lặp (LOW #17).
