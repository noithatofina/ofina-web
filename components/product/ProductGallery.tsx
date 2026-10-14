'use client'

import { useState } from 'react'
import { ProductImage } from './ProductImage'
import { ChevronLeft, ChevronRight, ImageOff } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props {
  images: string[]
  productName: string
  /** Mô tả riêng từng ảnh, cùng thứ tự với `images`. Rỗng thì dùng nhãn mặc định. */
  alts?: string[]
}

/**
 * ⛔ Trước đây chỗ này là một ảnh ghế trên Unsplash — tức là ảnh SẢN PHẨM CỦA NGƯỜI
 * KHÁC đứng làm ảnh sản phẩm OFINA. Đo 14/10/2026: 1 sản phẩm đang bán không có ảnh
 * nào, trang của nó hiện ảnh Unsplash 19 lần và vẫn nằm trong sitemap. Khách đặt hàng
 * theo ảnh đó là đặt theo cái không phải hàng mình bán.
 * Nay thay bằng khối trống có nhãn rõ ràng — thà nói "chưa có ảnh" còn hơn cho xem
 * nhầm hàng.
 */
function KhungChuaCoAnh() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#F7F9FC] text-gray-400 gap-3">
      <ImageOff className="w-10 h-10" strokeWidth={1.5} aria-hidden />
      <span className="text-sm font-medium">Đang cập nhật ảnh sản phẩm</span>
      <span className="text-xs text-gray-400">Liên hệ OFINA để xem ảnh thực tế</span>
    </div>
  )
}

export function ProductGallery({ images, productName, alts }: Props) {
  const imgs = images
  const [active, setActive] = useState(0)

  const prev = () => setActive((i) => (i === 0 ? imgs.length - 1 : i - 1))
  const next = () => setActive((i) => (i === imgs.length - 1 ? 0 : i + 1))

  return (
    <div>
      {/* Main image */}
      <div className="aspect-square bg-gray-50 rounded-2xl overflow-hidden mb-4 relative group">
        {imgs.length === 0 ? (
          <KhungChuaCoAnh />
        ) : (
          <ProductImage
            src={imgs[active]}
            alt={alts?.[active] || `${productName} - ảnh ${active + 1}`}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="w-full h-full"
            watermark="full"
          />
        )}
        {imgs.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white z-20"
              aria-label="Ảnh trước"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white z-20"
              aria-label="Ảnh tiếp"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded-full z-20">
              {active + 1} / {imgs.length}
            </div>
          </>
        )}
      </div>

      {/* Thumbnails — single row horizontal scroll */}
      {imgs.length > 1 && (
        <div
          className="flex gap-2 overflow-x-auto pb-1 snap-x snap-mandatory scroll-px-2 scrollbar-thin"
          style={{ scrollbarWidth: 'thin' }}
        >
          {imgs.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={cn(
                'flex-shrink-0 w-[18%] sm:w-[15%] md:w-20 lg:w-[18%] aspect-square bg-gray-50 rounded-lg overflow-hidden border-2 transition-colors relative snap-start',
                active === i ? 'border-brand-900' : 'border-transparent hover:border-gray-300'
              )}
              aria-label={`Xem ảnh ${i + 1}`}
            >
              <ProductImage
                src={img}
                alt={alts?.[i] || `${productName} thumbnail ${i + 1}`}
                fill
                sizes="100px"
                className="w-full h-full"
                watermark="none"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
