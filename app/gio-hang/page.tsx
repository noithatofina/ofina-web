'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Tag } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

// Mock cart state (sẽ dùng Zustand/Context sau khi tích hợp DB)
const MOCK_CART = [
  {
    id: '1',
    slug: 'ghe-xoay-van-phong-ofn-gxv-0001',
    name: 'Ghế xoay văn phòng công thái học GL117',
    sku: 'OFN-GXV-0001',
    price: 2800000,
    compare: 3500000,
    image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=200&q=80',
    quantity: 2,
    color: 'Đen',
  },
  {
    id: '2',
    slug: 'ban-lam-viec-chan-sat-ofn-blvs-0001',
    name: 'Bàn làm việc chân sắt mặt gỗ 1m4',
    sku: 'OFN-BLVS-0001',
    price: 1890000,
    compare: 2100000,
    image: 'https://images.unsplash.com/photo-1518051870910-a46e30d9db16?w=200&q=80',
    quantity: 1,
    color: 'Gỗ sáng',
  },
]

export default function CartPage() {
  const [cart, setCart] = useState(MOCK_CART)
  const [coupon, setCoupon] = useState('')

  const updateQty = (id: string, delta: number) => {
    setCart(cart.map(item =>
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    ))
  }
  const removeItem = (id: string) => setCart(cart.filter(i => i.id !== id))

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = subtotal > 500000 ? 0 : 50000
  const total = subtotal + shipping

  if (cart.length === 0) {
    return (
      <div className="container-custom py-20 text-center">
        <ShoppingBag className="w-24 h-24 mx-auto text-gray-300 mb-6" />
        <h1 className="text-3xl font-bold mb-3">Giỏ hàng trống</h1>
        <p className="text-gray-600 mb-8">Hãy khám phá các sản phẩm tuyệt vời tại OFINA</p>
        <Link href="/san-pham" className="btn-primary">Tiếp tục mua sắm →</Link>
      </div>
    )
  }

  return (
    <div className="container-custom py-8">
      <h1 className="font-display text-4xl font-bold text-brand-950 mb-8">
        Giỏ hàng ({cart.length} sản phẩm)
      </h1>

      <div className="grid lg:grid-cols-[1fr_400px] gap-8">
        {/* Items */}
        <div className="space-y-4">
          {cart.map((item) => (
            <div key={item.id} className="card p-4 md:p-6 flex gap-4">
              <div className="relative w-24 md:w-32 aspect-square bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
                <Image src={item.image} alt={item.name} fill className="object-cover" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between gap-2 mb-1">
                  <Link href={`/san-pham/${item.slug}`} className="font-semibold hover:text-brand-900 line-clamp-2">
                    {item.name}
                  </Link>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-gray-400 hover:text-sale transition-colors"
                    aria-label="Xóa"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                <div className="text-sm text-gray-500 mb-3">
                  Mã: {item.sku} · Màu: {item.color}
                </div>
                <div className="flex justify-between items-center flex-wrap gap-3">
                  <div className="inline-flex items-center gap-2 border-2 rounded-lg">
                    <button onClick={() => updateQty(item.id, -1)} className="p-2 hover:bg-gray-100">
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-10 text-center font-semibold">{item.quantity}</span>
                    <button onClick={() => updateQty(item.id, 1)} className="p-2 hover:bg-gray-100">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-brand-900">
                      {formatPrice(item.price * item.quantity)}
                    </div>
                    {item.compare > item.price && (
                      <div className="text-sm text-gray-400 line-through">
                        {formatPrice(item.compare * item.quantity)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="card p-6">
            <h3 className="font-bold text-lg mb-4">Tổng kết đơn hàng</h3>

            {/* Coupon */}
            <div className="mb-6 pb-6 border-b">
              <label className="font-semibold block mb-2 flex items-center gap-2">
                <Tag className="w-4 h-4" /> Mã giảm giá
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  placeholder="Nhập mã"
                  className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:border-brand-900"
                />
                <button className="btn-primary py-2 px-4 text-sm">Áp dụng</button>
              </div>
            </div>

            {/* Breakdown */}
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Tạm tính</span>
                <span className="font-semibold">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Phí vận chuyển</span>
                <span className="font-semibold">{shipping === 0 ? 'Miễn phí' : formatPrice(shipping)}</span>
              </div>
              {shipping > 0 && (
                <div className="text-xs text-green-600 bg-green-50 p-2 rounded">
                  💡 Mua thêm {formatPrice(500000 - subtotal)} để được miễn phí giao hàng
                </div>
              )}
            </div>

            <div className="border-t pt-4 mb-6">
              <div className="flex justify-between items-baseline">
                <span className="font-bold text-lg">Tổng cộng</span>
                <span className="font-bold text-2xl text-brand-900">{formatPrice(total)}</span>
              </div>
              <div className="text-xs text-gray-500 mt-1">Đã bao gồm VAT</div>
            </div>

            <Link href="/thanh-toan" className="btn-accent w-full py-4 text-lg">
              Tiến hành thanh toán <ArrowRight className="w-5 h-5 ml-2" />
            </Link>

            <div className="mt-4 text-center">
              <Link href="/san-pham" className="text-brand-900 hover:underline text-sm">
                ← Tiếp tục mua sắm
              </Link>
            </div>

            {/* Trust */}
            <div className="mt-6 pt-6 border-t text-sm space-y-2 text-gray-600">
              <p>✓ Giao hàng nhanh 2–3 ngày</p>
              <p>✓ Bảo hành chính hãng 2 năm</p>
              <p>✓ Đổi trả miễn phí 7 ngày</p>
              <p>✓ Hỗ trợ 24/7 qua hotline</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
