import Link from 'next/link'
import { Award, Users, Package, MapPin } from 'lucide-react'
import { getSetting } from '@/lib/site-settings'

export const metadata = {
  title: 'Về OFINA — Nội Thất Văn Phòng Việt Nam',
  description: 'OFINA là thương hiệu nội thất văn phòng chuyên cung cấp giải pháp toàn diện cho doanh nghiệp Việt Nam. Chuẩn quốc tế, giá hợp lý.',
}

export const revalidate = 300

export default async function AboutPage() {
  const cms = await getSetting<{ title: string; content: string }>('page.gioi_thieu', {
    title: '',
    content: '',
  })

  // Nếu admin đã viết content → dùng nội dung đó. Nếu không → dùng layout mặc định.
  const hasCustomContent = Boolean(cms.content && cms.content.length > 10)

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
              Nội thất văn phòng chuẩn quốc tế, giá hợp lý cho doanh nghiệp Việt Nam
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
            {/* Stats */}
            <section className="grid md:grid-cols-4 gap-6">
              {[
                { icon: Package, num: '2,400+', label: 'Sản phẩm' },
                { icon: Users, num: '1,200+', label: 'Khách hàng' },
                { icon: Award, num: '99%', label: 'Hài lòng' },
                { icon: MapPin, num: '63', label: 'Tỉnh thành' },
              ].map(({ icon: Icon, num, label }) => (
                <div key={label} className="text-center">
                  <Icon className="w-10 h-10 mx-auto text-brand-900 mb-3" />
                  <div className="text-3xl font-bold text-brand-900 mb-1">{num}</div>
                  <div className="text-gray-600">{label}</div>
                </div>
              ))}
            </section>

            {/* Story */}
            <section className="max-w-3xl mx-auto prose prose-lg">
              <h2 className="font-display text-3xl font-bold text-brand-950 mb-6">Câu chuyện OFINA</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                OFINA được sinh ra từ ý tưởng đơn giản: <strong>Người Việt xứng đáng có không gian làm việc đẹp,
                chuẩn quốc tế với giá hợp lý</strong>.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                Cái tên <strong>OFINA</strong> là sự kết hợp của hai chữ: <strong>OFI</strong> (Office — văn phòng)
                và <strong>NA</strong> (Nam — Việt Nam). Đây không chỉ là tên — đó là cam kết của chúng tôi:
              </p>
              <ul className="text-gray-700 space-y-2 mb-6">
                <li>✅ Nội thất văn phòng chất lượng quốc tế</li>
                <li>✅ Được thiết kế phù hợp với người Việt</li>
                <li>✅ Giá cả hợp lý cho mọi doanh nghiệp</li>
              </ul>

              <h2 className="font-display text-3xl font-bold text-brand-950 mt-10 mb-6">Cam kết của chúng tôi</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  { title: '🎯 Chất lượng', desc: 'Sản phẩm được tuyển chọn từ các thương hiệu uy tín, kiểm tra kỹ trước khi giao hàng.' },
                  { title: '💰 Giá tốt', desc: 'Cam kết giá cạnh tranh nhất thị trường. Hoàn tiền nếu tìm thấy nơi bán rẻ hơn.' },
                  { title: '🚚 Giao nhanh', desc: 'Nội thành HCM giao trong 2-3 ngày. Miễn phí lắp đặt tận nơi.' },
                  { title: '🛡️ Bảo hành', desc: 'Bảo hành chính hãng 2 năm. Đổi 1-1 nếu lỗi nhà sản xuất.' },
                ].map(item => (
                  <div key={item.title} className="bg-brand-50 p-6 rounded-xl">
                    <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                    <p className="text-gray-700 text-sm">{item.desc}</p>
                  </div>
                ))}
              </div>

              <h2 className="font-display text-3xl font-bold text-brand-950 mt-10 mb-6">Showroom OFINA</h2>
              <p className="text-gray-700 leading-relaxed">
                Ghé showroom OFINA để trải nghiệm trực tiếp sản phẩm, nhận tư vấn chi tiết từ chuyên gia thiết kế.
                Showroom mở cửa hàng ngày từ 8:00 – 18:00.
              </p>
            </section>
          </>
        )}

        {/* CTA */}
        <section className="bg-brand-50 rounded-2xl p-8 md:p-12 text-center">
          <h2 className="font-display text-3xl font-bold text-brand-950 mb-4">
            Sẵn sàng nâng cấp văn phòng của bạn?
          </h2>
          <p className="text-gray-700 mb-6">Đội ngũ tư vấn OFINA hỗ trợ bạn 24/7</p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link href="/san-pham" className="btn-primary">Xem sản phẩm</Link>
            <Link href="/bao-gia-b2b" className="btn-accent">Nhận báo giá B2B</Link>
          </div>
        </section>
      </div>
    </div>
  )
}
