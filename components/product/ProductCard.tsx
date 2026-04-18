'use client'

import Link from 'next/link'
import { ShoppingCart, Eye, Heart } from 'lucide-react'
import toast from 'react-hot-toast'
import { ProductImage } from './ProductImage'
import { formatPrice, calcDiscountPercent } from '@/lib/utils'
import { useCart } from '@/lib/cart'
import type { Product } from '@/lib/supabase'

interface Props {
  product: Partial<Product> & { id: string; slug: string; name: string }
}

export function ProductCard({ product }: Props) {
  const { addItem } = useCart()
  const price = product.price || 0
  const comparePrice = product.compare_price || 0
  const discount = calcDiscountPercent(comparePrice || price, price)
  const hasDiscount = comparePrice && comparePrice > price
  const img = product.primary_image || product.images?.[0] || '/placeholder-product.jpg'

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (!price) {
      toast.error('Sản phẩm này vui lòng liên hệ báo giá', { icon: '📞' })
      return
    }
    addItem({
      id: product.id,
      slug: product.slug,
      sku: product.ofina_sku || '',
      name: product.name,
      price,
      compare_price: comparePrice,
      image: img,
    })
    toast.success(`Đã thêm "${product.name.substring(0, 30)}..." vào giỏ`, { icon: '🛒' })
  }

  return (
    <article className="card group">
      <div className="relative aspect-[4/5] bg-gray-100 overflow-hidden">
        <Link href={`/san-pham/${product.slug}`} className="block w-full h-full">
          <ProductImage
            src={img}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="w-full h-full group-hover:scale-105 transition-transform duration-500"
            watermark="small"
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-20">
          {product.is_new && (
            <span className="bg-brand-900 text-white text-xs font-bold px-2 py-1 rounded">MỚI</span>
          )}
          {hasDiscount && discount > 0 && (
            <span className="bg-sale text-white text-xs font-bold px-2 py-1 rounded">-{discount}%</span>
          )}
          {product.is_bestseller && (
            <span className="bg-accent-500 text-white text-xs font-bold px-2 py-1 rounded">BÁN CHẠY</span>
          )}
        </div>

        {/* Hover actions */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
          <Link
            href={`/san-pham/${product.slug}`}
            className="w-9 h-9 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-brand-900 hover:text-white transition-colors"
            aria-label="Xem nhanh"
          >
            <Eye className="w-4 h-4" />
          </Link>
        </div>

        {/* Quick add */}
        <button
          onClick={handleAdd}
          className="absolute bottom-0 left-0 right-0 bg-brand-900 text-white py-2.5 font-semibold flex items-center justify-center gap-2 translate-y-full group-hover:translate-y-0 transition-transform z-20"
        >
          <ShoppingCart className="w-4 h-4" /> Thêm vào giỏ
        </button>
      </div>

      <div className="p-4">
        <div className="text-xs text-gray-500 mb-1 uppercase tracking-wide">
          {product.ofina_sku || ''}
        </div>
        <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2 min-h-[2.75rem]">
          <Link href={`/san-pham/${product.slug}`} className="hover:text-brand-900 transition-colors">
            {product.name}
          </Link>
        </h3>

        <div className="flex items-baseline gap-2 flex-wrap">
          {price > 0 ? (
            <>
              <span className="text-lg font-bold text-brand-900">{formatPrice(price)}</span>
              {hasDiscount && (
                <span className="text-sm text-gray-400 line-through">{formatPrice(comparePrice)}</span>
              )}
            </>
          ) : (
            <span className="text-sm text-brand-900 font-semibold">Liên hệ báo giá</span>
          )}
        </div>
      </div>
    </article>
  )
}
