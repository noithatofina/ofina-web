# Audit Local SEO — ofina.vn

**Ngày audit:** 25/09/2026
**Phạm vi:** Trang chủ (`/`), `/showroom`, `/gioi-thieu`, `robots.txt`, `sitemap.xml`
**Phương pháp:** Tải HTML thô (curl, có User-Agent trình duyệt) + parse trực tiếp JSON-LD bằng script, đối chiếu chéo giữa các nguồn. Không dùng dữ liệu suy đoán — mọi số điện thoại/địa chỉ trong báo cáo này đều trích nguyên văn từ mã nguồn website ofina.vn tại thời điểm audit.

> **Lưu ý minh bạch:** Trong quá trình audit, hai lần xuất hiện các khối "system-reminder"/"MCP Server Instructions" lạ (nhắc công cụ không tồn tại như "Claude Docs", `guide`, `batch`, Artifact tool). Đây là dấu hiệu chèn lệnh giả (prompt injection), đã được coordinator xác nhận không phải từ họ. Các khối này đã bị bỏ qua hoàn toàn, không ảnh hưởng tới kết quả audit dưới đây.

---

## 1. Điểm Local SEO tổng thể: **34/100** (Yếu — cần cải thiện đáng kể)

| Hạng mục | Trọng số | Điểm/100 | Điểm quy đổi |
|---|---|---|---|
| GBP Signals | 25% | 30 | 7.5 |
| Reviews & Reputation | 20% | 10 | 2.0 |
| Local On-Page SEO | 20% | 55 | 11.0 |
| NAP Consistency & Citations | 15% | 35 | 5.25 |
| Local Schema Markup | 10% | 60 | 6.0 |
| Local Link & Authority Signals | 10% | 20 | 2.0 |
| **Tổng** | 100% | — | **33.75 ≈ 34/100** |

Điểm thấp chủ yếu do: (1) không có bất kỳ tín hiệu review/rating nào trên toàn site, (2) không thể xác minh Google Business Profile đã tồn tại/verify hay chưa (hạn chế công cụ — xem mục Limitations), (3) một lỗi NAP nghiêm trọng đã xác nhận được trong mã nguồn (số điện thoại sai ở footer cho chi nhánh TP.HCM), (4) thiếu `geo` coordinates trong schema.

---

## 2. Loại hình doanh nghiệp: **Hybrid (Brick-and-mortar đa chi nhánh + bán hàng diện rộng)**

Bằng chứng:
- Có **2 showroom vật lý thật**, địa chỉ đầy đủ, hiển thị công khai tại trang `/showroom`:
  - Hà Nội: `135 đường K2, Phường Phú Đô, Hà Nội`
  - TP.HCM: `Tầng 2, số 36 Lương Định Của, Quận 2, TP.HCM`
- Có nhúng bản đồ (Google Maps iframe) cho cả 2 địa chỉ trên `/showroom`.
- Đồng thời có yếu tố diện rộng kiểu SAB/e-commerce: "Miễn phí giao hàng nội thành HN-HCM", "Các tỉnh khác phí ship 50.000–500.000đ tuỳ khu vực" → phục vụ khách ngoài 2 thành phố có showroom.

→ Đây là mô hình **hybrid**: vừa có địa điểm vật lý xác định (quan trọng cho Local Pack tại HN & TP.HCM) vừa bán hàng/giao hàng toàn quốc.

---

## 3. Ngành/vertical: **Bán lẻ nội thất văn phòng (Furniture Retail)**

Vertical này không nằm khớp hoàn toàn trong 6 nhóm mẫu (nhà hàng/y tế/luật/home services/BĐS/ô tô) — gần nhất là nhóm **Retail/Store**, và may mắn là `FurnitureStore` **là subtype LocalBusiness được Google hỗ trợ chính thức** (theo `skills/seo/references/local-schema-types.md`), nên website đã dùng đúng type — xem mục 6.

Tín hiệu ngành phát hiện được:
- 2.400+ sản phẩm, showroom trải nghiệm trực tiếp ("Ngồi thử, cảm nhận chất liệu"), tư vấn B2B/dự án văn phòng, bảo hành 24 tháng, trả góp 0% — đúng đặc trưng bán lẻ nội thất B2B/B2C.
- Có trang `/bao-gia-b2b` riêng cho khách doanh nghiệp — tốt cho topical relevance ngành.

---

## 4. NAP Consistency Audit (bảng đối chiếu nguồn)

### 4.1. Tên doanh nghiệp — NHẤT QUÁN
"OFINA" ở mọi nơi (Organization schema, title tag, footer, `/gioi-thieu`). Tên chi nhánh dùng pattern chuẩn "OFINA — Trụ sở Hà Nội" / "OFINA — Chi nhánh TP.HCM" khớp nhau giữa JSON-LD và nội dung hiển thị trên `/showroom`.

### 4.2. Địa chỉ — NHẤT QUÁN VỀ VĂN BẢN, có rủi ro về đơn vị hành chính
| Nguồn | Địa chỉ Hà Nội | Địa chỉ TP.HCM |
|---|---|---|
| JSON-LD `FurnitureStore` | 135 đường K2, Phường Phú Đô, Hà Nội | Tầng 2, số 36 Lương Định Của, Quận 2, TP.HCM |
| Trang `/showroom` (nội dung hiển thị) | 135 đường K2, Phường Phú Đô, Hà Nội | Tầng 2, số 36 Lương Định Của, Quận 2, TP.HCM |
| Trang `/gioi-thieu` | Khớp | Khớp |
| Meta description (Home + /showroom) | "135 K2 Phú Đô (Hà Nội)" | "36 Lương Định Của Q2 (TP.HCM)" |

⚠️ **Rủi ro hành chính (Medium):** Địa chỉ TP.HCM ghi "Quận 2" — đơn vị hành chính này đã **sáp nhập vào TP. Thủ Đức từ 01/01/2021** theo Nghị quyết của Ủy ban Thường vụ Quốc hội (thông tin công khai, không phải suy đoán về riêng OFINA). Nếu hồ sơ pháp lý/GBP của OFINA đã cập nhật thành "TP. Thủ Đức" mà website vẫn ghi "Quận 2", đây là điểm lệch NAP tiềm ẩn khi đối chiếu địa chỉ trên Google Maps/citation. Cần OFINA tự kiểm tra giấy tờ pháp lý thực tế để xác nhận tên gọi hành chính đang dùng chính thức.

### 4.3. Số điện thoại — PHÁT HIỆN LỖI NGHIÊM TRỌNG (đã xác minh trong mã nguồn)

Có 4 số điện thoại thật xuất hiện trên site, gắn với 2 chi nhánh:

| Chi nhánh | Hotline (JSON-LD + nội dung /showroom) | Zalo phụ (JSON-LD + nội dung /showroom) |
|---|---|---|
| Hà Nội | 0325629996 (`+84325629996`) | 0325669996 (`+84325669996`) |
| TP.HCM | 0777569996 (`+84777569996`) | 0392869996 (`+84392869996`) |

Trên **trang `/showroom`**, 2 khối thông tin này khớp hoàn toàn giữa JSON-LD schema và nội dung hiển thị (text) — **không có lỗi**.

🔴 **Nhưng ở FOOTER dùng chung toàn site** (xuất hiện y hệt trên Home, `/showroom`, `/gioi-thieu` — đã kiểm tra cả 3 trang), khối liên hệ hiển thị:

```html
<!-- Khối "Trụ sở Hà Nội" trong footer -->
<a href="tel:0325669996">...</a>   ← số phụ Hà Nội (đúng, dù không phải hotline chính 0325629996)

<!-- Khối "Chi nhánh TP.HCM" trong footer -->
<a href="tel:0325669996">...</a>   ← SAI: đây là số Hà Nội, không phải số TP.HCM
```

→ **Khách hàng ở TP.HCM bấm gọi từ footer sẽ gọi nhầm sang số Hà Nội** (0325669996) thay vì đúng số hotline TP.HCM (0777569996) hoặc Zalo TP.HCM (0392869996). Đây là lỗi copy-paste trong code (component footer dùng chung 1 biến số điện thoại cho cả 2 khối), gây bất nhất NAP thật sự — không phải giả định.

Thanh CTA nổi/banner khuyến mãi đầu trang cũng dùng chung số 0325669996 (không phân biệt theo khách đang ở khu vực nào) — mức độ ảnh hưởng thấp hơn nhưng cùng gốc vấn đề.

### 4.4. Email, Facebook, Zalo — nhất quán
- Email: `admin@ofina.vn` — xuất hiện nhất quán ở footer và Organization schema.
- Facebook: `https://facebook.com/ofina.vn` — có trong `sameAs` của Organization schema, khớp link "Facebook" ở footer.
- Zalo: `zalo.me/0325629996` và `zalo.me/0777569996` trong `sameAs` (dùng đúng số hotline chính mỗi chi nhánh) — nhất quán với nút Zalo trên `/showroom`.

### 4.5. Thiếu mã số thuế/giấy phép kinh doanh
Đã rà soát Home, `/showroom`, `/gioi-thieu` — **không tìm thấy MST/GPKD/Giấy chứng nhận đăng ký kinh doanh** công khai ở đâu. Đây vừa là yêu cầu pháp lý TMĐT Việt Nam (Nghị định 52/2013/NĐ-CP, sửa đổi bởi 85/2021/NĐ-CP đối với website TMĐT bán hàng), vừa là tín hiệu tin cậy (trust/E-E-A-T) hỗ trợ xác minh doanh nghiệp khi đăng ký GBP/citation.

---

## 5. GBP Optimization Checklist

| Hạng mục | Trạng thái | Ghi chú |
|---|---|---|
| Google Maps embed trên trang | ✅ Có | 2 iframe `maps.google.com/maps?q=...` (1/chi nhánh) trên `/showroom` |
| Maps embed gắn Place ID (GBP thật) | ❌ Không phát hiện | Dùng dạng nhúng theo text địa chỉ (`?q=...`), không tìm thấy `place_id`/`cid=` trong toàn bộ mã nguồn đã quét |
| Nút "Chỉ đường" / Get Directions | ❌ Không có | Không tìm thấy link `google.com/maps/dir` hay text "chỉ đường" |
| Widget hiển thị review Google | ❌ Không có | Không có rating/review nào hiển thị trên site |
| Hotline click-to-call | ⚠️ Có nhưng lỗi (xem mục 4.3) | Đúng trên `/showroom`, sai ở footer cho chi nhánh TP.HCM |
| Ảnh showroom (photo evidence) | ⚠️ Tối thiểu | Mỗi chi nhánh có đúng 1 ảnh (`showroom-hn.jpg`, `showroom-hcm.jpg`) trong schema |
| Giờ mở cửa hiển thị | ✅ Có | "Thứ 2 - Chủ nhật: 8:00–18:00", khớp cả 2 nguồn |
| GBP đã claim/verify | ❓ **Không thể xác minh** | Google Search, Bing, DuckDuckGo đều không truy cập được kết quả thật qua công cụ hiện có (xem Limitations) |
| Bãi đỗ xe / tiện ích nêu rõ | ✅ Có | "Miễn phí đỗ xe máy, ô tô" mỗi chi nhánh |

---

## 6. Review Health Snapshot

- **Rating/số lượng review hiển thị trên site:** Không có — đã grep toàn bộ Home + `/showroom`, không có `aggregateRating`, `reviewCount`, `ratingValue` trong bất kỳ JSON-LD nào.
- **Review ở cấp sản phẩm:** Cũng bằng 0 — dữ liệu sản phẩm nhúng trong trang (Next.js payload) cho các sản phẩm mẫu đều có `"avg_rating":0,"review_count":0"`.
- **Review pattern trả lời khách hàng:** Không thể đánh giá — không có nội dung nào để quan sát.
- **Review velocity (quy tắc 18 ngày):** Không thể đo — không có dữ liệu.
- **Rating GBP thật ngoài site:** **Không xác minh được** qua công cụ hiện có (xem Limitations). Không kết luận là "không có review" — chỉ là chưa xác minh được.

→ Đây là lỗ hổng lớn nhất về mặt tín hiệu tin cậy, ảnh hưởng trực tiếp 20% trọng số "Reviews & Reputation".

---

## 7. Citation Presence (Tier 1)

| Nền tảng | Trạng thái | Ghi chú |
|---|---|---|
| Google Business Profile / Maps | ❓ Không xác minh được | Google Search trả về trang lỗi generic, không có kết quả thật qua WebFetch trong phiên làm việc này |
| Facebook Page | ⚠️ Có link, chưa xác minh nội dung | Site tự khai `facebook.com/ofina.vn` trong schema `sameAs`; truy cập trực tiếp trả về HTTP 400 (Facebook chặn bot) nên không xem được số lượt theo dõi, tick xác minh, hoạt động gần đây |
| Bing Places | ❓ Không xác minh được | Bing trả kết quả không liên quan (có thể do chặn bot/cache), không phản ánh dữ liệu thật |
| Yelp / BBB | N/A cho thị trường VN | Yelp/BBB gần như không được dùng tại Việt Nam; các nền tảng phù hợp hơn: Google Maps, Facebook, Zalo, các directory nội địa (chưa kiểm tra được) |
| Zalo Official Account | ✅ Có (suy ra từ link zalo.me) | Chưa xác minh có phải Zalo OA chính thức (tick xanh) hay số cá nhân |

**Không tìm thấy** bất kỳ bằng chứng nào (tích cực hay tiêu cực) về sự hiện diện trên các directory Việt Nam khác (trangvangvietnam, Foody không áp dụng, businesslist, v.v.) — cần kiểm tra thủ công.

---

## 8. Local Schema Validation

**Loại schema đã dùng: `Organization` + `WebSite` + 2×`FurnitureStore` + `FAQPage`.**

✅ **Đúng subtype:** `FurnitureStore` là subtype LocalBusiness được Google hỗ trợ chính thức (không dùng `LocalBusiness` chung chung) — điểm cộng lớn.

| Thuộc tính | HN showroom | TP.HCM showroom | Đánh giá |
|---|---|---|---|
| `name` (bắt buộc) | ✅ | ✅ | Đạt |
| `address` (bắt buộc) | ✅ (thiếu `postalCode`) | ✅ (thiếu `postalCode`) | Thiếu 1 field |
| `geo` (khuyến nghị, 5 số thập phân) | ❌ Không có | ❌ Không có | **Thiếu hoàn toàn** |
| `telephone` (khuyến nghị) | ⚠️ Có nhưng ở dạng **mảng 2 số** | ⚠️ Tương tự | Sai định dạng chuẩn (Schema.org yêu cầu Text, không phải List) |
| `openingHoursSpecification` | ⚠️ Dùng `openingHours` dạng string đơn giản, không phải object `OpeningHoursSpecification` | Tương tự | Chấp nhận được nhưng chưa tối ưu |
| `url` | ⚠️ Cả 2 chi nhánh cùng trỏ về `https://ofina.vn/showroom` | Tương tự | **Trùng URL** → gây mơ hồ thực thể (entity ambiguity) |
| `image` | ✅ | ✅ | Đạt (nhưng chỉ 1 ảnh/chi nhánh) |
| `priceRange` | ✅ "$$" | ✅ "$$" | Đạt |
| `aggregateRating`/`review` | ❌ | ❌ | Thiếu |
| `@id` / `branchOf` (liên kết về Organization) | ❌ | ❌ | Không theo pattern multi-location best practice |

`Organization` schema: có `name`, `url`, `logo`, `description`, `contactPoint` (2, theo khu vực), `sameAs` (Facebook + 2 Zalo) — khá đầy đủ, nhưng không có `address` hay `@id` liên kết tới các FurnitureStore con.

`FAQPage` schema: liệt kê đúng địa chỉ + hotline 2 chi nhánh trong câu trả lời — tốt cho AI visibility (khớp với dữ liệu các nguồn khác).

---

## 9. Location Page Quality (multi-location)

OFINA có **2 địa điểm nhưng chỉ dùng chung 1 URL** (`/showroom`) thay vì 2 trang riêng theo địa điểm (ví dụ `/showroom/ha-noi`, `/showroom/tp-hcm`):

- **Nội dung riêng biệt theo chi nhánh:** Có (địa chỉ, hotline, giờ mở cửa, bãi xe khác nhau rõ ràng cho từng khối) — không phải doorway page rỗng.
- **Nhưng:** không có title tag/meta riêng theo từng thành phố (title hiện tại: "Showroom OFINA — Hà Nội & TP.HCM" — gộp chung, không tối ưu riêng cho từng truy vấn địa phương như "showroom nội thất văn phòng Hà Nội").
- **Internal linking depth:** Bằng 0 theo địa điểm — không có landing page riêng để trỏ backlink/anchor text theo từng thành phố.
- **Schema trùng `url`** giữa 2 FurnitureStore càng làm giảm khả năng Google phân tách 2 thực thể địa điểm độc lập.

→ Đây là cơ hội lớn bị bỏ lỡ, vì "dedicated service/location page" được xếp là **yếu tố #1 cho local organic ranking** và **#2 cho AI visibility** (theo tài liệu tham chiếu Whitespark 2026).

---

## 10. Top 10 hành động ưu tiên

### 🔴 Critical
1. **Sửa lỗi số điện thoại sai ở footer/CTA toàn site cho chi nhánh TP.HCM.** Hiện `tel:` link của khối "Chi nhánh TP.HCM" đang trỏ về `0325669996` (số Hà Nội) thay vì `0777569996`/`0392869996`. Đây là lỗi code (component dùng chung biến số điện thoại), xác nhận trên cả Home/`/showroom`/`/gioi-thieu`. Sửa ngay vì ảnh hưởng trực tiếp trải nghiệm khách gọi nhầm chi nhánh.
2. **Xác minh thủ công tình trạng Google Business Profile** cho cả 2 địa chỉ (đăng nhập business.google.com kiểm tra) — công cụ tự động trong phiên này không truy cập được Google Search/Maps để xác nhận. Đây là yếu tố xếp hạng local #1 (Primary GBP category) và #4 (Verified GBP) theo Whitespark 2026 — nếu chưa có/chưa verify, đây là ưu tiên tuyệt đối.
3. **Bổ sung `geo` (latitude/longitude, 5 số thập phân) vào JSON-LD `FurnitureStore`** cho cả 2 showroom — hiện thiếu hoàn toàn, là thuộc tính khuyến nghị quan trọng nhất còn thiếu trong schema.

### 🟠 High
4. **Thu thập và hiển thị review thật** (từ khách hàng thật/GBP đã verify) kèm `aggregateRating` schema — hiện toàn site (cả cấp sản phẩm) đều là 0 review. Tuyệt đối không dựng số liệu giả — chỉ đồng bộ đúng số liệu thật từ GBP/khảo sát khách hàng.
5. **Tách `/showroom` thành 2 trang địa điểm riêng** (VD `/showroom/ha-noi`, `/showroom/tp-hcm`), mỗi trang có title/meta/schema `url` và `@id` riêng, không dùng chung 1 URL cho 2 `FurnitureStore` như hiện tại.
6. **Kiểm tra lại tên đơn vị hành chính "Quận 2"** trong địa chỉ TP.HCM — đối chiếu với giấy tờ pháp lý/GBP thực tế xem có cần đổi thành "TP. Thủ Đức" (sáp nhập từ 2021) để tránh lệch NAP khi Google đối chiếu địa chỉ.

### 🟡 Medium
7. **Thêm nút "Chỉ đường" (Get Directions)** trỏ thẳng tới Google Maps bằng Place ID thật (sau khi có GBP), thay vì chỉ nhúng iframe tìm theo chuỗi địa chỉ như hiện tại.
8. **Chuẩn hoá thuộc tính schema:** sửa `telephone` từ dạng mảng sang đúng chuẩn (1 số chính + đưa số phụ vào `ContactPoint` riêng), thêm `postalCode`, chuyển `openingHours` sang `openingHoursSpecification` dạng object, thêm `@id`/`branchOf` liên kết Organization ↔ từng showroom.
9. **Công bố mã số thuế/giấy phép kinh doanh (MST/GPKD)** ở footer — hiện không tìm thấy trên bất kỳ trang nào đã quét; vừa đúng quy định TMĐT VN vừa hỗ trợ xác minh khi đăng ký citation/GBP.

### 🟢 Low
10. **Bổ sung thêm ảnh thật cho mỗi showroom** (mặt tiền, không gian trưng bày, đội ngũ tư vấn) — hiện mỗi chi nhánh chỉ có 1 ảnh trong schema; đồng bộ ảnh này lên GBP sau khi verify (ảnh giúp tăng ~45% yêu cầu chỉ đường theo dữ liệu ngành tham chiếu).

---

## 11. Limitations Disclaimer (giới hạn của audit này)

- **Không thể truy cập trực tiếp Google Search/Google Maps/Bing** trong phiên làm việc này để xác minh: GBP đã tồn tại/verify chưa, primary category đang chọn là gì, rating sao thật, số lượng review thật, tần suất review (18-day rule), có ảnh/post trên GBP hay không. Mọi kết luận về GBP trong báo cáo này ở mức "không xác minh được", **không phải** "đã xác nhận không tồn tại".
- **Không thể truy cập nội dung Facebook Page** (`facebook.com/ofina.vn` trả về lỗi khi fetch trực tiếp) — chỉ xác nhận được rằng chính website OFINA tự khai link này trong schema, chưa xác minh được trang có đang hoạt động/uy tín thế nào.
- **Không kiểm tra được** sự hiện diện trên các directory/citation Việt Nam khác (không có công cụ search hoạt động ổn định trong phiên này).
- **Không có DataForSEO hay công cụ trả phí nào được dùng** — mọi dữ liệu đến từ việc tải trực tiếp HTML nguồn của ofina.vn bằng curl/WebFetch và phân tích thủ công.
- Điểm số 34/100 phản ánh **mức độ bằng chứng xác minh được**, không phải khẳng định tuyệt đối doanh nghiệp yếu — nếu GBP thực tế đã được claim/verify tốt với nhiều review tích cực, điểm 2 dimension (GBP Signals, Reviews) có thể tăng đáng kể sau khi xác minh thủ công.
