'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Minus, Plus, ShoppingCart, Heart } from 'lucide-react'
import toast from 'react-hot-toast'
import { useCart } from '@/lib/cart'
import { CONTACT } from '@/lib/utils'

interface Props {
  product: {
    id: string
    slug: string
    name: string
    ofina_sku?: string
    price: number
    compare_price?: number | null
    is_price_hidden?: boolean
    primary_image?: string | null
  }
}

export function ProductActions({ product }: Props) {
  const router = useRouter()
  const { addItem } = useCart()
  const [quantity, setQuantity] = useState(1)

  const disabled = !product.price || product.is_price_hidden

  function handleAddToCart() {
    if (disabled) {
      toast.error('Sản phẩm này vui lòng liên hệ báo giá', { icon: '📞' })
      return
    }
    addItem({
      id: product.id,
      slug: product.slug,
      sku: product.ofina_sku || '',
      name: product.name,
      price: product.price,
      compare_price: product.compare_price,
      image: product.primary_image || '',
      quantity,
    })
    toast.success(`Đã thêm ${quantity} × ${product.name.substring(0, 30)}...`, { icon: '🛒' })
  }

  function handleBuyNow() {
    if (disabled) {
      toast.error('Sản phẩm này vui lòng liên hệ báo giá')
      return
    }
    addItem({
      id: product.id,
      slug: product.slug,
      sku: product.ofina_sku || '',
      name: product.name,
      price: product.price,
      compare_price: product.compare_price,
      image: product.primary_image || '',
      quantity,
    })
    router.push('/thanh-toan')
  }

  function handleWishlist() {
    const key = 'ofina_wishlist_v1'
    try {
      const list = JSON.parse(localStorage.getItem(key) || '[]')
      if (list.includes(product.id)) {
        localStorage.setItem(key, JSON.stringify(list.filter((id: string) => id !== product.id)))
        toast('Đã bỏ khỏi yêu thích', { icon: '💔' })
      } else {
        localStorage.setItem(key, JSON.stringify([...list, product.id]))
        toast.success('Đã thêm vào yêu thích', { icon: '❤️' })
      }
    } catch {}
  }

  // Hàng báo giá theo đơn: không hiện nút mua. Trước đây vẫn hiện "Thêm vào giỏ"
  // rồi chặn bằng thông báo lỗi — khách bấm xong mới biết không mua được.
  if (disabled) {
    return (
      <div className="mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Link
            href="/bao-gia-b2b"
            className="btn-accent py-4 text-base inline-flex items-center justify-center"
          >
            Yêu cầu báo giá →
          </Link>
          <a
            href={`tel:${CONTACT.hotline}`}
            className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-lg border-2 border-brand-900 text-brand-900 font-semibold hover:bg-brand-50 transition-all text-base"
          >
            Gọi {CONTACT.hotline}
          </a>
        </div>
        <p className="text-sm text-gray-600 mt-3">
          Hạng mục này báo giá theo đơn vì phụ thuộc cấu hình và số lượng. Gửi yêu cầu kèm số
          lượng và thời hạn cần hàng, OFINA phản hồi trong 30 phút giờ hành chính.
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="mb-5">
        <div className="font-semibold mb-2">Số lượng:</div>
        <div className="inline-flex items-center gap-3 border-2 rounded-lg">
          <button
            onClick={() => setQuantity(q => Math.max(1, q - 1))}
            className="p-3 hover:bg-gray-100"
            aria-label="Giảm"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="w-12 text-center font-semibold">{quantity}</span>
          <button
            onClick={() => setQuantity(q => q + 1)}
            className="p-3 hover:bg-gray-100"
            aria-label="Tăng"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <button onClick={handleAddToCart} className="btn-primary py-4 text-base">
          <ShoppingCart className="w-5 h-5 mr-2" /> Thêm vào giỏ
        </button>
        <button onClick={handleBuyNow} className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition-all shadow-lg hover:shadow-xl text-base">
          Mua ngay →
        </button>
      </div>

      <button onClick={handleWishlist} className="w-full flex items-center justify-center gap-2 py-3 border rounded-lg hover:bg-gray-50 mb-6">
        <Heart className="w-4 h-4" /> Thêm vào yêu thích
      </button>
    </>
  )
}
