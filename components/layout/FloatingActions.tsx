'use client'

import { useState, useEffect } from 'react'
import { MessageCircle, Phone, ArrowUp, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { CONTACT } from '@/lib/utils'

export function FloatingActions() {
  const [showTop, setShowTop] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 400)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  async function sendContact(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const res = await fetch('/api/contacts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: fd.get('name'),
        phone: fd.get('phone'),
        message: fd.get('message'),
        source: 'floating_chat',
      }),
    })
    if (res.ok) {
      toast.success('Đã gửi yêu cầu! OFINA sẽ liên hệ lại trong ít phút.')
      setChatOpen(false)
      setMsg('')
      e.currentTarget.reset()
    } else {
      toast.error('Có lỗi, vui lòng thử lại.')
    }
  }

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
        {/* Zalo */}
        <a
          href={CONTACT.zaloUrl}
          target="_blank"
          rel="noopener noreferrer"
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

        {/* Chat/Contact */}
        <button
          onClick={() => setChatOpen(true)}
          className="w-14 h-14 bg-brand-900 text-white rounded-full shadow-xl flex items-center justify-center hover:scale-110 transition-transform"
          aria-label="Yêu cầu tư vấn"
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

      {/* Chat popup */}
      {chatOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-80 bg-white rounded-2xl shadow-2xl border animate-slide-up">
          <div className="bg-brand-900 text-white p-4 rounded-t-2xl flex items-center justify-between">
            <div>
              <div className="font-bold">Nhận tư vấn từ OFINA</div>
              <div className="text-xs opacity-90">Gọi lại miễn phí trong 5 phút</div>
            </div>
            <button onClick={() => setChatOpen(false)} className="hover:bg-white/10 rounded-full p-1">
              <X className="w-5 h-5" />
            </button>
          </div>
          <form onSubmit={sendContact} className="p-4 space-y-3">
            <input
              name="name"
              type="text"
              required
              placeholder="Họ tên của bạn"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-brand-900"
            />
            <input
              name="phone"
              type="tel"
              required
              placeholder="Số điện thoại"
              pattern="[0-9]{10,11}"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-brand-900"
            />
            <textarea
              name="message"
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              placeholder="Bạn cần tư vấn gì? (không bắt buộc)"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-brand-900 min-h-[80px]"
            />
            <button type="submit" className="btn-primary w-full">Gửi yêu cầu</button>
            <p className="text-xs text-gray-500 text-center">Hoặc gọi trực tiếp: <a href={`tel:${CONTACT.hotline}`} className="text-brand-900 font-semibold">{CONTACT.hotline}</a></p>
          </form>
        </div>
      )}
    </>
  )
}
