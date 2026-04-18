'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Search, Package } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

export default function TrackOrderPage() {
  const [phone, setPhone] = useState('')
  const [orderNo, setOrderNo] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setResult(null)

    try {
      const res = await fetch(`/api/orders/track?phone=${encodeURIComponent(phone)}&order=${encodeURIComponent(orderNo)}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setResult(data.order)
    } catch (err: any) {
      setError(err.message || 'Không tìm thấy đơn hàng')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container-custom py-12 max-w-2xl">
      <h1 className="font-display text-4xl font-bold text-brand-950 mb-3">Tra cứu đơn hàng</h1>
      <p className="text-gray-600 mb-8">Nhập số điện thoại và mã đơn hàng để xem trạng thái</p>

      <form onSubmit={handleSubmit} className="card p-8 space-y-4">
        <div>
          <label className="block text-sm font-semibold mb-1.5">Số điện thoại *</label>
          <input
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            pattern="[0-9]{10,11}"
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-brand-900"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1.5">Mã đơn hàng *</label>
          <input
            type="text"
            required
            value={orderNo}
            onChange={(e) => setOrderNo(e.target.value)}
            placeholder="VD: OFN12345678"
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-brand-900"
          />
        </div>
        <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
          <Search className="w-4 h-4 mr-2" /> {loading ? 'Đang tra cứu...' : 'Tra cứu đơn'}
        </button>
      </form>

      {error && <div className="mt-6 p-4 bg-red-50 text-red-700 rounded-lg">{error}</div>}

      {result && (
        <div className="mt-6 card p-6">
          <div className="flex items-center gap-3 mb-4">
            <Package className="w-8 h-8 text-brand-900" />
            <div>
              <div className="text-sm text-gray-500">Mã đơn hàng</div>
              <div className="font-bold text-xl">{result.order_number}</div>
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <div>Trạng thái: <strong>{result.status}</strong></div>
            <div>Tổng tiền: <strong>{formatPrice(result.total)}</strong></div>
            <div>Thanh toán: <strong>{result.payment_method}</strong></div>
          </div>
        </div>
      )}

      <div className="mt-8 text-center">
        <Link href="/" className="text-brand-900 hover:underline">← Về trang chủ</Link>
      </div>
    </div>
  )
}
