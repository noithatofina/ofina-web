# BÁO CÁO AUDIT SEO TOÀN DIỆN — OFINA.VN

**Ngày audit:** 25/09/2026 · **Phương pháp:** 9 mảng audit độc lập chạy song song, mọi số liệu đo trực tiếp trên production + đối chiếu mã nguồn tại `/Users/admin/ofina-web`. **Không có** dữ liệu GSC/GA4/CrUX field (chưa được cấp quyền — xem mục Giới hạn).

---

## ĐIỂM SỨC KHOẺ SEO: 52/100 — TRUNG BÌNH YẾU

| Hạng mục | Điểm | Trọng số | Báo cáo chi tiết |
|---|---|---|---|
| Technical SEO | 60 | 22% | [technical.md](technical.md) |
| Content Quality | 33 | 23% | [content.md](content.md) |
| On-Page SEO | 55 | 20% | [onpage.md](onpage.md) |
| Schema / Structured Data | 48 | 10% | [schema.md](schema.md) |
| Performance (CWV lab) | 75 | 10% | [performance.md](performance.md) |
| AI Search Readiness | 56 | 10% | [geo-ai.md](geo-ai.md) |
| Images | 45 | 5% | trong [ecommerce.md](ecommerce.md) |

Điểm Performance = 75 lấy từ trung bình Lighthouse 5 trang (61/81/90/87/91 ≈ 82) trừ đi mức phạt cho LCP toàn bộ ở vùng kém + 3 route thương mại không cache CDN. CLS toàn site xuất sắc (~0).

Các thang đo bổ trợ (không tính vào điểm tổng): E-commerce 47 ([ecommerce.md](ecommerce.md)) · Sitemap 55 ([sitemap.md](sitemap.md)) · Local SEO 34 ([local.md](local.md)) · SXO Gap 47 ([sxo.md](sxo.md)).

**Loại hình kinh doanh:** e-commerce nội thất văn phòng + hybrid local (2 showroom thật HN/HCM), 2.673 sản phẩm.

---

## BỨC TRANH CHUNG

Nền kỹ thuật của site **tốt hơn mặt bằng**: SSR đầy đủ, redirect chuẩn, robots.txt sạch và mở cửa tường minh cho bot AI, llms.txt động, IndexNow hoạt động, breadcrumb đồng bộ UI + JSON-LD, faceted nav không sinh rác. Vấn đề không nằm ở nền — nằm ở **một lỗi canonical hệ thống giết các trang hub**, **nội dung mỏng/trùng lặp hàng loạt**, và **các tín hiệu tin cậy giả hoặc thiếu**.

## TOP VẤN ĐỀ CRITICAL (theo tác động)

1. **Canonical trỏ nhầm về trang chủ trên ≥11 route hub** — `/san-pham` (+111 trang phân trang), `/blog`, `/gioi-thieu`, `/khuyen-mai`, `/bao-gia-b2b`, `/tu-van`, 6× `/chinh-sach/*`... Gốc: default `alternates: {canonical: '/'}` tại `app/layout.tsx:34`, các page tĩnh không override. Hai cổng vào quan trọng nhất (catalog + blog) đang tự khai là bản sao trang chủ.
2. **Rating "5.0 sao" giả trên toàn site** — hiển thị cứng cho mọi sản phẩm trong khi dữ liệu thật `avg_rating: 0, review_count: 0`. Chưa lộ vào schema (may), nhưng là tín hiệu tin cậy giả quy mô lớn — rủi ro cả Google lẫn pháp lý với khách.
3. **Toàn bộ ảnh sản phẩm bị `X-Robots-Tag: none`** từ Supabase Storage — 2.673 sản phẩm vắng mặt hoàn toàn trên Google Hình ảnh, kênh khám phá quan trọng bậc nhất của ngành nội thất.
4. **Blog vô hình 3 lớp + spin content**: 0/16 bài có trong sitemap, `/blog` canonical sai, slug rác trả 200 (soft-404); 14/16 bài công khai là biến thể xoay vòng của 2 chủ đề (đo Jaccard 5-gram) — đúng mẫu "scaled content abuse" theo chính sách Google. Gốc sinh trùng: bug so khớp slug mờ 30 ký tự tại `app/api/seo/generate-post/route.ts:73-79`.
5. **`/gioi-thieu` rỗng trên production** — chỉ hiện placeholder 151 ký tự do giá trị rác trong `site_settings` (Supabase) đè nội dung fallback ~400 từ có sẵn trong code. Sửa bằng 1 thao tác dữ liệu, không cần deploy.
6. **Trang chủ 9,66MB — 5 ảnh hero PNG chiếm 8,1MB**, serve nguyên cỡ mọi thiết bị (`unoptimized` + `priority`) → LCP trang chủ vùng đỏ sâu, điểm Lighthouse 60-62 (các trang khác 81-91).
7. **NAP sai thật:** footer + CTA nổi toàn site gắn số Hà Nội cho khối "Chi nhánh TP.HCM" (trang /showroom hiển thị đúng: HN 0325629996 / HCM 0777569996 — lỗi chỉ ở component dùng chung).
8. **Mâu thuẫn cam kết bảo hành:** FAQ sản phẩm nói "24 tháng" toàn bộ; trang chính sách quy định đệm/cơ chế xoay chỉ 12 tháng.

## VẤN ĐỀ HIGH đáng chú ý

- 3 route thương mại (`/san-pham`, trang sản phẩm, `/danh-muc/*`) bị `cache-control: no-store` — không cache CDN, TTFB gấp 2-5 lần route có cache.
- 95 trang danh mục: không JSON-LD riêng (thiếu BreadcrumbList/CollectionPage/ItemList — trong khi template `/bo-suu-tap` đã làm đúng), meta description 1 công thức, thân trang 0 H2, không FAQ.
- Tên danh mục hero tự bó hẹp so với từ khoá thị trường: "ghế **da** giám đốc", "bàn họp văn phòng **chân sắt**" (SERP thưởng tên rộng "N+ mẫu ghế giám đốc…").
- Ảnh trong JSON-LD 404 thật: `og-image.jpg`, `showroom-hn.jpg`, `showroom-hcm.jpg`.
- Không MST/số ĐKKD/đăng ký Bộ Công Thương ở footer — thiếu chuẩn trust + quy định TMĐT VN.
- Sản phẩm hết hàng vẫn bấm mua được trên UI (schema đã đúng OutOfStock).
- `/tim-kiem` không noindex/disallow — rủi ro index rác.
- Sitemap thiếu 5 trang `/nhom/*` đang sống khoẻ; thêm blog vào sitemap CHỈ SAU khi dọn trùng.
- Không hiện diện thương hiệu ngoài site: search brand "OFINA nội thất" zero visibility, không GBP xác minh được, không YouTube thật (link `#`), 0 review.

## ĐIỂM MẠNH CẦN GIỮ

- Robots/redirect/SSR/IndexNow chuẩn; bot AI (GPTBot, ClaudeBot, PerplexityBot) vào tự do — đã test bằng UA thật.
- Schema Product nền tốt (72/100), không gắn review giả vào schema dù UI có sao giả.
- Template `/bo-suu-tap/[slug]`: nội dung + FAQ + schema đầy đủ — dùng làm mẫu nhân rộng cho 95 trang danh mục.
- 67 URL sitemap kiểm mẫu: 100% HTTP 200, 0 redirect, 0 doorway.
- SXO: loại trang đang dựng ĐÚNG với loại trang SERP thưởng — chỉ cần đắp nội dung, không cần đập kiến trúc.

## GIỚI HẠN CỦA AUDIT

- Không có GSC/GA4/CrUX: chưa biết thực trạng index và truy vấn thật — mọi kết luận "vô hình trên Google" dựa trên tín hiệu on-site + search công khai (site: qua WebSearch không đáng tin — đã ghi chú trong sxo.md). **Việc xin quyền GSC là ưu tiên đo lường số 1.**
- PageSpeed Insights API bị 429 trong phiên — CWV là số lab (Lighthouse local), chưa có field data.
- GBP/Facebook/Reddit không truy cập được bằng công cụ trong phiên — cần kiểm tay.
- Danh sách đầy đủ từng vấn đề + bằng chứng + file code liên quan: xem 9 file chi tiết cùng thư mục.
