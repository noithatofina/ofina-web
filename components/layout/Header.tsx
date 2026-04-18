'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useEffect, FormEvent } from 'react'
import { Search, ShoppingCart, Phone, Menu, X, ChevronDown, Sparkles } from 'lucide-react'
import { CONTACT, cn } from '@/lib/utils'
import { useCart } from '@/lib/cart'
import { NAV_MENU } from '@/lib/nav-menu'

export function Header() {
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
        <div className="container-custom flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group py-4">
            <div className="w-10 h-10 bg-brand-900 rounded-lg flex items-center justify-center font-display font-bold text-white text-xl group-hover:bg-brand-800 transition-colors">
              O
            </div>
            <div>
              <div className="font-display font-bold text-2xl text-brand-900 leading-none">OFINA</div>
              <div className="text-xs text-gray-500">Nội thất văn phòng</div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-0">
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
                    "px-4 py-6 font-bold text-sm tracking-wider uppercase transition-colors inline-flex items-center gap-1.5 whitespace-nowrap relative",
                    item.label === 'MỚI 2026'
                      ? "text-accent-600 hover:text-accent-700"
                      : "text-gray-800 hover:text-brand-900",
                    openMega === item.label && (item.label === 'MỚI 2026' ? "text-accent-700" : "text-brand-900")
                  )}
                >
                  {item.label === 'MỚI 2026' && <Sparkles className="w-4 h-4 inline animate-pulse" />}
                  {item.label}
                  {item.mega && (
                    <ChevronDown className={cn(
                      "w-3.5 h-3.5 transition-transform",
                      openMega === item.label && "rotate-180"
                    )} />
                  )}
                  {/* Underline animation */}
                  <span className={cn(
                    "absolute bottom-4 left-4 right-4 h-0.5 transition-transform origin-left",
                    item.label === 'MỚI 2026' ? "bg-accent-500" : "bg-brand-900",
                    openMega === item.label ? "scale-x-100" : "scale-x-0"
                  )} />
                </Link>
                {item.mega && openMega === item.label && (
                  <div className="absolute top-full left-0 bg-white shadow-2xl rounded-xl border border-gray-100 animate-fade-in overflow-hidden">
                    <div className="p-6 grid gap-6" style={{ gridTemplateColumns: `repeat(${item.mega.columns.length}, minmax(200px, 1fr))`, minWidth: `${item.mega.columns.length * 220}px` }}>
                      {item.mega.columns.map((col) => (
                        <div key={col.heading}>
                          <h4 className="font-bold text-brand-900 text-xs uppercase tracking-wider mb-3 border-b border-gray-100 pb-2">
                            {col.heading}
                          </h4>
                          <ul className="space-y-1">
                            {col.items.map((cat) => (
                              <li key={cat.slug}>
                                <Link
                                  href={`/danh-muc/${cat.slug}`}
                                  className="block text-sm text-gray-700 hover:text-brand-900 hover:bg-brand-50 rounded transition-colors py-1.5 px-2"
                                >
                                  {cat.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                    <div className="bg-brand-50 px-6 py-3 text-center">
                      <Link
                        href={item.href}
                        className="text-sm font-semibold text-brand-900 hover:underline"
                      >
                        Xem tất cả →
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            ))}
            {/* CTA nổi bật */}
            <Link
              href="/khuyen-mai"
              className="ml-3 px-4 py-2 bg-sale text-white text-sm font-bold uppercase tracking-wider rounded-full hover:bg-red-700 transition-colors whitespace-nowrap"
            >
              🔥 SALE
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

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden border-t bg-white max-h-[80vh] overflow-y-auto">
            <div className="container-custom py-4 space-y-1">
              {NAV_MENU.map((item) => (
                <div key={item.label}>
                  {item.mega ? (
                    <>
                      <button
                        onClick={() => setMobileExpanded(mobileExpanded === item.label ? null : item.label)}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-gray-900 font-semibold hover:bg-brand-50"
                      >
                        {item.label}
                        <ChevronDown className={cn(
                          "w-4 h-4 transition-transform",
                          mobileExpanded === item.label && "rotate-180"
                        )} />
                      </button>
                      {mobileExpanded === item.label && (
                        <div className="pl-4 pb-2 space-y-2">
                          <Link
                            href={item.href}
                            onClick={() => setMobileOpen(false)}
                            className="block px-3 py-1.5 text-sm font-semibold text-brand-900 hover:bg-brand-50 rounded"
                          >
                            Xem tất cả →
                          </Link>
                          {item.mega.columns.map((col) => (
                            <div key={col.heading}>
                              <div className="px-3 text-xs font-bold text-gray-500 uppercase mt-3 mb-1">
                                {col.heading}
                              </div>
                              {col.items.map((cat) => (
                                <Link
                                  key={cat.slug}
                                  href={`/danh-muc/${cat.slug}`}
                                  onClick={() => setMobileOpen(false)}
                                  className="block px-3 py-1.5 text-sm text-gray-700 hover:bg-brand-50 hover:text-brand-900 rounded"
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
                      className="block px-3 py-2 rounded-lg text-gray-700 hover:bg-brand-50 hover:text-brand-900"
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </header>
    </>
  )
}
