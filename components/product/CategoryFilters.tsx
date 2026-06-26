'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { SlidersHorizontal, X } from 'lucide-react'
import { PriceRangeSlider } from './PriceRangeSlider'

/**
 * Desktop sidebar filter (compact). Mobile dùng CategoryMobileFilter bottom sheet.
 */
export function CategoryFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const currentMin = parseInt(searchParams.get('min') || '0', 10)
  const currentMax = parseInt(searchParams.get('max') || '0', 10)
  const hasFilters = currentMin > 0 || currentMax > 0

  function clearAll() {
    router.push(pathname)
  }

  return (
    <div className="bg-white border border-[#E5EAF1] rounded-2xl p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-[15px] text-gray-900 flex items-center gap-1.5">
          <SlidersHorizontal className="w-4 h-4 text-[#155EEF]" strokeWidth={2} />
          Bộ lọc
        </h3>
        {hasFilters && (
          <button
            onClick={clearAll}
            className="text-xs text-[#155EEF] hover:underline flex items-center gap-1"
          >
            <X className="w-3 h-3" /> Xoá
          </button>
        )}
      </div>

      <div className="mb-4 pb-4 border-b border-[#E5EAF1]">
        <h4 className="text-[12px] font-semibold text-gray-500 uppercase tracking-wider mb-2.5">Khoảng giá</h4>
        <PriceRangeSlider />
      </div>

      <details className="mb-2.5 border border-[#E5EAF1] rounded-lg">
        <summary className="cursor-pointer list-none px-3 py-2.5 flex items-center justify-between text-[13px] font-semibold text-gray-900">
          <span>Thương hiệu</span>
          <span className="text-gray-400 text-xs">+</span>
        </summary>
        <div className="px-3 pb-3 text-[12px] text-gray-500">
          Đang cập nhật.
        </div>
      </details>

      <details className="border border-[#E5EAF1] rounded-lg">
        <summary className="cursor-pointer list-none px-3 py-2.5 flex items-center justify-between text-[13px] font-semibold text-gray-900">
          <span>Chất liệu</span>
          <span className="text-gray-400 text-xs">+</span>
        </summary>
        <div className="px-3 pb-3 text-[12px] text-gray-500">
          Xem chi tiết từng sản phẩm.
        </div>
      </details>
    </div>
  )
}
