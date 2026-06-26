'use client'

import { useState, useEffect, useRef } from 'react'
import { Phone, ArrowUp } from 'lucide-react'
import { CONTACT, zaloUrl as zaloUrlOf } from '@/lib/utils'
import type { ContactInfo } from '@/lib/shop-chrome-context'

type RegionGroup = { region: 'HN' | 'HCM'; label: string; phones: string[] }

export function FloatingActions({ contact: _contact }: { contact?: ContactInfo } = {}) {
  const regions: RegionGroup[] = CONTACT.branches.map((b) => ({
    region: b.region,
    label: b.region === 'HN' ? 'Hà Nội' : 'TP.HCM',
    phones: [...b.phones],
  }))
  const [showTop, setShowTop] = useState(false)
  const [zaloOpen, setZaloOpen] = useState(false)
  const [callOpen, setCallOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const mobileRef = useRef<HTMLDivElement>(null)
  const [mobileMenu, setMobileMenu] = useState<'zalo' | 'call' | null>(null)

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!zaloOpen && !callOpen && !mobileMenu) return
    function onClickOutside(e: MouseEvent) {
      const target = e.target as Node
      if (
        menuRef.current && !menuRef.current.contains(target) &&
        mobileRef.current && !mobileRef.current.contains(target)
      ) {
        setZaloOpen(false)
        setCallOpen(false)
        setMobileMenu(null)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [zaloOpen, callOpen, mobileMenu])

  return (
    <>
      {/* ========= DESKTOP: 2 nút nổi góc phải ========= */}
      <div ref={menuRef} className="hidden md:flex fixed bottom-6 right-6 z-50 flex-col gap-3 items-end">
        {/* Zalo */}
        <div className="relative flex flex-col items-end">
          {zaloOpen && (
            <MenuPanel
              regions={regions}
              variant="zalo"
              onSelect={() => setZaloOpen(false)}
            />
          )}
          <button
            onClick={() => { setZaloOpen(v => !v); setCallOpen(false) }}
            className="w-13 h-13 bg-[#0068FF] text-white rounded-full shadow-lg flex items-center justify-center hover:scale-105 transition-transform"
            style={{ width: 52, height: 52 }}
            aria-label="Chat Zalo"
          >
            <span className="font-bold text-sm">Zalo</span>
          </button>
        </div>

        {/* Call */}
        <div className="relative flex flex-col items-end">
          {callOpen && (
            <MenuPanel
              regions={regions}
              variant="call"
              onSelect={() => setCallOpen(false)}
            />
          )}
          <button
            onClick={() => { setCallOpen(v => !v); setZaloOpen(false) }}
            className="bg-green-600 text-white rounded-full shadow-lg flex items-center justify-center hover:scale-105 transition-transform"
            style={{ width: 52, height: 52 }}
            aria-label="Gọi ngay"
          >
            <Phone className="w-5 h-5" />
          </button>
        </div>

        {/* Back to top */}
        {showTop && (
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="w-11 h-11 bg-white border border-[#E5EAF1] text-gray-700 rounded-full shadow-sm flex items-center justify-center hover:border-brand-900 hover:text-brand-900 transition-colors"
            aria-label="Về đầu trang"
          >
            <ArrowUp className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* ========= MOBILE: sticky bottom bar 64px ========= */}
      <div ref={mobileRef} className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-white border-t border-[#E5EAF1] shadow-[0_-4px_12px_rgba(0,0,0,0.04)]">
        {mobileMenu && (
          <div className="border-b border-[#E5EAF1] bg-white max-h-[60vh] overflow-y-auto">
            <div className="px-4 py-3">
              <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 px-1">
                {mobileMenu === 'zalo' ? 'Chat Zalo theo khu vực' : 'Gọi theo khu vực'}
              </div>
              {regions.map((g) => (
                <div key={g.region} className="mb-2 last:mb-0">
                  <div className="text-xs font-semibold text-brand-900 px-1 mb-1">{g.label}</div>
                  <div className="flex flex-col gap-1">
                    {g.phones.map((p) => (
                      <a
                        key={p}
                        href={mobileMenu === 'zalo' ? zaloUrlOf(p) : `tel:${p}`}
                        target={mobileMenu === 'zalo' ? '_blank' : undefined}
                        rel={mobileMenu === 'zalo' ? 'noopener noreferrer' : undefined}
                        onClick={() => setMobileMenu(null)}
                        className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm group ${
                          mobileMenu === 'zalo' ? 'hover:bg-[#0068FF]/10' : 'hover:bg-green-50'
                        }`}
                      >
                        <span className="font-medium text-gray-800">{p}</span>
                        <span className={`font-bold text-xs ${
                          mobileMenu === 'zalo' ? 'text-[#0068FF]' : 'text-green-600'
                        }`}>{mobileMenu === 'zalo' ? 'Chat →' : 'Gọi →'}</span>
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="grid grid-cols-2 gap-2 px-3 py-2.5" style={{ height: 64 }}>
          <button
            onClick={() => setMobileMenu(mobileMenu === 'call' ? null : 'call')}
            className="flex items-center justify-center gap-2 bg-green-600 text-white rounded-xl font-semibold text-sm"
          >
            <Phone className="w-4 h-4" /> Gọi ngay
          </button>
          <button
            onClick={() => setMobileMenu(mobileMenu === 'zalo' ? null : 'zalo')}
            className="flex items-center justify-center gap-2 bg-[#0068FF] text-white rounded-xl font-semibold text-sm"
          >
            <span className="text-sm font-bold">Zalo</span> tư vấn
          </button>
        </div>
      </div>
    </>
  )
}

function MenuPanel({
  regions,
  variant,
  onSelect,
}: {
  regions: RegionGroup[]
  variant: 'zalo' | 'call'
  onSelect: () => void
}) {
  const isZalo = variant === 'zalo'
  return (
    <div className="absolute right-16 bottom-0 bg-white rounded-2xl shadow-xl border border-[#E5EAF1] p-3 min-w-[220px] animate-slide-up">
      <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2 px-1">
        {isZalo ? 'Chat Zalo theo khu vực' : 'Gọi theo khu vực'}
      </div>
      {regions.map((g) => (
        <div key={g.region} className="mb-2 last:mb-0">
          <div className="text-xs font-semibold text-brand-900 px-1 mb-1">{g.label}</div>
          <div className="flex flex-col gap-1">
            {g.phones.map((p) => (
              <a
                key={p}
                href={isZalo ? zaloUrlOf(p) : `tel:${p}`}
                target={isZalo ? '_blank' : undefined}
                rel={isZalo ? 'noopener noreferrer' : undefined}
                onClick={onSelect}
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm group ${
                  isZalo ? 'hover:bg-[#0068FF]/10' : 'hover:bg-green-50'
                }`}
              >
                <span className="font-medium text-gray-800">{p}</span>
                <span className={`font-bold text-xs group-hover:underline ${
                  isZalo ? 'text-[#0068FF]' : 'text-green-600'
                }`}>{isZalo ? 'Chat →' : 'Gọi →'}</span>
              </a>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
