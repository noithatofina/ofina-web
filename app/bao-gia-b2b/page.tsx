'use client'

import { useState } from 'react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { CheckCircle, Building2, Users, FileCheck, Truck } from 'lucide-react'

export default function B2BPage() {
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
      message: `Công ty: ${fd.get('company')}\nSố lượng SP: ${fd.get('quantity')}\nGhi chú: ${fd.get('note') || 'Không có'}`,
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
      <div className="container-custom py-20 text-center max-w-lg mx-auto">
        <CheckCircle className="w-24 h-24 mx-auto text-green-500 mb-6" />
        <h1 className="text-3xl font-bold mb-3">Đã nhận yêu cầu!</h1>
        <p className="text-gray-600 mb-8">
          Đội ngũ B2B của OFINA sẽ liên hệ lại trong <strong>30 phút (giờ hành chính)</strong>
          để tư vấn báo giá chi tiết.
        </p>
        <Link href="/" className="btn-primary">Về trang chủ</Link>
      </div>
    )
  }

  return (
    <div>
      <section className="bg-gradient-to-br from-brand-900 to-brand-950 text-white py-16">
        <div className="container-custom text-center max-w-3xl mx-auto">
          <h1 className="font-display text-5xl md:text-6xl font-bold mb-4">Báo giá doanh nghiệp</h1>
          <p className="text-xl text-gray-200">
            Ưu đãi đặc biệt cho đơn hàng số lượng lớn · Hóa đơn VAT · Lắp đặt toàn quốc
          </p>
        </div>
      </section>

      <div className="container-custom py-16 grid lg:grid-cols-2 gap-12">
        {/* Benefits */}
        <div>
          <h2 className="font-display text-3xl font-bold text-brand-950 mb-6">Quyền lợi khách DN</h2>
          <div className="space-y-4">
            {[
              { icon: Building2, title: 'Giảm 5-15% cho đơn từ 50 triệu', desc: 'Giá tốt hơn giá niêm yết trên web' },
              { icon: FileCheck, title: 'Xuất hóa đơn VAT đầy đủ', desc: 'Hợp lệ cho hạch toán doanh nghiệp' },
              { icon: Truck, title: 'Miễn phí vận chuyển + lắp đặt', desc: 'Áp dụng toàn quốc cho đơn lớn' },
              { icon: Users, title: 'Tư vấn thiết kế không gian', desc: 'KTS miễn phí cho đơn 100 triệu+' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex gap-4 p-4 bg-brand-50 rounded-xl">
                <Icon className="w-10 h-10 text-brand-900 flex-shrink-0" />
                <div>
                  <h3 className="font-bold mb-1">{title}</h3>
                  <p className="text-sm text-gray-600">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 p-6 bg-yellow-50 rounded-xl border-l-4 border-accent-500">
            <h3 className="font-bold mb-2">💎 Ưu đãi đặc biệt tháng này</h3>
            <p className="text-sm text-gray-700">
              Đơn hàng từ <strong>100 triệu</strong> được miễn phí: KTS thiết kế 3D + lắp đặt toàn quốc +
              khuyến mãi 10% cho đơn hàng thứ 2.
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="card p-8">
          <h2 className="font-bold text-2xl mb-6">Nhận báo giá ngay</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-1.5">Tên công ty *</label>
              <input name="company" type="text" required className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-brand-900" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1.5">Họ tên người liên hệ *</label>
              <input name="name" type="text" required className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-brand-900" />
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold mb-1.5">Số điện thoại *</label>
                <input name="phone" type="tel" required pattern="[0-9]{10,11}" className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-brand-900" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5">Email</label>
                <input name="email" type="email" className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-brand-900" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1.5">Số lượng SP cần mua</label>
              <select name="quantity" className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-brand-900">
                <option>10-30 sản phẩm</option>
                <option>30-50 sản phẩm</option>
                <option>50-100 sản phẩm</option>
                <option>Trên 100 sản phẩm</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1.5">Mô tả nhu cầu</label>
              <textarea name="note" className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-brand-900 min-h-[100px]" placeholder="VD: Setup văn phòng 30 nhân viên, cần bàn ghế + tủ + sofa..." />
            </div>
            <button type="submit" disabled={submitting} className="btn-accent w-full py-4 text-lg disabled:opacity-50">
              {submitting ? 'Đang gửi...' : 'Nhận báo giá ngay →'}
            </button>
            <p className="text-xs text-gray-500 text-center">
              Cam kết phản hồi trong <strong>30 phút</strong> (giờ hành chính)
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
