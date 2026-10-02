# Audit SEO E-commerce — ofina.vn (quét 25/09/2026)

Phạm vi: Product schema, tối ưu trang danh mục, faceted navigation, xử lý hết hàng,
breadcrumb, ảnh sản phẩm, internal linking sản phẩm liên quan. Không có DataForSEO
credentials trong phiên này → bỏ qua hoàn toàn phần marketplace/Google Shopping,
tập trung on-page + schema + kiến trúc.

**Nguồn dữ liệu:**
- Đọc mã nguồn Next.js 15 tại `/Users/admin/ofina-web`: `app/san-pham/[slug]/page.tsx`,
  `app/danh-muc/[slug]/page.tsx`, `app/san-pham/page.tsx`, `components/product/*`,
  `lib/queries.ts`, `lib/supabase-image-loader.ts`, `app/robots.ts`, `app/sitemap.ts`,
  `next.config.mjs`, `lib/nav-menu.ts`, `components/layout/Header.tsx|Footer.tsx`.
- Fetch trực tiếp HTML/JSON-LD/response header thật từ ofina.vn (curl + BeautifulSoup)
  trên 3 trang sản phẩm: `/san-pham/ban-hop-sonic-s09-ofn-bhl-0017`,
  `/san-pham/ghe-chan-quy-lung-luoi-r28c-bl-ofn-gcql-0014`, và 1 trang tự chọn
  `/san-pham/ghe-phong-hop-da-cao-cap-nhap-khau-no613c-ofn-gph-0134`.
- Kiểm tra trực tiếp `/danh-muc/ban-lam-viec-chan-sat` (90 SP/4 trang), `/san-pham`
  (2.664 SP/111 trang), `sitemap.xml` (2.788 URL), `robots.txt`, và header ảnh gốc
  từ Supabase Storage.
- Có song song một báo cáo on-page riêng tại `docs/seo-audit/onpage.md` (agent khác) —
  báo cáo này xác nhận lại 1-2 phát hiện trùng từ góc nhìn e-commerce vì chúng chặn
  trực tiếp trang hub catalog, không lặp lại toàn bộ nội dung.

---

## ĐIỂM E-COMMERCE SEO TỔNG: 47/100

| Hạng mục | Điểm | Ghi chú |
|---|---|---|
| Product Schema | 72/100 | Đủ field lõi, không gắn review giả — nhưng có case `description: null` |
| Trang danh mục (95 trang) | 42/100 | Canonical phân trang sai; meta description công thức hoá |
| Faceted navigation | 68/100 | Không sinh URL rác được index, nhưng thiếu robots hints |
| Xử lý hết hàng | 50/100 | Schema đúng, UI không khoá nút mua |
| Breadcrumb | 88/100 | UI + JSON-LD đồng bộ, đúng cấu trúc |
| Ảnh sản phẩm | 45/100 | Alt tốt nhưng ảnh bị chặn Google Images + không resize |
| Internal linking | 58/100 | Related products ổn nhưng thiếu sắp xếp; 20/95 danh mục ngoài menu |

Điểm tổng bị kéo xuống mạnh hơn trung bình cộng các hạng mục vì 2 lỗi Critical
(chặn ảnh khỏi Google Images toàn catalog, canonical `/san-pham` trỏ nhầm trang chủ)
tác động ở **quy mô hàng nghìn URL** cùng lúc, không phải lỗi cục bộ 1 trang.

---

## CRITICAL

### C1. Toàn bộ ảnh sản phẩm bị chặn khỏi Google Images (`X-Robots-Tag: none`)
**Nguồn: trực tiếp trên response header thật.**
Mọi ảnh sản phẩm (`*.supabase.co/storage/v1/object/public/products/...`, cả `.webp`
lẫn `.jpg`, test trên nhiều SKU khác nhau) trả về header:
```
x-robots-tag: none
```
Header này tương đương `noindex, nofollow` áp cho chính file ảnh đó — Google Images,
Google Lens và bề mặt ảnh miễn phí trong Merchant Center sẽ không thể index bất kỳ
ảnh sản phẩm nào trong catalog 2.673 sản phẩm × ~8-14 ảnh/SP. Đây là hành vi mặc định
của Supabase Storage cho bucket public (bảo vệ pháp lý), không phải cấu hình cố ý của
OFINA, nhưng hậu quả SEO là mất trắng một kênh lưu lượng ảnh/mua sắm trực quan.
**Impact:** Rất cao — chặn hoàn toàn 1 kênh acquisition.
**Khắc phục:** Cấu hình lại header response cho bucket Storage (Supabase hỗ trợ custom
headers qua CDN/edge function hoặc reverse-proxy ảnh qua route Next.js của chính OFINA
để tự set header `X-Robots-Tag` — hoặc kiểm tra Supabase Storage settings cho phép tắt
tag này cho bucket "products").

### C2. `/san-pham` (hub dẫn tới toàn bộ 2.664 sản phẩm) + toàn bộ trang phân trang có canonical trỏ về trang chủ
**Nguồn: trực tiếp, xác nhận trên page=1, 2, 5.**
```
GET /san-pham        → <link rel="canonical" href="https://ofina.vn">
GET /san-pham?page=2 → <link rel="canonical" href="https://ofina.vn">
GET /san-pham?page=5 → <link rel="canonical" href="https://ofina.vn">
```
Nguyên nhân: `app/san-pham/page.tsx` không khai `alternates.canonical` trong
`metadata`, nên kế thừa `alternates: { canonical: '/' }` từ `app/layout.tsx`. Với
2.664 sản phẩm / 24 mỗi trang = **111 trang** đều tự khai "tôi là bản sao trang chủ".
Google có quyền loại toàn bộ 111 trang này khỏi index, cắt đứt một trong các cổng
crawl/discovery chính vào catalog (dù sản phẩm vẫn có URL riêng qua sitemap, đây vẫn
là mất tín hiệu nội bộ + rủi ro thực tế Search Console báo "Duplicate, Google chose
different canonical").
**Đã được `docs/seo-audit/onpage.md` ghi nhận song song** — xác nhận lại tại đây vì
đây là trang trung tâm của kiến trúc e-commerce.
**Khắc phục:** thêm `alternates: { canonical: '/san-pham' }` (self-canonical, không
theo `page`) vào `metadata` của `app/san-pham/page.tsx`, tương tự cách `danh-muc` và
`san-pham/[slug]` đã làm đúng.

### C3. Sản phẩm thiếu dữ liệu mô tả → `"description": null` trong JSON-LD + không có `<meta name="description">` trên trang
**Nguồn: trực tiếp, trang `ghe-phong-hop-da-cao-cap-nhap-khau-no613c-ofn-gph-0134`.**
```json
{ "@type": "Product", "description": null, ... }
```
Nguyên nhân tại `app/san-pham/[slug]/page.tsx`:
```ts
description: product.short_description || product.seo_description,
```
Khi cả hai field đều `null` trong Supabase, biểu thức trả về `null` (không phải
`undefined`) nên `JSON.stringify` giữ nguyên key với giá trị `null` — output JSON-LD
không hợp lệ về mặt nội dung (Rich Results Test thường bỏ qua field null nhưng đây
vẫn là dấu hiệu dữ liệu thiếu ở tầng DB). Đồng thời trang này hoàn toàn **không có**
thẻ `<meta name="description">` — `generateMetadata` cũng dùng cùng field rỗng đó nên
Next.js không render thẻ meta. Google phải tự bốc nội dung ngẫu nhiên làm snippet.
Đây không phải lỗi cá biệt — là hệ quả của khoảng trống dữ liệu tại một phần catalog
(sản phẩm import chưa được viết mô tả/SEO copy).
**Khắc phục:** (1) sửa `description: product.short_description || product.seo_description || undefined` để không leak `null`; (2) chạy audit dữ liệu Supabase tìm toàn bộ sản phẩm có `short_description` VÀ `seo_description` đều rỗng, ưu tiên bổ sung hàng loạt (ít nhất fallback template theo tên + thông số cơ bản, tốt hơn null).

---

## HIGH

### H1. Canonical trang danh mục luôn trỏ về trang 1, bất kể đang xem trang nào
**Nguồn: trực tiếp, test trên `/danh-muc/ban-lam-viec-chan-sat` (90 SP → 4 trang).**
```
?page=1 → canonical: .../danh-muc/ban-lam-viec-chan-sat
?page=2 → canonical: .../danh-muc/ban-lam-viec-chan-sat   (SAI — phải tự trỏ chính nó)
?page=4 → canonical: .../danh-muc/ban-lam-viec-chan-sat   (SAI)
```
`generateMetadata` trong `app/danh-muc/[slug]/page.tsx` set cứng
`alternates: { canonical: \`/danh-muc/${slug}\` }` không đọc `searchParams.page`.
Với danh mục lớn (≥25 SP, hiện có ít nhất `ban-lam-viec-chan-sat` 90 SP,
`ban-hop-lon` 46 SP...), các trang 2/3/4 tự khai trùng nội dung trang 1 → Google
giảm ưu tiên crawl sâu, sản phẩm chỉ nằm ở trang 2+ khó được phát hiện qua đường
danh mục (vẫn có sitemap + URL riêng nên không mất index hẳn, nhưng giảm tín hiệu
internal discovery, đặc biệt bất lợi khi danh mục có hàng trăm SP).
**Khắc phục:** self-canonical theo trang — `canonical = page > 1 ? "/danh-muc/{slug}?page={page}" : "/danh-muc/{slug}"`, hoặc canonical luôn bare URL nhưng bổ sung `rel=prev/next` + đảm bảo nội dung trang 1 đại diện đủ tốt (ít khuyến nghị hơn).

### H2. Next.js Image không tối ưu ảnh thật — `srcset` giả, luôn tải full-res
**Nguồn: trực tiếp (HTML thật) + đọc mã nguồn `lib/supabase-image-loader.ts`.**
```ts
const ENABLE_TRANSFORM = false   // Supabase Free tier không có Image Transformation
// ... return src   (bỏ qua tham số `width` hoàn toàn)
```
HTML thật cho thấy `srcset` liệt kê nhiều breakpoint (16w, 32w, 48w... 384w, 640w,
750w...) nhưng **tất cả cùng trỏ về một URL gốc duy nhất** — trình duyệt (và
Googlebot khi đánh giá CWV) luôn tải ảnh full-resolution bất kể viewport. Kiểm tra
kích thước thật của 1 ảnh mẫu: **800×800px** — chạm đúng ngưỡng tối thiểu Google
khuyến nghị cho Product image nhưng chưa đủ lớn để đạt xử lý "ảnh lớn" trong rich
results (khuyến nghị ≥1200px chiều rộng). Ảnh không được nén/resize theo thiết bị
→ ảnh hưởng LCP trên mobile, một phần của Core Web Vitals/page experience.
**Khắc phục:** bật Supabase Pro Image Transformation (chi phí ~$25/tháng, đã có sẵn
code path `ENABLE_TRANSFORM = true`), hoặc tự dựng edge function resize (Cloudflare
Images/Workers), hoặc chuyển ảnh qua route `/api/image-proxy` dùng `sharp` (đã có
sẵn trong `package.json` dependencies) để tạo nhiều size thật.

### H3. Nút "Thêm vào giỏ" / "Mua ngay" không bị khoá khi hết hàng
**Nguồn: đọc mã nguồn `components/product/ProductActions.tsx`.**
```ts
const disabled = !product.price || product.is_price_hidden   // KHÔNG check in_stock
```
`interface Props` của `ProductActions` thậm chí không nhận field `in_stock`. Trong
khi Product JSON-LD báo đúng `"availability": "https://schema.org/OutOfStock"` khi
`product.in_stock === false`, giao diện vẫn cho phép thêm sản phẩm hết hàng vào giỏ
và tiến tới `/thanh-toan` — sai lệch giữa tín hiệu structured data và hành vi UI
thực tế, rủi ro đơn hàng ảo/khiếu nại khách hàng.
**Khắc phục:** truyền `in_stock` vào `ProductActions`, disable 2 nút khi
`!product.in_stock`, hiển thị CTA thay thế ("Báo khi có hàng" / liên hệ hotline).

### H4. Sao đánh giá "5.0" hard-code hiển thị cho MỌI sản phẩm dù DB có 0 review thật
**Nguồn: đọc mã nguồn `app/san-pham/[slug]/page.tsx` dòng ~180-188.**
```tsx
{[1,2,3,4,5].map((i) => ( <svg .../* full star */> ))}
<span>5.0</span>
```
Không có điều kiện nào dựa trên `review_count`/`avg_rating` thật — mọi trang sản
phẩm luôn hiện 5 sao vàng + "5.0". Điểm tích cực: giá trị này **không** được đưa vào
`aggregateRating` trong JSON-LD (schema sạch, không vi phạm chính sách rich-result
của Google) — nhưng đây vẫn là tín hiệu tin cậy giả trên giao diện người dùng thật,
rủi ro về minh bạch/uy tín thương hiệu và có thể vi phạm quy định quảng cáo/bảo vệ
người tiêu dùng tại VN nếu bị phát hiện, đặc biệt khi tính năng review thật ra mắt
sau này mà không dọn sạch phần hard-code này trước.
**Khắc phục:** ẩn khối rating hoàn toàn khi `review_count === 0` (hoặc chưa có field
này), chỉ hiển thị sao + số liệu thật khi có ít nhất 1 review thật, đồng bộ với việc
schema đã đúng là không gắn rating giả.

### H5. Meta description 95 trang danh mục dùng chung một công thức, chỉ đổi tên
**Nguồn: đọc mã nguồn `generateMetadata` trong `app/danh-muc/[slug]/page.tsx`.**
```
"{name} tại OFINA — đa dạng mẫu, giá cạnh tranh, bảo hành 24 tháng.
 Miễn phí giao Hà Nội & TP.HCM, lắp đặt tận nơi, trả góp 0%.
 Hotline HN ... · HCM ..."
```
Cấu trúc câu, thứ tự USP, số hotline **giống hệt nhau qua toàn bộ 95 trang**, chỉ
biến `{name}` thay đổi. Google có thể coi đây là nội dung mô tả gần-trùng-lặp ở quy
mô lớn, giảm khả năng mỗi trang danh mục có snippet SERP khác biệt, giảm CTR so với
đối thủ có mô tả danh mục viết tay/khác biệt hoá theo đặc thù từng nhóm sản phẩm.
**Khắc phục:** viết mô tả riêng (hoặc dùng field `categories.description` nếu có
sẵn trong Supabase) cho ít nhất 20-30 danh mục lưu lượng cao nhất; với danh mục nhỏ
có thể giữ template nhưng nên đa dạng hoá cấu trúc câu bằng 3-4 biến thể luân phiên.

---

## MEDIUM

### M1. "Sản phẩm liên quan" không sắp xếp, không lọc hết hàng
**Nguồn: đọc mã nguồn `getRelatedProducts()` trong `lib/queries.ts`.**
```ts
let q = supabase.from('products').select(...).eq('status','active')
  .gt('price', 0).neq('id', productId).limit(limit)
if (categoryId) q = q.eq('category_id', categoryId)
// KHÔNG có .order(...) và KHÔNG lọc in_stock
```
Kết quả phụ thuộc thứ tự trả về mặc định của Postgres (không đảm bảo ổn định qua
các lần deploy/re-index), không ưu tiên bestseller/sản phẩm mới/còn hàng — có thể
hiển thị sản phẩm hết hàng trong khối gợi ý, làm giảm hiệu quả internal linking và
tỷ lệ chuyển đổi từ khối "Sản phẩm liên quan".
**Khắc phục:** thêm `.eq('in_stock', true).order('is_bestseller', {ascending:false}).order('created_at', {ascending:false})`.

### M2. Cache-Control thực tế là `no-store` dù trang danh mục đã khai `revalidate = 3600`
**Nguồn: trực tiếp, response header thật trên cả `/san-pham/[slug]` và `/danh-muc/[slug]`.**
```
cache-control: private, no-cache, no-store, max-age=0, must-revalidate
x-vercel-cache: MISS
```
Trang danh mục có `export const revalidate = 3600` trong code nhưng header thực tế
cho thấy ISR/static cache không có hiệu lực — khả năng do một phần khác trong cây
render (vd. `getAllSettings()` hoặc Supabase client đọc cookie ở `layout.tsx`) buộc
toàn bộ route thành dynamic. Ảnh hưởng TTFB và crawl budget khi Googlebot quét đều
đặn 2.673 trang sản phẩm + 95 trang danh mục. Đây là vấn đề giáp ranh
performance/technical SEO, khuyến nghị audit kỹ hơn ở phiên kỹ thuật riêng.

### M3. 20/95 danh mục (21%) không có trong mega-menu chính
**Nguồn: đối chiếu `lib/nav-menu.ts` (75 slug) với 95 URL `/danh-muc/*` trong sitemap.**
Các danh mục này chỉ được phát hiện qua `sitemap.xml` hoặc breadcrumb của sản phẩm
thuộc danh mục đó (nếu có ít nhất 1 sản phẩm active) — internal PageRank flow yếu
hơn đáng kể so với 75 danh mục có mặt trong nav. Không phải "mồ côi" tuyệt đối
nhưng độ ưu tiên crawl/index thấp hơn.
**Khắc phục:** rà soát 20 slug còn thiếu, bổ sung vào mega-menu nếu còn sản phẩm
active và có traffic tiềm năng; cân nhắc footer sitemap-style link tới toàn bộ 95
danh mục nếu không muốn cồng kềnh hoá menu chính.

### M4. Thiếu `ProductGroup`/`isVariantOf` cho các sản phẩm cùng dòng (variant)
**Nguồn: đọc mã nguồn `components/product/VariantSwitcher.tsx` + schema trong `page.tsx`.**
Các biến thể cùng model (khác size/kiểu chân...) được UI liên kết qua
`VariantSwitcher` nhưng mỗi biến thể là 1 trang/Product JSON-LD hoàn toàn độc lập,
không có `isVariantOf`/`hasVariant` nối chúng lại. Google không có tín hiệu rõ ràng
đây là các phiên bản của cùng 1 sản phẩm, có thể bỏ lỡ tính năng "variant" trong
Google Shopping/rich results.

### M5. Offer JSON-LD thiếu `priceValidUntil`
Thuộc tính khuyến nghị (không bắt buộc) của Google cho `Offer`. Thiếu có thể giảm
độ tin cậy hiển thị giá trong một số bề mặt tìm kiếm giàu dữ liệu.

### M6. Ảnh fallback `/placeholder-product.jpg` không tồn tại trong `public/`
**Nguồn: đọc mã nguồn `ProductCard.tsx` + kiểm tra thư mục `public/`.**
```ts
const img = product.primary_image || product.images?.[0] || '/placeholder-product.jpg'
```
File này không có trong `public/` (chỉ có `logo.png`, `favicon-32.png`,
`apple-touch-icon.png`) → nếu một sản phẩm không có ảnh nào, `ProductCard` sẽ hiển
thị icon ảnh vỡ (404) thay vì fallback đẹp — cần kiểm tra xem có bao nhiêu trong
2.673 sản phẩm rơi vào tình huống này (không xác định được nếu không có quyền
truy vấn Supabase trực tiếp).

### M7. Sitemap có 2.664 URL sản phẩm, brief nói 2.673 — lệch 9 sản phẩm
Có thể do khác `status`, thiếu dữ liệu, hoặc giới hạn phân trang khi generate sitemap
(`app/sitemap.ts` dùng `PAGE_SIZE=1000`, fetch theo `range()` — cần xác nhận vòng
lặp `while(true)` không dừng sớm khi có lỗi tạm thời từ Supabase). Khuyến nghị đối
chiếu trực tiếp với DB để xác nhận không có sản phẩm active bị rớt khỏi sitemap.

---

## LOW

### L1. Thiếu `gtin`/`mpn`/`identifier_exists` trong Product schema
Chấp nhận được với hàng nội thất nhãn riêng OFINA (không có mã ngành chuẩn), nhưng
nên khai báo tường minh `"identifier_exists": false` theo hướng dẫn của Google để
tránh cảnh báo "thiếu định danh sản phẩm" trong Search Console/Merchant Center.

### L2. Title trang `/san-pham` bị lặp đuôi thương hiệu: "Tất cả sản phẩm | OFINA | OFINA"
Do không dùng `title: { absolute: ... }` để bỏ qua template `%s | OFINA` của layout
gốc, giống cách `san-pham/[slug]` và `danh-muc/[slug]` đã làm đúng. Đã được
`onpage.md` ghi nhận, nhắc lại vì ảnh hưởng trực tiếp trang hub catalog.

### L3. robots.txt chưa chủ động `Disallow` tham số faceted (`?min=`, `?max=`, `?sort=`)
Hiện không gây hại thực tế vì bộ lọc chạy client-side (`router.push`, không phải
`<a href>`) nên Googlebot khó tự khám phá các URL này qua crawl thông thường, cộng
với canonical đã trỏ đúng về URL gốc không tham số. Vẫn nên bổ sung chủ động khi
catalog tiếp tục mở rộng để tiết kiệm crawl budget.

---

## ĐIỂM TỐT — GIỮ NGUYÊN, KHÔNG ĐỘNG VÀO

- **Product schema có đủ field lõi Google yêu cầu**: `name`, `image` (nhiều ảnh, ưu
  tiên ảnh chính), `sku`, `brand`, `offers` (`price`, `priceCurrency`, `availability`,
  `itemCondition`, `seller`) — đạt chuẩn cho phần lớn sản phẩm có dữ liệu đầy đủ.
- **Không gắn `aggregateRating`/`review` giả vào JSON-LD** dù DB có 0 review thật —
  tuân thủ đúng chính sách chống spam review của Google. Nhiều site TMĐT Việt Nam
  mắc lỗi ngược lại (tự chế rating 4.8-5.0 vào schema); OFINA đã tránh được lỗi này.
- **Breadcrumb đồng bộ UI + JSON-LD**, đúng cấu trúc phân cấp Trang chủ → Sản phẩm →
  Danh mục → Sản phẩm, `position` tính đúng cả khi có/không có category.
- **Alt text ảnh có ý nghĩa**: chứa tên sản phẩm + số thứ tự ("Bàn họp Sonic S09 -
  ảnh 1", "... thumbnail 2"), không rỗng, không nhồi từ khoá.
- **Faceted navigation không sinh URL rác bị index**: bộ lọc giá/sắp xếp dùng
  `router.push` (client-side), canonical hoá luôn về URL gốc danh mục không tham số
  — hạn chế tốt nguy cơ Google crawl/index hàng loạt tổ hợp `?min=&max=&sort=`.
- **Sitemap.xml có cấu trúc tốt**: 95 danh mục + ~2.664 sản phẩm, đầy đủ
  `lastmod/changefreq/priority`, không lẫn URL phân trang/filter rác.
- **robots.txt chủ động allow AI bot** (GPTBot, ClaudeBot, PerplexityBot,
  Google-Extended...) — tốt cho khả năng được trích dẫn trong AI Overviews/answer
  engines 2026, đi kèm chặn đúng các route riêng tư (`/gio-hang`, `/thanh-toan`,
  `/admin`, `/api/`).

---

## ƯU TIÊN XỬ LÝ (khuyến nghị thứ tự)

1. **C2** — sửa canonical `/san-pham` (1 dòng code, tác động tới 111 trang + toàn bộ
   catalog discovery). Quick win lớn nhất/công sức nhỏ nhất.
2. **C1** — chặn ảnh khỏi Google Images (cần thay đổi hạ tầng Supabase Storage/CDN,
   phức tạp hơn nhưng tác động toàn catalog).
3. **H3 + H4** — khoá nút mua khi hết hàng, ẩn sao giả khi chưa có review thật (2
   sửa code nhỏ, tác động trực tiếp tới uy tín/trust).
4. **H1** — self-canonical cho phân trang danh mục.
5. **C3 + H5** — dọn dữ liệu mô tả trống + viết lại meta description danh mục theo
   nhóm ưu tiên traffic.
6. **H2** — đánh giá bật Supabase Pro Image Transformation hoặc tự resize ảnh.
7. Các mục Medium/Low còn lại theo lịch bảo trì thường kỳ.
