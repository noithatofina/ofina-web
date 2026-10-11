# Tìm nguồn bằng ảnh — kết quả thử nghiệm 05/10/2026

## Cách chạy được (dùng lại được ngay)

Google Lens dựng kết quả trong khung iframe khác miền → **không đọc được**.
**Yandex thì được**, và không cần đăng nhập:

```
https://yandex.com/images/search?rpt=imageview&url=<ĐỊA_CHỈ_ẢNH>&cbir_page=sites
```

Dùng địa chỉ ảnh qua `ofina.vn/img/...` (Yandex tải được), KHÔNG dùng địa chỉ Supabase
(thử trước, Yandex trả "No matching results" — nhiều khả năng nó không tải nổi).

Tab `cbir_page=sites` cho ra **các trang có chứa đúng ảnh đó**, quan trọng hơn tab ảnh tương tự.

Alibaba và made-in-china **chặn tải qua máy chủ** nhưng **mở được bằng trình duyệt thật**.
Alibaba còn tự hiển thị tiếng Việt kèm giá quy đổi sẵn.

## Thử 1 — Sofa SF730 (29,49tr): TÌM RA NHƯNG KHÁC MẪU

Yandex trả: 1 trang Alibaba, 2 niêm yết AliExpress ($395 và $1.138), hàng Taobao qua đại lý Nga,
và một nơi bán ở Việt Nam gọi mẫu này là GD221.

Nhà sản xuất trên Alibaba: **Guangzhou Glory Merge Furniture Co., Ltd.** — lập 2013, Phật Sơn,
xưởng 20.000 m², 300+ nhân công, **OEM/ODM**, 4,9/5 từ 101 đánh giá, giá 2,27–3,53 triệu/bộ (MOQ 2).

**Đối chiếu ảnh cạnh nhau → KHÔNG cùng mẫu.** SF730 của OFINA có **gối tựa đầu rời**,
**nẹp gỗ tay vịn khảm chỉ vàng**, **bàn trà mặt đá có tầng dưới**, kèm đôn góc.
Hàng Glory Merge: lưng phẳng không gối tựa đầu, tay vịn gỗ trơn, bàn trà gỗ kèm đôn giấu gầm.

⛔ **Bài học:** Yandex trả cả ảnh "tương tự", không chỉ ảnh trùng. Nếu lấy thông số của bộ này
gán cho SF730 thì kích thước sai hoàn toàn. **Bắt buộc phải soi ảnh cạnh nhau trước khi dùng.**

## Thử 2 — Cabin ZUM-01S (114,23tr): TRÚNG NGUỒN

Yandex dẫn tới **fsmingle.en.made-in-china.com**. Trang sản phẩm ghi thẳng:

- **Model NO.: ZUM-SL** · **Production Name: ZUM Acoustic Booth** · **Trademark: Mingle**
- **Mingle (Hecor) Furniture Group** — lập 2003, Longjiang, Thuận Đức. Hai thương hiệu
  *"Mingle furniture"* và *"silent box"*. **Nhận OEM và ODM.**
- Giá niêm yết: **US $950 – 2.120 / chiếc**, năng lực 1.000 chiếc/tháng

Khớp với đầu mối Zum/Hecor đã ghi trong `zum-hecor-dau-moi-2026-10-05.md`.

**Đối chiếu ảnh:** ZUM-01S của OFINA là bản 1 người, ZUM-SL của Mingle là bản 2 người — khác cỡ,
nhưng **cùng một dòng**: bo góc giống hệt, tay nắm cửa giống, bàn tròn gắn vách giống, đệm ngồi
giống, đèn LED trần giống, cùng lối chơi màu lớp trong (đỏ, xám, ngọc, cam, xanh rêu — OFINA dùng
đúng dải màu này).

### Thông số thật của ZUM-SL (nhà sản xuất công bố)

| Mục | Giá trị |
|---|---|
| Kích thước phủ bì | **W2300 × D966 × H2326 mm** |
| Kích thước lòng trong | **W2162 × D926 × H2146 mm** |
| Chỉ số âm học | **STC 30dB (±5dB) / RT 0,75s (±0,1s)** |
| Điện | 110–240V / 50Hz |
| Chiếu sáng | mô-đun LED **OSRAM**, thấu kính lăng trụ chống chói |
| Thông gió | quạt xoáy (vortex) hút khí vào trong |
| Lớp trong | **65% vật liệu tiêu âm** |
| Chứng nhận | **ISO9001, ISO14001** |
| Đóng gói | 210 × 110 × 75 cm · **nặng cả bì 480 kg** |
| Mã HS | 9401619000 |

⛔ **Lưu ý về con số 30dB:** đây là **STC** — chỉ số truyền âm đo trong phòng thí nghiệm,
**KHÔNG phải** mức giảm tiếng nói DS,A theo ISO 23351-1. Đúng y cái bẫy mà trang danh mục
cabin của OFINA đang cảnh báo khách. Không được đăng "giảm 30dB" trần.

## Việc tiếp theo

1. **Hỏi anh Vinh:** nguồn 11 cabin có phải Mingle (Hecor) không? Gần như chắc chắn có.
2. Nếu đúng → xin **bảng thông số đủ 11 mã + bộ ảnh chính thức**. Họ nhận OEM nên luôn sẵn và
   cho đại lý dùng — hợp pháp, nét hơn, và quan trọng nhất là **có quyền dùng**.
3. Yêu cầu thêm: biên bản đo theo **ISO 23351-1** nếu có, vì STC không trả lời được câu khách hỏi.
4. Với 2.653 sản phẩm còn lại: quy trình là **user tra ảnh bằng Yandex → gửi link trang khớp →
   tao bóc thông số, dịch, viết nội dung**. Khâu soi ảnh phải do người làm, như thử 1 đã chứng minh.

## Ảnh thì vẫn nên xin, đừng tải

Ngoài chuyện bản quyền: ảnh tải từ Taobao/Alibaba là **ảnh dùng chung với hàng trăm nơi khác**,
Google không xếp hạng ảnh trùng. Xin bộ gốc từ nhà sản xuất vừa hợp pháp vừa nét hơn, và chụp
thêm tại showroom thì có ảnh độc nhất — thứ duy nhất đối thủ không copy được.
