import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart, Eye, Heart } from 'lucide-react'
import { formatPrice, calcDiscountPercent } from '@/lib/utils'
import type { Product } from '@/lib/supabase'

interface Props {
  product: Partial<Product> & { id: string; slug: string; name: string }
}

export function ProductCard({ product }: Props) {
  const price = product.price || 0
  const comparePrice = product.compare_price || 0
  const discount = calcDiscountPercent(comparePrice || price, price)
  const hasDiscount = comparePrice && comparePrice > price
  const img = product.primary_image || product.images?.[0] || '/placeholder-product.jpg'

  return (
    <article className="card group">
      <div className="relative aspect-[4/5] bg-gray-100 overflow-hidden">
        <Link href={`/san-pham/${product.slug}`}>
          <Image
            src={img}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
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
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="w-9 h-9 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-brand-900 hover:text-white transition-colors" aria-label="Yêu thích">
            <Heart className="w-4 h-4" />
          </button>
          <Link href={`/san-pham/${product.slug}`} className="w-9 h-9 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-brand-900 hover:text-white transition-colors" aria-label="Xem nhanh">
            <Eye className="w-4 h-4" />
          </Link>
        </div>

        {/* Quick add to cart */}
        <button className="absolute bottom-0 left-0 right-0 bg-brand-900 text-white py-2.5 font-semibold flex items-center justify-center gap-2 translate-y-full group-hover:translate-y-0 transition-transform">
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

        {/* Rating */}
        {product.avg_rating && product.avg_rating > 0 && (
          <div className="flex items-center gap-1 mb-2 text-sm">
            <span className="text-accent-500">★</span>
            <span className="font-semibold">{product.avg_rating.toFixed(1)}</span>
            <span className="text-gray-400">({product.review_count || 0})</span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="text-lg font-bold text-brand-900">{formatPrice(price)}</span>
          {hasDiscount && (
            <span className="text-sm text-gray-400 line-through">{formatPrice(comparePrice)}</span>
          )}
        </div>
      </div>
    </article>
  )
}
