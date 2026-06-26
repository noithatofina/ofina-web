'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState, useEffect, FormEvent } from 'react'
import { Search, ShoppingCart, Phone, Menu, X, ChevronDown } from 'lucide-react'
import { CONTACT, cn } from '@/lib/utils'
import { useCart } from '@/lib/cart'
import { NAV_MENU } from '@/lib/nav-menu'
import type { ContactInfo } from '@/lib/shop-chrome-context'

export function Header({
  topbarMessages,
  contact,
  logoUrl,
}: {
  topbarMessages?: string[]
  contact?: ContactInfo
  logoUrl?: string
} = {}) {
  const hotline = contact?.hotline || CONTACT.hotline
  const messages = topbarMessages && topbarMessages.length > 0
    ? topbarMessages
    : ['Miễn phí giao hàng nội thành HCM', 'Bảo hành 2 năm', 'Đổi trả 7 ngày']
  const topbarText = messages.join(' · ')
  const router = useRouter()
  const { count } = useCart()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openMega, setOpenMega] = useState<string | null>(null)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  function handleSearch(e: FormEvent) {
    e.preventDefault()
    const q = searchQuery.trim()
    if (q) {
      router.push(`/tim-kiem?q=${encodeURIComponent(q)}`)
      setSearchOpen(false)
      setSearchQuery('')
    }
  }

  return (
    <>
      {/* Top bar */}
      <div className="bg-brand-900 text-white text-sm hidden md:block">
        <div className="container-custom flex justify-between py-2">
          <span>{topbarText}</span>
          <div className="flex items-center gap-3">
            <a href={`tel:${CONTACT.branches[0].phones[0]}`} className="hover:text-accent-400 transition-colors">
              📞 HN: {CONTACT.branches[0].phones[0]}
            </a>
            <span className="opacity-50">|</span>
            <a href={`tel:${CONTACT.branches[1].phones[0]}`} className="hover:text-accent-400 transition-colors">
              📞 HCM: {CONTACT.branches[1].phones[0]}
            </a>
            <span className="opacity-50">|</span>
            <Link href="/tra-cuu-don-hang" className="hover:text-accent-400 transition-colors">Tra cứu đơn</Link>
          </div>
        </div>
      </div>

      {/* Main header — gọn, 76px */}
      <header className={cn(
        "sticky top-0 z-50 bg-white border-b border-[#E5EAF1] transition-shadow",
        scrolled && "shadow-sm"
      )}>
        <div className="container-custom flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2.5 group py-3.5">
            <div className="w-11 h-11 bg-brand-900 rounded-xl flex items-center justify-center group-hover:bg-brand-800 transition-colors p-1.5">
              <Image
                src={logoUrl || '/logo.png'}
                alt="OFINA logo"
                width={44}
                height={44}
                priority
                unoptimized={!!logoUrl}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col justify-center">
              <div className="font-bold text-xl text-brand-900 leading-tight">OFINA</div>
              <div className="text-[10px] text-gray-500 leading-tight uppercase tracking-wider">Nội thất văn phòng</div>
            </div>
          </Link>

          {/* Desktop Nav — gọn, không có SALE đỏ to */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_MENU.map((item) => (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => setOpenMega(item.label)}
                onMouseLeave={() => setOpenMega(null)}
              >
                <Link
                  href={item.href}
                  className={cn(
                    "px-3 py-5 text-sm font-semibold transition-colors inline-flex items-center gap-1 whitespace-nowrap relative text-gray-700 hover:text-brand-900",
                    openMega === item.label && "text-brand-900",
                  )}
                >
                  {item.label}
                  {item.mega && (
                    <ChevronDown className={cn(
                      "w-3 h-3 transition-transform opacity-60",
                      openMega === item.label && "rotate-180 opacity-100"
                    )} />
                  )}
                  <span className={cn(
                    "absolute bottom-3 left-3 right-3 h-0.5 bg-brand-900 transition-transform origin-left",
                    openMega === item.label ? "scale-x-100" : "scale-x-0"
                  )} />
                </Link>
                {item.mega && openMega === item.label && (
                  <div className="absolute top-full left-0 bg-white shadow-lg rounded-xl border border-[#E5EAF1] animate-fade-in overflow-hidden">
                    <div className="p-5 grid gap-5" style={{ gridTemplateColumns: `repeat(${item.mega.columns.length}, minmax(200px, 1fr))`, minWidth: `${item.mega.columns.length * 220}px` }}>
                      {item.mega.columns.map((col) => (
                        <div key={col.heading}>
                          <h4 className="font-semibold text-gray-500 text-[11px] uppercase tracking-wider mb-2.5">
                            {col.heading}
                          </h4>
                          <ul className="space-y-0.5">
                            {col.items.map((cat) => (
                              <li key={cat.slug}>
                                <Link
                                  href={`/danh-muc/${cat.slug}`}
                                  className="block text-sm text-gray-700 hover:text-brand-900 hover:bg-[#F7F9FC] rounded transition-colors py-1.5 px-2"
                                >
                                  {cat.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                    <div className="bg-[#F7F9FC] px-5 py-2.5 text-center border-t border-[#E5EAF1]">
                      <Link
                        href={item.href}
                        className="text-sm font-medium text-brand-900 hover:underline"
                      >
                        Xem tất cả →
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            ))}
            {/* Sale pill nhỏ — không quá nổi bật */}
            <Link
              href="/khuyen-mai"
              className="ml-2 px-3 py-1.5 border border-red-200 text-red-600 text-xs font-semibold rounded-full hover:bg-red-50 transition-colors whitespace-nowrap"
            >
              Ưu đãi
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2 py-4">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Tìm kiếm"
            >
              <Search className="w-5 h-5" />
            </button>
            <Link href="/gio-hang" className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative" aria-label="Giỏ hàng">
              <ShoppingCart className="w-5 h-5" />
              {count > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent-500 text-white text-xs min-w-[20px] h-5 px-1 rounded-full flex items-center justify-center font-bold">
                  {count}
                </span>
              )}
            </Link>
            <a
              href={`tel:${hotline}`}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-brand-900"
              aria-label={`Gọi ngay ${hotline}`}
              title={`Gọi ${hotline}`}
            >
              <Phone className="w-5 h-5" />
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

        {/* Search overlay */}
        {searchOpen && (
          <div className="border-t bg-white animate-slide-up">
            <div className="container-custom py-4">
              <form onSubmit={handleSearch} className="flex gap-2 max-w-3xl mx-auto">
                <input
                  type="text"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm sản phẩm... (vd: ghế xoay, bàn họp, OFN-GXV)"
                  className="flex-1 px-4 py-3 border rounded-lg focus:outline-none focus:border-brand-900"
                />
                <button type="submit" className="btn-primary">Tìm kiếm</button>
                <button type="button" onClick={() => setSearchOpen(false)} className="px-4 py-2 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </form>
            </div>
          </div>
        )}

      </header>

      {/* Mobile drawer 85% width */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-[60]">
          <div
            className="absolute inset-0 bg-black/40 animate-fade-in"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute top-0 right-0 h-full w-[85%] max-w-[380px] bg-white shadow-2xl overflow-y-auto animate-slide-in-right">
            <div className="sticky top-0 z-10 flex items-center justify-between px-5 py-4 bg-white border-b border-[#E5EAF1]">
              <div className="font-bold text-lg text-brand-900">Danh mục</div>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
                aria-label="Đóng menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="px-3 py-3 space-y-0.5">
              {NAV_MENU.map((item) => (
                <div key={item.label}>
                  {item.mega ? (
                    <>
                      <button
                        onClick={() => setMobileExpanded(mobileExpanded === item.label ? null : item.label)}
                        className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-gray-900 font-semibold hover:bg-[#F7F9FC]"
                      >
                        <span>{item.label}</span>
                        <ChevronDown className={cn(
                          "w-4 h-4 transition-transform text-gray-400",
                          mobileExpanded === item.label && "rotate-180 text-brand-900"
                        )} />
                      </button>
                      {mobileExpanded === item.label && (
                        <div className="pl-3 pr-1 pb-2 space-y-2 border-l-2 border-[#E5EAF1] ml-3 mt-1">
                          <Link
                            href={item.href}
                            onClick={() => setMobileOpen(false)}
                            className="block px-3 py-1.5 text-sm font-medium text-brand-900 hover:bg-[#F7F9FC] rounded"
                          >
                            Xem tất cả →
                          </Link>
                          {item.mega.columns.map((col) => (
                            <div key={col.heading}>
                              <div className="px-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider mt-2 mb-1">
                                {col.heading}
                              </div>
                              {col.items.map((cat) => (
                                <Link
                                  key={cat.slug}
                                  href={`/danh-muc/${cat.slug}`}
                                  onClick={() => setMobileOpen(false)}
                                  className="block px-3 py-1.5 text-sm text-gray-700 hover:bg-[#F7F9FC] hover:text-brand-900 rounded"
                                >
                                  {cat.name}
                                </Link>
                              ))}
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className="block px-3 py-2.5 rounded-lg text-gray-900 font-semibold hover:bg-[#F7F9FC]"
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
            </nav>
            <div className="px-5 py-4 border-t border-[#E5EAF1] mt-2 space-y-2">
              <a
                href={`tel:${CONTACT.branches[0].phones[0]}`}
                className="flex items-center justify-center gap-2 w-full py-2.5 bg-brand-900 text-white rounded-lg text-sm font-semibold"
              >
                <Phone className="w-4 h-4" /> Gọi HN: {CONTACT.branches[0].phones[0]}
              </a>
              <a
                href={`tel:${CONTACT.branches[1].phones[0]}`}
                className="flex items-center justify-center gap-2 w-full py-2.5 bg-brand-50 text-brand-900 rounded-lg text-sm font-semibold border border-[#E5EAF1]"
              >
                <Phone className="w-4 h-4" /> Gọi HCM: {CONTACT.branches[1].phones[0]}
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
