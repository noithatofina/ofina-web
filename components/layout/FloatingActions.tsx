'use client'

import { useState, useEffect } from 'react'
import { MessageCircle, Phone, ArrowUp } from 'lucide-react'
import { CONTACT } from '@/lib/utils'

export function FloatingActions() {
  const [showTop, setShowTop] = useState(false)

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 400)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      {/* Zalo */}
      <a
        href={CONTACT.zaloUrl}
        className="w-14 h-14 bg-[#0068FF] text-white rounded-full shadow-xl flex items-center justify-center hover:scale-110 transition-transform"
        aria-label="Chat Zalo"
      >
        <span className="font-bold text-sm">Zalo</span>
      </a>

      {/* Call */}
      <a
        href={`tel:${CONTACT.hotline}`}
        className="w-14 h-14 bg-green-600 text-white rounded-full shadow-xl flex items-center justify-center hover:scale-110 transition-transform animate-pulse"
        aria-label="Gọi ngay"
      >
        <Phone className="w-6 h-6" />
      </a>

      {/* Chat */}
      <button
        className="w-14 h-14 bg-brand-900 text-white rounded-full shadow-xl flex items-center justify-center hover:scale-110 transition-transform"
        aria-label="Chat với tư vấn viên"
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {/* Back to top */}
      {showTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="w-12 h-12 bg-white border-2 border-gray-200 text-gray-700 rounded-full shadow-lg flex items-center justify-center hover:border-brand-900 hover:text-brand-900 transition-colors"
          aria-label="Về đầu trang"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </div>
  )
}
