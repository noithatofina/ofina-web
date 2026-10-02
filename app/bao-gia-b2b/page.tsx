import Link from 'next/link'
import { Building2, Users, FileCheck, Truck, ShieldCheck, Clock } from 'lucide-react'
import QuoteForm from './QuoteForm'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://ofina.vn'

const BENEFITS = [
  {
    icon: Building2,
    title: 'Chiết khấu 5–15% cho đơn từ 50 triệu',
    desc: 'Báo giá theo danh mục và số lượng thực tế, không áp giá niêm yết từng món.',
  },
  {
    icon: FileCheck,
    title: 'Xuất hoá đơn VAT đầy đủ',
    desc: 'Hợp lệ để hạch toán và quyết toán chi phí doanh nghiệp.',
  },
  {
    icon: Truck,
    title: 'Miễn phí vận chuyển và lắp đặt',
    desc: 'Áp dụng toàn quốc cho đơn hàng lớn.',
  },
  {
    icon: Users,
    title: 'Kiến trúc sư tư vấn bố trí mặt bằng',
    desc: 'Miễn phí cho đơn từ 100 triệu, gồm phương án 3D theo mặt bằng thực tế.',
  },
  {
    icon: ShieldCheck,
    title: 'Bảo hành 24 tháng khung và gỗ',
    desc: 'Đệm mút, da, nỉ, cơ xoay và piston bảo hành 12 tháng.',
  },
  {
    icon: Clock,
    title: 'Phản hồi trong 30 phút',
    desc: 'Trong giờ hành chính, kể từ lúc nhận yêu cầu báo giá.',
  },
] as const

/** Gợi ý quy mô theo số chỗ ngồi — con số là mức thường gặp để khách tự áng, không phải cam kết. */
const SCALE = [
  { seats: '10–20 chỗ', cluster: 'cum-ban-lam-viec-4-nguoi', clusterLabel: 'Cụm bàn 4 người', meeting: '1 phòng họp 6–8 người' },
  { seats: '20–40 chỗ', cluster: 'cum-ban-lam-viec-6-nguoi', clusterLabel: 'Cụm bàn 6 người', meeting: '1 phòng họp 10 người + 1 phòng họp nhỏ' },
  { seats: '40–80 chỗ', cluster: 'cum-ban-lam-viec-8-nguoi', clusterLabel: 'Cụm bàn 8 người', meeting: '2 phòng họp + cabin gọi điện riêng' },
  { seats: 'trên 80 chỗ', cluster: 'cum-ban-lam-viec-15-nguoi', clusterLabel: 'Cụm bàn 15 người', meeting: 'Phòng họp lớn + phòng đào tạo' },
] as const

const CATEGORY_LINKS = [
  { slug: 'cum-ban-lam-viec', label: 'Cụm bàn làm việc' },
  { slug: 'ghe-xoay-luoi', label: 'Ghế xoay lưới' },
  { slug: 'ghe-cong-thai-hoc', label: 'Ghế công thái học' },
  { slug: 'ban-hop-van-phong', label: 'Bàn họp văn phòng' },
  { slug: 'ghe-phong-hop-chan-dung', label: 'Ghế phòng họp' },
  { slug: 'ban-giam-doc', label: 'Bàn giám đốc' },
  { slug: 'ghe-da-giam-doc', label: 'Ghế da giám đốc' },
  { slug: 'tu-tai-lieu-sat', label: 'Tủ tài liệu sắt' },
  { slug: 'tu-locker-go', label: 'Tủ locker' },
  { slug: 'quay-le-tan', label: 'Quầy lễ tân' },
  { slug: 'sofa-van-phong', label: 'Sofa văn phòng' },
  { slug: 'cabin-cach-am-di-dong', label: 'Cabin cách âm di động' },
] as const

const FAQS = [
  {
    q: 'OFINA có xuất hoá đơn VAT cho đơn hàng doanh nghiệp không?',
    a: 'Có. Toàn bộ đơn hàng doanh nghiệp được xuất hoá đơn VAT đầy đủ để hạch toán chi phí. Khi gửi yêu cầu báo giá, nêu rõ thông tin xuất hoá đơn để OFINA chuẩn bị trước.',
  },
  {
    q: 'Đơn hàng bao nhiêu thì được chiết khấu?',
    a: 'Chiết khấu 5–15% áp dụng từ đơn 50 triệu trở lên. Mức cụ thể phụ thuộc danh mục hàng và số lượng từng mã, nên báo giá luôn được tính lại theo danh sách thực tế thay vì lấy giá niêm yết trên web.',
  },
  {
    q: 'Có được xem mẫu thật trước khi đặt số lượng không?',
    a: 'Được. OFINA có hai showroom tại Hà Nội và TP.HCM, mở cửa 8:00–18:00 hàng ngày. Khách doanh nghiệp nên gọi trước và nêu danh mục cần xem để showroom chuẩn bị sẵn mẫu.',
  },
  {
    q: 'Bảo hành bao lâu?',
    a: 'Bảo hành tính theo từng bộ phận, không áp một mức chung: khung kim loại và phần gỗ 24 tháng; đệm mút, da, nỉ, cơ xoay và piston 12 tháng.',
  },
  {
    q: 'Cần gửi những gì để nhận được báo giá sát nhất?',
    a: 'Bốn thông tin: số chỗ ngồi cần trang bị, mặt bằng hoặc diện tích từng khu, danh mục cần mua, và thời hạn cần nhận hàng. Có bản vẽ mặt bằng thì gửi kèm, OFINA sẽ bố trí phương án theo đúng diện tích.',
  },
  {
    q: 'OFINA có nhận lắp đặt không, hay chỉ giao hàng?',
    a: 'Đơn hàng lớn được miễn phí vận chuyển và lắp đặt tận nơi, áp dụng toàn quốc. Lắp đặt gồm dựng cụm bàn, cân chỉnh ghế và dọn bao bì sau khi hoàn thiện.',
  },
] as const

export default function B2BPage() {
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Báo giá doanh nghiệp', item: `${SITE_URL}/bao-gia-b2b` },
    ],
  }

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      <section className="bg-gradient-to-br from-brand-900 to-brand-950 text-white py-16">
        <div className="container-custom text-center max-w-3xl mx-auto">
          <h1 className="font-display text-5xl md:text-6xl font-bold mb-4">Báo giá doanh nghiệp</h1>
          <p className="text-xl text-gray-200">
            Nội thất văn phòng theo số lượng · Hoá đơn VAT · Giao và lắp đặt tận nơi
          </p>
        </div>
      </section>

      <div className="container-custom py-16 grid lg:grid-cols-2 gap-12">
        <div className="space-y-10">
          <div>
            <h2 className="font-display text-3xl font-bold text-brand-950 mb-4">
              Mua số lượng khác gì mua lẻ
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Giá niêm yết trên web là giá bán lẻ từng món. Khi công ty trang bị cho cả một sàn văn
              phòng, cùng một mã ghế có thể đặt hàng chục đến hàng trăm chiếc, nên OFINA tính lại giá
              theo danh sách thực tế thay vì cộng giá lẻ. Càng dồn số lượng vào ít mã, giá về càng tốt.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Kho hàng hiện có <strong>2.664 sản phẩm</strong> trong <strong>94 danh mục</strong>, đủ
              để một văn phòng lấy toàn bộ từ cùng một nguồn — nhân viên, phòng họp, phòng giám đốc,
              lễ tân, tủ tài liệu và khu nghỉ.
            </p>
          </div>

          <div>
            <h2 className="font-display text-3xl font-bold text-brand-950 mb-6">
              Quyền lợi khách doanh nghiệp
            </h2>
            <div className="space-y-4">
              {BENEFITS.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="flex gap-4 p-4 bg-brand-50 rounded-xl">
                  <Icon className="w-10 h-10 text-brand-900 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold mb-1">{title}</h3>
                    <p className="text-sm text-gray-600">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 p-6 bg-yellow-50 rounded-xl border-l-4 border-accent-500">
              <h3 className="font-bold mb-2">Đơn từ 100 triệu</h3>
              <p className="text-sm text-gray-700">
                Miễn phí kiến trúc sư thiết kế phương án 3D, miễn phí lắp đặt toàn quốc, và giảm thêm
                10% cho đơn hàng tiếp theo của cùng công ty.
              </p>
            </div>
          </div>

          <div>
            <h2 className="font-display text-3xl font-bold text-brand-950 mb-4">
              Áng số lượng theo số chỗ ngồi
            </h2>
            <p className="text-gray-700 leading-relaxed mb-5">
              Bảng dưới là mức thường gặp để bạn tự áng trước khi gửi yêu cầu. Số thực tế vẫn phụ
              thuộc mặt bằng, nên OFINA sẽ tính lại khi có diện tích từng khu.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b-2 border-brand-900 text-left">
                    <th className="py-2 pr-4 font-semibold">Quy mô</th>
                    <th className="py-2 pr-4 font-semibold">Cụm bàn phù hợp</th>
                    <th className="py-2 font-semibold">Khu họp nên có</th>
                  </tr>
                </thead>
                <tbody>
                  {SCALE.map(row => (
                    <tr key={row.seats} className="border-b border-gray-200">
                      <td className="py-3 pr-4 font-medium whitespace-nowrap">{row.seats}</td>
                      <td className="py-3 pr-4">
                        <Link href={`/danh-muc/${row.cluster}`} className="text-brand-900 underline">
                          {row.clusterLabel}
                        </Link>
                      </td>
                      <td className="py-3 text-gray-700">{row.meeting}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h2 className="font-display text-3xl font-bold text-brand-950 mb-4">
              Quy trình từ yêu cầu đến lắp đặt
            </h2>
            <ol className="text-gray-700 space-y-3 list-decimal pl-5">
              <li>
                <strong>Gửi yêu cầu</strong> — điền form bên cạnh, nêu số chỗ ngồi và thời hạn cần
                hàng.
              </li>
              <li>
                <strong>Xác nhận trong 30 phút</strong> (giờ hành chính) để làm rõ danh mục và mặt
                bằng.
              </li>
              <li>
                <strong>Khảo sát mặt bằng</strong> nếu đơn cần bố trí theo diện tích thực tế.
              </li>
              <li>
                <strong>Báo giá theo danh sách</strong> kèm phương án 3D với đơn từ 100 triệu.
              </li>
              <li>
                <strong>Chốt hợp đồng</strong> và xuất hoá đơn VAT.
              </li>
              <li>
                <strong>Giao và lắp đặt tận nơi</strong>, dọn bao bì sau khi hoàn thiện.
              </li>
            </ol>
          </div>

          <div>
            <h2 className="font-display text-3xl font-bold text-brand-950 mb-4">
              Danh mục thường dùng khi setup văn phòng
            </h2>
            <div className="flex flex-wrap gap-2">
              {CATEGORY_LINKS.map(c => (
                <Link
                  key={c.slug}
                  href={`/danh-muc/${c.slug}`}
                  className="px-3 py-2 bg-brand-50 rounded-lg text-sm text-brand-950 hover:bg-brand-100"
                >
                  {c.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <QuoteForm />
        </div>
      </div>

      <div className="container-custom pb-16">
        <h2 className="font-display text-3xl font-bold text-brand-950 mb-6">Câu hỏi thường gặp</h2>
        <div className="space-y-3 max-w-3xl">
          {FAQS.map(f => (
            <details key={f.q} className="bg-brand-50 rounded-xl p-5">
              <summary className="font-semibold cursor-pointer">{f.q}</summary>
              <p className="text-gray-700 mt-3 leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>
        <p className="text-gray-700 mt-8 max-w-3xl">
          Chưa rõ điều gì thì xem thêm{' '}
          <Link href="/gioi-thieu" className="text-brand-900 underline">
            giới thiệu OFINA
          </Link>
          ,{' '}
          <Link href="/chinh-sach/bao-hanh" className="text-brand-900 underline">
            chính sách bảo hành
          </Link>{' '}
          và{' '}
          <Link href="/chinh-sach/thanh-toan" className="text-brand-900 underline">
            chính sách thanh toán
          </Link>
          .
        </p>
      </div>
    </div>
  )
}
