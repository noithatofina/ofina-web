'use client'

import { useState } from 'react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { CheckCircle } from 'lucide-react'

export default function QuoteForm() {
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitting(true)
    const fd = new FormData(e.currentTarget)
    const payload = {
      name: fd.get('name'),
      phone: fd.get('phone'),
      email: fd.get('email'),
      subject: 'Báo giá B2B: ' + (fd.get('company') || ''),
      message: `Công ty: ${fd.get('company')}\nSố chỗ ngồi: ${fd.get('seats') || 'Không rõ'}\nSố lượng SP: ${fd.get('quantity')}\nThời hạn cần hàng: ${fd.get('deadline') || 'Không nêu'}\nGhi chú: ${fd.get('note') || 'Không có'}`,
      source: 'b2b_quote',
    }
    try {
      const res = await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error()
      setSubmitted(true)
      toast.success('Đã nhận yêu cầu! OFINA sẽ liên hệ trong 30 phút.')
    } catch {
      toast.error('Có lỗi, vui lòng thử lại.')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="card p-8 text-center">
        <CheckCircle className="w-20 h-20 mx-auto text-green-500 mb-6" />
        <h2 className="text-2xl font-bold mb-3">Đã nhận yêu cầu</h2>
        <p className="text-gray-600 mb-8">
          Đội ngũ doanh nghiệp của OFINA sẽ liên hệ lại trong{' '}
          <strong>30 phút (giờ hành chính)</strong> để xác nhận danh mục và báo giá chi tiết.
        </p>
        <Link href="/san-pham" className="btn-primary">
          Xem sản phẩm trong lúc chờ
        </Link>
      </div>
    )
  }

  return (
    <div className="card p-8">
      <h2 className="font-bold text-2xl mb-2">Gửi yêu cầu báo giá</h2>
      <p className="text-sm text-gray-600 mb-6">
        Càng nêu rõ số chỗ ngồi và thời hạn cần hàng, báo giá gửi lại càng sát.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="b2b-company" className="block text-sm font-semibold mb-1.5">
            Tên công ty *
          </label>
          <input
            id="b2b-company"
            name="company"
            type="text"
            required
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-brand-900"
          />
        </div>
        <div>
          <label htmlFor="b2b-name" className="block text-sm font-semibold mb-1.5">
            Họ tên người liên hệ *
          </label>
          <input
            id="b2b-name"
            name="name"
            type="text"
            required
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-brand-900"
          />
        </div>
        <div className="grid md:grid-cols-2 gap-3">
          <div>
            <label htmlFor="b2b-phone" className="block text-sm font-semibold mb-1.5">
              Số điện thoại *
            </label>
            <input
              id="b2b-phone"
              name="phone"
              type="tel"
              required
              pattern="[0-9]{10,11}"
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-brand-900"
            />
          </div>
          <div>
            <label htmlFor="b2b-email" className="block text-sm font-semibold mb-1.5">
              Email
            </label>
            <input
              id="b2b-email"
              name="email"
              type="email"
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-brand-900"
            />
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-3">
          <div>
            <label htmlFor="b2b-seats" className="block text-sm font-semibold mb-1.5">
              Số chỗ ngồi cần trang bị
            </label>
            <input
              id="b2b-seats"
              name="seats"
              type="text"
              placeholder="VD: 30 chỗ"
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-brand-900"
            />
          </div>
          <div>
            <label htmlFor="b2b-quantity" className="block text-sm font-semibold mb-1.5">
              Số lượng sản phẩm
            </label>
            <select
              id="b2b-quantity"
              name="quantity"
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-brand-900"
            >
              <option>10-30 sản phẩm</option>
              <option>30-50 sản phẩm</option>
              <option>50-100 sản phẩm</option>
              <option>Trên 100 sản phẩm</option>
            </select>
          </div>
        </div>
        <div>
          <label htmlFor="b2b-deadline" className="block text-sm font-semibold mb-1.5">
            Thời hạn cần hàng
          </label>
          <input
            id="b2b-deadline"
            name="deadline"
            type="text"
            placeholder="VD: trước 15/11, hoặc chưa gấp"
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-brand-900"
          />
        </div>
        <div>
          <label htmlFor="b2b-note" className="block text-sm font-semibold mb-1.5">
            Mô tả nhu cầu
          </label>
          <textarea
            id="b2b-note"
            name="note"
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-brand-900 min-h-[110px]"
            placeholder="VD: setup văn phòng 30 nhân viên tại toà nhà ở Cầu Giấy, cần cụm bàn làm việc, ghế xoay lưới, 1 phòng họp 10 người và quầy lễ tân."
          />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="btn-accent w-full py-4 text-lg disabled:opacity-50"
        >
          {submitting ? 'Đang gửi...' : 'Nhận báo giá ngay →'}
        </button>
        <p className="text-xs text-gray-500 text-center">
          Cam kết phản hồi trong <strong>30 phút</strong> (giờ hành chính)
        </p>
      </form>
    </div>
  )
}
