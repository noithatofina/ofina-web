# Audit Structured Data (Schema.org / JSON-LD) — ofina.vn

- Ngày audit: 2026-09-25
- Phạm vi: đọc source code tại `/Users/admin/ofina-web` (grep `application/ld+json`) + xác minh trực tiếp HTML **live** trên `https://ofina.vn` cho từng loại trang (curl thật, không suy đoán từ code).
- Công cụ đối chiếu: yêu cầu Rich Results của Google (Product, Article/BlogPosting, BreadcrumbList, LocalBusiness/FurnitureStore, FAQPage, Organization/Logo, WebSite SearchAction).

## ĐIỂM SCHEMA TỔNG: 48/100

Cách tính: nền tảng kỹ thuật đúng định dạng (JSON-LD, `https://schema.org`, không dùng loại đã deprecated) nhưng **5/8 loại trang không có bất kỳ schema riêng nào** (chỉ thừa hưởng 4 block global), và ngay trong các schema đã cài cũng có **3 lỗi field bắt buộc/sai kiểu dữ liệu** (ảnh 404, author sai @type, thiếu shipping/return cho toàn bộ 2.673 SKU).

---

## 1. Sơ đồ render schema hiện tại (grep code + xác nhận qua HTML live)

| Vị trí code | Áp dụng cho | Schema render |
|---|---|---|
| `app/layout.tsx` (dòng 58–133) | **MỌI trang** (global, nằm trong `<body>` của root layout) | `Organization`, `WebSite` (SearchAction), 2× `FurnitureStore` (HN + HCM) |
| `app/page.tsx` (dòng 79–91) | `/` | + `FAQPage` |
| `app/san-pham/[slug]/page.tsx` (dòng 74–136) | `/san-pham/*` (2.673 trang) | + `Product`, `BreadcrumbList`, `FAQPage` (nếu có FAQ trong mô tả) |
| `app/bo-suu-tap/[slug]/page.tsx` (dòng 61–98) | `/bo-suu-tap/*` | + `BreadcrumbList`, `CollectionPage` > `ItemList`, `FAQPage` (nếu có) |
| `app/bo-suu-tap/page.tsx` (dòng 17–24) | `/bo-suu-tap` | + `BreadcrumbList` |
| `app/blog/[slug]/page.tsx` (dòng 111–137) | `/blog/*` | + `BlogPosting`, `BreadcrumbList` |
| `app/danh-muc/[slug]/page.tsx` | `/danh-muc/*` (áp dụng cho hàng trăm danh mục) | **KHÔNG có schema riêng** — chỉ 4 block global |
| `app/blog/page.tsx` | `/blog` (listing) | **KHÔNG có schema riêng** |
| `app/gioi-thieu/page.tsx` | `/gioi-thieu` | **KHÔNG có schema riêng** |
| `app/showroom/page.tsx` | `/showroom` | **KHÔNG có schema riêng** |
| `app/chinh-sach/[slug]/page.tsx` | `/chinh-sach/*` (6 trang chính sách) | **KHÔNG có schema riêng** |

Đã xác nhận bằng cách tải HTML thật của cả 8 URL trong yêu cầu (curl trực tiếp `ofina.vn`, không phải đọc code suy diễn) và đếm số block `<script type="application/ld+json">` — kết quả khớp 100% với bảng trên.

---

## 2. Chi tiết theo từng loại trang

### 2.1. Trang chủ `https://ofina.vn/`

**Có:** `Organization`, `WebSite` (SearchAction), 2× `FurnitureStore`, `FAQPage` (5 câu hỏi).

- ✅ `@context` đúng `https://schema.org`, không dùng `http`.
- ✅ `WebSite.potentialAction.SearchAction` đúng cấu trúc `EntryPoint` + `query-input` → đủ điều kiện Sitelinks Search Box.
- ✅ `Organization.logo` = `https://ofina.vn/logo.png`, thật sự tồn tại (HTTP 200), kích thước 256×256px — đạt ngưỡng tối thiểu 112×112px của Google cho Logo trong Knowledge Panel.
- ❌ **`FurnitureStore.image` trỏ tới `/showroom-hn.jpg` và `/showroom-hcm.jpg` — cả hai đều trả về HTTP 404** (đã curl xác nhận trực tiếp trên production). `image` là field bắt buộc cho LocalBusiness → hiện tại coi như rỗng/hỏng cho cả 2 chi nhánh. Đối chiếu `git log` cho thấy đây không phải lỗi mới xoá file — filename này được viết vào code từ đầu nhưng **file thật chưa từng được upload vào `/public`**.
- ⚠️ `FurnitureStore.address` thiếu `postalCode`, thiếu `geo` (GeoCoordinates) — không bắt buộc nhưng Google khuyến nghị mạnh để lên Local Pack/Maps.
- ⚠️ `openingHours: "Mo-Su 08:00-18:00"` là chuỗi text hợp lệ theo schema.org nhưng Google khuyến nghị dùng `openingHoursSpecification` dạng object có `dayOfWeek/opens/closes` — an toàn hơn khi chạy Rich Results Test.
- ⚠️ `FAQPage` trên trang chủ (site thương mại điện tử) — theo chính sách Google (8/2023), rich result FAQ chỉ còn dành cho site chính phủ/y tế. Khối này **không tạo rich snippet trên Google** nhưng vẫn có giá trị cho trích dẫn AI/LLM (ChatGPT, Perplexity, Google AI Overview) — mức độ: **Info**, không phải lỗi kỹ thuật, không cần gỡ bỏ.
- ⚠️ Hai `FurnitureStore` không có `@id` và không dùng `branchOf` để liên kết về `Organization` — Google phải tự suy luận quan hệ chi nhánh thay vì được khai báo tường minh.

### 2.2. Trang sản phẩm `https://ofina.vn/san-pham/ban-hop-sonic-s09-ofn-bhl-0017`

**Có:** `Product`, `BreadcrumbList`, `FAQPage` (6 câu, lấy từ mô tả sản phẩm).

Dữ liệu thật lấy từ trang (curl production):
```
Product.image: 2 ảnh https://...supabase.co/storage/.../S09/02.webp, 03.webp
Product.offers.price: 6120000, priceCurrency: VND
Product.offers.availability: https://schema.org/InStock
```

- ✅ Đủ điều kiện tối thiểu cho Product rich result (`name` + `offers.price` + `offers.priceCurrency` + `offers.availability`).
- ✅ `sku`, `brand`, `itemCondition`, `seller` đều có, đúng kiểu.
- ✅ `BreadcrumbList` 4 cấp, URL tuyệt đối, đúng thứ tự `position`.
- ❌ **Thiếu `offers.shippingDetails` (`OfferShippingDetails`) và `offers.hasMerchantReturnPolicy` (`MerchantReturnPolicy`)** — đây là 2 field Google yêu cầu để hiển thị badge "miễn phí ship / đổi trả X ngày" ngay trên kết quả tìm kiếm sản phẩm. OFINA **đã có sẵn chính sách rõ ràng** (freeship nội thành HN/HCM đơn từ 500k, đổi trả 7 ngày, bảo hành 24 tháng) — chỉ cần đưa vào JSON-LD, áp dụng đồng loạt cho 2.673 sản phẩm → đây là cơ hội lớn nhất của toàn bộ audit.
- ⚠️ Thiếu `offers.priceValidUntil` — khuyến nghị của Google để tránh giá bị coi là lỗi thời khi index lại chậm.
- ⚠️ Thiếu `AggregateRating`/`Review`. **Lưu ý quan trọng:** UI trang sản phẩm đang hiển thị **cứng "5.0 sao"** cho MỌI sản phẩm (không lấy từ dữ liệu đánh giá thật — xem `app/san-pham/[slug]/page.tsx` dòng 180–188). Con số này **hiện chưa bị đưa vào JSON-LD** nên chưa vi phạm chính sách Google, nhưng **tuyệt đối không được dùng "5.0" hardcode này để tạo `AggregateRating`** khi triển khai — Google coi rating giả/không có nguồn là vi phạm chính sách structured data về đánh giá gian lận, có thể bị action thủ công (manual action) mất toàn bộ rich result của site.
- ⚠️ `FAQPage` trên trang sản phẩm (thương mại) — cùng lưu ý Info như trang chủ: không tạo rich snippet Google, có giá trị GEO/AI.
- ⚠️ `Product` không có field `url` riêng (không bắt buộc, nhưng khuyến nghị).

### 2.3. Danh mục `https://ofina.vn/danh-muc/ban-cafe-gap-gon`

**Có:** KHÔNG có gì ngoài 4 block global (`Organization`, `WebSite`, 2× `FurnitureStore`). Đã xác nhận cả trong source `app/danh-muc/[slug]/page.tsx` (không có dòng `application/ld+json` nào) lẫn HTML live.

- ❌ **Không có `BreadcrumbList`** dù trang có breadcrumb hiển thị UI đầy đủ (Trang chủ / Sản phẩm / [Tên danh mục]) — chỉ cần serialize lại đúng những gì đã render.
- ❌ **Không có `CollectionPage`/`ItemList`** liệt kê sản phẩm trong danh mục, dù template `/bo-suu-tap/[slug]` (cùng dự án) đã làm đúng việc này — đây là bất nhất kỹ thuật giữa 2 template cùng chức năng liệt kê sản phẩm.
- Đây là template dùng cho **hàng trăm danh mục sản phẩm** (không chỉ ban-cafe-gap-gon) → mức ảnh hưởng rất rộng, độ ưu tiên cao.

### 2.4. Bộ sưu tập `https://ofina.vn/bo-suu-tap/ghe-cong-thai-hoc`

**Có:** `BreadcrumbList`, `CollectionPage` > `ItemList` (149 sản phẩm, cắt 12 item đầu), `FAQPage`.

- ✅ `BreadcrumbList` đúng 3 cấp, URL tuyệt đối.
- ✅ `CollectionPage.mainEntity.ItemList` có `numberOfItems` khớp tổng thật (149), từng `ListItem` có `position/url/name` — đúng chuẩn.
- ⚠️ `ItemList` chỉ liệt kê 12/149 sản phẩm (trang có phân trang 24/trang) — không sai kỹ thuật (Google không bắt buộc liệt kê hết) nhưng nên cân nhắc đồng bộ với số sản phẩm hiển thị thật trên trang hiện tại (24) thay vì hardcode 12.
- ⚠️ `FAQPage` — cùng lưu ý Info (site thương mại) như trên.
- Đây là **template làm đúng nhất** trong toàn bộ site — nên dùng làm khuôn mẫu để vá lại `/danh-muc/[slug]`.

### 2.5. Blog

**`https://ofina.vn/blog` (listing):** KHÔNG có schema riêng, chỉ 4 block global.
- ❌ Thiếu `BreadcrumbList` tối thiểu (Trang chủ / Blog).
- ⚠️ Có thể cân nhắc `Blog`/`ItemList` liệt kê bài viết mới nhất (không bắt buộc, ít giá trị rich result nhưng tốt cho AI crawler).

**`https://ofina.vn/blog/ban-nang-ha-thong-minh-la-gi-co-nen-mua-ban-dung-lam-viec` (bài thật lấy từ listing):**

**Có:** `BlogPosting`, `BreadcrumbList`. Dữ liệu thật lấy từ production:
```json
"image": "https://ofina.vn/og-image.jpg",
"author": { "@type": "Person", "name": "OFINA" },
"datePublished": "2026-06-13T10:48:57.443+00:00",
"dateModified": "2026-06-13T10:46:55.363929+00:00"
```
- ❌ **`image` trỏ tới `https://ofina.vn/og-image.jpg` — HTTP 404** (đã curl xác nhận). Bài này không có `cover_image` trong CMS nên rơi vào fallback, và fallback đó cũng hỏng. `image` là field **bắt buộc** cho Article/BlogPosting rich result (kể cả trong Top Stories/AI Overview) → bài viết này và mọi bài không có ảnh cover đều fail.
- ❌ **`author` bị gán sai `@type: "Person"` cho tên "OFINA"** — đây là công ty, không phải một người. Nguyên nhân: code kiểm tra `post.author !== 'OFINA Team'` (`app/blog/[slug]/page.tsx` dòng 119), nhưng giá trị thật trong DB là `"OFINA"` (không phải `"OFINA Team"`) nên điều kiện lọt qua nhầm và gắn `Person`. Đây là lỗi logic có thể sửa 1 dòng.
- ⚠️ `dateModified` (10:46:55) sớm hơn `datePublished` (10:48:57) vài phút — không sai định dạng ISO 8601 nhưng vô lý về logic (sửa trước khi xuất bản), nên rà lại pipeline ghi timestamp khi tạo bài.
- ⚠️ Phát hiện phụ (không thuộc phạm vi schema nhưng ảnh hưởng chất lượng Article): tồn tại các slug gần như trùng lặp `cach-chon-ghe-cong-thai-hoc-chong-dau-lung`, `-h6mo`, `-iy9c`, `-lkln` — nhiều `BlogPosting` cùng headline song song, nên rà lại có phải lỗi sinh bài trùng của công cụ SEO tự động không.

### 2.6. `https://ofina.vn/gioi-thieu`

KHÔNG có schema riêng — chỉ 4 block global.
- ❌ Thiếu `BreadcrumbList`.
- ⚠️ Có thể cân nhắc `AboutPage` hoặc bổ sung `Organization.foundingDate`/số liệu (2.400+ sản phẩm, 1.200+ khách hàng — hiện là text UI, chưa vào schema) nhưng đây là "nice-to-have", không bắt buộc.

### 2.7. `https://ofina.vn/showroom`

KHÔNG có schema riêng — chỉ 4 block global. Đây là **trang quan trọng nhất cho LocalBusiness** vì có địa chỉ thật, giờ mở cửa, bãi đỗ xe và **Google Maps iframe nhúng thật** (`branch.mapsQuery`) cho cả 2 chi nhánh — nhưng lại không tận dụng gì thêm ngoài block global đã có lỗi ảnh 404.
- ❌ Thiếu `BreadcrumbList`.
- ❌ Không có `geo` (GeoCoordinates) dù toạ độ có thể lấy được từ chính `mapsQuery` đang dùng để nhúng iframe — bỏ lỡ ngay trên trang có dữ liệu sẵn.
- ❌ Không liên kết `@id` giữa nội dung trang và 2 `FurnitureStore` khai báo ở layout — Google phải tự đoán trang này chính là trang đại diện cho 2 địa điểm.
- Đây là trang nên sửa **ưu tiên cao nhất** cho mục tiêu Local Pack vì có showroom thật.

### 2.8. `https://ofina.vn/chinh-sach/bao-hanh`

KHÔNG có schema riêng — chỉ 4 block global. Nội dung thật (curl xác nhận) là dạng danh sách chính sách (thời gian bảo hành theo bộ phận, quy trình, trường hợp không bảo hành) — **không phải dạng hỏi–đáp**, nên không tự nhiên phù hợp `FAQPage` như hiện trạng.
- ❌ Thiếu `BreadcrumbList`.
- ℹ️ Không khuyến nghị thêm `FAQPage` cho Google (site thương mại, đã bị hạn chế rich result từ 8/2023) — nếu muốn phục vụ AI Overview/LLM citation thì cần viết lại nội dung theo cấu trúc Q/A trước, rồi mới đánh dấu `FAQPage` với mục đích GEO, không kỳ vọng rich snippet trên Google Search.

---

## 3. Vấn đề kiến trúc tổng thể

- **Organization + WebSite + 2× LocalBusiness bị lặp y hệt trên MỌI trang** (kể cả 2.673 trang sản phẩm, toàn bộ blog, chính sách) thay vì chỉ đặt ở trang liên quan (trang chủ, `/showroom`, `/gioi-thieu`) — không sai kỹ thuật nhưng làm phình `<head>`/`<body>` mọi trang và loãng ngữ cảnh entity "địa điểm kinh doanh" (Google có thể khó xác định trang nào mới là trang đại diện chính thức của LocalBusiness).
- Không có `@id` xuyên suốt để liên kết `Organization` ↔ `WebSite` ↔ 2 `FurnitureStore` ↔ `Product.seller` — mỗi khối đang là entity rời rạc, chưa tận dụng graph liên kết mà Google khuyến khích cho site nhiều thực thể.

---

## 4. JSON-LD đề xuất bổ sung (ưu tiên cao nhất)

### 4.1. `/danh-muc/[slug]` — thêm BreadcrumbList + ItemList (áp dụng mẫu này cho toàn bộ danh mục)

```json
[
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Trang chủ", "item": "https://ofina.vn" },
      { "@type": "ListItem", "position": 2, "name": "Sản phẩm", "item": "https://ofina.vn/san-pham" },
      { "@type": "ListItem", "position": 3, "name": "Bàn cafe gấp gọn", "item": "https://ofina.vn/danh-muc/ban-cafe-gap-gon" }
    ]
  },
  {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Bàn cafe gấp gọn",
    "url": "https://ofina.vn/danh-muc/ban-cafe-gap-gon",
    "inLanguage": "vi-VN",
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": 24,
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "url": "https://ofina.vn/san-pham/<slug-1>", "name": "<Tên sản phẩm 1>" }
      ]
    }
  }
]
```
(dùng lại đúng logic đã có ở `app/bo-suu-tap/[slug]/page.tsx`, chỉ đổi nguồn dữ liệu sang `getProductsByCategory`).

### 4.2. Product — bổ sung shipping + return policy (áp dụng 2.673 SKU)

```json
{
  "@type": "Offer",
  "priceValidUntil": "2027-09-25",
  "shippingDetails": {
    "@type": "OfferShippingDetails",
    "shippingRate": { "@type": "MonetaryAmount", "value": "0", "currency": "VND" },
    "shippingDestination": { "@type": "DefinedRegion", "addressCountry": "VN" },
    "deliveryTime": {
      "@type": "ShippingDeliveryTime",
      "handlingTime": { "@type": "QuantitativeValue", "minValue": 0, "maxValue": 1, "unitCode": "DAY" },
      "transitTime": { "@type": "QuantitativeValue", "minValue": 1, "maxValue": 2, "unitCode": "DAY" }
    }
  },
  "hasMerchantReturnPolicy": {
    "@type": "MerchantReturnPolicy",
    "applicableCountry": "VN",
    "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
    "merchantReturnDays": 7,
    "returnMethod": "https://schema.org/ReturnByMail",
    "returnFees": "https://schema.org/FreeReturn"
  }
}
```
(giá trị `shippingRate`/`deliveryTime` cần tách riêng cho đơn nội thành HN/HCM (freeship) và ngoại thành (50k–500k) — có thể dùng mảng `OfferShippingDetails` nhiều phần tử theo `shippingDestination`).

### 4.3. `/showroom` — thêm BreadcrumbList + LocalBusiness có geo (không thay thế block global, bổ sung geo cho đúng entity)

```json
{
  "@context": "https://schema.org",
  "@type": "FurnitureStore",
  "@id": "https://ofina.vn/showroom#hn",
  "name": "OFINA — Trụ sở Hà Nội",
  "url": "https://ofina.vn/showroom",
  "image": "https://ofina.vn/showroom-hn.jpg",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "135 đường K2",
    "addressLocality": "Phường Phú Đô",
    "addressRegion": "Hà Nội",
    "addressCountry": "VN"
  },
  "geo": { "@type": "GeoCoordinates", "latitude": "<lấy từ mapsQuery thật>", "longitude": "<lấy từ mapsQuery thật>" },
  "branchOf": { "@id": "https://ofina.vn/#organization" }
}
```
(cần thay `image` bằng file thật đã upload — xem mục 5.1; toạ độ lấy từ chính `branch.mapsQuery` đang dùng để nhúng iframe Google Maps trong `app/showroom/page.tsx`).

---

## 5. Việc cần làm ngay (không phải thêm schema mới, mà là sửa lỗi field đang khai báo sai)

1. **Upload 3 file ảnh thật** vào `/public`: `og-image.jpg` (1200×630), `showroom-hn.jpg`, `showroom-hcm.jpg` — hiện cả 3 đều 404 trên production, ảnh hưởng trực tiếp `image` bắt buộc của `FurnitureStore` × 2 và `BlogPosting` (mọi bài không có `cover_image` riêng).
2. Sửa điều kiện tác giả trong `app/blog/[slug]/page.tsx` dòng 119: đổi so sánh cứng `!== 'OFINA Team'` thành logic nhận diện tên công ty đúng (vd. danh sách tên tổ chức, hoặc field `author_type` riêng trong DB) để không gắn nhầm `Person` cho "OFINA".
3. Thêm `@id`/`branchOf` để liên kết `Organization` ↔ 2 `FurnitureStore`.

---

## 6. Tổng hợp vấn đề theo mức độ (mỗi dòng = 1 vấn đề)

### 🔴 Critical
- `FurnitureStore.image` (HN + HCM) trỏ tới `/showroom-hn.jpg`, `/showroom-hcm.jpg` — cả hai đều HTTP 404 trên production, field bắt buộc của LocalBusiness bị hỏng trên toàn bộ site.
- `BlogPosting.image` fallback về `/og-image.jpg` — cũng HTTP 404 — mọi bài blog không có `cover_image` riêng (đã xác nhận thực tế với bài "Bàn nâng hạ thông minh") bị thiếu field ảnh bắt buộc.
- `/danh-muc/[slug]` (áp dụng hàng trăm danh mục, gồm `/danh-muc/ban-cafe-gap-gon`) không có bất kỳ JSON-LD nào — thiếu cả `BreadcrumbList` lẫn `ItemList` dù UI đã hiển thị breadcrumb đầy đủ.
- `BlogPosting.author` bị gắn sai `@type: "Person"` cho tên tổ chức "OFINA" do lỗi so sánh chuỗi cứng (`!== 'OFINA Team'`) trong `app/blog/[slug]/page.tsx`.

### 🟠 High
- `Product` (2.673 SKU) thiếu `offers.shippingDetails` và `offers.hasMerchantReturnPolicy` dù OFINA đã có chính sách freeship/đổi trả 7 ngày rõ ràng — mất badge shipping/return trên kết quả tìm kiếm sản phẩm.
- `/showroom` — trang duy nhất có địa chỉ + Google Maps thật — không có `BreadcrumbList`, không có `geo` (GeoCoordinates), không liên kết `@id` tới LocalBusiness toàn cục, bỏ lỡ cơ hội Local Pack rõ ràng nhất của site.
- `/blog` (listing), `/gioi-thieu`, `/chinh-sach/[slug]` (6 trang chính sách) hoàn toàn không có `BreadcrumbList` dù UI đều đã render breadcrumb.
- 2× `FurnitureStore.address` thiếu `postalCode`; không có `geo` — giảm khả năng match chính xác trong Google Maps/Local Pack.

### 🟡 Medium
- `Organization`/`WebSite`/2×`FurnitureStore` bị lặp y hệt trên MỌI trang (kể cả 2.673 trang sản phẩm, blog, chính sách) thay vì chỉ đặt ở trang liên quan, không có `@id`/`branchOf` liên kết — phình HTML, loãng ngữ cảnh entity.
- `Product.offers` thiếu `priceValidUntil` — khuyến nghị của Google để tránh giá bị coi lỗi thời.
- `LocalBusiness.openingHours` dùng chuỗi text thay vì `openingHoursSpecification` có cấu trúc — hợp lệ nhưng không theo mẫu Google khuyến nghị.
- `FAQPage` xuất hiện trên trang chủ, trang sản phẩm và bộ sưu tập (site thương mại) — theo chính sách Google 8/2023 không còn tạo rich snippet, chỉ còn giá trị AI/GEO citation (mức Info, không cần gỡ).
- `dateModified` sớm hơn `datePublished` vài phút trên bài blog thực tế kiểm tra — dữ liệu timestamp không nhất quán logic dù vẫn đúng ISO 8601.
- `ItemList` trên `/bo-suu-tap/[slug]` chỉ liệt kê 12/149 sản phẩm, lệch với số sản phẩm hiển thị thật trên trang (24/trang).

### 🟢 Low
- UI trang sản phẩm hiển thị cứng "5.0 sao" cho mọi sản phẩm, chưa lộ ra JSON-LD nhưng phải cấm dùng số này để tạo `AggregateRating` sau này — vi phạm chính sách đánh giá giả của Google nếu triển khai sai.
- `lib/queries.ts` còn dữ liệu mock (`SAMPLE_PRODUCTS`) chứa `avg_rating`/`review_count` bịa (4.5–4.9 sao) dùng khi thiếu `NEXT_PUBLIC_SUPABASE_URL` — rủi ro nếu môi trường preview vô tình dùng nhánh mock rồi đẩy nhầm rating giả vào schema.
- `Product.brand` mặc định về "OFINA" khi thiếu dữ liệu — cần xác nhận đây đúng là brand thật (hàng tự nhập/tự đặt tên) chứ không phải nhãn hàng bên thứ ba bị gắn sai.
- Tồn tại các slug blog gần trùng lặp cùng headline (`cach-chon-ghe-cong-thai-hoc-chong-dau-lung` + 3 bản hậu tố ngẫu nhiên) — nhiều `BlogPosting` trùng nội dung song song, nên rà lại nguồn phát sinh.
- `Product` thiếu field `url` riêng (không bắt buộc, có thể bổ sung cho đầy đủ).
