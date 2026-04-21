'use client'

import Link from 'next/link'
import { FormEvent, useState } from 'react'
import { Facebook, Mail, MapPin, Phone, Youtube } from 'lucide-react'
import toast from 'react-hot-toast'
import { CONTACT } from '@/lib/utils'
import type { ContactInfo, Branch } from '@/lib/shop-chrome-context'

export function Footer({
  contact,
  branches: cmsBranches,
}: {
  contact?: ContactInfo
  branches?: Branch[]
} = {}) {
  const hotline = contact?.hotline || CONTACT.hotline
  const email = contact?.email || CONTACT.email
  const facebookUrl = contact?.facebook_url || CONTACT.facebookUrl
  const branches = cmsBranches && cmsBranches.length > 0 ? cmsBranches : CONTACT.branches
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleNewsletter(e: FormEvent) {
    e.preventDefault()
    if (!newsletterEmail) return
    setLoading(true)
    try {
      const res = await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: newsletterEmail,
          source: 'newsletter',
          subject: 'Đăng ký nhận tin',
        }),
      })
      if (res.ok) {
        toast.success('Đã đăng ký nhận tin từ OFINA! 🎉')
        setNewsletterEmail('')
      } else toast.error('Có lỗi, vui lòng thử lại')
    } catch {
      toast.error('Lỗi kết nối')
    } finally {
      setLoading(false)
    }
  }
  return (
    <footer className="bg-brand-950 text-gray-300 mt-20">
      <div className="container-custom py-16 grid md:grid-cols-4 gap-8">
        {/* Brand */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-accent-500 rounded-lg flex items-center justify-center font-display font-bold text-white text-xl">
              O
            </div>
            <div>
              <div className="font-display font-bold text-2xl text-white">OFINA</div>
              <div className="text-xs text-gray-400">Nội thất văn phòng</div>
            </div>
          </div>
          <p className="text-sm leading-relaxed">
            OFINA — Giải pháp nội thất văn phòng toàn diện cho doanh nghiệp Việt Nam.
            Chuẩn quốc tế, giá hợp lý, dịch vụ tận tâm.
          </p>
          <div className="flex gap-3">
            <a href={facebookUrl} className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-accent-500 transition-colors" aria-label="Facebook">
              <Facebook className="w-5 h-5" />
            </a>
            <a href="#" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-accent-500 transition-colors" aria-label="YouTube">
              <Youtube className="w-5 h-5" />
            </a>
            <a href={`mailto:${email}`} className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-accent-500 transition-colors" aria-label="Email">
              <Mail className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Danh mục */}
        <div>
          <h3 className="text-white font-bold text-lg mb-4">Danh mục nổi bật</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/danh-muc/ghe-xoay-van-phong" className="hover:text-accent-400">Ghế xoay văn phòng</Link></li>
            <li><Link href="/danh-muc/ghe-da-giam-doc" className="hover:text-accent-400">Ghế da giám đốc</Link></li>
            <li><Link href="/danh-muc/ghe-cong-thai-hoc" className="hover:text-accent-400">Ghế công thái học</Link></li>
            <li><Link href="/danh-muc/ban-lam-viec-chan-sat" className="hover:text-accent-400">Bàn làm việc</Link></li>
            <li><Link href="/danh-muc/ban-hop-van-phong-chan-sat" className="hover:text-accent-400">Bàn họp</Link></li>
            <li><Link href="/danh-muc/ban-nang-ha-thong-minh" className="hover:text-accent-400">Bàn nâng hạ điện</Link></li>
            <li><Link href="/danh-muc/tu-ho-so-cao" className="hover:text-accent-400">Tủ hồ sơ</Link></li>
            <li><Link href="/danh-muc/tu-locker-go" className="hover:text-accent-400">Tủ locker</Link></li>
            <li><Link href="/danh-muc/sofa-van-phong" className="hover:text-accent-400">Sofa văn phòng</Link></li>
            <li><Link href="/san-pham-moi-2026" className="hover:text-accent-400 font-semibold text-accent-400">✨ Sản phẩm mới 2026</Link></li>
            <li><Link href="/khuyen-mai" className="hover:text-accent-400 font-semibold text-red-400">🔥 Khuyến mãi</Link></li>
            <li><Link href="/san-pham" className="hover:text-accent-400 font-semibold">Xem tất cả sản phẩm →</Link></li>
          </ul>
        </div>

        {/* Chính sách */}
        <div>
          <h3 className="text-white font-bold text-lg mb-4">Chính sách</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/chinh-sach/doi-tra" className="hover:text-accent-400">Đổi trả hàng</Link></li>
            <li><Link href="/chinh-sach/bao-hanh" className="hover:text-accent-400">Bảo hành</Link></li>
            <li><Link href="/chinh-sach/van-chuyen" className="hover:text-accent-400">Vận chuyển</Link></li>
            <li><Link href="/chinh-sach/thanh-toan" className="hover:text-accent-400">Thanh toán</Link></li>
            <li><Link href="/chinh-sach/bao-mat" className="hover:text-accent-400">Bảo mật</Link></li>
            <li><Link href="/bao-gia-b2b" className="hover:text-accent-400">Báo giá doanh nghiệp</Link></li>
          </ul>
        </div>

        {/* Liên hệ */}
        <div>
          <h3 className="text-white font-bold text-lg mb-4">Liên hệ</h3>
          <ul className="space-y-3 text-sm">
            {branches.map((b) => (
              <li key={b.address} className="flex items-start gap-2">
                <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5 text-accent-400" />
                <span>
                  <span className="block font-semibold text-white">{b.name}</span>
                  <span className="block">{b.address}</span>
                </span>
              </li>
            ))}
            <li className="flex items-center gap-2">
              <Phone className="w-5 h-5 text-accent-400" />
              <a href={`tel:${hotline}`} className="hover:text-accent-400">Hotline: {hotline}</a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-accent-400" />
              <a href={`mailto:${email}`} className="hover:text-accent-400">{email}</a>
            </li>
          </ul>
          <div className="mt-6">
            <h4 className="text-white font-semibold mb-2">Nhận ưu đãi</h4>
            <form onSubmit={handleNewsletter} className="flex gap-2">
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Email của bạn"
                className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 text-sm focus:outline-none focus:border-accent-400"
              />
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-accent-500 rounded-lg text-white font-semibold text-sm hover:bg-accent-600 disabled:opacity-50"
              >
                {loading ? '...' : 'Đăng ký'}
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-custom py-6 flex flex-col md:flex-row justify-between items-center text-sm gap-3">
          <p>© {new Date().getFullYear()} OFINA.vn — Nội Thất Văn Phòng Việt Nam. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/sitemap.xml" className="hover:text-accent-400">Sitemap</Link>
            <Link href="/chinh-sach/dieu-khoan" className="hover:text-accent-400">Điều khoản</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
