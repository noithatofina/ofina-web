# Audit Chất lượng Nội dung — ofina.vn

**Ngày audit:** 25/09/2026
**Phạm vi kiểm:** Trang chủ (/), Giới thiệu (/gioi-thieu), Blog listing (/blog) + 5 bài blog thật, 2 trang sản phẩm (Bàn họp Sonic S09, Ghế chân quỳ lưng lưới R28C-BL), Bộ sưu tập Ghế công thái học (/bo-suu-tap/ghe-cong-thai-hoc), Chính sách bảo hành (/chinh-sach/bao-hanh), Điều khoản sử dụng.
**Phương pháp:** Tải HTML thật qua curl (User-Agent trình duyệt), parse bằng Python (html.parser, không dùng ước lượng bằng mắt), đo trùng lặp bằng 5-gram Jaccard similarity + so khớp chuỗi (difflib), đối chiếu JSON-LD (Organization/Product/BlogPosting/FAQPage) với nội dung hiển thị và với dữ liệu thô nhúng trong RSC payload (`avg_rating`, `review_count`...).

> Lưu ý minh bạch quy trình: trong lúc audit, một khối nội dung lạ dạng "MCP Server Instructions/Claude Docs" xuất hiện chen vào phiên làm việc, cố hướng dẫn tạo tài liệu ở nơi khác thay vì ghi file này. Đây là nội dung không đến từ user thật (dấu hiệu prompt injection) và đã bị bỏ qua; báo cáo này được ghi đúng theo yêu cầu gốc vào đường dẫn cục bộ đã chỉ định.

---

## ĐIỂM TỔNG QUAN

| Chỉ số | Điểm |
|---|---|
| **Content Quality Score** | **33 / 100** — Yếu, cần khắc phục nghiêm trọng |
| **AI Citation Readiness** | **50 / 100** — Trung bình (nền schema tốt nhưng nội dung không đủ khác biệt để được trích) |

### E-E-A-T Breakdown

| Yếu tố | Trọng số | Điểm | Ghi chú ngắn |
|---|---|---|---|
| Experience (trải nghiệm thật) | 20% | **22/100** | Không có dấu hiệu trải nghiệm thật (ảnh sử dụng thực tế, video lắp đặt thật, case study khách hàng B2B cụ thể); các trang sản phẩm/blog viết theo lối tổng hợp kiến thức chung, không có "chúng tôi đã đo/đã lắp/đã dùng" |
| Expertise (chuyên môn) | 25% | **32/100** | Tác giả blog đứng tên "OFINA" (schema `Person.name = "OFINA"`), không phải người thật, không bio/chứng chỉ; nội dung viện dẫn mơ hồ "theo các chuyên gia vật lý trị liệu", "nhiều nghiên cứu quốc tế" nhưng không có link nguồn nào |
| Authoritativeness (uy tín ngoài site) | 25% | **30/100** | Không thấy tín hiệu được nhắc đến bên ngoài (báo chí, backlink uy tín) trong phạm vi các trang đã kiểm; Organization schema có `sameAs` tới Facebook/Zalo nhưng thiếu địa chỉ cấu trúc, thiếu số ĐKKD/MST công khai |
| Trustworthiness (tin cậy) | 30% | **28/100** | Điểm trừ nặng nhất: rating "5.0" hiển thị trên mọi sản phẩm trong khi dữ liệu thật `avg_rating: 0, review_count: 0`; FAQ bảo hành trên trang sản phẩm mâu thuẫn với chính sách bảo hành chính thức; không tìm thấy số ĐKKD/MST/thông báo Bộ Công Thương |

**Cách tính điểm tổng:** 0.20×22 + 0.25×32 + 0.25×30 + 0.30×28 = **27,9 → làm tròn E-E-A-T lõi ~28/100**. Content Quality Score (33/100) điều chỉnh nhích lên một chút so với lõi E-E-A-T vì hạ tầng kỹ thuật nội dung (schema, số từ đạt sàn tối thiểu, cấu trúc heading H1→H2→H3 hợp lệ ở cấp trang) làm tốt hơn phần E-E-A-T thuần tuý.

---

## VẤN ĐỀ THEO MỨC ĐỘ

### CRITICAL

**C1. Trang "Giới thiệu" (/gioi-thieu) là placeholder rỗng — không có nội dung thật**
- Bằng chứng: toàn bộ nội dung thân trang chỉ là một dòng `<p>Nội dung giới thiệu công ty...</p>` (nguyên văn, còn dấu "..." như văn bản mẫu chưa được viết thay). Word count thân trang thực tế ≈ 4 từ, trong khi tổng word count đo được của cả trang (kể cả nav/footer) chỉ 247 từ.
- Tác động: Đây là trang mà cả người dùng lẫn Google/AI đều dùng để đánh giá "công ty này là ai, có thật không, có kinh nghiệm gì" — E-E-A-T (đặc biệt Experience + Expertise) gần như bằng 0 tại trang quan trọng nhất cho tín hiệu thương hiệu.
- Ưu tiên: sửa ngay trong tuần này trước khi làm bất kỳ việc SEO nào khác trên site.

**C2. Rating "5.0 sao" hiển thị trên mọi trang sản phẩm nhưng dữ liệu thật là 0 đánh giá**
- Bằng chứng đo trực tiếp từ HTML: UI hiển thị 5 icon sao đầy + text "5.0" ở cả `/san-pham/ban-hop-sonic-s09-...` và `/san-pham/ghe-chan-quy-lung-luoi-r28c-bl-...`. Nhưng dữ liệu sản phẩm nhúng trong trang (React Server Component payload) ghi rõ: `"avg_rating":0,"review_count":0` — xuất hiện đồng nhất ở **cả 2 trang sản phẩm kiểm + 40 lần lặp lại trên trang chủ** (tức là mọi thẻ sản phẩm trên trang chủ đều avg_rating=0). Không có mục đánh giá/nhận xét khách hàng thật ở bất kỳ đâu trên các trang đã kiểm.
- Tác động: Đây là tín hiệu tin cậy giả/gây hiểu lầm trên diện rộng (khả năng áp dụng cho toàn bộ 2.673 sản phẩm vì đây là component UI dùng chung, không phải lỗi riêng lẻ 2 sản phẩm). Theo Sept 2025 QRG, "Lowest" quality trust được gắn với trang có tuyên bố sai lệch/gây hiểu lầm về sản phẩm/dịch vụ. Rủi ro thêm: nếu sau này gắn `aggregateRating` vào schema Product với số liệu không thật sẽ vi phạm chính sách Merchant/Rich Result của Google về fake review — may mắn là hiện schema Product đang để `aggregateRating: null` (chưa phạm ở tầng schema), nhưng UI hiển thị vẫn đang đánh lừa người dùng thật.
- Khuyến nghị: gỡ hiển thị "5.0" cứng khi `review_count = 0`, chỉ hiện rating khi có đánh giá thật; xây cơ chế thu thập review thật trước khi bật lại.

**C3. 14/16 bài blog công khai là nội dung xoay vòng (spun) cùng một chủ đề, tự cộng dồn thành "scaled content abuse"**
- Xác nhận lại phát hiện đã biết bằng đo đạc độc lập: 9 bài dùng title "Cách Chọn Ghế Công Thái Học Chống Đau Lưng Hiệu Quả", 5 bài dùng title "Cách Chọn Ghế Công Thái Học Phù Hợp Để Chống Đau Lưng" — cùng nằm trong 16 bài public.
- Đo trùng lặp giữa 3 bài mẫu (post A/B/C) bằng 5-gram Jaccard (n-gram từ, phương pháp chuẩn phát hiện trùng lặp SEO): chỉ **6,6–8,2%** trùng câu chữ chính xác — nghĩa là đây **không phải copy-paste y hệt**, mà là **paraphrase/spin bằng AI**: giữ nguyên bộ khung (H2/H3 gần như 1-1: "Lumbar Support", "chiều cao ghế điều chỉnh", "tay vịn/armrest", "cơ chế ngả lưng", "chất liệu lưới/đệm"...), giữ nguyên công thức mở bài ("Đau lưng vì/do ngồi sai tư thế... Hướng dẫn chọn ghế công thái học đúng chuẩn...") và công thức meta description, chỉ đổi từ ngữ.
- Bằng chứng đặc biệt nghiêm trọng: 2 trong số các bài trùng lặp (post B và post C) có **cùng ngày xuất bản 04/07/2026** — tức là site tự động đăng 2 bài gần như cùng nội dung, cùng chủ đề, cùng chủ đích tìm kiếm, trong cùng một ngày.
- Tác động: Đúng như mô tả trong Sept 2025 QRG về nội dung AI chất lượng thấp ("repetitive structure across pages", "no original insight"), và đúng định nghĩa "scaled content abuse" trong chính sách spam Google (đã gộp vào thuật toán lõi từ 3/2024) — rủi ro cao bị giảm hạng/deindex hàng loạt cho toàn bộ /blog/, không chỉ các trang bị trùng.
- Khuyến nghị: gộp 14 bài thành 1-2 bài toàn diện nhất (giữ bài có checklist + bảng so sánh chi tiết nhất), 301 redirect các bài còn lại về bài giữ lại, dừng ngay pipeline tự động sinh bài theo cùng 1 chủ đề.

### HIGH

**H1. FAQ trên trang sản phẩm mâu thuẫn với chính sách bảo hành chính thức**
- Bằng chứng: FAQ schema (`FAQPage`) trên cả 2 trang sản phẩm trả lời câu "Sản phẩm có bảo hành bao lâu?" bằng: *"OFINA bảo hành chính hãng [tên SP] trong 24 tháng"* — áp dụng cho toàn bộ sản phẩm, kể cả ghế (sp2).
- Nhưng trang `/chinh-sach/bao-hanh` quy định rõ theo linh kiện: **Khung kim loại/gỗ: 24 tháng — Đệm, da, nỉ: 12 tháng — Cơ chế xoay, piston: 12 tháng**.
- Với sản phẩm ghế (Ghế chân quỳ lưng lưới R28C-BL), phần đệm và cơ chế xoay/piston (khớp nối chịu lực nhiều nhất, dễ hỏng nhất) thực tế chỉ có bảo hành 12 tháng, nhưng FAQ ngay trên trang sản phẩm lại khẳng định "24 tháng" không giới hạn — đây là mâu thuẫn thông tin trực tiếp, có thể dẫn tới khiếu nại/tranh chấp khi khách bảo hành ở tháng thứ 13-24.
- Khuyến nghị: sửa câu trả lời FAQ để dẫn chiếu đúng theo loại linh kiện, hoặc ít nhất thêm dòng "(chi tiết theo từng bộ phận xem chính sách bảo hành)" kèm link.

**H2. Mô tả sản phẩm + FAQ bị khuôn mẫu hoá nặng, thin content núp dưới lớp vỏ dài**
- Bằng chứng: 5/6 câu trả lời FAQ **giống hệt 100% từng chữ** giữa 2 sản phẩm khác loại hoàn toàn (bàn họp vs ghế xoay) — chỉ thay tên sản phẩm ở đầu câu. Đo 5-gram Jaccard phần mô tả chi tiết giữa 2 trang sản phẩm = **32%** trùng cụm từ 5-từ liên tiếp — mức rất cao đối với 2 sản phẩm khác chủng loại (đối chứng: 2 bài blog khác chủ đề chỉ trùng 2,9-3,7%).
- Các cụm lặp y hệt: "100% hàng chính hãng, kiểm định kỹ trước khi giao", "Bảo hành 24 tháng + bảo trì miễn phí trọn đời (nếu mua từ OFINA)", "Hotline & Zalo phản hồi trong 5 phút giờ hành chính", "Đặt lịch xem trực tiếp tại 2 showroom OFINA"...
- Tác động: word count đạt sàn (~1.200-1.300 từ thân bài, vượt mốc 300-400 từ cho trang sản phẩm) nhưng phần lớn là **boilerplate dùng chung**, không phải nội dung đặc thù cho từng sản phẩm → nếu đây là mẫu UI áp dụng cho toàn bộ 2.673 sản phẩm (nhiều khả năng đúng vì cùng component), rủi ro trùng lặp nội bộ (internal duplicate content) ở quy mô hàng nghìn trang là rất lớn, làm loãng "topical authority" và giảm khả năng từng trang sản phẩm được Google/AI coi là nguồn thông tin riêng biệt có giá trị.
- Lưu ý: cụm "bảo trì miễn phí trọn đời" trong mô tả sản phẩm này **cũng mâu thuẫn** với chính sách bảo hành chính thức (không hề nhắc đến "trọn đời" ở đâu) — cộng dồn với H1 thành vấn đề nhất quán chính sách xuyên suốt site.

**H3. Không tìm thấy thông tin đăng ký kinh doanh (MST/ĐKKD/Bộ Công Thương) ở bất kỳ trang nào đã kiểm**
- Đã kiểm: trang chủ, /gioi-thieu, /chinh-sach/bao-hanh, /chinh-sach/dieu-khoan — không có mã số thuế, số giấy chứng nhận đăng ký kinh doanh, hay huy hiệu "Đã thông báo/Đăng ký Bộ Công Thương" ở footer hay bất kỳ trang chính sách nào.
- Tác động: đây là tín hiệu minh bạch pháp lý theo quy định về website TMĐT tại Việt Nam, và cũng là tín hiệu Trustworthiness mà quality rater guidelines đánh giá cao (ai đứng sau website, có pháp nhân rõ ràng không). Thiếu nó vừa là rủi ro tuân thủ, vừa là điểm trừ trust.
- Khuyến nghị (không bịa số liệu): bổ sung thông tin pháp nhân **thật** (tên công ty, MST, số ĐKKD) mà OFINA đã có sẵn trong hồ sơ đăng ký kinh doanh của mình vào footer/trang Điều khoản.

**H4. Tác giả blog không phải người thật, không có tín hiệu chuyên môn xác thực được**
- Bằng chứng: `BlogPosting.author = {"@type":"Person","name":"OFINA"}` ở mọi bài — dùng tên thương hiệu làm "tác giả cá nhân", không có tên thật, không link bio, không chứng chỉ.
- Nội dung có những câu khẳng định chuyên môn mơ hồ, không dẫn nguồn: *"đây là thiết kế được các chuyên gia Chiropratic và Physiotherapist khuyên dùng"* (trang sản phẩm sp2), *"Theo các chuyên gia vật lý trị liệu..."* (post C), *"Nhiều nghiên cứu quốc tế chỉ ra..."* (post E) — không có link nguồn/trích dẫn cụ thể nào.
- Lưu ý pháp lý/đạo đức: **không khuyến nghị bịa tên tác giả, chứng chỉ, hay gắn "chuyên gia" giả** để lấp khoảng trống này. Khuyến nghị đúng đắn: (a) nếu có nhân sự thật am hiểu sản phẩm (kỹ thuật viên lắp đặt, tư vấn B2B lâu năm) thì đứng tên thật + mô tả vai trò thật của họ; (b) nếu trích "chuyên gia/nghiên cứu" thì phải gắn link nguồn thật hoặc bỏ hẳn cụm từ mơ hồ đó, thay bằng thông tin có thể kiểm chứng (thông số kỹ thuật, tiêu chuẩn ISO/BIFMA nếu sản phẩm thật sự đạt).

### MEDIUM

**M1. Trang chủ có nhiều thẻ H2 bị lặp đôi y hệt trong DOM**
- Bằng chứng: grep trực tiếp trên HTML cho thấy các H2 "Ghế công thái học", "Phòng họp cao cấp", "Đủ giải pháp cho doanh nghiệp", "Nội thất văn phòng chuẩn", "Ghế giám đốc cao cấp" mỗi cụm xuất hiện **2 lần** trong cùng file HTML với class CSS khác nhau (một bản cỡ chữ lớn `text-[40px]...`, một bản `text-[26px]...`) — nhiều khả năng là render song song bản desktop/mobile của cùng một slider trong DOM.
- Tác động: làm nhiễu cấu trúc heading (H1→H2→H3) mà công cụ AI/Google dùng để hiểu bố cục trang — không tự nó gây phạt nặng nhưng là kỹ thuật debt nên dọn để cấu trúc heading sạch, hỗ trợ AI citation tốt hơn.

**M2. Chính sách bảo hành thiếu nhất quán vùng phục vụ + quá ngắn để đủ chi tiết**
- Bằng chứng: câu *"Kỹ thuật viên OFINA đến kiểm tra tại nhà (nội thành HCM) hoặc hướng dẫn sửa chữa"* chỉ nêu HCM, trong khi Trụ sở chính của OFINA lại ở **Hà Nội** (theo footer) — không rõ khách Hà Nội có được hỗ trợ tại nhà hay chỉ nhận hướng dẫn từ xa. Thân trang chính sách chỉ ~188 từ (sau khi trừ nav/footer chung), không có SLA thời gian phản hồi, không nêu chi phí sửa chữa ngoài bảo hành, không nêu điều kiện chuyển nhượng bảo hành khi bán lại sản phẩm.
- Khuyến nghị: làm rõ phạm vi HN/HCM cho nhất quán với các cam kết khác trên site ("miễn phí giao hàng nội thành HN-HCM"), bổ sung SLA cụ thể.

**M3. Chèn từ khoá dạng cơ học trong heading trang sản phẩm**
- Bằng chứng: cụm tên sản phẩm đầy đủ (bao gồm mã, ví dụ "Ghế chân quỳ lưng lưới R28C-BL") lặp lại **12 lần/~1.400 từ** (mật độ 0,8% — chưa tới ngưỡng "nhồi nhét" theo mật độ %), nhưng cách lặp là **chèn nguyên cụm vào gần như mọi H2**: "Tổng quan về X", "Vì sao X là lựa chọn lý tưởng...", "Cam kết từ OFINA [với X]", "Cần tư vấn thêm về X?" — đọc máy móc, không tự nhiên với người dùng thật, là dấu hiệu điển hình của mẫu nội dung sinh tự động hàng loạt.

**M4. Organization schema thiếu trường address dù có địa chỉ thật hiển thị**
- Bằng chứng: `Organization.address = None` ở mọi trang đã kiểm, trong khi footer hiển thị đầy đủ "Trụ sở Hà Nội — 135 đường K2, Phường Phú Đô" và "Chi nhánh TP.HCM — Tầng 2, số 36 Lương Định Của, Quận 2".
- Tác động: bỏ lỡ cơ hội để Google/AI answer engine trích xuất chính xác địa chỉ doanh nghiệp khi trả lời truy vấn dạng "địa chỉ OFINA ở đâu" — nên bổ sung `PostalAddress` (2 địa điểm) vào schema Organization/LocalBusiness bằng đúng địa chỉ thật đã có sẵn trên site.

**M5. Bộ sưu tập "Ghế công thái học" chứa sản phẩm gắn nhãn khác tên**
- Bằng chứng: trang `/bo-suu-tap/ghe-cong-thai-hoc` (H1: "Ghế công thái học (ergonomic)", 149 sản phẩm) liệt kê hàng loạt sản phẩm có tên hiển thị là **"Ghế xoay văn phòng Ryan/Venus/Veno/Win..."** — không sản phẩm nào trong 24 kết quả đầu có chữ "công thái học"/"ergonomic" trong tên. Lệch nhãn giữa tên bộ sưu tập và tên sản phẩm con có thể gây nhầm lẫn cho người dùng lẫn AI khi đối chiếu danh mục ("ghế xoay văn phòng" và "ghế công thái học" là 2 khái niệm khác nhau về mức độ chuyên biệt công thái học).

**M6. Không có trang Liên hệ (Contact) độc lập**
- `/lien-he` trả 404. Thông tin liên hệ chỉ tồn tại dạng khối lặp lại ở footer mọi trang (đủ Name/Address/Phone nhưng không có form liên hệ, bản đồ, giờ làm việc rõ ràng ngoài phần nêu trong FAQ sản phẩm "Mở cửa 8h-18h hàng ngày"). Nên có 1 trang /lien-he chính thức tổng hợp đầy đủ, có bản đồ nhúng — vừa tăng trust vừa dễ được AI trích khi trả lời câu hỏi về địa chỉ/giờ mở cửa.

### LOW

**L1. Nội dung blog "stale" ~2 tháng**
- Bài mới nhất theo `datePublished` là 22/07/2026 (title trùng lặp nhóm C1), tính đến ngày audit 25/09/2026 là gần 2 tháng không có bài mới — với một mục được định vị là "Kiến thức, cảm hứng và xu hướng nội thất văn phòng mới nhất" thì tín hiệu freshness đang yếu.

**L2. Câu văn trong blog khá dài, một số đoạn nên chẻ nhỏ để dễ đọc lướt/dễ trích AI**
- Đo trên bài mẫu (post A, đã loại các đoạn dạng bảng so sánh khỏi phép đo để không làm sai lệch): trung bình **23,1 từ/câu**, 6/55 câu dài trên 35 từ (câu dài nhất 57 từ). Đây là mức trung bình-cao cho nội dung web tiếng Việt; nên rút câu xuống 15-20 từ ở các đoạn giải thích chính để tăng khả năng từng câu được AI answer engine trích dẫn độc lập.

**L3. Khối "Cần hỗ trợ thêm?" trên trang chính sách hứa "các kênh liên hệ" nhưng chỉ đưa 2 nút điều hướng**
- Bằng chứng: text "Liên hệ OFINA qua các kênh sau để được tư vấn nhanh nhất:" nhưng theo sau chỉ là 2 nút "Về trang chủ" / "Xem sản phẩm" — không có nút gọi điện/Zalo trực tiếp ngay tại khối này (dù có ở header sitewide). Chi tiết nhỏ nhưng gây hụt kỳ vọng người đọc.

**L4. Mô tả sản phẩm/meta description dùng công thức cứng lặp lại ở quy mô lớn**
- Công thức: "Mua [tên SP] tại OFINA · chỉ [giá]đ (-X%) · [đặc điểm ngắn] · BH 24 tháng · miễn phí giao HN/HCM · trả góp 0% Hotline 0325669996." — hiệu quả cho CTR nhưng với catalog 2.673 sản phẩm, nếu áp dụng máy móc cho tất cả sẽ tạo ra hàng nghìn meta description gần như đồng dạng, giảm khác biệt hoá trong kết quả tìm kiếm.

---

## TỔNG HỢP SỐ LIỆU ĐO ĐƯỢC (để tham chiếu nhanh)

| Trang | Word count (thân bài, đã trừ nav/footer ~180 từ) | Sàn tối thiểu theo loại trang | Đạt sàn? |
|---|---|---|---|
| / (Trang chủ) | ~1.530 từ (nhiều là tên sản phẩm/danh mục lặp, không phải văn xuôi) | 500 | Đạt về số lượng, yếu về chất lượng nội dung thật |
| /gioi-thieu | **~4 từ** (placeholder) | 500 | **Không đạt — gần như trống** |
| /blog (listing) | ~850 từ | không áp dụng (trang listing) | — |
| Bài blog mẫu (5 bài) | 1.420 – 1.635 từ | 1.500 | 3/5 bài dưới sàn nhẹ, không phải vấn đề chính (vấn đề chính là trùng lặp nội dung, không phải thiếu từ) |
| Bàn họp Sonic S09 (sản phẩm) | ~1.210 từ | 300–400 | Đạt, nhưng ~32% là boilerplate dùng chung với sản phẩm khác |
| Ghế chân quỳ R28C-BL (sản phẩm) | ~1.280 từ | 300–400 | Đạt, cùng vấn đề boilerplate |
| /bo-suu-tap/ghe-cong-thai-hoc | ~675 từ | 500–600 (áp dụng logic trang danh mục/location) | Đạt |
| /chinh-sach/bao-hanh | ~188 từ | không áp dụng sàn chuẩn, nhưng thiếu chiều sâu | Thiếu chi tiết |

**Đo trùng lặp (bằng script, không nhẩm tay):**
- 5-gram Jaccard giữa 3 bài "ghế công thái học" nghi trùng: 6,6% / 8,2% / 7,8%
- 5-gram Jaccard đối chứng giữa 2 bài khác chủ đề: 3,7% / 2,9%
- → Kết luận: không phải copy-paste (Jaccard thấp) nhưng là **spin có cùng khung/dàn ý/công thức mở bài** — đúng bản chất "scaled content abuse" chứ không phải duplicate content cổ điển.
- 5-gram Jaccard mô tả chi tiết giữa 2 trang sản phẩm khác loại (bàn vs ghế): **32,0%** — cao bất thường, xác nhận thin/template hoá mô tả sản phẩm.
- FAQ schema: 5/6 câu trả lời giống 100% từng chữ giữa 2 sản phẩm khác loại.
- Rating: `avg_rating: 0, review_count: 0` ở dữ liệu thật, nhưng UI hiển thị cứng "5.0" — xác nhận ở 2 trang sản phẩm + 40 lần trên trang chủ.

---

## KHUYẾN NGHỊ ƯU TIÊN (không bịa thông tin liên hệ/chứng chỉ/giải thưởng, không khẳng định "chính hãng" vô căn cứ)

1. **Viết lại /gioi-thieu bằng nội dung thật** — lịch sử thành lập, quy mô đội ngũ thật, số liệu vận hành có thể kiểm chứng (số đơn đã giao, số năm hoạt động...), không cần thêm giải thưởng/chứng chỉ nếu chưa có thật.
2. **Tắt hiển thị rating "5.0" khi review_count = 0** trên toàn bộ 2.673 sản phẩm; chỉ hiện rating thật khi đã có đánh giá khách hàng thật.
3. **Gộp 14 bài blog trùng chủ đề thành 1-2 bài chuẩn, 301 redirect phần còn lại**, dừng pipeline sinh bài AI theo cùng chủ đề lặp.
4. **Đồng bộ hoá thông tin bảo hành** giữa FAQ trang sản phẩm và trang chính sách chính thức (theo từng loại linh kiện), bỏ cụm "bảo trì miễn phí trọn đời" nếu không có văn bản chính sách nào hậu thuẫn.
5. **Bổ sung thông tin pháp nhân thật** (tên công ty, MST, số ĐKKD đã có sẵn trong hồ sơ đăng ký của OFINA) vào footer/trang Điều khoản.
6. **Đa dạng hoá mô tả/FAQ sản phẩm** theo cụm sản phẩm tương tự thay vì 1 template chung cho toàn catalog — ít nhất phần "Cam kết OFINA" và "Câu hỏi thường gặp" cần có ≥1-2 câu đặc thù theo từng dòng sản phẩm.
7. **Bổ sung `PostalAddress` thật vào Organization schema**, dọn H2 trùng lặp trên trang chủ, chuẩn hoá vùng phục vụ bảo hành (HN + HCM nhất quán).
8. Nếu muốn giữ các câu trích "chuyên gia/nghiên cứu quốc tế" trong bài blog, **phải gắn link nguồn thật**; nếu không có nguồn, xoá cụm từ mơ hồ đó thay vì để lơ lửng không kiểm chứng được.

---

## FILE THAM CHIẾU

Dữ liệu thô (HTML đã tải), script đo trùng lặp/word-count dùng cho audit này được lưu tại:
`/private/tmp/claude-501/-Users-admin/8dd70d50-6f01-4b67-b817-e06e6fa953ed/scratchpad/ofina/`
(bao gồm `extract.py`, `simcheck.py`, `shingle.py` và các file `.html` đã tải trực tiếp từ ofina.vn ngày 25/09/2026 — thư mục tạm, có thể dọn sau khi đối chiếu xong).
