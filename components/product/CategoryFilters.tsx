'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { SlidersHorizontal, X } from 'lucide-react'
import { PriceRangeSlider } from './PriceRangeSlider'

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
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-lg flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5" /> Bộ lọc
        </h3>
        {hasFilters && (
          <button
            onClick={clearAll}
            className="text-sm text-brand-900 hover:underline flex items-center gap-1"
          >
            <X className="w-3 h-3" /> Xóa
          </button>
        )}
      </div>

      {/* Khoảng giá — slider kéo từ–đến (mobile thu gọn) */}
      <div className="mb-6 pb-6 border-b border-gray-100">
        <h4 className="font-semibold mb-3">Khoảng giá</h4>
        <PriceRangeSlider />
      </div>

      {/* Brand filter — placeholder for future */}
      <div className="mb-6 pb-6 border-b border-gray-100">
        <h4 className="font-semibold mb-3">Thương hiệu</h4>
        <div className="text-sm text-gray-500">Tất cả thương hiệu (chưa phân loại)</div>
      </div>

      {/* Chất liệu placeholder */}
      <div>
        <h4 className="font-semibold mb-3">Chất liệu</h4>
        <div className="text-sm text-gray-500">Thông tin chất liệu có trong chi tiết từng SP</div>
      </div>
    </div>
  )
}
