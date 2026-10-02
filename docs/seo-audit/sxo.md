# SXO Analysis — ofina.vn (quét 25/09/2026)

Phân tích SERP tiếng Việt ngược cho 5 từ khoá hero (WebSearch, ~9 kết quả organic/từ khoá) đối chiếu với 8 trang OFINA đã fetch thật qua `scripts/fetch_page.py` + `scripts/parse_html.py`: trang chủ, `/bo-suu-tap/ghe-cong-thai-hoc`, 4 trang `/danh-muc/*`, 2 trang `/nhom/*`, `/san-pham`, 2 trang sản phẩm chi tiết. Đối chiếu chéo với `docs/seo-audit/technical.md` và `docs/seo-audit/schema.md` (đã quét cùng ngày) để tránh kết luận sai từ một nguồn đo duy nhất.

**SXO Gap Score: 47/100** (thang riêng, KHÔNG phải SEO Health Score — xem `technical.md` cho điểm kỹ thuật 30-90/100 theo hạng mục). 47/100 = lệch nhiều so với những gì Google đang thưởng cho 5 từ khoá hero, dù bản thân trang không sai *loại trang*.

## Phát hiện chính (dẫn đầu — đây không phải lỗi "sai loại trang")

Khác với mô hình SXO điển hình, OFINA **không** mắc lỗi page-type mismatch nghiêm trọng (không phải kiểu "đăng blog cho từ khoá muốn mua sản phẩm"). Loại trang OFINA dựng cho từng từ khoá về cơ bản **đúng nhóm** với những gì SERP đang thưởng. Vấn đề thật sự nằm ở 4 lớp cộng dồn:

1. **Nội dung quá mỏng trên đúng loại trang** — 4/4 trang `/danh-muc/*` được kiểm tra có **0 thẻ H2**, gần như không có đoạn văn tư vấn/FAQ, trong khi SERP của cả 4 từ khoá category đều bị thống trị bởi các trang "100+/300+/999+ Mẫu..." tích hợp nội dung tư vấn dài.
2. **Bất nhất schema giữa 2 template cùng chức năng liệt kê sản phẩm** — `/bo-suu-tap/[slug]` có đủ `CollectionPage`+`ItemList`+`BreadcrumbList`+`FAQPage`; `/danh-muc/[slug]` (áp dụng cho hàng trăm danh mục, kể cả 4 trang hero) **không có bất kỳ JSON-LD nào ngoài 4 block global** (`Organization`, `WebSite`, 2× `FurnitureStore`) — xác nhận chéo với `schema.md` dòng 23, 68-73.
3. **Trùng lặp kiến trúc 3 tầng danh mục** (`/nhom/*` > `/danh-muc/*` > `/bo-suu-tap/*`) cùng nhắm một cụm từ khoá (vd. "ghế công thái học" xuất hiện ở cả `/nhom/ghe`, `/danh-muc/ghe-cong-thai-hoc`, `/bo-suu-tap/ghe-cong-thai-hoc`) — nguy cơ pha loãng tín hiệu nội bộ (self-cannibalization), và với truy vấn thương hiệu ("OFINA ghế công thái học"), Google hiện chọn hiển thị đúng bản **mỏng nhất** (`/danh-muc/`) chứ không phải bản giàu nội dung (`/bo-suu-tap/`).
4. **Zero visibility ở tầm từ khoá không thương hiệu** — cả 5 từ khoá hero, ofina.vn không xuất hiện trong top ~9 kết quả organic. Chỉ xuất hiện khi query có kèm "OFINA" hoặc `site:ofina.vn`. Đây là dấu hiệu Authority/E-E-A-T yếu (không phải lỗi on-page riêng lẻ) — ngay cả truy vấn thương hiệu "OFINA nội thất văn phòng" cũng không trả về ofina.vn trong kết quả WebSearch thu được.

---

## Bảng đối chiếu: từ khoá → loại trang SERP thưởng → trang OFINA → khớp không

| # | Từ khoá | Loại trang SERP thưởng (mẫu quan sát/tổng) | Trang OFINA tương ứng | Khớp loại? | Vấn đề chính |
|---|---|---|---|---|---|
| 1 | **nội thất văn phòng** | Trang chủ thương hiệu / Hub tổng danh mục (~7/9), 1 trang dịch vụ thiết kế nội thất, 1 bài blog định nghĩa | Trang chủ `ofina.vn` (H1 "Ghế & nội thất văn phòng OFINA", 1.752 từ, 14 H2, FAQPage) | ✅ Khớp loại | Không xuất hiện trong SERP thường lẫn SERP thương hiệu → Authority/backlink yếu, không phải lỗi cấu trúc trang |
| 2 | **ghế công thái học** | Trang danh mục e-commerce giàu nội dung (6/9), 1 forum FB, 1 Wikipedia | `/danh-muc/ghe-cong-thai-hoc` (đang được Google hiển thị cho truy vấn brand) — bản giàu nội dung hơn `/bo-suu-tap/ghe-cong-thai-hoc` lại KHÔNG được chọn hiển thị | ⚠️ Khớp loại, lệch độ sâu | 0 H2, không FAQ, không `CollectionPage`/`BreadcrumbList`/`ItemList` (xác nhận chéo `schema.md`) trên đúng bản đang được Google ưu tiên |
| 3 | **bàn làm việc văn phòng** | Trang danh mục "N+ Mẫu..." giàu nội dung (9/9), 3/9 thuộc hệ Hòa Phát (top ngành) | `/danh-muc/ban-lam-viec-chan-sat` (489 từ, 0 H2) | ⚠️ Khớp loại, hẹp phạm vi | Tên/URL chỉ phủ biến thể "chân sắt", không có bài tư vấn chọn bàn theo ngân sách/không gian như đối thủ |
| 4 | **ghế giám đốc** | Trang danh mục "N+ Mẫu..." (8/9) + 1 bài "hướng dẫn chọn mua cho CEO" | `/danh-muc/ghe-da-giam-doc` (499 từ, 0 H2) | ⚠️ Khớp loại, hẹp phạm vi | Tên category giới hạn "ghế DA giám đốc" (chỉ da) trong khi đối thủ và người tìm kiếm bao quát cả ghế lưới/gỗ giám đốc |
| 5 | **bàn họp văn phòng** | Trang danh mục e-commerce (9/9), 2/9 thuộc hệ Hòa Phát | `/danh-muc/ban-hop-van-phong-chan-sat` (447 từ, 0 H2) | ⚠️ Khớp loại, hẹp phạm vi | Chỉ phủ "chân sắt", không có bảng gợi ý kích thước bàn theo số người họp — điểm SERP đối thủ thường có |

**Đọc bảng:** Không có ô nào là ❌ (sai hẳn loại trang) — đây là điểm khác biệt quan trọng với mô hình SXO "blog vs product page" điển hình. 4/5 ô là ⚠️ (đúng loại, sai độ sâu/phạm vi), 1/5 là vấn đề Authority thuần tuý (từ khoá đầu, quá rộng để một category page cạnh tranh — cần trang chủ + backlink).

---

## 1. SERP Landscape chi tiết theo từng từ khoá

### "nội thất văn phòng"
- Kết quả: xuanhoa.vn (hub danh mục hãng lớn), noithattoz.com, noithatduyphat.vn, noithatdangkhoa.com, tongkhonoithatvanphong.com, noithatoffice.com (đều là **trang chủ thương hiệu** đóng vai trò hub); ychi.vn/noi-that-van-phong.html (Service Page — "thiết kế thi công"); timioffice.vn (hybrid gallery/blog "102+ Mẫu Thiết Kế..."); coidb.com (Blog Post định nghĩa "...bao gồm những đồ vật gì?").
- Consensus: Trang chủ/Hub thương hiệu ~78%, không có định dạng bắt buộc kiểu blog hay tool.
- OFINA: trang chủ đã đúng loại, nội dung khá đầy đủ (14 H2: "Nội thất văn phòng chuẩn", "Ghế công thái học", "Ghế giám đốc cao cấp", "Đủ giải pháp cho doanh nghiệp", "Phòng họp cao cấp", "Vì sao khách hàng chọn OFINA?", FAQ...) nhưng **không lọt top kết quả** — kể cả khi search đúng brand "OFINA nội thất văn phòng" (kết quả trả về toàn đối thủ: O'FURNI, Xuân Hòa, Đăng Khoa, VinaOffice...).

### "ghế công thái học"
- Kết quả: gearvn.com/collections (category), thecity.com.vn (category), Facebook group (outlier cộng đồng), dergo.vn ×2 (category, kể cả biến thể "cao cấp"), smafurniture.com (category/brand), congthaihoc.vn ×2 — **domain exact-match ngành** (danh mục + trang chủ), Wikipedia "Kneeling chair" (outlier).
- Consensus: Category/listing e-commerce ~67% (6/9), phần còn lại là outlier ít giá trị tham chiếu.
- OFINA có 2 trang cùng nhắm từ khoá này: `/bo-suu-tap/ghe-cong-thai-hoc` (800 từ, đoạn giới thiệu ~150 từ giải thích lợi ích công thái học, 3 câu FAQ, `CollectionPage`+`BreadcrumbList`+`FAQPage`) và `/danh-muc/ghe-cong-thai-hoc` (570 từ, chỉ bộ lọc + lưới sản phẩm, 0 H2, không FAQ, không schema riêng). Khi search `site:ofina.vn ghế công thái học` hoặc `OFINA ghế công thái học`, kết quả trả về ưu tiên **bản `/danh-muc/`** — bản yếu hơn về nội dung/schema lại là bản đại diện thương hiệu trước Google.

### "bàn làm việc văn phòng"
- Kết quả: noithathoaphat.com.vn (category, Hòa Phát), noithatdogoviet.com ("999+ Mẫu..." category giàu nội dung), noithatgiasi.org (category), noithathoaphat.com (category, Hòa Phát reseller khác), govi.vn ("500+ Mẫu..."), noithattoz.com ("168 Mẫu..."), hoaphatsaigon.com (category, Hòa Phát), toanmanh.com (category), noithatdangkhoa.com (category).
- Consensus: 9/9 category/listing, trong đó 3/9 thuộc hệ sinh thái Hòa Phát — thương hiệu số 1 ngành nội thất văn phòng VN áp đảo SERP này bằng nhiều domain.
- OFINA: `/danh-muc/ban-lam-viec-chan-sat` — tên chỉ phủ biến thể chân sắt trong khi OFINA thực tế còn bán bàn nâng hạ, cụm bàn nhân viên (thấy ở `/nhom/ban`, "Tất cả Bàn Văn Phòng", 564 từ, 0 H2 — cũng thiếu nội dung tư vấn).

### "ghế giám đốc"
- Kết quả: hungphatsaigon.vn (category), noithatvito.vn ("300+ Mẫu..."), noithatluongson.com.vn ("300+ Mẫu..."), hoaphatsaigon.com (category, Hòa Phát), govi.vn ("300+..."), mychair.vn (category), noithatdangkhoa.com (category), dsggroup.com.vn ("199+ Mẫu..."), bchair.com.vn ("7 Mẫu... và hướng dẫn chọn mua cho CEO" — blog/buying-guide hybrid).
- Consensus: 8/9 category giàu nội dung kiểu "N+ Mẫu", 1/9 buying-guide. Không một kết quả nào giới hạn theo chất liệu (da/lưới/gỗ) ngay trong tên category — tất cả dùng tên rộng "ghế giám đốc"/"ghế lãnh đạo".
- OFINA: `/danh-muc/ghe-da-giam-doc` — tên category tự giới hạn phạm vi ("ghế DA giám đốc"), lệch với cách đặt tên rộng mà toàn bộ SERP đang dùng.

### "bàn họp văn phòng"
- Kết quả: noithathoaphat.com.vn (category, Hòa Phát), noithatluongson.com.vn ("100+..."), govi.vn ("250+ Mẫu..."), hoaphatnoithat.net.vn ("121 Mẫu...", Hòa Phát), noithat190.com.vn (category), truongmaisaigon.vn ("Top 50+ Mẫu..."), noithatduongdong.com (category), noithatvuongphat.com ("+22 Mẫu..."), noithatab.net (category).
- Consensus: 9/9 category/listing, 2/9 thuộc hệ Hòa Phát.
- OFINA: `/danh-muc/ban-hop-van-phong-chan-sat` — cùng vấn đề: tên hẹp theo chân sắt, không có nội dung tư vấn chọn theo sức chứa phòng họp.

---

## 2. Page-Type Alignment — tổng kết theo taxonomy

Theo `references/page-type-taxonomy.md`, các trang `/danh-muc/*` của OFINA có tín hiệu chính: giá hiển thị, nhiều ảnh sản phẩm, badge "Mới"/"Bán chạy", CTA "→" dẫn vào trang chi tiết, bộ lọc giá/thương hiệu/chất liệu, sắp xếp — khớp nhóm **Product Page (biến thể danh sách/category)**; taxonomy gốc không có type "Category Listing" riêng nên xếp gần nhất vào nhóm này. SERP cho 4/5 từ khoá hero cũng đúng nhóm Product/Category-listing, nên **Verdict: ALIGNED về loại trang**, nhưng **MEDIUM-HIGH mismatch về độ sâu nội dung + schema** so với chuẩn SERP đang thưởng.

Riêng "nội thất văn phòng": Target = Homepage/Hub, SERP = Homepage/Hub → ALIGNED, nhưng **Impact = 0 visibility** do Authority Signals yếu (mục 5, Gap Analysis).

---

## 3. User Stories (trích từ tín hiệu SERP quan sát được)

1. **Là chủ doanh nghiệp/admin mua sắm B2B (SME Owner)**, tôi muốn tìm nhà cung cấp trọn gói cho văn phòng mới/mở rộng và nhận báo giá sỉ nhanh, vì tôi cần trang bị đồng loạt cho nhiều nhân viên, nhưng tôi bị chặn bởi việc lưới sản phẩm trong `/danh-muc/*` không có banner "mua số lượng lớn → nhận báo giá sỉ" — CTA B2B ("Nhận tư vấn B2B") chỉ xuất hiện ở header/footer (`/bao-gia-b2b`, đã xác nhận qua grep HTML: chỉ 2 lần xuất hiện trên mỗi trang danh mục, đều ở nav/footer, không ở gần lưới sản phẩm). *(Nguồn: SERP "bàn làm việc"/"bàn họp" dominance của Hòa Phát — thương hiệu vốn mạnh về kênh dự án/B2B.)*
2. **Là nhân viên văn phòng mua lẻ đang đau lưng**, tôi muốn hiểu nên chọn ghế lưới hay ghế đệm và có phù hợp với vóc dáng mình không trước khi bỏ vài triệu đồng, vì tôi sợ mua sai, nhưng tôi bị chặn bởi đúng bản `/danh-muc/ghe-cong-thai-hoc` (bản Google đang hiển thị) không có FAQ nào — trong khi FAQ trả lời chính xác câu hỏi này ("Ghế công thái học có thật sự giảm đau lưng không?", "Nên chọn ghế lưới hay ghế đệm?") lại nằm ở bản `/bo-suu-tap/ghe-cong-thai-hoc` mà Google không ưu tiên hiển thị cho truy vấn brand. *(Nguồn: FAQPage schema đã viết sẵn trên `bo-suu-tap` nhưng "đặt sai chỗ" so với bản đang thắng SERP.)*
3. **Là quản lý hành chính nâng cấp phòng giám đốc**, tôi muốn xem đủ 3 dòng ghế giám đốc da/lưới/gỗ để chọn đúng phong cách phòng làm việc, vì ghế giám đốc còn thể hiện hình ảnh công ty trước đối tác, nhưng tôi có thể bỏ lỡ OFINA nếu tìm "ghế giám đốc" chung chung vì OFINA đặt tên category hẹp "ghế DA giám đốc". *(Nguồn: 8/9 SERP "ghế giám đốc" dùng tên rộng bao quát mọi chất liệu.)*
4. **Là người so sánh giá trước khi quyết định (price-comparison shopper)**, tôi muốn thấy khoảng giá/số sản phẩm ngay trên kết quả tìm kiếm Google trước khi click, vì tôi muốn lọc nhanh shop trong tầm giá, nhưng `/danh-muc/*` không có `ItemList`/rich snippet giá (chỉ 4 block schema global — xác nhận chéo `schema.md`), nên kết quả OFINA (khi hiển thị) kém nổi bật hơn đối thủ có giá/sao hiện ngay trên SERP. *(Nguồn: nhiều title đối thủ nhấn "giá tốt"/"giá rẻ" được hỗ trợ bởi structured data.)*
5. **Là người phụ trách setup phòng họp (bulk buyer)**, tôi muốn biết nên chọn bàn họp cỡ nào theo số người dự họp, vì đặt sai kích thước sẽ phải đổi trả tốn thời gian, nhưng `/danh-muc/ban-hop-van-phong-chan-sat` chỉ có lưới sản phẩm, không có bảng quy đổi "số người → kích thước bàn" như dạng nội dung phổ biến trong các trang "50-250 Mẫu" đang thắng SERP. *(Nguồn: 9/9 SERP "bàn họp văn phòng" là category giàu nội dung tư vấn.)*

Câu chuyện #2, #4 thuộc giai đoạn **Consideration**; #1, #3, #5 thuộc **Consideration → Decision** (B2B/high-ticket cần tư vấn trước khi chốt).

---

## 4. Gap Analysis — SXO Gap Score: 47/100

Chấm theo nhóm trang `/danh-muc/*` (đại diện 4/5 từ khoá hero — nhóm trang thực sự đang cạnh tranh trên SERP).

| Dimension | Điểm | Bằng chứng |
|---|---|---|
| Page Type (0-15) | **10/15** | Đúng nhóm Product/Category-listing như SERP, nhưng bị pha loãng bởi 3 tầng trùng lặp (`/nhom/` , `/danh-muc/`, `/bo-suu-tap/` cùng nhắm 1 cụm từ khoá) và tên category tự thu hẹp phạm vi (chân sắt, da) |
| Content Depth (0-15) | **4/15** | 0 H2 trên cả 4 trang hero; 447-570 từ nhưng phần lớn là nav/footer/boilerplate, nội dung riêng biệt gần như bằng 0. So với chuẩn SERP "100-999+ Mẫu" kèm tư vấn dài |
| UX Signals (0-15) | **9/15** | Có bộ lọc giá/thương hiệu/chất liệu, sort, badge "Mới"/"Bán chạy", breadcrumb hiển thị UI đầy đủ, thanh trust (bảo hành 24 tháng/giao HN-HCM/hotline) trên đầu trang. Thiếu: không có nội dung hướng dẫn chọn theo nhu cầu ngay trên category |
| Schema (0-15) | **5/15** | Chỉ 4 block global (`Organization`, `WebSite`, 2× `FurnitureStore`) — thiếu `BreadcrumbList` (dù UI đã có breadcrumb), thiếu `CollectionPage`/`ItemList` (dù template `/bo-suu-tap/[slug]` cùng dự án đã làm đúng — xác nhận `schema.md`) |
| Media (0-15) | **9/15** | 25 ảnh sản phẩm/trang, alt text đầy đủ 100% (0 ảnh thiếu alt — điểm tốt hiếm gặp), nhưng không có ảnh bối cảnh/phòng thực tế, không video, không sơ đồ kích thước |
| Authority (0-15) | **4/15** | Không có `aggregateRating`/review trong `Product` schema (xác nhận qua JSON-LD sp1/sp2 — hoàn toàn không có trường review), không case study B2B, không logo khách hàng; brand không xuất hiện cả khi search "OFINA nội thất văn phòng" |
| Freshness (0-10) | **6/10** | Giá + % giảm giá hiển thị động, badge "Mới", nav có "Sản phẩm mới 2026"; nhưng không có "cập nhật lần cuối" hiển thị cho người dùng trên category |
| **Tổng** | **47/100** | |

**Đối chiếu:** trang chủ (từ khoá "nội thất văn phòng") ước tính cao hơn (~58/100 theo cùng thang) nhờ nội dung dày hơn (1.752 từ, 14 H2, FAQPage) nhưng vẫn bị Authority kéo xuống nặng vì zero visibility — không đưa vào điểm tổng vì SERP mục tiêu/persona khác hẳn nhóm category.

---

## 5. Persona Scores

5 persona suy ra trực tiếp từ tín hiệu SERP + cấu trúc nội dung OFINA hiện có (`bao-gia-b2b` cho B2B, FAQ trên `bo-suu-tap` cho persona đau lưng, tên category hẹp cho persona giám đốc/phòng họp).

| Persona | Relevance | Clarity | Trust | Action | Total | Xếp loại |
|---|---|---|---|---|---|---|
| **Meeting Room Planner** (setup phòng họp, "bàn họp văn phòng") | 13/25 | 9/25 | 11/25 | 12/25 | **45/100** | Critical Mismatch |
| **Executive Office Upgrader** (nâng cấp phòng giám đốc, "ghế giám đốc") | 12/25 | 11/25 | 12/25 | 11/25 | **46/100** | Critical Mismatch |
| **Individual Ergonomic Buyer** (nhân viên đau lưng, "ghế công thái học") | 13/25 | 10/25 | 12/25 | 14/25 | **49/100** | Needs Work |
| **B2B SME Owner** (chủ DN mua sỉ) | 15/25 | 13/25 | 10/25 | 12/25 | **50/100** | Needs Work |
| **Early-stage Researcher** ("nội thất văn phòng" — awareness) | 19/25 | 17/25 | 12/25 | 15/25 | **63/100** | Good |

*(Sắp theo persona yếu nhất trước.)*

### Persona yếu nhất: Meeting Room Planner (45/100)
**Vấn đề chính:** `/danh-muc/ban-hop-van-phong-chan-sat` không trả lời được câu hỏi cốt lõi "bàn nào phù hợp phòng họp X người" — chỉ có lưới sản phẩm + bộ lọc giá, buộc persona tự đoán qua ảnh.
**Đề xuất cụ thể:** Thêm khối "Chọn bàn họp theo số người" (vd. bảng 4-6-8-12-20 người → kích thước gợi ý) ngay dưới H1, mở rộng phạm vi category để không chỉ giới hạn "chân sắt" (đổi URL/alias sang `/danh-muc/ban-hop-van-phong` bao quát, giữ redirect 301 từ URL cũ).

### Persona #2: Executive Office Upgrader (46/100)
**Vấn đề chính:** Tên category "ghế da giám đốc" tự loại các phân khúc lưới/gỗ mà SERP (8/9 kết quả) dùng tên rộng "ghế giám đốc".
**Đề xuất cụ thể:** Đổi H1/URL thành "Ghế giám đốc" bao quát 3 chất liệu, thêm đoạn giới thiệu ngắn phân biệt da/lưới/gỗ + CTA "Đặt lịch xem trực tiếp tại showroom HN/HCM" (đã có địa chỉ thật theo `schema.md` — chỉ cần liên kết từ category).

### Systemic Issues (ảnh hưởng mọi persona)
- **Schema**: 0/5 persona có trải nghiệm rich-snippet giá/sao trên Google vì `/danh-muc/*` thiếu `ItemList`+`BreadcrumbList` (đã có sẵn code mẫu đúng ở `/bo-suu-tap/[slug]`, theo `schema.md` mục 4.1, chỉ cần tái sử dụng logic, đổi nguồn dữ liệu).
- **Trust**: Không persona nào thấy review/rating — `Product` schema toàn site không có trường `aggregateRating`/`review`.
- **Content Depth**: 4/4 trang category hero có 0 H2 — cùng một causa gốc (template `/danh-muc/[slug]` không render phần nội dung tư vấn, khác hẳn `/bo-suu-tap/[slug]` cùng dự án).

### Priority Actions (ưu tiên theo persona yếu nhất + vấn đề hệ thống)
1. Đưa toàn bộ khối nội dung/FAQ đã viết sẵn ở `/bo-suu-tap/ghe-cong-thai-hoc` sang thẳng `/danh-muc/ghe-cong-thai-hoc` — vì đây là bản Google đang thực sự hiển thị cho truy vấn brand.
2. Áp dụng lại logic `CollectionPage`+`ItemList`+`BreadcrumbList` đã đúng ở `/bo-suu-tap/[slug]` cho toàn bộ `/danh-muc/[slug]` (việc này sibling audit `schema.md` đã có sẵn snippet mẫu ở mục 4.1).
3. Thêm bảng "chọn theo nhu cầu" (số người họp / chiều cao-cân nặng / phong cách phòng) ngay dưới H1 của 3 trang: `ban-hop-van-phong-chan-sat`, `ghe-da-giam-doc`, `ban-lam-viec-chan-sat`.
4. Đổi tên/URL category từ hẹp (chân sắt, da) sang rộng (đúng head-term), giữ 301 redirect từ slug cũ.
5. Thêm banner "Mua từ 5 sản phẩm — nhận báo giá sỉ" ngay trong lưới sản phẩm category (không chỉ ở nav/footer `/bao-gia-b2b`).
6. Bổ sung `aggregateRating`/review thật (kể cả khởi động bằng review nội bộ đã xác thực) cho `Product` schema.
7. Đầu tư backlink/PR để "OFINA" xuất hiện khi search brand + category — hiện tại truy vấn "OFINA nội thất văn phòng" không trả về ofina.vn trong dữ liệu WebSearch thu thập được.

---

## 6. Cross-Skill References

- Thiếu `CollectionPage`/`ItemList`/`BreadcrumbList` trên `/danh-muc/*` → dùng `/seo schema` (đã có phân tích sâu + snippet mẫu tại `docs/seo-audit/schema.md`).
- Nội dung mỏng (0 H2, không FAQ) trên 4 trang danh mục hero → dùng `/seo page` hoặc `/seo content` để viết lại nội dung tư vấn theo persona.
- Không review/rating, brand invisibility → dùng `/seo content` cho audit E-E-A-T sâu (case study, tác giả, chứng nhận).
- Có tín hiệu showroom thật tại HN/HCM (theo `schema.md`) nhưng chưa khai thác cho local intent — nếu mở rộng sang từ khoá dạng "nội thất văn phòng Hà Nội/showroom", nên chạy thêm `/seo local`.

---

## 7. Giới hạn của phân tích (Limitations)

- **SERP lấy qua WebSearch, không phải DataForSEO/Google trực tiếp**: không thấy được đầy đủ PAA, ads, featured snippet, AI Overview, related searches thật — phân loại loại trang chỉ dựa trên tiêu đề + domain của các link trả về (~9 link/từ khoá), không phải toàn bộ 10 vị trí SERP thật với snippet đầy đủ.
- **`site:` operator qua WebSearch không đáng tin cậy để kết luận "không được index"**: `site:ofina.vn/bo-suu-tap` trả về 0 kết quả trong dữ liệu thu thập được, nhưng đối chiếu `technical.md`/`schema.md` cho thấy `/bo-suu-tap/[slug]` có canonical đúng, nằm trong sitemap (13 URL, `lastmod=now`), không dính bug noindex — nên khả năng cao đây là hạn chế của công cụ tìm kiếm (site: qua WebSearch), không phải bằng chứng chắc chắn trang bị de-index. **Cần xác minh lại bằng Google Search Console (URL Inspection) trước khi hành động dựa trên kết luận này.**
- Kết quả WebSearch có thể bị ảnh hưởng bởi vị trí địa lý/cá nhân hoá mặc định của công cụ, không hoàn toàn phản ánh SERP mà một người dùng thật tại Hà Nội/TP.HCM sẽ thấy.
- Không đánh giá Core Web Vitals/tốc độ tải thực tế (ngoài phạm vi công cụ fetch/parse dùng trong audit này — xem `technical.md` nếu đã có phần riêng).
- Không dùng công cụ backlink chuyên dụng (Ahrefs/Moz) — nhận định "Authority thấp" chỉ dựa trên việc brand không nổi lên trong kết quả WebSearch, cần xác minh thêm bằng dữ liệu backlink thật.
- Điểm SXO Gap Score (47/100) và điểm persona là ước lượng định tính có bằng chứng cụ thể kèm theo, không phải điểm đo tự động — nên đọc cùng bảng bằng chứng, không tách rời con số.

---

Muốn xuất báo cáo PDF? Dùng `/seo google report`.
