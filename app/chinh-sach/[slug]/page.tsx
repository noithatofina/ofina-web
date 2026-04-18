import { notFound } from 'next/navigation'
import Link from 'next/link'

const POLICIES: Record<string, { title: string; content: string }> = {
  'doi-tra': {
    title: 'Chính sách đổi trả',
    content: `
## Điều kiện đổi trả

OFINA cam kết đổi trả miễn phí trong vòng **7 ngày** kể từ khi khách nhận hàng, với các điều kiện:

- Sản phẩm còn nguyên tem, nhãn mác, chưa qua sử dụng
- Còn đầy đủ phụ kiện, hộp đựng gốc
- Có hóa đơn hoặc mã đơn hàng

## Quy trình đổi trả

1. **Liên hệ OFINA** qua hotline hoặc Zalo trong 7 ngày
2. **Cung cấp mã đơn** và lý do đổi trả
3. **Gửi sản phẩm** về kho OFINA (OFINA chịu phí vận chuyển nếu lỗi NSX)
4. **Nhận hàng mới** hoặc hoàn tiền trong 3-5 ngày

## Trường hợp không đổi trả

- Sản phẩm do khách tự ý thay đổi, sửa chữa
- Sản phẩm bị lỗi do sử dụng sai cách
- Đã quá 7 ngày kể từ ngày nhận
    `,
  },
  'bao-hanh': {
    title: 'Chính sách bảo hành',
    content: `
## Thời gian bảo hành

- **Khung kim loại, khung gỗ**: Bảo hành 24 tháng
- **Đệm, da, nỉ**: Bảo hành 12 tháng
- **Cơ chế xoay, piston**: Bảo hành 12 tháng
- **Linh kiện điện tử (motor bàn nâng hạ)**: Bảo hành 24 tháng

## Quy trình bảo hành

1. Liên hệ OFINA qua hotline trong thời gian bảo hành
2. Mô tả tình trạng + cung cấp mã đơn hàng
3. Kỹ thuật viên OFINA đến kiểm tra tại nhà (nội thành HCM) hoặc hướng dẫn sửa chữa
4. Thay thế linh kiện lỗi miễn phí

## Không áp dụng bảo hành

- Hỏng hóc do va đập, rơi, làm đổ nước
- Sửa chữa tại cơ sở không được OFINA ủy quyền
- Sản phẩm quá thời gian bảo hành
    `,
  },
  'van-chuyen': {
    title: 'Chính sách vận chuyển',
    content: `
## Phí vận chuyển

- **Nội thành TP.HCM**: Miễn phí cho đơn hàng từ 500,000đ
- **Ngoại thành HCM**: 50,000đ – 200,000đ (tùy khu vực)
- **Các tỉnh thành khác**: Tính theo cước của đơn vị vận chuyển (đã giảm giá cho KH OFINA)

## Thời gian giao hàng

- Nội thành HCM: **1-2 ngày làm việc**
- Các tỉnh miền Nam: **2-4 ngày làm việc**
- Miền Bắc, Trung: **4-7 ngày làm việc**

## Lắp đặt

- **Miễn phí lắp đặt** cho khách hàng nội thành TP.HCM
- Các tỉnh khác: Hướng dẫn lắp đặt chi tiết kèm video
    `,
  },
  'thanh-toan': {
    title: 'Phương thức thanh toán',
    content: `
## Các hình thức thanh toán

OFINA chấp nhận các hình thức sau:

### 💵 COD - Thanh toán khi nhận hàng
- Kiểm tra hàng trước khi thanh toán
- Không phí phát sinh

### 💳 Chuyển khoản ngân hàng
- **Ngân hàng**: Vietcombank
- **Số tài khoản**: 1234567890
- **Chủ tài khoản**: CÔNG TY TNHH OFINA VIỆT NAM
- **Nội dung**: OFINA + SĐT của bạn

### 📱 Ví điện tử
- MoMo
- ZaloPay
- VNPay

### 💳 Thẻ ATM/Visa/Master
- Thanh toán qua cổng VNPay an toàn

## Trả góp 0%

Áp dụng cho đơn hàng từ **3 triệu** qua thẻ tín dụng các ngân hàng: Vietcombank, Techcombank, VIB, TPBank...
    `,
  },
  'bao-mat': {
    title: 'Chính sách bảo mật',
    content: `
## Thu thập thông tin

OFINA chỉ thu thập các thông tin cần thiết để xử lý đơn hàng:
- Họ tên, số điện thoại, địa chỉ giao hàng
- Email (nếu có)

## Sử dụng thông tin

- Xử lý và giao đơn hàng
- Liên hệ xác nhận và hỗ trợ sau bán
- Gửi ưu đãi (chỉ khi KH đồng ý)

## Bảo mật thông tin

- Thông tin lưu trữ trên hệ thống bảo mật SSL
- Không chia sẻ với bên thứ ba trừ đơn vị vận chuyển (để giao hàng)
- Khách hàng có quyền yêu cầu xóa thông tin bất cứ lúc nào

## Cookies

Website sử dụng cookies để cải thiện trải nghiệm mua sắm. Khách có thể tắt cookies trong trình duyệt.
    `,
  },
  'dieu-khoan': {
    title: 'Điều khoản sử dụng',
    content: `
## Điều khoản sử dụng website OFINA.vn

Khi truy cập và sử dụng website này, bạn đồng ý với các điều khoản sau:

## 1. Thông tin sản phẩm
Thông tin, hình ảnh, giá trên website có thể thay đổi mà không báo trước. OFINA cam kết giá hiển thị tại thời điểm đặt hàng là giá cuối cùng.

## 2. Quyền sở hữu trí tuệ
Toàn bộ nội dung, hình ảnh, logo trên website thuộc sở hữu của OFINA. Nghiêm cấm sao chép dưới mọi hình thức.

## 3. Trách nhiệm khách hàng
- Cung cấp thông tin đặt hàng chính xác
- Thanh toán đúng hạn
- Nhận hàng và kiểm tra kỹ trước khi ký nhận

## 4. Giải quyết tranh chấp
Mọi tranh chấp được giải quyết qua thương lượng. Nếu không thành, sẽ đưa ra Tòa án có thẩm quyền tại TP.HCM.
    `,
  },
}

export function generateStaticParams() {
  return Object.keys(POLICIES).map(slug => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const p = POLICIES[slug]
  if (!p) return {}
  return { title: `${p.title} | OFINA`, description: p.title }
}

function renderMarkdown(md: string) {
  // Very simple markdown → HTML
  let html = md
  html = html.replace(/^## (.+)$/gm, '<h2 class="text-2xl font-bold text-brand-900 mt-8 mb-4">$1</h2>')
  html = html.replace(/^### (.+)$/gm, '<h3 class="text-xl font-bold text-brand-800 mt-6 mb-3">$1</h3>')
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  html = html.replace(/^- (.+)$/gm, '<li class="mb-1">$1</li>')
  html = html.replace(/(<li class="mb-1">.+<\/li>\n?)+/g, (m) => `<ul class="list-disc list-inside space-y-1 my-4 ml-4">${m}</ul>`)
  html = html.replace(/^(\d+)\. (.+)$/gm, '<li class="mb-1">$2</li>')
  html = html.split('\n\n').map(p => {
    p = p.trim()
    if (!p) return ''
    if (p.startsWith('<h') || p.startsWith('<ul')) return p
    return `<p class="mb-4 leading-relaxed">${p.replace(/\n/g, ' ')}</p>`
  }).join('\n')
  return html
}

export default async function PolicyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const policy = POLICIES[slug]
  if (!policy) return notFound()

  return (
    <div className="container-custom py-12 max-w-4xl">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-brand-900">Trang chủ</Link>
        <span className="mx-2">/</span>
        <Link href="/chinh-sach/doi-tra" className="hover:text-brand-900">Chính sách</Link>
        <span className="mx-2">/</span>
        <span className="text-brand-900 font-semibold">{policy.title}</span>
      </nav>

      <h1 className="font-display text-4xl md:text-5xl font-bold text-brand-950 mb-8">
        {policy.title}
      </h1>

      <article
        className="prose prose-lg max-w-none text-gray-700"
        dangerouslySetInnerHTML={{ __html: renderMarkdown(policy.content) }}
      />

      <div className="mt-12 p-6 bg-brand-50 rounded-xl">
        <h3 className="font-bold text-lg mb-3">Cần hỗ trợ thêm?</h3>
        <p className="text-gray-700 mb-4">Liên hệ OFINA qua các kênh sau để được tư vấn nhanh nhất:</p>
        <div className="flex gap-3 flex-wrap">
          <Link href="/" className="btn-primary">Về trang chủ</Link>
          <Link href="/san-pham" className="btn-ghost">Xem sản phẩm</Link>
        </div>
      </div>
    </div>
  )
}
