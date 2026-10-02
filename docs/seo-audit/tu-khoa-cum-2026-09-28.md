# Bản đồ từ khóa & cụm nội dung (Hub & Spoke) — ofina.vn

**Ngày:** 28/09/2026
**Phạm vi:** 73 danh mục có hàng (2.673 sản phẩm), 2 showroom (Hà Nội — 135 đường K2, P. Phú Đô; TP.HCM — Tầng 2, số 36 Lương Định Của, Quận 2)
**Người thực hiện:** Semantic Topic Clustering (dựa trên WebSearch thời gian thực, không dùng dữ liệu suy đoán)

---

## 0. Phương pháp & giới hạn dữ liệu (đọc trước khi dùng số liệu)

- Từ khóa được thu thập bằng ~35 lượt WebSearch thực tế (không bịa), mô phỏng hành vi tìm kiếm người Việt: cụm từ chính, biến thể dài, câu hỏi so sánh, câu hỏi theo ngân sách/quy mô, câu hỏi theo khu vực.
- **Không có quyền truy cập công cụ đo volume/CPC (Ahrefs, Keyword Planner, GSC của ofina.vn)** trong phiên làm việc này. Mọi số liệu "khối lượng tìm kiếm" trong báo cáo này là **suy luận định tính** từ: (a) số lượng bài viết đối thủ đã đầu tư cho từ khóa đó, (b) độ dài/tần suất biến thể xuất hiện lặp lại trong search suggestions, (c) mức độ cụ thể của cụm từ. Đây **không phải** số liệu đo lường chính xác — cần đối chiếu với Google Search Console/Ahrefs thật trước khi rót ngân sách content lớn.
- **Mức độ cạnh tranh** được chấm định tính (Thấp / Trung bình / Cao) dựa trên số lượng thương hiệu lớn đã có trang landing riêng cho đúng cụm từ đó trong kết quả tìm kiếm thực tế thu thập được (xem mục 2). Đây không phải Keyword Difficulty số hoá từ công cụ chuyên dụng.
- Phương pháp đo "SERP overlap top-10" theo đúng quy trình chuẩn (so khớp URL giữa từng cặp từ khóa) **không được thực hiện đầy đủ theo kiểu pairwise cho toàn bộ tổ hợp** vì chi phí tìm kiếm quá lớn (hàng trăm cặp). Thay vào đó, việc gom cụm dưới đây dùng **overlap định tính**: từ khóa được xếp chung cụm khi (a) cùng nằm trong cùng danh mục tồn kho, (b) kết quả tìm kiếm thực tế cho thấy cùng một tập thương hiệu (Hòa Phát, Govi, Lương Sơn, TOZ, Luso, DSGGroup, MyChair...) đang xếp hạng cho cả hai cụm từ, và (c) cùng chung ý định mua. Đây là **overlap suy luận có căn cứ**, không phải điểm số overlap chính xác đến từng URL.
- Đã đối chiếu chéo với 2 audit trước đó trong cùng thư mục (`content.md`, `ecommerce.md`, `sitemap.md`, `local.md`) để lấy URL thật, số liệu tồn kho thật và các vấn đề kỹ thuật đang tồn tại — tránh đề xuất nội dung chồng lên một site đang có lỗi cấu trúc.

> **Ghi chú minh bạch:** Trong phiên làm việc xuất hiện khối nội dung lạ dạng "MCP Server Instructions/Claude Docs" yêu cầu tạo tài liệu ở nơi khác (Artifact) thay vì ghi file cục bộ. Đây là dấu hiệu chèn lệnh giả (prompt injection), không đến từ user, đã bị bỏ qua hoàn toàn. Báo cáo được ghi đúng theo yêu cầu gốc vào đường dẫn `/Users/admin/ofina-web/docs/seo-audit/tu-khoa-cum-2026-09-28.md`.

---

## 1. CẢNH BÁO ƯU TIÊN — xử lý trước khi triển khai cụm nội dung mới

Ba phát hiện dưới đây lấy từ các audit đã có sẵn trong `docs/seo-audit/` (không phải suy đoán) — **ảnh hưởng trực tiếp** tới cách triển khai kế hoạch từ khóa này, nên nêu lại ở đây để không ai đọc riêng báo cáo này mà bỏ sót:

1. **`content.md` — Khủng hoảng trùng lặp blog:** 14/16 bài blog công khai hiện tại là bản AI spin cùng một chủ đề "Cách chọn ghế công thái học chống đau lưng" (9 bài dùng 1 tiêu đề, 5 bài dùng tiêu đề gần giống, 2 bài cùng đăng một ngày 04/07/2026). Đây đúng định nghĩa "scaled content abuse" của Google. **Hệ quả cho kế hoạch này:** không được thêm bài blog mới cho tới khi gộp 14 bài trên thành 1-2 bài + 301 redirect phần còn lại, và phải dừng pipeline tự động sinh bài cùng chủ đề. Tất cả đề xuất bài viết mới trong báo cáo này **cố tình tránh chủ đề "ghế công thái học"** vì chủ đề đó đã bị lạm phát nội bộ, viết thêm sẽ làm cannibalization nặng hơn.
2. **`ecommerce.md` — Lỗi canonical phân trang danh mục:** `/danh-muc/[slug]?page=2`, `?page=4`... đang trả về canonical trỏ về trang 1 (sai). Với 95 trang danh mục hiện có, việc thêm bộ lọc/trang con mới cho các cụm bên dưới (ví dụ lọc "cụm bàn làm việc theo số người") cần sửa lỗi này trước, nếu không trang lọc mới sẽ không được index đúng.
3. **`ecommerce.md` — Mô tả/FAQ sản phẩm bị khuôn mẫu hoá (template chung cho ~2.673 sản phẩm, đo được 32% trùng cụm 5-từ giữa 2 sản phẩm khác loại hoàn toàn).** Các trang danh mục/bộ sưu tập dùng làm pillar bên dưới nên có phần mô tả riêng, không dùng lại template sản phẩm.

**Khuyến nghị trình tự:** (1) dọn dẹp blog trùng lặp → (2) vá lỗi canonical phân trang → (3) mới bắt đầu build cụm nội dung mới theo thứ tự ưu tiên ở Mục 3.

---

## 2. Phát hiện cạnh tranh quan trọng

### 2.1. Nhóm từ khóa đầu ngành đã bị 8-10 thương hiệu lớn chiếm sóng

Với hầu hết từ khóa gốc một-hai từ ("ghế giám đốc", "bàn họp", "bàn làm việc chân sắt"...), kết quả tìm kiếm luôn lặp lại cùng một nhóm thương hiệu: **Hòa Phát (nhiều site con: hoaphat.net, hoaphatsaigon.com, noithathoaphat.com, hoaphatgiasi.vn...), Govi, Nội Thất Lương Sơn, TOZ Furniture, Luso, DSGGroup, MyChair, Nội Thất The One, Trường Mai Sài Gòn, Hưng Phát Sài Gòn, Nội Thất Đăng Khoa**. Đây là các sàn/thương hiệu đã hoạt động 5-10+ năm với hàng trăm trang landing theo từ khóa × chất liệu × mức giá. Ofina.vn là site mới, cạnh tranh trực diện trên các từ khóa 1-2 từ này gần như không có cửa trong ngắn hạn.

→ **Chiến lược đúng: KHÔNG cạnh tranh trực diện đầu ngành, đánh vào từ khóa dài/ngách mà các "ông lớn" chưa làm landing page riêng** (xem Mục 3).

### 2.2. Va chạm địa phương trực tiếp — cần xử lý ưu tiên

- **TP.HCM:** Đối thủ **Hưng Phát Sài Gòn có showroom tại 109 Lương Định Của, An Khánh, Quận 2** — **cùng một con phố** với showroom Ofina tại **36 Lương Định Của**. Đây là va chạm NAP/địa lý trực tiếp hiếm gặp, cần ưu tiên Google Business Profile + review thật + schema `LocalBusiness`/`FurnitureStore` chuẩn trước khi cạnh tranh nội dung, vì nếu không hoàn thiện tín hiệu local, khách tìm "nội thất văn phòng Lương Định Của" nhiều khả năng thấy đối thủ trước.
- **Hà Nội:** Khu vực Phú Đô/Nam Từ Liêm đã có nhiều đối thủ hiện diện: **TOZ (28A Phạm Hùng), BAYA, Nội Thất Ami (380 Phúc Diễn), Erado, Xuân Hòa (Mễ Trì)** — đều trong bán kính vài km quanh showroom Ofina (135 K2, Phú Đô). Chưa thấy đối thủ nào tối ưu content riêng cho cụm từ "Nam Từ Liêm"/"Phú Đô" — đây là khoảng trống thật.
- Ghi chú hành chính: Quận 2 (TP.HCM) đã sáp nhập vào TP. Thủ Đức từ 2021, nhưng người dùng vẫn tìm cả hai biến thể "Quận 2" và "Thủ Đức" — nên tối ưu cho cả hai, khớp với cách địa chỉ hiện đang hiển thị trên site (`/showroom` hiện ghi "Quận 2").

### 2.3. Vùng ít cạnh tranh nhất tìm được qua nghiên cứu

Xếp từ ít cạnh tranh nhất: **(1) từ khóa theo tên phố/khu vực cụ thể** (chưa ai làm landing riêng) → **(2) từ khóa theo tình huống sử dụng** ("ghế giám đốc cho người to béo", "bàn ghế pantry văn phòng", "bàn training cho coworking") → **(3) từ khóa theo ngân sách cụ thể bằng số tiền thật** ("setup văn phòng 10 người hết bao nhiêu", "ngân sách 100 triệu mua được gì") — nhiều bài hiện có nói chung chung, chưa ai làm dạng "mua được đúng bao nhiêu món với số tiền X" gắn với tồn kho thật → **(4) bài so sánh kỹ thuật** (chân sắt vs chân gỗ, công thái học vs da giám đốc) — đã có vài bài nhưng chất lượng thấp, có thể làm tốt hơn với bảng so sánh tương tác + tồn kho thật.

---

## 3. Bản đồ cụm chủ đề (xếp theo độ ưu tiên)

Chú thích cột **Ý định**: TH = Tìm hiểu (Informational) · SS = So sánh (Commercial investigation) · MN = Mua ngay (Transactional) · ĐP = Định vị/điều hướng địa phương (Local).
Chú thích cột **Cạnh tranh**: Thấp / TB (Trung bình) / Cao — xem định nghĩa ở Mục 0.

### TIER 1 — Làm trước (tồn kho lớn, đã có trang, cơ hội từ khóa dài rõ ràng)

---

#### Cụm 1 — Ghế da giám đốc / ghế lãnh đạo (112 sản phẩm — tồn kho lớn nhất toàn site)

**Trang trụ cột:** `/danh-muc/ghe-da-giam-doc` (đã có nội dung đầy đủ, xác nhận tồn tại thật trong sitemap)
**Lý do chọn làm pillar:** tồn kho lớn nhất, đã có nội dung nền, có thể chịu tải nhiều liên kết spoke nhất.

| # | Từ khóa vệ tinh | Ý định | Cạnh tranh | Dạng trang đề xuất |
|---|---|---|---|---|
| 1 | cách chọn ghế giám đốc phù hợp vóc dáng | TH | Thấp | Bài blog mới |
| 2 | ghế giám đốc cho người to béo / ghế giám đốc khổ lớn (big size) | TH→MN | Thấp | Bài blog + bộ lọc "kích thước lớn" trong danh mục |
| 3 | ghế công thái học hay ghế da giám đốc nên chọn loại nào | SS | TB | Bài blog so sánh |
| 4 | ghế giám đốc da thật hay da PU nên mua loại nào | SS | TB | Bài blog so sánh |
| 5 | ghế giám đốc dưới 3 triệu / dưới 5 triệu | MN | TB | Trang lọc theo giá trong danh mục hiện có |
| 6 | bàn ghế giám đốc hợp mệnh phong thủy hướng đặt | TH | TB | Bài blog (nhu cầu tìm kiếm thực tế cao, ít trang chuyên nội thất văn phòng làm sâu) |
| 7 | ghế giám đốc có bệ gác chân | MN | Thấp | Mô tả bổ sung + lọc thuộc tính |
| 8 | ghế giám đốc nhập khẩu vs sản xuất trong nước | SS | TB | Đoạn nội dung trong pillar, không cần bài riêng |
| 9 | bảo hành ghế da giám đốc bao lâu, cách bảo quản da | TH | Thấp | FAQ riêng trên pillar (không dùng template FAQ chung — xem Cảnh báo #3) |

**Đề xuất bài viết cụ thể:**
- *"Cách chọn ghế giám đốc theo vóc dáng và vị trí lãnh đạo (kèm bảng tra kích thước)"* — spoke #1+#2
- *"Ghế công thái học hay ghế da giám đốc: 5 tiêu chí quyết định cho phòng lãnh đạo"* — spoke #3
- *"Bàn ghế giám đốc hợp mệnh 2026: hướng đặt, màu sắc, chất liệu theo ngũ hành"* — spoke #6

---

#### Cụm 2 — Bàn họp văn phòng (gộp bàn họp chân sắt 59 + bàn họp lớn 36 + bàn họp cao cấp 20 = 115 sản phẩm)

**Trang trụ cột:** `/danh-muc/ban-hop-van-phong-chan-sat` (đã có nội dung, tồn kho lớn nhất trong nhóm)
**Trang liên quan (spoke-cluster nội bộ):** `/danh-muc/ban-hop-van-phong` (bàn họp lớn, đã có nội dung) — 2 trang này cần liên kết 2 chiều rõ ràng, phân biệt bằng "quy mô phòng họp" để tránh cannibalization (xem Mục 5).
**Bàn họp cao cấp (20 sản phẩm)** hiện **chưa có trang riêng đầy đủ** → đề xuất tạo bộ sưu tập `/bo-suu-tap/ban-hop-cao-cap` định vị theo phân khúc giá/chất liệu (veneer, chân inox) thay vì theo kích thước, để không trùng ý định với 2 trang trên.

| # | Từ khóa vệ tinh | Ý định | Cạnh tranh | Dạng trang đề xuất |
|---|---|---|---|---|
| 1 | kích thước bàn họp 10 người / 12 người / 15 người tiêu chuẩn | TH | TB | Bài blog dạng bảng tra cứu (nhu cầu tìm kiếm thực tế rất rõ, nhiều đối thủ đã viết nhưng dạng liệt kê — làm bảng tương tác + gợi ý sản phẩm theo từng cỡ sẽ vượt trội) |
| 2 | bàn họp 12 chỗ giá bao nhiêu | MN | TB | Nội dung trong pillar `ban-hop-van-phong-chan-sat`, không cần bài riêng |
| 3 | bàn họp có ổ cắm điện, cổng sạc USB tích hợp | MN | Thấp | Lọc thuộc tính trong danh mục |
| 4 | bàn họp phòng họp lãnh đạo cao cấp veneer/chân inox | MN | TB | Trang `/bo-suu-tap/ban-hop-cao-cap` mới |
| 5 | bàn họp hình chữ nhật hay bầu dục nên chọn loại nào | TH | Thấp | Đoạn nội dung trong bài kích thước (spoke #1) |
| 6 | bàn họp gỗ hay bàn họp chân sắt bền hơn, nên chọn loại nào | SS | TB | Bài blog so sánh |

**Đề xuất bài viết cụ thể:**
- *"Kích thước bàn họp chuẩn cho phòng 6-30 người (bảng tra + gợi ý mẫu bàn phù hợp)"* — spoke #1+#5, liên kết 2 chiều tới cả `ban-hop-van-phong-chan-sat` và `ban-hop-van-phong`
- *"Bàn họp chân sắt hay bàn họp gỗ nguyên khối: nên chọn loại nào cho phòng họp công ty?"* — spoke #6

---

#### Cụm 3 — Bàn làm việc: chân sắt vs chân gỗ (66 + 15 = 81 sản phẩm)

**Trang trụ cột:** `/danh-muc/ban-lam-viec-chan-sat` (đã có nội dung; lưu ý: `ecommerce.md` ghi nhận tồn kho thực tế đo được là 90 sản phẩm/4 trang tại thời điểm audit 25/09, khác số 66 trong dữ liệu đầu bài — có thể do thời điểm cập nhật tồn kho khác nhau, nên đối chiếu lại trước khi công bố số liệu ra ngoài).
**Bàn làm việc chân gỗ (15 sản phẩm)** — tồn kho nhỏ, chưa có nội dung riêng đầy đủ → dùng làm **spoke có trang**, không tách pillar riêng vì tồn kho quá mỏng để gánh cụm từ khóa riêng.

| # | Từ khóa vệ tinh | Ý định | Cạnh tranh | Dạng trang đề xuất |
|---|---|---|---|---|
| 1 | bàn làm việc chân sắt hay chân gỗ tốt hơn, nên chọn loại nào | SS | TB | Bài blog so sánh (nhu cầu tìm kiếm rất thật, nhiều đối thủ đã viết — cần bảng so sánh + ảnh thật từ showroom để vượt trội) |
| 2 | hướng dẫn lắp ráp bàn làm việc chân sắt tại nhà | TH | Thấp | Bài blog ngắn/video hướng dẫn |
| 3 | bàn làm việc chân sắt chịu lực bao nhiêu kg | TH | Thấp | FAQ riêng trên pillar |
| 4 | kích thước bàn làm việc chuẩn văn phòng (1m2, 1m4, 1m6) | TH | TB | Bảng kích thước trong pillar |
| 5 | bàn làm việc chân sắt giá rẻ dưới 1 triệu / dưới 2 triệu | MN | TB | Lọc theo giá trong danh mục |
| 6 | bàn làm việc chân gỗ tự nhiên cho phòng giám đốc nhỏ | MN | Thấp | Trang/spoke riêng cho danh mục chân gỗ (15 sản phẩm) |

**Đề xuất bài viết cụ thể:**
- *"Bàn làm việc chân sắt hay chân gỗ: nên chọn loại nào cho văn phòng hiện đại? (bảng so sánh độ bền, giá, phong cách)"* — spoke #1, liên kết 2 chiều tới cả 2 danh mục chân sắt/chân gỗ

---

#### Cụm 4 — Cụm bàn làm việc nhóm theo số người (2 người 25 + 3 người 14 + 4 người 26 + 6 người 25 = 90 sản phẩm)

**Trang trụ cột:** `/danh-muc/cum-ban-lam-viec-4-nguoi` (đã có nội dung, tồn kho lớn nhất trong nhóm) — đề xuất nâng cấp thành **trang mẹ có bộ lọc số người** (2/3/4/6) thay vì 4 trang tách rời để tập trung sức mạnh liên kết, hoặc giữ 4 trang riêng nhưng liên kết chéo chặt (2/3/6 người hiện chưa có nội dung đầy đủ theo dữ liệu đầu bài).

| # | Từ khóa vệ tinh | Ý định | Cạnh tranh | Dạng trang đề xuất |
|---|---|---|---|---|
| 1 | cụm bàn làm việc 6 người giá bao nhiêu | MN | TB | Trang/spoke riêng cụm 6 người |
| 2 | cụm bàn làm việc 2 người có vách ngăn | MN | Thấp | Trang/spoke riêng cụm 2 người |
| 3 | cụm bàn làm việc 3 người góc chữ L | MN | Thấp | Trang/spoke riêng cụm 3 người |
| 4 | module bàn làm việc nhóm cho văn phòng open space | TH→MN | TB | Bài blog + link tới cả 4 spoke số người |
| 5 | cụm bàn làm việc có vách ngăn chống ồn | MN | Thấp | Lọc thuộc tính |
| 6 | bố trí cụm bàn làm việc cho văn phòng open space 20-50m² | TH | Thấp | Bài blog, nối sang Cụm 8 (B2B theo quy mô) |

**Đề xuất bài viết cụ thể:**
- *"Cụm bàn làm việc nhóm 2-3-4-6 người: chọn theo diện tích và số nhân sự (kèm sơ đồ bố trí mẫu)"* — pillar nội dung nối 4 danh mục con, đồng thời là spoke của Cụm 8 (B2B theo quy mô)

---

### TIER 2 — Làm tiếp theo (B2B, địa phương — độ cạnh tranh thấp nhất, phù hợp lợi thế thật của Ofina)

---

#### Cụm 5 — B2B: Setup / trang bị văn phòng trọn gói (cụm xuyên danh mục — hub liên kết tới mọi cụm sản phẩm)

**Trang trụ cột đề xuất:** nâng cấp trang dự án B2B hiện có (nếu đã tồn tại dạng `/bao-gia-b2b` theo cấu trúc nav được ghi nhận trong audit trước) thành **"Giải pháp nội thất trọn gói cho doanh nghiệp"** — hub tổng, liên kết bắt buộc tới toàn bộ pillar Tier 1.
**Lý do ưu tiên:** đối thủ đang thống trị nhóm từ khóa này là **công ty thiết kế-thi công nội thất** (bán dịch vụ, không có sẵn 2.673 sản phẩm với giá công khai), Ofina có lợi thế khác biệt hoá rõ ràng: bán sản phẩm có sẵn, giá minh bạch, giao lắp nhanh — điều các agency thiết kế không làm được.

| # | Từ khóa vệ tinh | Ý định | Cạnh tranh | Dạng trang đề xuất |
|---|---|---|---|---|
| 1 | setup văn phòng trọn gói giá bao nhiêu | MN | TB | Landing B2B hub |
| 2 | chi phí setup văn phòng 10 người / 20 người / 50 người | MN | TB | Bài blog theo quy mô (nối Cụm 9) |
| 3 | trang bị nội thất văn phòng cho công ty mới thành lập | TH→MN | TB | Bài blog checklist |
| 4 | mua sỉ bàn ghế văn phòng số lượng lớn, chiết khấu theo đơn | MN | TB | Trang chính sách B2B/chiết khấu sỉ riêng |
| 5 | báo giá nội thất văn phòng trọn gói theo m² | MN | Cao (agency thiết kế chiếm ưu thế) | Không ưu tiên landing riêng, chỉ nêu trong hub |
| 6 | nội thất văn phòng cho công ty luật / phòng khám / startup | MN | Thấp | Bài blog theo ngành nghề — ngách rất ít người làm |
| 7 | mua nội thất văn phòng trả góp 0% | MN | Thấp-TB | Trang chính sách trả góp (nếu Ofina có áp dụng) |

**Đề xuất bài viết cụ thể:**
- *"Trang bị nội thất văn phòng cho công ty mới thành lập: checklist đầy đủ theo ngân sách"* — spoke #3
- *"Setup văn phòng cho công ty luật, phòng khám, startup: gợi ý bộ nội thất theo đặc thù ngành"* — spoke #6

---

#### Cụm 6 — Địa phương Hà Nội (showroom Phú Đô, Nam Từ Liêm)

**Trang trụ cột:** `/showroom` (đã có, chứa cả 2 địa chỉ) — đề xuất tách thành `/showroom/ha-noi` để tối ưu riêng cho cụm từ khóa địa phương, có schema `LocalBusiness`/`FurnitureStore` + `geo` coordinates (theo phát hiện thiếu geo trong `local.md`).

| # | Từ khóa vệ tinh | Ý định | Cạnh tranh | Dạng trang đề xuất |
|---|---|---|---|---|
| 1 | nội thất văn phòng Nam Từ Liêm | ĐP/MN | Thấp | Nội dung riêng trong `/showroom/ha-noi` |
| 2 | showroom nội thất văn phòng gần Mỹ Đình / Phạm Hùng | ĐP | Thấp | Đoạn nội dung chỉ đường trong trang showroom |
| 3 | mua bàn ghế văn phòng quận Nam Từ Liêm | ĐP/MN | Thấp | Trang showroom + CTA đặt lịch xem trực tiếp |
| 4 | giao lắp đặt nội thất văn phòng nội thành Hà Nội trong ngày | MN | Thấp | Trang chính sách giao hàng, liên kết từ showroom |

**Lưu ý cạnh tranh:** TOZ (28A Phạm Hùng), BAYA, Nội Thất Ami, Erado, Xuân Hòa đều có mặt bằng cùng khu vực nhưng **chưa thấy ai tối ưu content riêng cho "Nam Từ Liêm"/"Phú Đô"** — đây là khoảng trống thật, độ cạnh tranh nội dung thấp dù cạnh tranh mặt bằng vật lý cao.

---

#### Cụm 7 — Địa phương TP.HCM (showroom Lương Định Của, Quận 2/Thủ Đức)

**Trang trụ cột:** tách `/showroom/tp-hcm` từ `/showroom` hiện có, cùng nguyên tắc schema như Cụm 6.

| # | Từ khóa vệ tinh | Ý định | Cạnh tranh | Dạng trang đề xuất |
|---|---|---|---|---|
| 1 | nội thất văn phòng Quận 2 | ĐP/MN | TB | Nội dung riêng trong `/showroom/tp-hcm` |
| 2 | nội thất văn phòng Thủ Đức | ĐP/MN | Thấp | Dùng chung trang, tối ưu cả 2 biến thể tên gọi |
| 3 | showroom nội thất văn phòng Lương Định Của | ĐP | Thấp | ⚠️ Đối thủ Hưng Phát Sài Gòn cùng phố (109 Lương Định Của) — ưu tiên GBP + review thật trước |
| 4 | mua bàn ghế văn phòng gần Phú Mỹ Hưng / An Khánh | ĐP/MN | Thấp | Đoạn nội dung chỉ đường trong trang showroom |

---

### TIER 3 — Làm sau (tồn kho nhỏ hơn hoặc nhu cầu B2B ngành hẹp, vẫn đáng làm vì cạnh tranh rất thấp)

---

#### Cụm 8 — Nội dung theo ngân sách & quy mô nhân sự (funnel nối Cụm 4 + Cụm 5)

**Trang trụ cột đề xuất:** bài blog trụ *"Setup văn phòng theo số người: từ 5 đến 50 nhân sự cần bao nhiêu tiền?"*

| # | Từ khóa vệ tinh | Ý định | Cạnh tranh | Dạng trang đề xuất |
|---|---|---|---|---|
| 1 | văn phòng 2 người diện tích nhỏ setup thế nào | TH | Thấp | Bài blog con |
| 2 | văn phòng 10 người chi phí nội thất bao nhiêu | MN | TB | Bài blog con |
| 3 | văn phòng 20 người diện tích/ngân sách cần bao nhiêu | MN | TB | Bài blog con |
| 4 | ngân sách nội thất văn phòng 50-100 triệu mua được gì | MN | Thấp | Bài blog dạng "mua được gì với X triệu" gắn tồn kho thật — **rất ít đối thủ làm dạng cụ thể này**, lợi thế lớn cho Ofina vì có sẵn giá công khai |
| 5 | ngân sách nội thất văn phòng 200 triệu setup được bao nhiêu chỗ | MN | Thấp | Bài blog con |

**Đề xuất bài viết cụ thể (ưu tiên làm 1 bài trụ + 2-3 bài con để test trước khi mở rộng hết):**
- *"Ngân sách 100 triệu setup được văn phòng bao nhiêu chỗ ngồi? (gợi ý combo sản phẩm thật từ Ofina)"*
- *"Setup văn phòng 10 người: chi phí thực tế và danh sách nội thất cần mua"*

---

#### Cụm 9 — Ghế chờ khách hàng theo ngành B2B (ghế phòng chờ 19 + ghế băng chờ 18 = 37 sản phẩm)

**Trang trụ cột:** danh mục ghế phòng chờ/ghế băng chờ — cần bổ sung nội dung đầy đủ (hiện chưa nằm trong 12 danh mục đã hoàn thiện).

| # | Từ khóa vệ tinh | Ý định | Cạnh tranh | Dạng trang đề xuất |
|---|---|---|---|---|
| 1 | ghế chờ ngân hàng tiêu chuẩn mấy chỗ | MN | Thấp | Nội dung pillar + bài blog ngành ngân hàng |
| 2 | ghế băng chờ bệnh viện phòng khám | MN | Thấp | Nội dung pillar theo ngành y tế |
| 3 | ghế chờ sân bay, công sở, khu hành chính công | MN | Thấp | Đoạn nội dung trong pillar |
| 4 | ghế băng chờ 2-3-4 chỗ giá rẻ | MN | TB | Lọc theo số chỗ trong danh mục |

---

#### Cụm 10 — Khu tiếp khách - lễ tân (sofa văn phòng 27 + bàn trà 17 = 44 sản phẩm)

**Trang trụ cột:** `/danh-muc/sofa-van-phong` (có trong tồn kho top-20 nhưng chưa xác nhận thuộc nhóm 12 danh mục đã hoàn thiện nội dung — cần bổ sung).
**Bàn trà (17 sản phẩm)** hiện chưa có trang riêng → làm spoke có trang, liên kết chặt với sofa văn phòng vì cùng bối cảnh sử dụng (sảnh lễ tân, phòng chờ VIP).

| # | Từ khóa vệ tinh | Ý định | Cạnh tranh | Dạng trang đề xuất |
|---|---|---|---|---|
| 1 | sofa văn phòng lễ tân giá rẻ dưới 5 triệu | MN | TB | Lọc theo giá trong danh mục |
| 2 | bộ sofa bàn trà tiếp khách văn phòng nhỏ | MN | Thấp | Trang/spoke bàn trà, bán combo sofa + bàn trà |
| 3 | bàn trà mặt kính chân sắt cho sảnh lễ tân | MN | Thấp | Trang bàn trà |
| 4 | bố trí khu tiếp khách văn phòng nhỏ | TH | Thấp | Bài blog ngắn, ảnh thật từ showroom |

---

#### Cụm 11 — Bàn cafe & ghế cafe chân sắt (33 + 36 = 69 sản phẩm, đã có nội dung)

**Trang trụ cột:** `/danh-muc/ban-cafe-gap-gon` hoặc danh mục bàn cafe chân sắt mặt gỗ/kính tương ứng (đã có nội dung, xác nhận URL thật tồn tại theo dạng `ban-cafe-*` trong sitemap).
**Góc độ khác biệt hoá quan trọng:** hầu hết đối thủ nhóm bàn/ghế cafe chân sắt nhắm vào **chủ quán cafe** (thị trường rất cạnh tranh giá) — Ofina có thể chiếm ngách ít người nhắm: **pantry nội bộ văn phòng** (khác đối tượng, ít cạnh tranh hơn).

| # | Từ khóa vệ tinh | Ý định | Cạnh tranh | Dạng trang đề xuất |
|---|---|---|---|---|
| 1 | bàn ghế cafe chân sắt cho quán cafe văn phòng mở (coworking) | MN | TB | Nội dung pillar |
| 2 | bàn cafe mặt kính hay mặt gỗ bền hơn, nên chọn loại nào | SS | Thấp | Bài blog ngắn |
| 3 | ghế cafe chân sắt giá rẻ dưới 300k/500k | MN | Cao (thị trường quán cafe cạnh tranh giá gắt) | Không ưu tiên, chỉ giữ trong lọc giá |
| 4 | bàn ghế pantry văn phòng chân sắt | MN | Thấp | **Bài blog + trang riêng — ngách khác biệt hoá, gần như chưa ai nhắm đúng đối tượng "văn phòng nội bộ"** |

---

#### Cụm 12 — Bàn training / phòng đào tạo (32 sản phẩm, đã có nội dung)

**Trang trụ cột:** `/danh-muc/ban-training` (đã có nội dung, xác nhận có sản phẩm thật `ban-training-tr-019at-ofn-btr-0033` trong catalog).

| # | Từ khóa vệ tinh | Ý định | Cạnh tranh | Dạng trang đề xuất |
|---|---|---|---|---|
| 1 | bàn training gấp gọn có bánh xe di chuyển | MN | Thấp | Nội dung pillar |
| 2 | bàn ghế phòng đào tạo trung tâm tiếng Anh / trung tâm dạy nghề | MN | Thấp | Bài blog theo ngành ngách |
| 3 | bàn training cho coworking space | MN | Thấp | Đoạn nội dung trong pillar |
| 4 | bàn training chữ U hay chữ I nên chọn kiểu nào | TH | Thấp | Bài blog ngắn |

---

#### Cụm 13 — Bàn giám đốc / bàn lãnh đạo chân sắt (48 + 27 = 75 sản phẩm, đã có nội dung cả 2)

**Trang trụ cột:** `/danh-muc/ban-giam-doc` (bàn lãnh đạo, tồn kho lớn hơn) + spoke chặt với `bàn giám đốc chân sắt`.

| # | Từ khóa vệ tinh | Ý định | Cạnh tranh | Dạng trang đề xuất |
|---|---|---|---|---|
| 1 | bàn giám đốc gỗ công nghiệp hiện đại | MN | TB | Nội dung pillar |
| 2 | bàn giám đốc chân sắt hay chân gỗ tự nhiên, nên chọn loại nào | SS | TB | Bài blog so sánh (dùng lại khung bài Cụm 3, đổi ngữ cảnh sang bàn giám đốc — **không copy nguyên**, xem Cảnh báo #1 để tránh lặp lỗi spin) |
| 3 | bàn giám đốc chữ L có kệ tài liệu | MN | Thấp | Lọc thuộc tính |
| 4 | kích thước bàn giám đốc chuẩn 1.8m-2.4m | TH | Thấp | Bảng kích thước trong pillar |
| 5 | bàn giám đốc hợp mệnh, hướng đặt theo phong thủy | TH | TB | **Trùng ý định với spoke #6 Cụm 1 (ghế giám đốc phong thủy) — gộp chung 1 bài "bàn ghế giám đốc phong thủy" duy nhất, KHÔNG viết 2 bài riêng để tránh cannibalization** |

---

## 4. Danh sách tổng hợp bài blog mới đề xuất (ưu tiên triển khai)

Thứ tự ưu tiên, giả định blog đã được dọn dẹp theo Cảnh báo #1:

| # | Tiêu đề đề xuất | Cụm | Ưu tiên |
|---|---|---|---|
| 1 | Cách chọn ghế giám đốc theo vóc dáng và vị trí lãnh đạo (kèm bảng tra kích thước) | 1 | Cao |
| 2 | Bàn làm việc chân sắt hay chân gỗ: nên chọn loại nào cho văn phòng hiện đại? | 3 | Cao |
| 3 | Kích thước bàn họp chuẩn cho phòng 6-30 người (bảng tra + gợi ý mẫu bàn) | 2 | Cao |
| 4 | Cụm bàn làm việc nhóm 2-3-4-6 người: chọn theo diện tích và số nhân sự | 4 | Cao |
| 5 | Bàn ghế giám đốc hợp mệnh 2026: hướng đặt, màu sắc theo phong thủy (gộp cả ghế + bàn, 1 bài duy nhất) | 1 + 13 | Cao |
| 6 | Trang bị nội thất văn phòng cho công ty mới thành lập: checklist theo ngân sách | 5 | TB |
| 7 | Ngân sách 100 triệu setup được văn phòng bao nhiêu chỗ ngồi? | 8 | TB |
| 8 | Setup văn phòng 10 người: chi phí thực tế và danh sách nội thất cần mua | 8 | TB |
| 9 | Setup văn phòng cho công ty luật, phòng khám, startup | 5 | TB |
| 10 | Bàn ghế pantry văn phòng chân sắt: giải pháp cho khu bếp nội bộ công ty | 11 | Thấp |

**Nguyên tắc bắt buộc khi viết (rút từ bài học Cảnh báo #1):** mỗi bài phải có dàn ý H2/H3 khác nhau thật sự (không dùng lại 1 khung rồi đổi từ), có ít nhất 1 bảng/dữ liệu đặc thù riêng (kích thước, giá, số lượng sản phẩm tồn kho thật), không đăng 2 bài cùng chủ đề trong cùng một ngày.

---

## 5. Nguyên tắc liên kết nội bộ (hub & spoke)

- **Bắt buộc 2 chiều:** mọi spoke (bài blog/spoke-category) → liên kết về đúng 1 pillar chính; pillar → liên kết xuống toàn bộ spoke thuộc cụm của nó.
- **Mỗi spoke cần ≥ 3 liên kết trỏ vào** (từ pillar, từ 1-2 spoke cùng cụm, và từ 1 spoke thuộc cụm B2B/quy mô có liên quan — ví dụ bài "cụm bàn 6 người" nên được trỏ từ cả pillar Cụm 4, bài "setup văn phòng 10 người" (Cụm 8), và bài B2B trọn gói (Cụm 5)).
- **Không để 2 trang cùng nhắm 1 từ khóa chính** — đã rà soát và đánh dấu 2 điểm rủi ro cannibalization thật sự trong Mục 3: (a) bàn họp chân sắt 59sp vs bàn họp lớn 36sp — phân biệt bằng "quy mô phòng họp" trong tiêu đề/H1; (b) phong thủy ghế giám đốc vs phong thủy bàn giám đốc — gộp thành 1 bài duy nhất thay vì 2 bài riêng.
- **Liên kết chéo cụm (optional/tuỳ chọn):** Cụm 5 (B2B) nên xuất hiện như một khối CTA chuẩn ("Cần setup cả phòng? Xem gói trọn bộ") ở cuối mọi trang pillar Tier 1, không chỉ liên kết văn bản trong bài.
- **Liên kết tới Cụm 6/7 (địa phương):** nên xuất hiện dạng banner/CTA "Đặt lịch xem trực tiếp tại showroom [Hà Nội/TP.HCM]" ở mọi trang pillar sản phẩm, không cần liên kết văn bản riêng trong từng bài blog.

---

## 6. Bảng kiểm trước khi triển khai (dựa theo checklist chuẩn của quy trình cluster)

- [x] Không có 2 bài trong danh sách đề xuất Mục 4 trùng từ khóa chính (đã gộp bài phong thủy ghế + bàn giám đốc thành 1)
- [x] Mỗi spoke có kế hoạch ≥ 3 liên kết trỏ vào (nêu ở Mục 5)
- [x] Mỗi spoke có liên kết bắt buộc về đúng 1 pillar
- [x] Mỗi pillar có liên kết bắt buộc xuống toàn bộ spoke của nó
- [ ] **Chưa thể xác nhận "không có trang mồ côi"** vì không có quyền truy cập toàn bộ 95 URL `/danh-muc/*` + 13 URL `/bo-suu-tap/*` thật trong phiên này — cần đối chiếu danh sách đầy đủ (đã có sẵn trong `sitemap.md`/`ecommerce.md`) trước khi publish để đảm bảo mọi pillar/spoke đề xuất đều trỏ tới URL còn sống, đúng slug.
- [ ] **Chưa sửa lỗi canonical phân trang** (Cảnh báo #2) — cần vá trước khi thêm trang lọc mới (ví dụ lọc cụm bàn theo số người).
- [ ] **Chưa dọn dẹp 14 bài blog trùng lặp** (Cảnh báo #1) — cần hoàn thành trước khi đăng bài mới nào trong Mục 4, nếu không nguy cơ site tiếp tục bị đánh giá là "scaled content abuse" sẽ tăng thêm.

---

## 7. Việc cần làm tiếp

1. Đối chiếu số liệu tồn kho trong báo cáo này với dashboard quản trị thật (phát hiện lệch giữa 66 vs 90 sản phẩm cho `bàn làm việc chân sắt` cần làm rõ nguồn nào đúng tại thời điểm publish).
2. Lấy dữ liệu volume/CPC thật từ Google Search Console (ofina.vn đã verified theo `reference_doanhnghiep_gsc` cho dự án khác — kiểm tra xem ofina.vn đã verify GSC chưa) hoặc Ahrefs/Keyword Planner để thay thế phần ước lượng định tính ở Mục 3 bằng số liệu thật trước khi phân bổ ngân sách content lớn.
3. Xác nhận đầy đủ 95 slug `/danh-muc/*` và 13 slug `/bo-suu-tap/*` thật (có sẵn trong `docs/seo-audit/sitemap.md`) để map chính xác 1-1 với từng cụm trước khi giao cho đội content.
4. Ưu tiên xử lý 3 cảnh báo ở Mục 1 trước khi bất kỳ bài viết nào trong Mục 4 được xuất bản.
