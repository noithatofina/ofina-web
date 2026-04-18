'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { CheckCircle, CreditCard, Wallet, Building2, Smartphone, ArrowLeft } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

const MOCK_ITEMS = [
  { name: 'Ghế xoay văn phòng GL117', qty: 2, price: 2800000 },
  { name: 'Bàn làm việc chân sắt 1m4', qty: 1, price: 1890000 },
]

const PAYMENTS = [
  { id: 'cod', label: 'Thanh toán khi nhận hàng (COD)', icon: Wallet, desc: 'Thanh toán tiền mặt khi giao hàng' },
  { id: 'bank', label: 'Chuyển khoản ngân hàng', icon: Building2, desc: 'Mã giảm 2% khi CK trước' },
  { id: 'momo', label: 'Ví MoMo', icon: Smartphone, desc: 'Thanh toán qua ứng dụng MoMo' },
  { id: 'vnpay', label: 'Thẻ ATM / Visa / Master', icon: CreditCard, desc: 'Thanh toán qua VNPay' },
]

export default function CheckoutPage() {
  const [payment, setPayment] = useState('cod')
  const [submitted, setSubmitted] = useState(false)

  const subtotal = MOCK_ITEMS.reduce((s, i) => s + i.price * i.qty, 0)
  const shipping = subtotal > 500000 ? 0 : 50000
  const total = subtotal + shipping

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="container-custom py-20 text-center max-w-lg mx-auto">
        <CheckCircle className="w-24 h-24 mx-auto text-green-500 mb-6" />
        <h1 className="text-3xl font-bold text-brand-950 mb-3">Đặt hàng thành công!</h1>
        <p className="text-gray-600 mb-2">Cảm ơn bạn đã mua sắm tại OFINA</p>
        <p className="text-gray-600 mb-8">
          Mã đơn hàng: <strong className="text-brand-900">OFINA-{Date.now().toString().slice(-6)}</strong>
        </p>
        <p className="mb-8 text-gray-700">
          Chúng tôi sẽ liên hệ xác nhận đơn hàng trong vòng 30 phút qua số điện thoại bạn đã cung cấp.
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <Link href="/" className="btn-ghost">Về trang chủ</Link>
          <Link href="/san-pham" className="btn-primary">Tiếp tục mua sắm →</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container-custom py-8">
      <Link href="/gio-hang" className="inline-flex items-center gap-2 text-brand-900 hover:underline mb-6">
        <ArrowLeft className="w-4 h-4" /> Quay lại giỏ hàng
      </Link>

      <h1 className="font-display text-4xl font-bold text-brand-950 mb-8">Thanh toán</h1>

      <form onSubmit={handleSubmit} className="grid lg:grid-cols-[1fr_400px] gap-8">
        <div className="space-y-6">
          {/* Thông tin khách hàng */}
          <div className="card p-6">
            <h3 className="font-bold text-xl mb-5">Thông tin giao hàng</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold mb-1.5">Họ và tên *</label>
                <input type="text" required className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-brand-900" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5">Số điện thoại *</label>
                <input type="tel" required className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-brand-900" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5">Email</label>
                <input type="email" className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-brand-900" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold mb-1.5">Địa chỉ *</label>
                <input type="text" required placeholder="Số nhà, tên đường" className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-brand-900" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5">Tỉnh/Thành phố *</label>
                <select required className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-brand-900">
                  <option>TP. Hồ Chí Minh</option>
                  <option>Hà Nội</option>
                  <option>Đà Nẵng</option>
                  <option>Khác...</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5">Quận/Huyện *</label>
                <select required className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-brand-900">
                  <option>Chọn quận/huyện</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold mb-1.5">Ghi chú (không bắt buộc)</label>
                <textarea className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-brand-900 min-h-[80px]" placeholder="Ví dụ: giao vào giờ hành chính, gọi trước khi đến..." />
              </div>
            </div>
          </div>

          {/* Phương thức thanh toán */}
          <div className="card p-6">
            <h3 className="font-bold text-xl mb-5">Phương thức thanh toán</h3>
            <div className="space-y-3">
              {PAYMENTS.map((p) => (
                <label
                  key={p.id}
                  className={`flex items-start gap-4 p-4 border-2 rounded-xl cursor-pointer transition-colors ${
                    payment === p.id ? 'border-brand-900 bg-brand-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={p.id}
                    checked={payment === p.id}
                    onChange={(e) => setPayment(e.target.value)}
                    className="mt-1"
                  />
                  <p.icon className="w-6 h-6 text-brand-900 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold">{p.label}</div>
                    <div className="text-sm text-gray-600">{p.desc}</div>
                  </div>
                </label>
              ))}
            </div>

            {payment === 'bank' && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg text-sm">
                <div className="font-semibold mb-2">Thông tin chuyển khoản:</div>
                <div>Ngân hàng: <strong>Vietcombank</strong></div>
                <div>Số TK: <strong>1234567890</strong></div>
                <div>Chủ TK: <strong>CÔNG TY TNHH OFINA VIỆT NAM</strong></div>
                <div>Nội dung: <strong>OFINA [SĐT của bạn]</strong></div>
              </div>
            )}
          </div>
        </div>

        {/* Order summary */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="card p-6">
            <h3 className="font-bold text-lg mb-4">Đơn hàng ({MOCK_ITEMS.length})</h3>

            <div className="space-y-3 mb-4 max-h-[300px] overflow-y-auto">
              {MOCK_ITEMS.map((item, idx) => (
                <div key={idx} className="flex justify-between gap-2 text-sm">
                  <span className="line-clamp-2">{item.name} <span className="text-gray-500">×{item.qty}</span></span>
                  <span className="font-semibold flex-shrink-0">{formatPrice(item.price * item.qty)}</span>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Tạm tính</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Vận chuyển</span>
                <span>{shipping === 0 ? 'Miễn phí' : formatPrice(shipping)}</span>
              </div>
            </div>

            <div className="border-t mt-4 pt-4 flex justify-between items-baseline">
              <span className="font-bold text-lg">Tổng</span>
              <span className="font-bold text-2xl text-brand-900">{formatPrice(total)}</span>
            </div>

            <button type="submit" className="btn-accent w-full py-4 text-lg mt-6">
              Đặt hàng ngay
            </button>

            <p className="text-xs text-gray-500 mt-3 text-center">
              Bằng cách đặt hàng, bạn đồng ý với{' '}
              <Link href="/chinh-sach/dieu-khoan" className="text-brand-900 underline">Điều khoản sử dụng</Link>{' '}
              của OFINA
            </p>
          </div>
        </aside>
      </form>
    </div>
  )
}
