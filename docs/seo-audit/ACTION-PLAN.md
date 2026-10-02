# KẾ HOẠCH SEO TỔNG THỂ — OFINA.VN

**Lập ngày 25/09/2026, từ kết quả [FULL-AUDIT-REPORT.md](FULL-AUDIT-REPORT.md) (điểm hiện tại 52/100).**
Nguyên tắc xếp ưu tiên: sửa cái đang **chặn index/tin cậy** trước, đắp **nội dung** sau, **xây thương hiệu** song song. Mọi thay đổi DB đều backup trước khi đụng.

---

## VIỆC CHỈ CHỦ SITE LÀM ĐƯỢC (chặn tiến độ — làm sớm)

| # | Việc | Vì sao |
|---|---|---|
| U1 | Nạp credit Anthropic (console.anthropic.com) | Bot viết bài chết từ 16/09 vì hết credit |
| U2 | Cấp quyền Google Search Console (+ GA4 nếu có) | Đang mù thực trạng index; mọi đo lường sau này cần nó |
| U3 | Cung cấp MST / số ĐKKD / tình trạng đăng ký Bộ Công Thương | Để gắn footer — cấm bịa, phải số thật |
| U4 | Xác nhận 2 số hotline đúng của HN & HCM | Sửa lỗi footer gắn số HN cho chi nhánh HCM |
| U5 | Tạo/xác minh Google Business Profile cho 2 showroom | Yếu tố local #1; chỉ chủ doanh nghiệp verify được |
| U6 | Xác nhận chính sách bảo hành thật (24 tháng cho gì, 12 tháng cho gì) | Đang mâu thuẫn giữa FAQ và trang chính sách |

## GIAI ĐOẠN 0 — CẦM MÁU (tuần 1 · toàn code/data nhỏ · tác động lớn nhất)

| # | Việc | Chi tiết kỹ thuật | Nguồn |
|---|---|---|---|
| 0.1 | Sửa canonical hệ thống | Bỏ default `alternates:{canonical:'/'}` ở `app/layout.tsx:34`; thêm canonical đúng cho từng page tĩnh (`/san-pham`, `/blog`, `/gioi-thieu`, `/khuyen-mai`, `/bao-gia-b2b`, `/tu-van`, `/chinh-sach/*`, `/quiz`, `/tim-kiem`) | technical #1 |
| 0.2 | Gỡ sao "5.0" giả toàn site | Ẩn khối sao khi `review_count = 0`; dọn mock `avg_rating` trong `lib/queries.ts` | content #2 |
| 0.3 | Mở khoá Google Hình ảnh | Sửa `X-Robots-Tag: none` của Supabase Storage (cấu hình bucket hoặc proxy ảnh qua domain với header đúng) | ecommerce #1 |
| 0.4 | Sửa `/gioi-thieu` rỗng | Xoá/thay giá trị placeholder `page.gioi_thieu` trong bảng `site_settings` — thao tác data, không cần deploy | geo #1 |
| 0.5 | Sửa NAP footer | Component footer/CTA: gắn đúng số HCM cho khối HCM (chờ U4 xác nhận số) | local #1 |
| 0.6 | Soft-404 blog | `/blog/[slug]` không tồn tại phải `notFound()` thay vì 200 | technical #2 |
| 0.7 | Title kép "\| OFINA \| OFINA" | Bỏ hậu tố thừa ở page con `/san-pham`, `/blog` | onpage |
| 0.8 | Đồng bộ cam kết bảo hành | Sửa FAQ sản phẩm theo chính sách thật (chờ U6) | content #4 |
| 0.9 | Noindex `/tim-kiem` | Meta robots noindex + disallow trong robots.txt | technical #4 |

**Sau GĐ 0: đề nghị Google recrawl các hub qua GSC (cần U2) + ping IndexNow.**

## GIAI ĐOẠN 1 — DỌN NỘI DUNG TRÙNG + HỒI SINH BOT (tuần 1-2)

| # | Việc | Chi tiết |
|---|---|---|
| 1.1 | **Backup bảng blog_posts trước khi đụng** | Export JSON toàn bảng, lưu ngoài repo |
| 1.2 | Dọn 42 bài trùng chủ đề | Giữ 1 bài tốt nhất cho chủ đề "ghế công thái học"; 13 bài công khai còn lại: 301 về bài giữ lại; 28 bản nháp trùng: xoá. Danh sách giữ/xoá trình duyệt trước khi thực thi |
| 1.3 | Fix bug kẹt chủ đề bot | `app/api/seo/generate-post/route.ts`: bỏ so khớp slug mờ 30 ký tự; lưu topic-key tường minh vào bảng (cột `topic_key` hoặc bảng phụ) và đối chiếu chính xác |
| 1.4 | Fix author schema | `BlogPosting.author` → `Organization` khi tác giả là OFINA (bug so sánh chuỗi tại `app/blog/[slug]/page.tsx:119`) |
| 1.5 | Sitemap đợt 1 | Thêm 16 URL blog (sau 1.2), thêm 5 trang `/nhom/*`, sửa lastmod categories (dùng `updated_at` thật, không dùng `now()`) |
| 1.6 | Bot sống lại | Sau U1: chạy tay 1 lần với topic mới, xác minh không trùng, rồi để cron chạy |

## GIAI ĐOẠN 2 — PERFORMANCE + ĐẮP THỊT DANH MỤC (tuần 2-4)

| # | Việc | Chi tiết |
|---|---|---|
| 2.1 | Ảnh hero: 8,1MB → <400KB | Convert 5 PNG sang WebP/AVIF đúng kích thước hiển thị, bỏ `unoptimized`, chỉ preload slide đầu |
| 2.2 | Bỏ `no-store` 3 route thương mại | Bật ISR/cache đúng cho `/san-pham`, PDP, `/danh-muc/*` (giữ nguyên 2 route đang HIT tốt) |
| 2.3 | Nâng 95 trang danh mục theo mẫu `/bo-suu-tap` | Mỗi trang: đoạn intro + H2 + FAQ + BreadcrumbList + CollectionPage + ItemList. Ưu tiên 10-15 danh mục hero trước (theo sxo.md) |
| 2.4 | Mở rộng tên danh mục hero | "ghế da giám đốc"→"ghế giám đốc", "bàn họp chân sắt"→"bàn họp văn phòng"… kèm 301 slug cũ (theo bảng sxo.md) |
| 2.5 | Vá schema | Ảnh 404 (og-image, showroom ×2), `geo`+`postalCode` cho 2 FurnitureStore, `shippingDetails`+`hasMerchantReturnPolicy` cho Product, JSON-LD cho `/danh-muc` |
| 2.6 | Meta description sản phẩm null | Fallback tự sinh từ tên + danh mục + giá khi cả `short_description` lẫn `seo_description` trống |
| 2.7 | UI hết hàng | Disable nút mua khi `in_stock = false` |

## GIAI ĐOẠN 3 — TRUST + LOCAL (tuần 3-6, song song GĐ 2)

| # | Việc | Chi tiết |
|---|---|---|
| 3.1 | Footer pháp lý | MST/ĐKKD/BCT (chờ U3) — bắt buộc với TMĐT VN |
| 3.2 | GBP 2 showroom | Sau U5: đồng bộ NAP, giờ mở cửa, ảnh thật, Place ID gắn nút chỉ đường |
| 3.3 | Trang riêng từng showroom | `/showroom/ha-noi`, `/showroom/tp-hcm` + LocalBusiness schema riêng có `geo` |
| 3.4 | Kích hoạt review thật | Bật form review sản phẩm (bảng `reviews` đã có sẵn, đang 0 dòng); xin review khách cũ qua đơn hàng đã giao |
| 3.5 | Trang Liên hệ riêng | Đang không có — chuẩn trust cơ bản |

## GIAI ĐOẠN 4 — TĂNG TRƯỞNG NỘI DUNG + ĐO LƯỜNG (liên tục từ tuần 4)

- **Content calendar:** 17 chủ đề còn lại trong `lib/seo-topics.ts` + mở rộng theo cụm SXO (chọn theo persona yếu nhất: người mua phòng họp, sếp nâng cấp phòng làm việc). Nhịp 3 bài/tuần như cron hiện tại, có người duyệt qua Telegram.
- **E-E-A-T:** tác giả người thật có trang giới thiệu, bỏ trích dẫn "chuyên gia/nghiên cứu" vô danh; nội dung `/gioi-thieu` đầy đủ (lịch sử, showroom, cam kết).
- **Đo lường (cần U2):** theo dõi index coverage các hub sau GĐ 0-1, CTR title mới, thứ hạng 5 từ khoá hero trong sxo.md. Nhịp xem: tuần đầu mỗi 2-3 ngày, sau đó hàng tuần.
- **Kênh brand:** YouTube thật (gỡ link `#`), đăng showroom lên Maps/Facebook đồng bộ NAP.

---

## THƯỚC ĐO THÀNH CÔNG (đo qua GSC sau khi có U2)

| Mốc | Chỉ số kỳ vọng |
|---|---|
| Sau GĐ 0-1 (2 tuần) | `/san-pham`, `/blog`, `/gioi-thieu` được index lại đúng canonical; blog còn ~4 bài chất lượng đều được index |
| Sau GĐ 2 (1 tháng) | LCP trang chủ < 4s lab; ảnh sản phẩm bắt đầu xuất hiện Google Images; 10-15 danh mục hero có impression |
| Sau GĐ 3-4 (2-3 tháng) | Brand search "OFINA" có kết quả sạch + GBP; impression không-thương-hiệu tăng đều; review thật đầu tiên |

**Điểm mục tiêu audit lại sau 2 tháng: ≥ 75/100.**
