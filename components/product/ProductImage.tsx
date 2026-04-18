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
}

/**
 * Product Image với OFINA watermark overlay
 * Che logo/watermark gốc của nhà cung cấp, branding lại thành OFINA
 */
export function ProductImage({
  src, alt, className, fill, width, height, priority, sizes
}: Props) {
  if (!src) {
    return (
      <div className={cn('bg-gray-100 flex items-center justify-center', className)}>
        <span className="text-gray-400">No image</span>
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

      {/* OFINA Watermark Overlay - góc dưới trái */}
      <div className="absolute bottom-2 left-2 z-10 pointer-events-none">
        <div className="bg-black/50 backdrop-blur-sm text-white px-2 py-1 rounded-md text-xs font-bold tracking-wide shadow-lg">
          OFINA
        </div>
      </div>

      {/* OFINA Corner Watermark lớn - góc phải trên (mờ) */}
      <div className="absolute top-3 right-3 z-10 pointer-events-none opacity-70">
        <div className="font-display text-white text-lg font-bold drop-shadow-lg" style={{
          textShadow: '2px 2px 4px rgba(0,0,0,0.8), 0 0 8px rgba(30,58,138,0.5)'
        }}>
          OFINA
        </div>
      </div>
    </div>
  )
}
