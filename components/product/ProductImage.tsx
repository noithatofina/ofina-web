'use client'

import Image from 'next/image'
import { cn } from '@/lib/utils'

interface Props {
  src: string
  alt: string
  className?: string
  fill?: boolean
  width?: number
  height?: number
  priority?: boolean
  sizes?: string
  watermark?: 'full' | 'small' | 'none'
}

/**
 * Product Image với OFINA watermark overlay tinh gọn
 * - `full`: Watermark lớn ở góc trên phải (cho ảnh chính)
 * - `small`: Watermark nhỏ (cho thumbnail / card)
 * - `none`: Không watermark
 */
export function ProductImage({
  src, alt, className, fill, width, height, priority, sizes,
  watermark = 'small',
}: Props) {
  if (!src) {
    return (
      <div className={cn('bg-gray-100 flex items-center justify-center', className)}>
        <span className="text-gray-400 text-sm">No image</span>
      </div>
    )
  }

  return (
    <div className={cn('relative overflow-hidden', className)}>
      {fill ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
        />
      ) : (
        <Image
          src={src}
          alt={alt}
          width={width || 500}
          height={height || 500}
          priority={priority}
          className="w-full h-full object-cover"
        />
      )}

      {/* Watermark layer - Che logo Govi bằng OFINA */}
      {watermark === 'full' && (
        <div className="absolute top-4 right-4 z-10 pointer-events-none">
          <div className="bg-gradient-to-br from-brand-900 to-brand-800 text-white px-3 py-1.5 rounded-md shadow-lg font-display font-bold text-base tracking-wider">
            OFINA
          </div>
        </div>
      )}

      {watermark === 'small' && (
        <div className="absolute top-2 right-2 z-10 pointer-events-none">
          <div className="bg-black/40 backdrop-blur-md text-white px-2 py-0.5 rounded text-[10px] font-bold tracking-wider">
            OFINA
          </div>
        </div>
      )}
    </div>
  )
}
