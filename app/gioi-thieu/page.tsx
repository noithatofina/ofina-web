import Link from 'next/link'
import { Package, LayoutGrid, MapPin, ShieldCheck } from 'lucide-react'
import { getSetting } from '@/lib/site-settings'
import { BRANCHES, CONTACT } from '@/lib/utils'

export const metadata = {
  alternates: { canonical: '/gioi-thieu' },
  title: 'Về OFINA — nhà cung cấp nội thất văn phòng',
  description:
    'OFINA cung cấp nội thất văn phòng cho doanh nghiệp: 2.664 sản phẩm, showroom tại Hà Nội và TP.HCM, xuất hoá đơn VAT, giao và lắp đặt tận nơi.',
}

export const revalidate = 300

/**
 * Nội dung CMS chỉ được thay bố cục mặc định khi là bài viết thật.
 * Ngưỡng tính trên text đã bỏ thẻ: chữ giữ chỗ kiểu "<p>Nội dung...</p>"
 * từng vượt ngưỡng 10 ký tự cũ và đè sạch trang này trên bản đang chạy.
 */
const MIN_CMS_TEXT = 200

function plainTextLength(html: string) {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().length
}

export default async function AboutPage() {
  const cms = await getSetting<{ title: string; content: string }>('page.gioi_thieu', {
    title: '',
    content: '',
  })

  const hasCustomContent = Boolean(cms.content) && plainTextLength(cms.content) >= MIN_CMS_TEXT

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-900 to-brand-950 text-white py-20">
        <div className="container-custom text-center max-w-3xl mx-auto">
          <h1 className="font-display text-5xl md:text-6xl font-bold mb-4">
            {cms.title || 'Về OFINA'}
          </h1>
          {!hasCustomContent && (
            <p className="text-xl text-gray-200">
              Nhà cung cấp nội thất văn phòng cho doanh nghiệp — showroom tại Hà Nội và TP.HCM
            </p>
          )}
        </div>
      </section>

      <div className="container-custom py-16 space-y-16">
        {hasCustomContent ? (
          <div
            className="blog-content max-w-3xl mx-auto"
            dangerouslySetInnerHTML={{ __html: cms.content }}
          />
        ) : (
          <>
            {/* Chỉ các con số kiểm chứng được từ kho hàng và chi nhánh thật */}
            <section className="grid md:grid-cols-4 gap-6">
              {[
                { icon: Package, num: '2.664', label: 'Sản phẩm đang bán' },
                { icon: LayoutGrid, num: '94', label: 'Danh mục hàng' },
                { icon: MapPin, num: '2', label: 'Showroom: Hà Nội, TP.HCM' },
                { icon: ShieldCheck, num: '24', label: 'Tháng bảo hành khung, gỗ' },
              ].map(({ icon: Icon, num, label }) => (
                <div key={label} className="text-center">
                  <Icon className="w-10 h-10 mx-auto text-brand-900 mb-3" />
                  <div className="text-3xl font-bold text-brand-900 mb-1">{num}</div>
                  <div className="text-gray-600">{label}</div>
                </div>
              ))}
            </section>

            <section className="max-w-3xl mx-auto prose prose-lg">
              <h2 className="font-display text-3xl font-bold text-brand-950 mb-6">OFINA làm gì</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                OFINA cung cấp nội thất văn phòng cho doanh nghiệp Việt Nam: ghế công thái học, ghế
                giám đốc, bàn làm việc, bàn họp, tủ tài liệu, tủ locker, quầy lễ tân và cabin cách âm
                di động. Hiện có <strong>2.664 sản phẩm</strong> trong <strong>94 danh mục</strong>,
                phục vụ cả đơn lẻ một chiếc ghế và đơn số lượng cho cả sàn văn phòng.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                Cái tên <strong>OFINA</strong> ghép từ <strong>OFI</strong> (Office — văn phòng) và{' '}
                <strong>NA</strong> (Nam — Việt Nam).
              </p>

              <h2 className="font-display text-3xl font-bold text-brand-950 mt-10 mb-6">
                Làm việc với khách doanh nghiệp
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Nếu công ty bạn đang setup văn phòng mới hoặc thay nội thất theo số lượng, OFINA nhận
                báo giá theo danh mục và số lượng cụ thể thay vì bán theo giá niêm yết từng món.
              </p>
              <ul className="text-gray-700 space-y-2 mb-6">
                <li>
                  <strong>Chiết khấu theo số lượng</strong> — áp dụng từ đơn 50 triệu trở lên, mức
                  cụ thể tuỳ danh mục và số lượng.
                </li>
                <li>
                  <strong>Xuất hoá đơn VAT</strong> cho toàn bộ đơn hàng doanh nghiệp.
                </li>
                <li>
                  <strong>Giao và lắp đặt tận nơi</strong>, miễn phí toàn quốc với đơn hàng lớn.
                </li>
                <li>
                  <strong>Tư vấn bố trí mặt bằng</strong> theo số chỗ ngồi và diện tích thực tế.
                </li>
              </ul>
              <p className="text-gray-700 leading-relaxed mb-6">
                Gửi yêu cầu qua{' '}
                <Link href="/bao-gia-b2b" className="text-brand-900 underline">
                  trang báo giá doanh nghiệp
                </Link>{' '}
                hoặc gọi trực tiếp {CONTACT.hotline}.
              </p>

              <h2 className="font-display text-3xl font-bold text-brand-950 mt-10 mb-6">
                Bảo hành
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Thời hạn bảo hành theo từng bộ phận, không áp một mức chung cho cả sản phẩm:
              </p>
              <ul className="text-gray-700 space-y-2 mb-4">
                <li>
                  <strong>24 tháng</strong> — khung kim loại và phần gỗ.
                </li>
                <li>
                  <strong>12 tháng</strong> — đệm mút, da, nỉ, cơ xoay và piston.
                </li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                Chi tiết điều kiện áp dụng xem tại{' '}
                <Link href="/chinh-sach/bao-hanh" className="text-brand-900 underline">
                  chính sách bảo hành
                </Link>
                .
              </p>

              <h2 className="font-display text-3xl font-bold text-brand-950 mt-10 mb-6">
                Showroom OFINA
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Hai showroom mở cửa hàng ngày 8:00 – 18:00. Khách doanh nghiệp nên gọi trước để
                chuẩn bị sẵn mẫu cần xem theo danh mục.
              </p>
              <ul className="text-gray-700 space-y-3 not-prose">
                {BRANCHES.map(b => (
                  <li key={b.name} className="bg-brand-50 p-5 rounded-xl">
                    <div className="font-bold text-brand-950">{b.name}</div>
                    <div className="text-gray-700">{b.address}</div>
                    <div className="text-gray-700">
                      {b.phones.map((p, i) => (
                        <span key={p}>
                          {i > 0 && ' · '}
                          <a href={`tel:${p}`} className="text-brand-900 underline">
                            {p}
                          </a>
                        </span>
                      ))}
                    </div>
                  </li>
                ))}
              </ul>
              {/* TODO(pháp nhân): bổ sung tên pháp nhân + mã số thuế khi anh Vinh cấp.
                  Phòng mua của khách doanh nghiệp cần hai thông tin này để mở nhà cung cấp
                  trên hệ thống kế toán. Chưa có thì không tự điền. */}
            </section>
          </>
        )}

        {/* CTA */}
        <section className="bg-brand-50 rounded-2xl p-8 md:p-12 text-center">
          <h2 className="font-display text-3xl font-bold text-brand-950 mb-4">
            Cần báo giá cho cả văn phòng?
          </h2>
          <p className="text-gray-700 mb-6">
            Gửi danh mục và số lượng, OFINA báo giá kèm thời gian giao và lắp đặt.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link href="/bao-gia-b2b" className="btn-accent">
              Nhận báo giá doanh nghiệp
            </Link>
            <Link href="/san-pham" className="btn-primary">
              Xem sản phẩm
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
