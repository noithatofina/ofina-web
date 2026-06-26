import type { Metadata } from 'next'
import Link from 'next/link'
import { MapPin, Phone, Clock, Car, MessageCircle } from 'lucide-react'
import { CONTACT, zaloUrl } from '@/lib/utils'

export const revalidate = 3600

export const metadata: Metadata = {
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
                <div className="flex-1">
                  <div className="font-semibold">Hotline {branch.region === 'HN' ? 'Hà Nội' : 'TP.HCM'}</div>
                  <div className="space-y-1.5 mt-1">
                    {branch.phones.map((p) => (
                      <div key={p} className="flex items-center gap-2 flex-wrap">
                        <a href={`tel:${p}`} className="text-gray-700 hover:text-brand-900 font-medium">
                          {p}
                        </a>
                        <a
                          href={zaloUrl(p)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#0068FF]/10 text-[#0068FF] hover:bg-[#0068FF]/20 text-xs font-semibold"
                          aria-label={`Chat Zalo ${p}`}
                        >
                          <MessageCircle className="w-3 h-3" />
                          Zalo
                        </a>
                      </div>
                    ))}
                  </div>
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
