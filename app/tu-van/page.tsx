'use client'
import { useState } from 'react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { CheckCircle } from 'lucide-react'

export default function ConsultPage() {
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitting(true)
    const fd = new FormData(e.currentTarget)
    const res = await fetch('/api/contacts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: fd.get('name'), phone: fd.get('phone'), email: fd.get('email'),
        subject: 'Yêu cầu tư vấn',
        message: `Nhu cầu: ${fd.get('need')}\nNgân sách: ${fd.get('budget')}\nKhu vực: ${fd.get('area')}\nGhi chú: ${fd.get('note') || 'Không có'}`,
        source: 'consult_form',
      }),
    })
    if (res.ok) { setSubmitted(true); toast.success('Đã gửi!') }
    else toast.error('Có lỗi, vui lòng thử lại')
    setSubmitting(false)
  }

  if (submitted) {
    return (
      <div className="container-custom py-20 text-center max-w-lg mx-auto">
        <CheckCircle className="w-24 h-24 mx-auto text-green-500 mb-6" />
        <h1 className="text-3xl font-bold mb-3">Cảm ơn bạn!</h1>
        <p className="text-gray-600 mb-8">OFINA sẽ liên hệ trong 30 phút để tư vấn miễn phí.</p>
        <Link href="/" className="btn-primary">Về trang chủ</Link>
      </div>
    )
  }

  return (
    <div className="container-custom py-12 max-w-2xl">
      <h1 className="font-display text-4xl font-bold text-brand-950 mb-3">Nhận tư vấn miễn phí</h1>
      <p className="text-gray-600 mb-8">OFINA tư vấn miễn phí setup nội thất văn phòng phù hợp nhu cầu và ngân sách của bạn.</p>

      <form onSubmit={handleSubmit} className="card p-8 space-y-4">
        <div>
          <label className="block text-sm font-semibold mb-1.5">Họ tên *</label>
          <input name="name" type="text" required className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-brand-900" />
        </div>
        <div className="grid md:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-semibold mb-1.5">SĐT *</label>
            <input name="phone" type="tel" required pattern="[0-9]{10,11}" className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-brand-900" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1.5">Email</label>
            <input name="email" type="email" className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-brand-900" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1.5">Nhu cầu</label>
          <select name="need" className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-brand-900">
            <option>Setup văn phòng cá nhân</option>
            <option>Setup văn phòng công ty</option>
            <option>Thay mới đồ cũ</option>
            <option>Tư vấn chọn SP cụ thể</option>
            <option>Khác</option>
          </select>
        </div>
        <div className="grid md:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-semibold mb-1.5">Ngân sách</label>
            <select name="budget" className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-brand-900">
              <option>Dưới 10 triệu</option>
              <option>10-30 triệu</option>
              <option>30-100 triệu</option>
              <option>Trên 100 triệu</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1.5">Khu vực</label>
            <select name="area" className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-brand-900">
              <option>TP.HCM</option><option>Hà Nội</option><option>Đà Nẵng</option><option>Khác</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1.5">Ghi chú</label>
          <textarea name="note" className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-brand-900 min-h-[80px]" />
        </div>
        <button type="submit" disabled={submitting} className="btn-accent w-full py-4 disabled:opacity-50">
          {submitting ? 'Đang gửi...' : 'Nhận tư vấn miễn phí →'}
        </button>
      </form>
    </div>
  )
}
