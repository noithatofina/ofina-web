# Audit hiệu năng (Core Web Vitals) — ofina.vn

**Ngày đo:** 25/09/2026, 11:25–11:35 (giờ VN, UTC+7)
**Máy đo:** máy local tại VN (macOS), qua Internet dân dụng — không phải origin, không SSH được vào Vercel.
**Stack:** Next.js 15 trên Vercel, region hàm chạy `sin1` (Singapore), PoP biên nhận request `hkg1` (Hong Kong) — xem `x-vercel-id`.

## 0. Phương pháp đo và GIỚI HẠN (đọc trước khi tin số liệu)

| Công cụ dự định | Thực tế | Lý do |
|---|---|---|
| PageSpeed Insights API công khai (không key) | **THẤT BẠI — HTTP 429 liên tục** | `quota_limit_value: "0"` cho consumer ẩn danh `project_number:583797351490`. Thử lại 3 lần cách nhau >30s trong suốt 10 phút, luôn 429. Đây là quota chia sẻ toàn cầu cho mọi request PSI không có API key, đã cạn/khoá tại thời điểm đo — **không phải lỗi tạm thời của riêng phiên này**. → **Không lấy được CrUX field data (28 ngày người dùng thật)** cho bất kỳ trang nào. |
| Lighthouse CLI (fallback) | **Dùng `npx lighthouse@13`, Chrome headless local, `--form-factor=mobile --throttling-method=simulate`** | Đây là lab data (1 lượt máy ảo, không phải người dùng thật). Đã chạy **2 lần** riêng cho trang chủ để kiểm tra độ ổn định (xem mục 2 — kết quả **không ổn định**, phải đọc kỹ). |
| curl đo timing | 3 lần liên tiếp/trang, đo `time_starttransfer` (TTFB) và `time_total`, cách nhau 1s | Theo đúng yêu cầu: lần 1 có thể "nguội", lần 2–3 mới đại diện. **Đã kiểm tra thêm header `x-vercel-cache`/`age`** — phát hiện quan trọng ở mục 1. |

**Vì không có CrUX, báo cáo này KHÔNG thể khẳng định trang có đạt ngưỡng "Good" theo phân vị p75 của Google hay không** — chỉ đánh giá được trên lab data (1 lượt máy, không đại diện phân phối người dùng thật). Khuyến nghị: xin cấp Google API key (PSI có quota lớn hơn nhiều khi có key) hoặc dùng CrUX Vis/CrUX API khi ofina.vn có đủ traffic (CrUX cần lưu lượng tối thiểu, có thể domain còn quá nhỏ nên trước đây cũng có thể ra 404 dù có key).

---

## 1. PHÁT HIỆN QUAN TRỌNG NHẤT — đọc trước khi xem điểm số

### 1.1 — 3/5 trang không có cache CDN, render lại 100% mỗi request (SSR mù cache)

Lệnh chạy:
```bash
curl -s -D - -o /dev/null "https://ofina.vn/<path>" -H "User-Agent: Mozilla/5.0"
```
Kết quả header (chạy 3 lần liên tiếp mỗi URL để loại trừ "miss lần đầu rồi sẽ hit"):

| Trang | `x-vercel-cache` | `cache-control` | `age` |
|---|---|---|---|
| `/` | **HIT** (cả 3 lần) | `public, max-age=0, must-revalidate` | 890s |
| `/blog` | **HIT** (cả 3 lần) | `public, max-age=0, must-revalidate` | 73s |
| `/san-pham` | **MISS** (cả 3 lần liên tiếp, không đổi) | `private, no-cache, no-store, max-age=0, must-revalidate` | 0 |
| `/san-pham/ban-hop-sonic-s09-ofn-bhl-0017` | **MISS** (cả 3 lần liên tiếp) | `private, no-cache, no-store, max-age=0, must-revalidate` | 0 |
| `/danh-muc/ban-cafe-gap-gon` | **MISS** (cả 3 lần liên tiếp) | `private, no-cache, no-store, max-age=0, must-revalidate` | 0 |

**Đọc kết quả:** `/san-pham`, PDP (`/san-pham/[slug]`) và `/danh-muc/[slug]` luôn MISS **kể cả sau 3 lần gọi liên tiếp** (không phải "cache rỗng lần đầu rồi lần sau sẽ hit" — nếu vậy lần 2-3 đã phải HIT). `cache-control: private, no-cache, no-store` nghĩa là các route này **không dùng SSG/ISR mà force-dynamic** (khả năng cao do dùng `cookies()`, `headers()`, `noStore()`, hoặc `export const dynamic = 'force-dynamic'` trong route đó) — **mỗi lượt Googlebot/người dùng đều kích hoạt render Node.js đầy đủ trên Vercel, không có edge cache nào giúp cả.** Đây là nguyên nhân trực tiếp khiến TTFB các trang này (0,33–1,03s) cao gấp 2-5 lần so với `/` và `/blog` (0,19–0,23s, đang HIT cache).

**Mức độ: CRITICAL.** Ảnh hưởng TTFB (phần LCP) trên toàn bộ trang sản phẩm/danh mục — đúng nhóm trang có giá trị SEO/chuyển đổi cao nhất của một site TMĐT.

### 1.2 — Trang chủ nặng 9,66MB, riêng 5 ảnh slider hero đã chiếm 8,1MB (84% tổng ảnh)

Lệnh: tải `https://ofina.vn/` bằng Lighthouse, đọc audit `network-requests`, cộng `transferSize` theo loại tài nguyên (script `node -e` chạy trên JSON thật, không tính tay):

```
Image        count=26   transfer=9.483,1 KB
Script       count=15   transfer=155,0 KB
Font         count=14   transfer=120,1 KB
Document     count=1    transfer=107,0 KB
Stylesheet   count=1    transfer=12,6 KB
Fetch        count=10   transfer=9,5 KB
Other        count=1    transfer=8,8 KB
TỔNG         count=68   transfer=9.896,0 KB  (~9,66 MB)
```

5 ảnh nặng nhất — toàn bộ đều là **PNG chưa nén trong hero slider trang chủ**:

| Ảnh | Dung lượng tải | Định dạng |
|---|---|---|
| `noi-that-van-phong-cao-cap-ofina.png` | 2.067 KB | PNG |
| `phong-hop-noi-that-doanh-nghiep-ofina.png` | 2.053 KB | PNG |
| `ghe-cong-thai-hoc-da-mau-ofina.png` | 1.530 KB | PNG |
| `ghe-giam-doc-van-phong-cao-cap-ofina.png` | 1.369 KB | PNG |
| `giai-phap-noi-that-van-phong-ofina.png` | 1.290 KB | PNG |
| **Tổng 5 ảnh hero** | **8.309 KB (~8,1 MB)** | |

So sánh: 21 ảnh sản phẩm còn lại (đã dùng WebP/JPG hợp lý) chỉ nặng tổng cộng **1.174 KB**. Audit `image-delivery-insight` của Lighthouse ước tính có thể **tiết kiệm 9.287 KB** (~9,07 MB, gần như toàn bộ) nếu nén/đổi định dạng đúng cách — con số này do chính Lighthouse tính (so ảnh gốc với ảnh nén WebP/kích thước hiển thị thực tế), không phải tôi tự ước lượng.

**Vì sao xảy ra:** carousel hero tải **cả 5 slide ảnh cùng lúc khi vào trang** (không lazy-load theo slide đang hiện), toàn bộ ở định dạng PNG (định dạng không tối ưu cho ảnh chụp nhiều màu) và có vẻ chưa resize đúng kích thước hiển thị thực tế trên mobile (412px width) — ảnh PNG >2MB cho vùng hiển thị 412×320px là dấu hiệu ảnh gốc full-size chưa qua pipeline resize/nén.

**Mức độ: CRITICAL.** Đây là nguyên nhân gốc khiến LCP trang chủ cực kỳ xấu ở mục 2.

### 1.3 — DOM trang chủ 1.529 phần tử, vượt ngưỡng khuyến nghị 1.500

Đo bằng audit `dom-size-insight` của Lighthouse (không phải đếm tay): **1.529 elements**, độ sâu tối đa 13 tầng. Các trang khác đều an toàn: `/san-pham` 744, PDP 750, `/danh-muc/[slug]` 555, `/blog` 383. DOM lớn làm tăng chi phí style/layout recalculation mỗi khi có tương tác (ảnh hưởng INP), dù chưa phải mức nghiêm trọng (>1.500 mới bắt đầu đáng lo, ở đây vừa vượt nhẹ).

**Mức độ: MEDIUM** (chỉ ở trang chủ, chưa nghiêm trọng nhưng nên theo dõi khi thêm section mới).

### 1.4 — LCP lab của trang chủ đo 2 lần ra 2 con số rất khác nhau — KHÔNG dùng một con số duy nhất để kết luận

Chạy `npx lighthouse@13` **2 lần độc lập, cách nhau ~4 phút**, cùng cấu hình (`mobile`, `throttling-method=simulate`):

| | Lần 1 | Lần 2 |
|---|---|---|
| Performance score | 60 | 62 |
| LCP **quan sát thực tế** (observed, trace thật, không mô phỏng) | 6.566 ms | 2.384 ms |
| LCP **mô phỏng mobile** (số Lighthouse/PSI thường hiển thị, giả lập mạng chậm + CPU chậm 4x) | **54.281 ms** | **37.263 ms** |
| TTFB quan sát | 1.257 ms | 228 ms |

**Đọc đúng cách:** cả LCP-quan-sát lẫn LCP-mô-phỏng đều dao động rất mạnh giữa 2 lần chạy (quan sát: 2,4s↔6,6s; mô phỏng: 37,3s↔54,3s) — đúng như bài học "đo một lượt duy nhất → trúng lượt nguội/khác thường → phóng đại hoặc bóp méo con số", **tôi không lấy con số 54,3s hay 37,3s làm kết luận LCP chính thức**. Điều CHẮC CHẮN và nhất quán qua cả 2 lần đo:
- Điểm Performance ổn định quanh **60-62** (khớp cả 2 lần, không dao động).
- LCP mô phỏng luôn rơi vào vùng **"Poor" gấp 9–14 lần ngưỡng xấu (>4s)** — dù con số tuyệt đối không đáng tin, mức độ nghiêm trọng thì nhất quán và tương ứng chính xác với phát hiện 1.2 (8MB ảnh hero PNG).
- Nguyên nhân kỹ thuật khớp với breakdown LCP (`lcp-breakdown-insight`, đo trên trace thật): `elementRenderDelay` (thời gian ảnh hero đã tải xong nhưng chưa được vẽ lên màn hình, do JS/font/script khác đang chặn main thread) chiếm 1,4–4,3s tuỳ lần đo — riêng phần này đã vượt ngưỡng "Good" (2,5s) của cả một LCP hoàn chỉnh.

So sánh 3 trang còn lại (ổn định hơn nhiều, không có carousel nặng):

| Trang | LCP quan sát | LCP mô phỏng mobile | TTFB quan sát |
|---|---|---|---|
| `/san-pham` | 2.485 ms | 4.861 ms | 1.255 ms |
| PDP (`/san-pham/[slug]`) | 919 ms | 3.662 ms | 662 ms |
| `/danh-muc/[slug]` | 1.277 ms | 4.048 ms | 634 ms |
| `/blog` | 2.362 ms | 3.062 ms | 662 ms |

---

## 2. Bảng tổng hợp điểm & Core Web Vitals (lab, Lighthouse 13, mobile, simulate throttling)

| Trang | Performance score | LCP (lab, mô phỏng mobile) | CLS (lab) | TBT (lab, proxy rủi ro INP*) | Đạt/Không đạt ngưỡng "Good" |
|---|---|---|---|---|---|
| `/` (trang chủ) | **60–62 / 100** (2 lần đo, không ổn định — xem 1.4) | 37,3–54,3s (**không ổn định, xem 1.4**) | 0,0002 (Good) | 200–250ms | **LCP: Poor** · CLS: Good · TBT: cận Poor |
| `/san-pham` | **81 / 100** | 4,9s | 0,0002 (Good) | 70ms | LCP: **Poor** (>4s) · CLS: Good · TBT: Good |
| `/san-pham/ban-hop-sonic-s09-ofn-bhl-0017` (PDP) | **90 / 100** | 3,7s | 0 (Good) | 60ms | LCP: **Needs Improvement** (2,5–4s) · CLS: Good · TBT: Good |
| `/danh-muc/ban-cafe-gap-gon` | **87 / 100** | 4,0s | 0 (Good) | 50ms | LCP: **Needs Improvement/Poor** (biên 4s) · CLS: Good · TBT: Good |
| `/blog` | **91 / 100** | 3,1s | 0 (Good) | 140ms | LCP: **Needs Improvement** (2,5–4s) · CLS: Good · TBT: Good |

*\*INP thật sự KHÔNG đo được bằng Lighthouse lab (cần tương tác người dùng thật + CrUX field data — đã không lấy được do PSI 429). Total Blocking Time (TBT) chỉ là proxy gần đúng cho nguy cơ tác vụ JS dài chặn main thread. **Không có trang nào trong báo cáo này có số INP field-data thật — cần bổ sung khi có Google API key hoặc đủ traffic CrUX.***

**Phân loại điểm theo thang Google:** 90-100 xanh (tốt) · 50-89 cam (cần cải thiện) · 0-49 đỏ (kém). Theo đó: PDP, `/danh-muc`, `/blog` ở mức 90/87/91 — **suýt xanh, không cần đại phẫu**; `/san-pham` (81) và trang chủ (60-62) ở vùng cam đậm, trang chủ gần biên đỏ.

---

## 3. Chi tiết đo curl (TTFB & tổng thời gian, tại VN qua CDN Vercel — KHÔNG phải origin vì Vercel không cho SSH vào origin)

Lệnh (chạy 3 lần/trang, cách nhau 1s):
```bash
curl -s -o /dev/null -w "ttfb=%{time_starttransfer} total=%{time_total} size=%{size_download} code=%{http_code}" \
  -H "User-Agent: Mozilla/5.0 ..." "<url>"
```

| Trang | Lần 1 (ttfb/total) | Lần 2 (ttfb/total) | Lần 3 (ttfb/total) | **TTFB trung vị** | **Total trung vị** | Kích thước HTML |
|---|---|---|---|---|---|---|
| `/` | 0,186s / 0,296s | 0,197s / 0,320s | 0,186s / 0,299s | **0,186s** | **0,299s** | 730,4 KB |
| `/san-pham` | 0,494s / 0,583s | **1,032s / 1,149s** | 0,466s / 0,586s | **0,494s** | **0,586s** | 324,5 KB |
| PDP | 0,343s / 0,443s | 0,371s / 0,473s | 0,359s / 0,450s | **0,359s** | **0,450s** | 230,3 KB |
| `/danh-muc/[slug]` | 0,360s / 0,451s | 0,359s / 0,412s | 0,332s / 0,417s | **0,359s** | **0,417s** | 196,4 KB |
| `/blog` | 0,186s / 0,214s | 0,228s / 0,267s | 0,204s / 0,232s | **0,204s** | **0,232s** | 72,3 KB |

**Đọc kết quả:** lần 1 KHÔNG phải lúc nào cũng là lần chậm nhất (ví dụ `/san-pham` lần 2 mới là lần chậm nhất, gấp đôi lần 1 và 3) — vì các trang MISS cache render lại hoàn toàn mỗi lần, độ trễ phụ thuộc tải tức thời của hàm serverless, không phải hiện tượng "cold start điển hình chỉ ở lần đầu". Đây là bằng chứng bổ sung củng cố phát hiện 1.1: thiếu cache khiến thời gian phản hồi bấp bênh theo từng lượt.

---

## 4. Cân nặng tài nguyên trang chủ (JS/CSS/ảnh) — chi tiết đầy đủ

Nguồn số liệu: audit `network-requests` của Lighthouse (JSON thật, cộng bằng script Node, không tính tay).

| Loại | Số request | Dung lượng tải (transfer) | Dung lượng gốc (resource, chưa nén) |
|---|---|---|---|
| Ảnh (Image) | 26 | **9.483,1 KB** | 9.466,8 KB |
| JS (Script) | 15 | 155,0 KB | 482,4 KB (chưa giải nén) |
| Font (woff2) | 14 | 120,1 KB | 117,2 KB |
| HTML (Document) | 1 | 107,0 KB | 730,4 KB (chưa giải nén — Brotli/gzip nén tốt) |
| CSS (Stylesheet) | 1 | 12,6 KB | 70,6 KB |
| Fetch (RSC prefetch Next.js) | 10 | 9,5 KB | 25,0 KB |
| Khác (favicon...) | 1 | 8,8 KB | 39,6 KB |
| **TỔNG** | **68** | **9.896,0 KB (~9,66 MB)** | 10.932,1 KB |

Ảnh chiếm **95,8%** tổng băng thông trang chủ, và riêng 5 ảnh hero PNG chiếm **87,6%** tổng ảnh (8.309 / 9.483 KB) — xem phân tích nguyên nhân ở mục 1.2. JS/CSS/Font tổng cộng chỉ ~288KB nén, không phải vấn đề chính của trang chủ.

Không phát hiện script bên thứ ba nặng (không có Google Tag Manager/Facebook Pixel/chat widget dạng script chặn render) — toàn bộ 15 script đều là chunk Next.js tự host (`_next/static/chunks/*`), tốt cho INP.

---

## 5. Danh sách vấn đề theo mức độ ưu tiên

### CRITICAL
1. **3 route (`/san-pham`, PDP `/san-pham/[slug]`, `/danh-muc/[slug]`) không có cache CDN — `cache-control: private, no-cache, no-store`, `x-vercel-cache: MISS` cả 3 lần đo liên tiếp.** Mọi lượt Googlebot/người dùng đều buộc Vercel render Node.js đầy đủ, TTFB cao gấp 2-5 lần so với 2 route đang cache tốt (`/`, `/blog`). Đây là nhóm trang lưu lượng/giá trị chuyển đổi cao nhất (danh mục + sản phẩm), ảnh hưởng trực tiếp LCP và ngân sách crawl Googlebot trên quy mô lớn (nhân với hàng nghìn sản phẩm/danh mục).
   → **Khuyến nghị:** kiểm tra vì sao route mất khả năng cache — thường do dùng `cookies()`/`headers()`/`no-store` không cần thiết trong Server Component, hoặc bật `export const dynamic = 'force-dynamic'`. Chuyển sang ISR (`export const revalidate = N`) hoặc generateStaticParams cho các slug sản phẩm/danh mục phổ biến. Impact kỳ vọng: TTFB giảm từ ~350-1.000ms xuống dưới 100ms (tương đương mức `/` và `/blog` hiện tại).

2. **5 ảnh hero slider trang chủ nặng tổng 8,1MB, định dạng PNG chưa nén, tải cùng lúc khi vào trang.** Là nguyên nhân trực tiếp khiến `elementRenderDelay` của LCP kéo dài 1,4-4,3s và điểm Performance trang chủ mắc kẹt ở 60-62 (thấp nhất trong 5 trang, thấp hơn hẳn PDP/blog 90/91).
   → **Khuyến nghị:** (a) đổi PNG → WebP/AVIF, resize đúng kích thước hiển thị mobile (~412px width thay vì full-size gốc) — Lighthouse ước tính tiết kiệm được ~9MB; (b) chỉ tải ảnh slide đầu tiên ngay (`fetchpriority="high"`, đã có preload cho 1 ảnh — cần áp dụng cho ảnh đang hiển thị thực tế, không phải cố định 1 ảnh); (c) lazy-load 4 ảnh slide còn lại, chỉ tải khi carousel sắp chuyển tới. Impact kỳ vọng: LCP trang chủ giảm mạnh, có thể về vùng "Needs improvement" hoặc "Good".

### HIGH
3. **Điểm Performance trang chủ (60-62/100) thấp nhất trong 5 trang, LCP lab luôn ở vùng Poor sâu qua cả 2 lần đo độc lập** (xem mục 1.4) dù con số tuyệt đối không ổn định. Cần re-test bằng PSI/CrUX thật (field data) ngay khi hết giới hạn quota, vì đây là trang có traffic cao nhất.
4. **14 file font riêng biệt (woff2) tải trên mọi trang** (~113-120KB) — dùng `next/font` là đúng hướng (đã preload, đã tự host, không phụ thuộc Google Fonts) nhưng 14 file cho một website là khá nhiều, có thể đang load dư weight/subset không dùng tới. Rà soát để giảm số lượng file font xuống còn các weight thực sự dùng, giảm số request chặn render (`render-blocking-insight` xác nhận CSS 12,6KB đang chặn render, cộng thêm chuỗi font preload kéo dài trước khi ảnh hero được vẽ).
5. **`/san-pham` điểm 81, LCP mô phỏng 4,9s (Poor)** — nặng hơn PDP/danh-muc dù cùng kiến trúc route MISS cache, do tải nhiều ảnh sản phẩm hơn (775KB ảnh, 21 ảnh) trên cùng một trang listing. Cân nhắc lazy-load ảnh sản phẩm dưới fold + giảm số sản phẩm render sẵn ở lần tải đầu (infinite scroll/pagination thay vì render hết).

### MEDIUM
6. **DOM trang chủ 1.529 phần tử — vừa vượt ngưỡng khuyến nghị 1.500.** Chưa nghiêm trọng nhưng là tín hiệu sớm cho rủi ro INP khi thêm section mới. Các trang khác đều an toàn (383-750 phần tử).
7. **Không đo được INP thật (cần CrUX field data, PSI đang 429).** Toàn bộ đánh giá "tốt/xấu" về khả năng phản hồi tương tác trong báo cáo này chỉ dựa trên TBT (proxy lab), chưa phải INP chuẩn Google dùng để xếp hạng. Cần đo lại bằng PSI có API key hoặc CrUX Vis khi đủ traffic.
8. **`legacy-javascript-insight` phát hiện ~11,4KB code polyfill dư thừa** (`Array.prototype.at/flat/flatMap` transpile không cần thiết cho trình duyệt hiện đại) trong chunk `1255-5c680abb9db89955.js` — có thể do cấu hình target build (browserslist) quá rộng. Ảnh hưởng nhỏ, nên dọn khi có dịp build lại.

### LOW
9. Ảnh sản phẩm dạng WebP/JPG ở các trang danh mục/sản phẩm nhìn chung đã tối ưu tốt (17-117KB/ảnh) — không cần hành động gấp, chỉ nên tiếp tục chuẩn hoá về WebP/AVIF cho toàn bộ 21 ảnh còn lại của `/san-pham`.
10. Homepage và `/blog` đã tận dụng cache CDN tốt (`x-vercel-cache: HIT`, TTFB 0,19-0,20s) — đây là điểm mạnh, cần giữ nguyên khi refactor, tránh vô tình làm mất cache như đã xảy ra ở 3 route mục CRITICAL #1.

---

## 6. Tổng kết điểm số

| Trang | Performance Score (lab, mobile) | Trạng thái tổng thể |
|---|---|---|
| `/` (trang chủ) | **60-62/100** | Cam đậm, gần biên đỏ — CẦN XỬ LÝ NGAY (ảnh hero + cache) |
| `/san-pham` | **81/100** | Cam — LCP vẫn Poor do cache MISS + nhiều ảnh |
| PDP (`/san-pham/[slug]`) | **90/100** | Sát ngưỡng xanh — chỉ còn TTFB do MISS cache cần vá |
| `/danh-muc/[slug]` | **87/100** | Cam nhạt — chủ yếu do MISS cache |
| `/blog` | **91/100** | Xanh — tốt nhất trong 5 trang |

**Ưu tiên xử lý theo thứ tự tác động:** (1) vá cache MISS ở 3 route dynamic → lợi toàn site vì áp dụng cho hàng nghìn trang sản phẩm/danh mục cùng kiến trúc; (2) nén/lazy-load ảnh hero trang chủ → lợi riêng LCP trang chủ nhưng trang chủ là trang traffic cao nhất; (3) dọn font/JS dư thừa → lợi nhỏ, làm sau.

---

## Phụ lục — lệnh đã chạy để lấy từng số liệu

- Cache header: `curl -s -D - -o /dev/null "<url>" -H "User-Agent: Mozilla/5.0"` — lọc `x-vercel-cache`, `cache-control`, `age`.
- Timing 3 lần: `curl -s -o /dev/null -w "ttfb=%{time_starttransfer} total=%{time_total} size=%{size_download} code=%{http_code}" "<url>"`.
- Lab Performance/CWV: `npx lighthouse@13 "<url>" --output json --chrome-flags="--headless=new --no-sandbox" --only-categories=performance --form-factor=mobile --throttling-method=simulate` (Chrome local, `/Applications/Google Chrome.app`).
- Cân nặng tài nguyên: đọc audit `network-requests` trong JSON Lighthouse trên bằng script Node, cộng `transferSize` theo `resourceType`.
- PSI API công khai: `curl -G "https://www.googleapis.com/pagespeedonline/v5/runPagespeed" --data-urlencode "url=<url>" --data-urlencode "strategy=mobile"` → **429 `RESOURCE_EXHAUSTED`, `quota_limit_value: "0"`** ở mọi lần thử (3 lần, cách nhau 30s-10 phút).
