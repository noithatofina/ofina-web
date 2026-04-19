import Link from 'next/link'
import { MapPin, Phone, Clock, Car } from 'lucide-react'
import { CONTACT } from '@/lib/utils'

export const metadata = {
  title: { absolute: 'Showroom OFINA — Hà Nội & TP.HCM | Nội Thất Văn Phòng' },
  description: 'Ghé 2 showroom OFINA tại 135 K2 Phú Đô (Hà Nội) và 36 Lương Định Của Q2 (TP.HCM) để trải nghiệm trực tiếp 2,400+ sản phẩm nội thất văn phòng. Mở 8h-18h hàng ngày.',
  alternates: { canonical: '/showroom' },
}

export default function ShowroomPage() {
  return (
    <div className="container-custom py-12">
      <div className="text-center mb-12">
        <h1 className="font-display text-5xl font-bold text-brand-950 mb-4">Showroom OFINA</h1>
        <p className="text-xl text-gray-600">Trải nghiệm trực tiếp, nhận tư vấn miễn phí từ chuyên gia</p>
      </div>

      <div className="space-y-12 mb-12">
        {CONTACT.branches.map((branch) => (
          <div key={branch.address} className="grid md:grid-cols-2 gap-8">
            <div className="card p-8 space-y-4">
              <h2 className="font-bold text-2xl mb-4">{branch.name}</h2>
              <div className="flex gap-3">
                <MapPin className="w-5 h-5 text-brand-900 flex-shrink-0 mt-1" />
                <div>
                  <div className="font-semibold">Địa chỉ</div>
                  <div className="text-gray-600">{branch.address}</div>
                </div>
              </div>
              <div className="flex gap-3">
                <Phone className="w-5 h-5 text-brand-900 flex-shrink-0 mt-1" />
                <div>
                  <div className="font-semibold">Hotline</div>
                  <a href={`tel:${CONTACT.hotline}`} className="text-gray-600 hover:text-brand-900">{CONTACT.hotline}</a>
                </div>
              </div>
              <div className="flex gap-3">
                <Clock className="w-5 h-5 text-brand-900 flex-shrink-0 mt-1" />
                <div>
                  <div className="font-semibold">Giờ mở cửa</div>
                  <div className="text-gray-600">Thứ 2 - Chủ nhật: 8:00 – 18:00</div>
                </div>
              </div>
              <div className="flex gap-3">
                <Car className="w-5 h-5 text-brand-900 flex-shrink-0 mt-1" />
                <div>
                  <div className="font-semibold">Bãi đỗ xe</div>
                  <div className="text-gray-600">Miễn phí đỗ xe máy, ô tô</div>
                </div>
              </div>
              <div className="pt-4">
                <Link href="/tu-van" className="btn-primary">Đặt lịch thăm showroom</Link>
              </div>
            </div>

            <div className="card overflow-hidden">
              <iframe
                src={`https://maps.google.com/maps?q=${encodeURIComponent(branch.mapsQuery)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                className="w-full h-[400px] border-0"
                loading="lazy"
                title={`Bản đồ ${branch.name}`}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="bg-brand-900 text-white rounded-2xl p-8 md:p-12 text-center">
        <h2 className="font-display text-3xl font-bold mb-4">Tại sao nên đến showroom?</h2>
        <div className="grid md:grid-cols-3 gap-6 mt-8">
          <div>
            <div className="text-4xl mb-2">👁️</div>
            <h3 className="font-bold mb-1">Trải nghiệm thật</h3>
            <p className="text-sm text-gray-200">Ngồi thử, cảm nhận chất liệu trực tiếp</p>
          </div>
          <div>
            <div className="text-4xl mb-2">🎨</div>
            <h3 className="font-bold mb-1">So sánh màu sắc</h3>
            <p className="text-sm text-gray-200">Xem màu thực tế, không qua ảnh</p>
          </div>
          <div>
            <div className="text-4xl mb-2">💬</div>
            <h3 className="font-bold mb-1">Tư vấn chuyên sâu</h3>
            <p className="text-sm text-gray-200">Kiến trúc sư tư vấn miễn phí</p>
          </div>
        </div>
      </div>
    </div>
  )
}
