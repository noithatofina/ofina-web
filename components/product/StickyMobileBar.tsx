'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ShoppingCart, Phone } from 'lucide-react'
import toast from 'react-hot-toast'
import { useCart } from '@/lib/cart'
import { formatPrice, CONTACT } from '@/lib/utils'

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

export function StickyMobileBar({ product }: Props) {
  const router = useRouter()
  const { addItem } = useCart()
  const [show, setShow] = useState(false)

  useEffect(() => {
    function onScroll() {
      setShow(window.scrollY > 480)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const disabled = !product.price || product.is_price_hidden

  function add(buyNow = false) {
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
      quantity: 1,
    })
    if (buyNow) router.push('/thanh-toan')
    else toast.success('Đã thêm vào giỏ', { icon: '🛒' })
  }

  return (
    <div
      className={`fixed bottom-0 inset-x-0 z-40 lg:hidden bg-white border-t shadow-2xl transition-transform duration-200 ${
        show ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="px-3 py-2 grid grid-cols-[auto_1fr_1fr] gap-2 items-center">
        <a
          href={`tel:${CONTACT.hotline}`}
          className="w-12 h-12 rounded-lg bg-green-50 text-green-700 flex items-center justify-center"
          aria-label="Gọi hotline"
        >
          <Phone className="w-5 h-5" />
        </a>
        <button
          onClick={() => add(false)}
          disabled={disabled}
          className="h-12 rounded-lg bg-brand-900 text-white font-semibold text-sm flex items-center justify-center gap-1 disabled:opacity-50"
        >
          <ShoppingCart className="w-4 h-4" /> Thêm giỏ
        </button>
        <button
          onClick={() => add(true)}
          disabled={disabled}
          className="h-12 rounded-lg bg-accent-500 text-white font-bold text-sm flex flex-col items-center justify-center disabled:opacity-50"
        >
          <span>Mua ngay</span>
          {!disabled && <span className="text-[10px] font-normal opacity-90">{formatPrice(product.price)}</span>}
        </button>
      </div>
    </div>
  )
}
