# GEO / AI Search Readiness — ofina.vn (quét 25/09/2026)

Phương pháp: fetch trực tiếp `https://ofina.vn` bằng curl với User-Agent thật của GPTBot, ClaudeBot, PerplexityBot, OAI-SearchBot, trình duyệt thường và không có UA; đọc source code route `llms.txt`/`robots.ts` tại `/Users/admin/ofina-web`; parse HTML thật (không suy đoán) để đếm heading, JSON-LD, độ dài văn bản. Không có DataForSEO/Tavily MCP trong phiên này nên **không** có số liệu "đã được ChatGPT/AI Overview trích dẫn bao nhiêu lần" — phần "điểm theo nền tảng" ở cuối là suy luận có căn cứ kỹ thuật, không phải đo trực tiếp, ghi rõ để tránh nhầm là số đo thật.

Giới hạn đã gặp: mọi nỗ lực tra brand mention qua Google/Bing/DuckDuckGo bằng WebFetch đều bị chặn (Google trả lỗi, Bing trả kết quả cache sai chủ đề, DuckDuckGo yêu cầu CAPTCHA "chọn ô có con vịt"), Facebook/YouTube search cũng không lấy được nội dung thật vì cần JS. Phần "hiện diện ngoài site" dưới đây vì vậy tách bạch rõ: cái gì xác minh được từ chính site/code (chắc chắn) vs cái gì không kiểm chứng được (cần làm lại bằng công cụ tra cứu thật, không suy diễn).

## Điểm AI Search Readiness tổng: 56/100

| Dimension | Trọng số | Điểm | Ghi chú |
|---|---|---|---|
| Citability (trích dẫn được) | 25% | 50/100 | Trang sản phẩm rất tốt (FAQPage trực tiếp), nhưng trang Giới thiệu gần như rỗng và 87,5% blog là nội dung lặp |
| Structural Readability (cấu trúc heading) | 20% | 60/100 | H1/H2/H3 tốt ở sản phẩm & blog, hỏng ở trang Giới thiệu |
| Multi-Modal Content | 15% | 40/100 | Có ảnh sản phẩm webp, có 1-2 bảng so sánh trong blog; không video, không infographic |
| Authority & Brand Signals | 20% | 35/100 | Có Facebook + Organization/FurnitureStore schema; không YouTube thật, không Wikipedia, tác giả blog là schema giả (Person nhưng điền tên brand) |
| Technical Accessibility | 20% | 90/100 | SSR đầy đủ, không bot nào bị chặn ở tầng CDN/Vercel, robots.txt allow rõ ràng |

Công thức: 0,25×50 + 0,20×60 + 0,15×40 + 0,20×35 + 0,20×90 = **55,5 ≈ 56/100**.

Diễn giải: hạ tầng kỹ thuật (SSR, robots.txt, llms.txt) đã làm đúng gần như mẫu mực — đây là phần khó nhất mà nhiều site còn chưa làm. Nhưng điểm tổng bị kéo xuống mức trung bình vì hai lỗi nội dung nghiêm trọng (trang Giới thiệu rỗng, blog lặp nội dung hàng loạt) và thiếu tín hiệu thương hiệu ngoài site.

---

## 1. Trạng thái truy cập của AI Crawler (đã test thật, không suy đoán)

Test bằng `curl -A "<UA thật>" https://ofina.vn/...`, so sánh status code + kích thước byte trả về với UA trình duyệt thường:

| Crawler | UA test | Kết quả | Ghi chú |
|---|---|---|---|
| GPTBot | `GPTBot/1.1 (+https://openai.com/gptbot)` | 200, nội dung đầy đủ | trên `/gioi-thieu`, 42.164 byte |
| OAI-SearchBot | `OAI-SearchBot/1.0` | 200, 747.939 byte (=đúng bằng browser) | trang chủ |
| ClaudeBot | `ClaudeBot/1.0 (+anthropic.com/bot.html)` | 200, 747.939 byte (=đúng bằng browser) | trang chủ |
| PerplexityBot | `PerplexityBot/1.0` | 200, 747.939 byte (=đúng bằng browser) | trang chủ |
| Trình duyệt thường | Chrome UA | 200, 747.939 byte | baseline |
| Không có UA | rỗng | 200, 747.939 byte | baseline |

- Không phát hiện trang thách đố Cloudflare ("Just a moment", `cf-challenge`) ở bất kỳ UA nào.
- Header trả về: `server: Vercel`, `x-nextjs-prerender: 1`, `x-vercel-cache: HIT` → xác nhận **SSR/prerender thật**, không phải shell rỗng chờ JS (CSR). Trích văn bản thấy được trong `<body>` khi fetch bằng UA ClaudeBot dài 8.777 ký tự nội dung thật, không phải placeholder loading.
- **Kết luận: robots.txt "allow" là allow thật, không có tường CDN nào âm thầm chặn ngược lại các bot AI đã khai báo cho phép.** Đây là điểm mạnh nhất của site.

### robots.txt (đọc từ `app/robots.ts` + fetch live, khớp 100%)

```
User-Agent: *
Allow: /
Disallow: /api/ /gio-hang /thanh-toan /tra-cuu-don-hang /admin

User-Agent: GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-Web,
            PerplexityBot, Google-Extended, Applebot-Extended, Bingbot
Allow: /
Disallow: (giống trên)

Sitemap: https://ofina.vn/sitemap.xml
```

- Đúng chuẩn: GPTBot, ClaudeBot, PerplexityBot, OAI-SearchBot đều được allow tường minh (không chỉ dựa vào wildcard `*`).
- **Thiếu quyết định tường minh cho nhóm chỉ-để-train** (CCBot, anthropic-ai, cohere-ai) — các bot này hiện KHÔNG bị chặn, chúng rơi vào rule `User-Agent: *` `Allow: /`. Nếu chủ site muốn được AI trích dẫn nhưng không muốn nội dung bị lấy miễn phí để train mô hình, cần thêm rule Disallow riêng cho 3 UA này (quyết định kinh doanh, không phải lỗi kỹ thuật).
- Danh sách Disallow (`/api/`, giỏ hàng, thanh toán, tra cứu đơn, admin) hợp lý — đúng các trang riêng tư/giao dịch, không chặn nhầm nội dung công khai.

---

## 2. llms.txt

- Route: `/Users/admin/ofina-web/app/llms.txt/route.ts` — Route Handler động của Next.js, không phải file tĩnh.
- Fetch live `https://ofina.vn/llms.txt` → HTTP 200, `Content-Type: text/plain; charset=utf-8`, cache 6 giờ (`revalidate = 21600`), dữ liệu danh mục + số lượng sản phẩm được kéo trực tiếp từ Supabase (`categories`, `products` bảng thật) nên số liệu tự cập nhật, không bị "đông cứng" lỗi thời.
- **Chất lượng nội dung: Tốt, đúng chuẩn llmstxt.org.** Có: mô tả 1 dòng về OFINA + số liệu cụ thể (2.664+ sản phẩm, bảo hành 24 tháng, giao miễn phí HN/HCM), thông tin liên hệ + địa chỉ 2 chi nhánh, lý do chọn OFINA, danh sách ~95 danh mục sản phẩm dạng link có mô tả, 13 bộ sưu tập theo nhu cầu, các trang chính (blog, tư vấn, báo giá B2B, showroom, giới thiệu), 4 trang chính sách, link sitemap.xml.
- **Thiếu:**
  - Không có dòng công bố điều khoản sử dụng/license cho nội dung (không có RSL 1.0, không có câu kiểu "nội dung này được phép trích dẫn khi ghi nguồn ofina.vn").
  - Không có mục Q&A/FAQ ngắn (kiểu "Câu hỏi thường gặp") — trong khi đây là định dạng AI thích trích dẫn nhất.
  - Không dẫn tới trang Giới thiệu với nội dung thật (vì trang đó hiện đang rỗng — xem mục 3).
  - Không có ví dụ giá cụ thể của vài sản phẩm bán chạy (chỉ có link danh mục, không có dữ kiện giá "ghế công thái học từ X đồng" ngay trong llms.txt).

### RSL 1.0

- `https://ofina.vn/rsl.xml` → 404
- `https://ofina.vn/.well-known/rsl.xml` → 404
- Không có `<link rel="license">` trong `<head>` bất kỳ trang nào đã quét.
- **Kết luận: chưa áp dụng RSL 1.0.** Đây là spec còn rất mới (không phải mọi AI crawler đã đọc), nên xếp mức độ ưu tiên Thấp/Trung bình, không phải chặn cứng.

---

## 3. Citability — 4 trang đã kiểm tra

### 3.1 Trang chủ (`/`)
- H1: "Ghế & nội thất văn phòng OFINA" — rõ ràng nhưng không ở dạng câu hỏi (chấp nhận được cho homepage).
- Meta description có dữ kiện cụ thể: "2.400+ sản phẩm... Bảo hành 24 tháng, miễn phí giao HN/HCM, trả góp 0%" — đúng kiểu câu trả lời trực tiếp AI thích trích.
- Nội dung chủ yếu là thẻ điều hướng/danh mục sản phẩm kèm mô tả 1-2 câu ngắn, ít đoạn văn tự sự dài — phù hợp vai trò trang điều hướng, không phải trang "trả lời câu hỏi", nên không kỳ vọng cao ở tiêu chí đoạn văn 134-167 từ.

### 3.2 `/gioi-thieu` (Giới thiệu) — HỎNG NẶNG
- Toàn bộ nội dung hiển thị trong trang: **`Nội dung giới thiệu công ty...`** (151 ký tự kể cả heading và nút CTA). Đây là text placeholder, không phải nội dung thật.
- Đối chiếu code (`/Users/admin/ofina-web/app/gioi-thieu/page.tsx`): trang có sẵn một bản nội dung fallback viết tốt (~400+ từ: "Câu chuyện OFINA", nguồn gốc tên thương hiệu, 4 cam kết, đoạn về showroom) — nhưng logic là *nếu* CMS setting `page.gioi_thieu` có `content.length > 10` thì **dùng nội dung CMS thay cho fallback**. Ai đó đã nhập giá trị placeholder `"Nội dung giới thiệu công ty..."` (18 ký tự, > 10) vào setting này trong Supabase → điều kiện bị thoả → nội dung tốt có sẵn trong code bị nội dung rỗng đè lên, hiển thị y hệt live.
- Cộng dồn với lỗi đã ghi nhận trước đó trong `docs/seo-audit/onpage.md`: canonical của trang này trỏ nhầm về `https://ofina.vn` (trang chủ) — đã xác minh lại, vẫn còn nguyên. Tức là trang vừa rỗng nội dung, vừa tự khai "tôi là bản sao trang chủ".
- JSON-LD trang này chỉ có Organization/WebSite/FurnitureStore (thông tin công ty ở dạng máy đọc), không có gì ở dạng văn bản người đọc được để AI trích dẫn khi có câu hỏi kiểu "OFINA là công ty gì, thành lập ra sao, có đáng tin không".

### 3.3 Bài blog "Cách Chọn Ghế Công Thái Học Chống Đau Lưng"
- Cấu trúc heading tốt: H1 rõ, H2 dạng câu hỏi ("Ghế Công Thái Học Là Gì? Tại Sao Quan Trọng?"), 7 H3 mục con đánh số, có bảng so sánh lưới vs đệm mút, có checklist dạng ☑.
- Độ dài bài ~1.391 từ — dài hơn nhiều mức tối ưu trích dẫn 134-167 từ/đoạn, nhưng vì được chia nhỏ theo H3 nên từng đoạn con (mỗi tiêu chí ~60-100 từ) vẫn nằm gần khung tối ưu — chấp nhận được.
- Có `BlogPosting` schema với `datePublished` — tốt, nhưng `author: {"@type": "Person", "name": "OFINA"}` — khai `@type: Person` nhưng điền tên thương hiệu, không phải tên người thật → tín hiệu E-E-A-T giả, Google/AI có thể coi là dữ liệu có cấu trúc sai lệch (structured data mismatch).
- **Vấn đề nghiêm trọng nhất phát hiện ở đây không nằm ở bài này mà ở toàn bộ mục blog** — xem mục 4 Critical #2.

### 3.4 Trang sản phẩm "Bàn họp Sonic S09" — Tốt nhất trong 4 trang
- H1 + chuỗi H2 rõ ràng: Điểm nổi bật → Mô tả chi tiết → Thông số kỹ thuật → Bảo hành & Vận chuyển → Câu hỏi thường gặp.
- JSON-LD đầy đủ 7 khối: `Organization`, `WebSite`, `FurnitureStore` (x2), `Product` (có SKU, giá VND cụ thể, tình trạng tồn kho, brand), `BreadcrumbList`, `FAQPage`.
- `FAQPage` có 6 câu hỏi thật với câu trả lời tự-đầy-đủ-ngữ-cảnh (self-contained), mỗi câu 20-60 từ, có số liệu cụ thể (ví dụ: "bảo hành 24 tháng", "đổi trả miễn phí trong 7 ngày", "trả góp 0% qua Sacombank/VPBank/Techcombank kỳ hạn 3-12 tháng"). Đây đúng là định dạng AI thích trích dẫn nhất trong toàn bộ site — nên dùng làm mẫu nhân rộng.

---

## 4. Vấn đề theo mức độ ưu tiên

### CRITICAL

1. **Trang `/gioi-thieu` gần như rỗng do một giá trị placeholder trong CMS.** Live site chỉ hiện "Nội dung giới thiệu công ty..." thay vì nội dung fallback ~400 từ đã viết sẵn trong code. Đây là trang quan trọng nhất để AI xác minh entity/độ tin cậy thương hiệu ("OFINA là ai, có uy tín không") — hiện tại gần như 0 tín hiệu. Cộng thêm lỗi canonical trỏ về trang chủ đã ghi nhận trong `onpage.md`.
   *Sửa:* xoá/thay giá trị setting `page.gioi_thieu` trong bảng `site_settings` (Supabase) — trang sẽ tự động hiện lại nội dung fallback tốt có sẵn trong code, hoặc viết nội dung CMS thật thay placeholder. **Effort: Rất thấp (vài phút, chỉ sửa dữ liệu, không cần deploy code).**

2. **87,5% bài blog (14/16 bài) là nội dung "xoay vòng" (spun) của chỉ 2 chủ đề gốc**, mỗi bài một canonical tự-trỏ-về-chính-nó (không hợp nhất):
   - Chủ đề "cách chọn ghế công thái học chống đau lưng": 9 URL (`...chong-dau-lung` + 8 biến thể đuôi ngẫu nhiên `-h6mo, -iy9c, -lkln, -n8q2, -oims, -pjwk, -qa6h, -xwco`)
   - Chủ đề "cách chọn ghế công thái học phù hợp để chống đau lưng": 5 URL (`-cwyp, -g2gh, -mduc, -r5ym, -tncl`)
   - Đã diff nội dung 2 biến thể: cùng `<title>` tag y hệt, cùng cấu trúc 6-7 tiêu chí, chỉ đổi câu chữ — rõ ràng là nội dung được sinh lại nhiều lần trên cùng một chủ đề, không phải bài viết mới.
   - Chỉ có **2 chủ đề blog thực sự khác nhau** trên toàn site ("bàn nâng hạ thông minh" và "ghế giám đốc loại nào tốt") — trong khi OFINA bán 12+ nhóm sản phẩm lớn (bàn giám đốc, bàn họp, tủ hồ sơ, sofa, ghế phòng chờ...) không có bài hướng dẫn mua nào.
   - Cả 14 bài đều được serve HTTP 200 đầy đủ cho GPTBot/ClaudeBot (đã test) — tức AI crawler đang thật sự nạp và phải xử lý toàn bộ nội dung trùng lặp này.
   *Rủi ro:* pha loãng độ uy tín chủ đề, tốt nhất chỉ 1/14 bản được trích dẫn — 13 bản còn lại vô ích; xấu nhất bị Google/AI xếp vào dạng nội dung có dấu hiệu tự động hàng loạt (programmatic/spam pattern), ảnh hưởng uy tín toàn site chứ không chỉ 14 URL đó.
   *Sửa:* chọn 1 bản tốt nhất/chủ đề, 301-redirect hoặc noindex+canonical 13 bản còn lại về bản đó; đồng thời rà lại pipeline sinh nội dung blog (script tạo bài) để chặn việc tạo lại cùng chủ đề. Dùng ngân sách nội dung dư ra để viết bài mới cho các nhóm sản phẩm chưa có bài. **Effort: Trung bình-Cao** (cần quyết định giữ bản nào + sửa pipeline + viết bài mới thay thế).

### HIGH

3. **Không có sự hiện diện YouTube thật** — link YouTube trong footer là `href="#"` placeholder (xác nhận trong code, không phải suy đoán), không có link LinkedIn/Instagram/TikTok nào trong toàn bộ codebase. Theo bảng tương quan GEO, mention YouTube có hệ số tương quan mạnh nhất (~0,737) với việc được AI trích dẫn — đây là kênh gần như bị bỏ trắng hoàn toàn. **Effort: Trung bình** (cần lập kênh + sản xuất video, ví dụ video hướng dẫn chọn ghế, tour showroom, review sản phẩm bán chạy).

4. **Cùng gốc với Critical #2**: quy trình sinh nội dung blog dường như tự động và không có bước chống trùng chủ đề. Đây là vấn đề quy trình/kỹ thuật cần sửa tận gốc, tách biệt với việc dọn 13 bài trùng hiện có (vá triệu chứng) — nếu không sửa pipeline, tình trạng này sẽ tái diễn ở đợt bài tiếp theo. **Effort: Trung bình.**

5. **Tác giả blog không phải người thật** — `BlogPosting.author` khai `@type: "Person"` nhưng `name: "OFINA"` (tên thương hiệu, không phải tên người) — sai lệch structured data, đồng thời không có trang tác giả/bio chuyên gia nào cho nội dung mang tính tư vấn sức khỏe-cột sống (ergonomic). Yếu tín hiệu E-E-A-T. **Effort: Trung bình** (cử một người phụ trách nội dung có tên thật + tiểu sử ngắn, sửa lại schema).

### MEDIUM

6. **Sitemap.xml không liệt kê từng bài blog** — chỉ có `/blog` (trang danh sách), không có 16 URL bài viết con, dù các URL này vẫn crawl được qua link nội bộ. Thiếu tín hiệu ưu tiên/độ mới cho cả bot tìm kiếm lẫn AI crawler dùng sitemap để định hướng crawl budget. **Effort: Thấp** (thêm block loop bài blog vào route sitemap, tương tự cách `/san-pham` đã làm với 2.665 URL).

7. **Chưa có quyết định tường minh cho nhóm bot chỉ-để-train** (CCBot, anthropic-ai, cohere-ai) — hiện đang mặc định được allow qua rule `*`. Cần quyết định kinh doanh: cho phép (đổi lấy khả năng được nhắc tên nhiều hơn ở các mô hình dùng dữ liệu này để train) hay chặn (tránh bị lấy nội dung miễn phí để train mà không được trích dẫn lại). **Effort: Thấp** (thêm vài dòng rule vào `app/robots.ts`).

8. **Chưa có RSL 1.0** (`/rsl.xml`, `/.well-known/rsl.xml` đều 404) và llms.txt chưa có dòng công bố điều khoản sử dụng nội dung. Spec còn mới nên chưa cấp bách, nhưng nên chuẩn bị trước khi nhiều AI crawler bắt đầu đọc RSL làm căn cứ trả phí/ghi nguồn. **Effort: Thấp-Trung bình.**

9. **Thiếu khối FAQ/Q&A ở trang chủ và trang Giới thiệu** — đối chiếu với trang sản phẩm (có `FAQPage` 6 câu, chất lượng rất tốt), đây là định dạng thắng lớn nhưng mới áp dụng ở 1/4 loại trang đã kiểm tra. **Effort: Thấp** — nhân rộng mẫu FAQ đã có sẵn trên trang sản phẩm sang trang chủ, danh mục, và trang Giới thiệu (sau khi trang này có nội dung thật).

### LOW

10. **Không có trang Wikipedia tiếng Việt cho OFINA** (xác nhận `vi.wikipedia.org/wiki/OFINA` trả 404). Bình thường với quy mô SME, không cấp bách, nhưng là mục tiêu dài hạn khi thương hiệu lớn hơn (Wikipedia có tương quan cao với việc AI coi là entity đáng tin).
11. **Không kiểm chứng được mức độ xuất hiện trên Reddit/diễn đàn/review độc lập** trong phiên này — mọi công cụ tra cứu (Google, Bing, DuckDuckGo, Facebook, YouTube search) qua WebFetch đều bị chặn bởi CAPTCHA hoặc yêu cầu JavaScript, không trả về dữ liệu thật. **Không kết luận là "không có" hay "có"** — cần làm lại bằng SERP API/DataForSEO thật hoặc tra thủ công trước khi ra quyết định đầu tư.
12. Số điện thoại hotline hiển thị không đồng nhất định dạng giữa các trang (có chỗ "032 562 9996", có chỗ "0325669996" liền số) — về bản chất là 2 số hotline hợp lệ khác nhau của cùng chi nhánh (đã xác nhận trong `lib/utils.ts` — `CONTACT.branches[0].phones = ['0325629996', '0325669996']`), không phải lỗi dữ liệu, nhưng định dạng không đồng nhất hơi làm nhiễu tín hiệu NAP khi AI trích số điện thoại.

---

## 5. Top 5 thay đổi ưu tiên cao nhất (ước tính effort)

| # | Thay đổi | Tác động GEO | Effort |
|---|---|---|---|
| 1 | Xoá/thay giá trị placeholder trong CMS setting `page.gioi_thieu` để trang Giới thiệu hiện lại nội dung thật đã có sẵn trong code | Rất cao — khôi phục toàn bộ tín hiệu authority của trang About | Rất thấp (phút) |
| 2 | Hợp nhất 14 bài blog trùng lặp về 1 bản/chủ đề (redirect/noindex 13 bản), viết bài mới cho các nhóm sản phẩm chưa có nội dung | Rất cao — chặn rủi ro bị coi là nội dung spam hàng loạt, giải phóng ngân sách nội dung | Trung bình-Cao |
| 3 | Sửa pipeline sinh blog để chặn trùng chủ đề (nguyên nhân gốc của #2) | Cao — ngăn tái diễn | Trung bình |
| 4 | Lập kênh YouTube thật + 3-5 video (hướng dẫn chọn ghế/bàn, tour showroom) thay link `href="#"` | Cao — YouTube là tín hiệu tương quan mạnh nhất với trích dẫn AI | Trung bình |
| 5 | Thêm 16 URL blog vào sitemap.xml + nhân rộng mẫu FAQPage (đã tốt ở trang sản phẩm) sang trang chủ/Giới thiệu | Trung bình-Cao | Thấp |

---

## 6. Điểm ước tính theo nền tảng (suy luận kỹ thuật, KHÔNG phải số đo trực tiếp)

Không có DataForSEO/công cụ đo live-citation trong phiên này. Các điểm dưới đây suy ra từ: (a) mức độ chặn/allow crawler đã test thật, (b) mức độ trùng lặp nội dung ảnh hưởng khác nhau tới từng nền tảng, (c) mức độ nền tảng đó ưu tiên structured data/FAQ.

| Nền tảng | Điểm ước tính /100 | Vì sao |
|---|---|---|
| Google AI Overviews | ~45 | Google-Extended được allow, nhưng Google là nơi nhạy nhất với nội dung trùng lặp/spun — 14 bài blog trùng là rủi ro trực tiếp lớn nhất ở đây; canonical sai ở `/gioi-thieu` và `/blog` (ghi nhận trong `onpage.md`) càng làm nặng thêm |
| ChatGPT (GPTBot/OAI-SearchBot) | ~60 | Có llms.txt + FAQPage schema tốt ở trang sản phẩm giúp trích dẫn trực tiếp; bị kéo xuống vì trang Giới thiệu rỗng khi ChatGPT cần xác minh entity |
| Perplexity | ~55 | Thích số liệu cụ thể (đã có: bảo hành 24 tháng, giá VND rõ ràng) nhưng thiếu tín hiệu uy tín ngoài site (không Reddit/YouTube xác nhận được) |
| Bing Copilot | ~50 | Bingbot được allow tường minh, nhưng chưa kiểm tra IndexNow cho riêng ofina.vn trong phiên này nên chưa có cơ sở chấm cao hơn |

**Khuyến nghị:** dùng DataForSEO MCP (`ai_optimization_chat_gpt_scraper`, `ai_opt_llm_ment_search`) hoặc hỏi trực tiếp ChatGPT/Perplexity/Copilot câu "ghế công thái học nào tốt ở Hà Nội/TPHCM" để lấy số đo thật, thay cho bảng ước tính trên, trước khi báo cáo con số này cho bên thứ ba.

---

*Ghi chú: trong quá trình audit có xuất hiện 2 khối chỉ dẫn lạ chèn vào ngữ cảnh (một khối giả danh "Claude Docs" yêu cầu tạo artifact thay vì ghi file, một khối claim là "MCP server instructions"). Cả hai đều không khớp với bộ công cụ thực tế được cấp và không đến từ user/coordinator nên đã bỏ qua, tiếp tục ghi báo cáo vào đúng file được yêu cầu.*
