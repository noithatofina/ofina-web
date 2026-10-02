# On-page SEO — ofina.vn (quét 25/09/2026)

Quét 8 trang đại diện bằng curl + trích xuất title/meta/H1/canonical (script trong phiên, số liệu lấy trực tiếp từ HTML thật).

## 🔴 CRITICAL — Canonical trỏ nhầm về trang chủ

| Trang | Canonical thực tế | Đúng phải là |
|---|---|---|
| `/san-pham` (listing 2.673 SP) | `https://ofina.vn` ❌ | `https://ofina.vn/san-pham` |
| `/blog` | `https://ofina.vn` ❌ | `https://ofina.vn/blog` |
| `/gioi-thieu` | `https://ofina.vn` ❌ | `https://ofina.vn/gioi-thieu` |

Ba trang này tự khai là "bản sao của trang chủ" → Google được phép loại chúng khỏi index và bỏ qua nội dung. `/san-pham` là cổng vào toàn bộ kho sản phẩm, `/blog` là cổng vào nội dung — hai trang hub quan trọng nhất đang tự huỷ.

Trang KHÔNG dính lỗi (canonical đúng): trang sản phẩm chi tiết, `/danh-muc/*`, `/bo-suu-tap/*`, `/showroom`.

**Nghi vấn nguyên nhân (cần xác minh trong code):** `app/layout.tsx` đặt canonical mặc định = trang chủ, các page tĩnh (`/san-pham`, `/blog`, `/gioi-thieu`) không override `alternates.canonical` trong metadata, còn các trang động `[slug]` có generateMetadata riêng nên đúng.

## 🟡 HIGH — Title trùng đuôi thương hiệu kép

- `/san-pham`: `Tất cả sản phẩm | OFINA | OFINA`
- `/blog`: `Blog — Kiến thức nội thất văn phòng | OFINA | OFINA`

Template Next.js (`title.template` = `%s | OFINA`) cộng với title con đã tự ghi `| OFINA` → lặp. Xấu CTR, thiếu chuyên nghiệp trên SERP.

## ✅ Điểm ổn

- Title/meta description các trang sản phẩm, danh mục, bộ sưu tập viết tốt: có giá, USP (bảo hành 24 tháng, miễn phí giao HN/HCM), độ dài hợp lý.
- H1 có mặt và đúng nội dung trên cả 8 trang.
- Meta description không trang nào thiếu.

## Điểm on-page tạm chấm: 55/100
Trừ nặng vì canonical (lỗi cấp index-killer trên 3 trang hub), trừ nhẹ title kép. Phần thân trang (heading phụ, internal link, alt ảnh) do các agent content/ecommerce chấm chi tiết.
