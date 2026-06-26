'use client'

import Link from 'next/link'
import Image from 'next/image'
import { formatPrice } from '@/lib/utils'
import type { VariantOption } from '@/lib/variant-groups'

export function VariantSwitcher({
  options,
  currentSlug,
}: {
  options: VariantOption[]
  currentSlug: string
}) {
  return (
    <div className="mb-5">
      <div className="text-sm font-semibold text-gray-900 mb-2.5">
        Chọn phiên bản:
      </div>
      <div className="grid grid-cols-3 gap-2">
        {options.map((opt) => {
          const isActive = opt.slug === currentSlug
          const hasDiscount = opt.compare_price && opt.compare_price > opt.price

          const card = (
            <div
              className={[
                'relative h-full rounded-xl border-2 p-2.5 transition-all',
                isActive
                  ? 'border-brand-900 bg-brand-50 shadow-sm'
                  : 'border-gray-200 bg-white hover:border-gray-400 hover:shadow-sm',
              ].join(' ')}
            >
              {isActive && (
                <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-brand-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
                  ĐANG XEM
                </span>
              )}
              <div className="aspect-square bg-gray-50 rounded-lg overflow-hidden mb-2 flex items-center justify-center">
                <Image
                  src={opt.thumb_url}
                  alt={opt.label}
                  width={140}
                  height={140}
                  className="object-contain w-full h-full"
                />
              </div>
              <div className="text-xs font-bold text-gray-900 text-center">{opt.label}</div>
              {opt.badge && (
                <div className="text-[10px] text-gray-500 uppercase tracking-wider text-center mt-0.5">
                  {opt.badge}
                </div>
              )}
              <div className="mt-1.5 text-center">
                <div className="text-sm font-bold text-red-600">{formatPrice(opt.price)}</div>
                {hasDiscount && (
                  <div className="text-[10px] text-gray-400 line-through">
                    {formatPrice(opt.compare_price!)}
                  </div>
                )}
              </div>
            </div>
          )

          if (isActive) {
            return (
              <div key={opt.slug} aria-current="true">
                {card}
              </div>
            )
          }
          return (
            <Link
              key={opt.slug}
              href={`/san-pham/${opt.slug}`}
              prefetch
              className="block"
              aria-label={`Chuyển sang ${opt.label} giá ${formatPrice(opt.price)}`}
            >
              {card}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
