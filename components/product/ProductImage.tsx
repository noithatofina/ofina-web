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
  watermark?: 'full' | 'small' | 'none'  // DEPRECATED: ảnh đã có watermark sẵn
}

/**
 * Product Image — ảnh đã có OFINA watermark burn-in (processed bằng Python)
 * Chỉ làm nhiệm vụ hiển thị ảnh đúng size/aspect-ratio
 */
export function ProductImage({
  src, alt, className, fill, width, height, priority, sizes,
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
    </div>
  )
}
