'use client'

import Link from 'next/link'
import { ProductImage } from './ProductImage'
import { formatPrice } from '@/lib/utils'
import type { Product } from '@/lib/supabase'

interface Props {
  product: Partial<Product> & { id: string; slug: string; name: string }
}

export function ProductCard({ product }: Props) {
  const price = product.price || 0
  const comparePrice = product.compare_price || 0
  const hasDiscount = !!comparePrice && comparePrice > price
  const img = product.primary_image || product.images?.[0] || '/placeholder-product.jpg'

  return (
    <article className="group flex flex-col h-full bg-white rounded-[20px] border border-[#E5EAF1] hover:border-[#155EEF]/40 transition-colors overflow-hidden">
      <div className="relative aspect-square bg-[#F7F9FC] overflow-hidden">
        <Link href={`/san-pham/${product.slug}`} className="block w-full h-full">
          <ProductImage
            src={img}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="w-full h-full p-4 group-hover:scale-[1.03] transition-transform duration-500"
            watermark="small"
          />
        </Link>

        {/* Badges nhỏ — chỉ "Mới" hoặc "Bán chạy", không có badge giảm giá đỏ */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-20">
          {product.is_new && (
            <span className="bg-[#155EEF] text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
              Mới
            </span>
          )}
          {product.is_bestseller && (
            <span className="bg-gray-900 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
              Bán chạy
            </span>
          )}
        </div>
      </div>

      <div className="p-4 flex flex-col flex-1">
        {product.ofina_sku ? (
          <div className="text-[11px] text-gray-400 mb-1.5 uppercase tracking-wide truncate">
            {product.ofina_sku}
          </div>
        ) : null}
        <h3 className="text-[14px] sm:text-[15px] text-gray-900 line-clamp-2 mb-3 leading-snug min-h-[40px]">
          <Link href={`/san-pham/${product.slug}`} className="hover:text-[#155EEF] transition-colors">
            {product.name}
          </Link>
        </h3>

        <div className="mt-auto flex items-baseline justify-between gap-2">
          <div className="min-w-0">
            {price > 0 ? (
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className="text-[17px] font-bold text-gray-900">{formatPrice(price)}</span>
                {hasDiscount && (
                  <span className="text-xs text-gray-400 line-through">{formatPrice(comparePrice)}</span>
                )}
              </div>
            ) : (
              <span className="text-sm text-gray-700 font-semibold">Liên hệ báo giá</span>
            )}
          </div>
          <Link
            href={`/san-pham/${product.slug}`}
            className="flex-shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#F7F9FC] hover:bg-[#155EEF] hover:text-white text-gray-700 transition-colors"
            aria-label={`Xem chi tiết ${product.name}`}
          >
            <span aria-hidden className="text-[15px]">→</span>
          </Link>
        </div>
      </div>
    </article>
  )
}
