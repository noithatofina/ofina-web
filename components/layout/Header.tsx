'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Search, ShoppingCart, Phone, Menu, X, ChevronDown } from 'lucide-react'
import { CONTACT, cn } from '@/lib/utils'

const NAV_CATEGORIES = [
  {
    label: 'Ghế văn phòng',
    href: '/danh-muc/ghe-van-phong',
    children: [
      { label: 'Ghế xoay văn phòng', href: '/danh-muc/ghe-xoay-van-phong' },
      { label: 'Ghế da giám đốc', href: '/danh-muc/ghe-da-giam-doc' },
      { label: 'Ghế công thái học', href: '/danh-muc/ghe-cong-thai-hoc' },
      { label: 'Ghế chân quỳ', href: '/danh-muc/ghe-chan-quy' },
      { label: 'Ghế hội trường', href: '/danh-muc/ghe-hoi-truong' },
      { label: 'Ghế phòng chờ', href: '/danh-muc/ghe-phong-cho' },
    ]
  },
  {
    label: 'Bàn làm việc',
    href: '/danh-muc/ban-lam-viec',
    children: [
      { label: 'Bàn nhân viên', href: '/danh-muc/ban-nhan-vien' },
      { label: 'Bàn giám đốc', href: '/danh-muc/ban-giam-doc' },
      { label: 'Bàn lãnh đạo', href: '/danh-muc/ban-lanh-dao' },
      { label: 'Bàn họp', href: '/danh-muc/ban-hop' },
      { label: 'Bàn nâng hạ', href: '/danh-muc/ban-nang-ha' },
      { label: 'Cụm bàn làm việc', href: '/danh-muc/cum-ban-lam-viec' },
    ]
  },
  {
    label: 'Tủ & Kệ',
    href: '/danh-muc/tu-ke',
    children: [
      { label: 'Tủ tài liệu', href: '/danh-muc/tu-tai-lieu' },
      { label: 'Tủ locker', href: '/danh-muc/tu-locker' },
      { label: 'Tủ giám đốc', href: '/danh-muc/tu-giam-doc' },
      { label: 'Kệ trang trí', href: '/danh-muc/ke-trang-tri' },
      { label: 'Giá kệ sắt', href: '/danh-muc/gia-ke-sat' },
    ]
  },
  {
    label: 'Sofa văn phòng',
    href: '/danh-muc/sofa',
    children: [
      { label: 'Sofa đơn', href: '/danh-muc/sofa-don' },
      { label: 'Sofa đôi', href: '/danh-muc/sofa-doi' },
      { label: 'Sofa góc', href: '/danh-muc/sofa-goc' },
      { label: 'Ghế thư giãn', href: '/danh-muc/ghe-thu-gian' },
    ]
  },
  { label: 'Blog', href: '/blog' },
  { label: 'Về OFINA', href: '/gioi-thieu' },
]

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      {/* Top bar */}
      <div className="bg-brand-900 text-white text-sm hidden md:block">
        <div className="container-custom flex justify-between py-2">
          <span>Miễn phí giao hàng nội thành HCM · Bảo hành 2 năm · Đổi trả 7 ngày</span>
          <div className="flex gap-4">
            <a href={`tel:${CONTACT.hotline}`} className="hover:text-accent-400 transition-colors">
              📞 {CONTACT.hotline}
            </a>
            <span>|</span>
            <Link href="/tra-cuu-don-hang" className="hover:text-accent-400 transition-colors">Tra cứu đơn</Link>
          </div>
        </div>
      </div>

      {/* Main header */}
      <header className={cn(
        "sticky top-0 z-50 bg-white transition-shadow",
        scrolled && "shadow-lg"
      )}>
        <div className="container-custom flex items-center justify-between py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-brand-900 rounded-lg flex items-center justify-center font-display font-bold text-white text-xl group-hover:bg-brand-800 transition-colors">
              O
            </div>
            <div>
              <div className="font-display font-bold text-2xl text-brand-900 leading-none">OFINA</div>
              <div className="text-xs text-gray-500">Nội thất văn phòng</div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_CATEGORIES.map((cat) => (
              <div
                key={cat.label}
                className="relative"
                onMouseEnter={() => setOpenDropdown(cat.label)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <Link
                  href={cat.href}
                  className="px-3 py-2 text-gray-700 hover:text-brand-900 font-medium transition-colors inline-flex items-center gap-1"
                >
                  {cat.label}
                  {cat.children && <ChevronDown className="w-4 h-4" />}
                </Link>
                {cat.children && openDropdown === cat.label && (
                  <div className="absolute top-full left-0 bg-white shadow-2xl rounded-lg py-2 w-56 border border-gray-100 animate-fade-in">
                    {cat.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="block px-4 py-2 text-gray-700 hover:bg-brand-50 hover:text-brand-900 transition-colors"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" aria-label="Tìm kiếm">
              <Search className="w-5 h-5" />
            </button>
            <Link href="/gio-hang" className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative" aria-label="Giỏ hàng">
              <ShoppingCart className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 bg-accent-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">0</span>
            </Link>
            <a href={`tel:${CONTACT.hotline}`} className="hidden md:inline-flex btn-primary text-sm">
              <Phone className="w-4 h-4 mr-1" /> Gọi ngay
            </a>
            <button
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden border-t bg-white">
            <div className="container-custom py-4 space-y-1">
              {NAV_CATEGORIES.map((cat) => (
                <Link
                  key={cat.label}
                  href={cat.href}
                  className="block px-3 py-2 rounded-lg text-gray-700 hover:bg-brand-50 hover:text-brand-900"
                  onClick={() => setMobileOpen(false)}
                >
                  {cat.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>
    </>
  )
}
