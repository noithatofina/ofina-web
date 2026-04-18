'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { CheckCircle, CreditCard, Wallet, Building2, Smartphone, ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'
import { formatPrice } from '@/lib/utils'
import { useCart } from '@/lib/cart'

const PAYMENTS = [
  { id: 'cod', label: 'Thanh toán khi nhận hàng (COD)', icon: Wallet, desc: 'Thanh toán tiền mặt khi giao hàng' },
  { id: 'bank', label: 'Chuyển khoản ngân hàng', icon: Building2, desc: 'Chuyển khoản qua tài khoản OFINA' },
  { id: 'momo', label: 'Ví MoMo', icon: Smartphone, desc: 'Thanh toán qua ứng dụng MoMo' },
  { id: 'vnpay', label: 'Thẻ ATM / Visa / Master', icon: CreditCard, desc: 'Thanh toán qua VNPay' },
]

const CITIES = ['TP. Hồ Chí Minh', 'Hà Nội', 'Đà Nẵng', 'Cần Thơ', 'Hải Phòng', 'Bình Dương', 'Đồng Nai', 'Khánh Hòa', 'Lâm Đồng', 'Khác']

export default function CheckoutPage() {
  const router = useRouter()
  const { items, subtotal, clearCart } = useCart()
  const [payment, setPayment] = useState('cod')
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<{ order_number: string } | null>(null)

  // Redirect if cart empty (after mount to avoid hydration mismatch)
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])
  useEffect(() => {
    if (mounted && items.length === 0 && !result) {
      router.push('/gio-hang')
    }
  }, [mounted, items, result, router])

  const shipping = subtotal > 500_000 ? 0 : 50_000
  const total = subtotal + shipping

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitting(true)

    const formData = new FormData(e.currentTarget)

    const orderData = {
      customer_name: formData.get('name') as string,
      customer_phone: formData.get('phone') as string,
      customer_email: formData.get('email') as string,
      address_line: formData.get('address') as string,
      city: formData.get('city') as string,
      district: formData.get('district') as string || undefined,
      ward: formData.get('ward') as string || undefined,
      note: formData.get('note') as string,
      payment_method: payment,
      items: items.map(i => ({
        id: i.id,
        sku: i.sku,
        name: i.name,
        price: i.price,
        quantity: i.quantity,
      })),
      subtotal,
      shipping_fee: shipping,
      discount: 0,
    }

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Lỗi đặt hàng')

      setResult({ order_number: data.order_number })
      clearCart()
      toast.success('Đặt hàng thành công!')
    } catch (err: any) {
      toast.error(err.message || 'Có lỗi xảy ra, vui lòng thử lại')
    } finally {
      setSubmitting(false)
    }
  }

  if (result) {
    return (
      <div className="container-custom py-20 text-center max-w-lg mx-auto">
        <CheckCircle className="w-24 h-24 mx-auto text-green-500 mb-6" />
        <h1 className="text-3xl font-bold text-brand-950 mb-3">Đặt hàng thành công!</h1>
        <p className="text-gray-600 mb-2">Cảm ơn bạn đã mua sắm tại OFINA</p>
        <p className="text-gray-600 mb-8">
          Mã đơn hàng: <strong className="text-brand-900">{result.order_number}</strong>
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

  if (!mounted || items.length === 0) {
    return <div className="container-custom py-20 text-center text-gray-500">Đang tải giỏ hàng...</div>
  }

  return (
    <div className="container-custom py-8">
      <Link href="/gio-hang" className="inline-flex items-center gap-2 text-brand-900 hover:underline mb-6">
        <ArrowLeft className="w-4 h-4" /> Quay lại giỏ hàng
      </Link>

      <h1 className="font-display text-4xl font-bold text-brand-950 mb-8">Thanh toán</h1>

      <form onSubmit={handleSubmit} className="grid lg:grid-cols-[1fr_400px] gap-8">
        <div className="space-y-6">
          <div className="card p-6">
            <h3 className="font-bold text-xl mb-5">Thông tin giao hàng</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold mb-1.5">Họ và tên *</label>
                <input name="name" type="text" required className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-brand-900" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5">Số điện thoại *</label>
                <input name="phone" type="tel" required pattern="[0-9]{10,11}" className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-brand-900" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5">Email</label>
                <input name="email" type="email" className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-brand-900" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold mb-1.5">Địa chỉ *</label>
                <input name="address" type="text" required placeholder="Số nhà, tên đường" className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-brand-900" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5">Tỉnh/Thành phố *</label>
                <select name="city" required defaultValue="TP. Hồ Chí Minh" className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-brand-900">
                  {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5">Quận/Huyện</label>
                <input name="district" type="text" placeholder="VD: Quận 1" className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-brand-900" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold mb-1.5">Ghi chú (không bắt buộc)</label>
                <textarea name="note" className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-brand-900 min-h-[80px]" placeholder="Giao vào giờ hành chính, gọi trước..." />
              </div>
            </div>
          </div>

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

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="card p-6">
            <h3 className="font-bold text-lg mb-4">Đơn hàng ({items.length})</h3>

            <div className="space-y-3 mb-4 max-h-[300px] overflow-y-auto">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between gap-2 text-sm">
                  <span className="line-clamp-2">{item.name} <span className="text-gray-500">×{item.quantity}</span></span>
                  <span className="font-semibold flex-shrink-0">{formatPrice(item.price * item.quantity)}</span>
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

            <button
              type="submit"
              disabled={submitting}
              className="btn-accent w-full py-4 text-lg mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Đang xử lý...' : 'Đặt hàng ngay'}
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
