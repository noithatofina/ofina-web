'use client'

import Link from 'next/link'
import { ProductImage } from './ProductImage'
import { formatPrice, calcDiscountPercent } from '@/lib/utils'
import type { Product } from '@/lib/supabase'

interface Props {
  product: Partial<Product> & { id: string; slug: string; name: string }
}

export function ProductCard({ product }: Props) {
  const price = product.price || 0
  const comparePrice = product.compare_price || 0
  const discount = calcDiscountPercent(comparePrice || price, price)
  const hasDiscount = !!comparePrice && comparePrice > price
  const img = product.primary_image || product.images?.[0] || '/placeholder-product.jpg'

  return (
    <article className="group flex flex-col h-full bg-white rounded-lg border border-gray-100 shadow-[0_1px_4px_rgba(0,0,0,0.04)] hover:shadow-md transition-shadow overflow-hidden">
      <div className="relative aspect-square bg-gray-50 overflow-hidden">
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
      </div>

      <div className="p-3 sm:p-4 flex flex-col flex-1">
        {product.ofina_sku ? (
          <div className="text-[11px] text-gray-400 mb-1 uppercase tracking-wide truncate">
            {product.ofina_sku}
          </div>
        ) : null}
        <h3 className="font-medium text-sm sm:text-[15px] text-gray-900 line-clamp-2 mb-2 h-10 leading-snug overflow-hidden">
          <Link href={`/san-pham/${product.slug}`} className="hover:text-brand-900 transition-colors">
            {product.name}
          </Link>
        </h3>

        {/* Giá + CTA luôn đẩy xuống đáy để các card thẳng hàng */}
        <div className="mt-auto">
          <div className="flex items-baseline gap-2 flex-wrap">
            {price > 0 ? (
              <>
                <span className="text-base font-bold text-brand-900">{formatPrice(price)}</span>
                {hasDiscount && (
                  <span className="text-xs text-gray-400 line-through">{formatPrice(comparePrice)}</span>
                )}
              </>
            ) : (
              <span className="text-sm text-brand-900 font-semibold">Liên hệ báo giá</span>
            )}
          </div>

          <Link
            href={`/san-pham/${product.slug}`}
            className="mt-2.5 inline-flex items-center gap-1 text-xs font-medium text-brand-900 hover:text-brand-700 transition-colors"
          >
            Xem chi tiết <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </article>
  )
}
