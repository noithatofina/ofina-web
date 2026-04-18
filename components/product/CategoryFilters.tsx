'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { SlidersHorizontal, X } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

const PRICE_RANGES = [
  { label: 'Dưới 1 triệu', min: 0, max: 1_000_000 },
  { label: '1 - 3 triệu', min: 1_000_000, max: 3_000_000 },
  { label: '3 - 5 triệu', min: 3_000_000, max: 5_000_000 },
  { label: '5 - 10 triệu', min: 5_000_000, max: 10_000_000 },
  { label: 'Trên 10 triệu', min: 10_000_000, max: 999_999_999 },
]

export function CategoryFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const currentMin = parseInt(searchParams.get('min') || '0', 10)
  const currentMax = parseInt(searchParams.get('max') || '0', 10)

  function setPriceRange(min: number, max: number) {
    const params = new URLSearchParams(searchParams.toString())
    if (min === 0 && max === 0) {
      params.delete('min')
      params.delete('max')
    } else {
      params.set('min', String(min))
      params.set('max', String(max))
    }
    params.delete('page')
    router.push(`${pathname}?${params.toString()}`)
  }

  function clearAll() {
    router.push(pathname)
  }

  const hasFilters = currentMin > 0 || currentMax > 0

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

      {/* Price Range */}
      <div className="mb-6 pb-6 border-b">
        <h4 className="font-semibold mb-3">Khoảng giá</h4>
        <div className="space-y-2 text-sm">
          <label className="flex items-center gap-2 cursor-pointer hover:text-brand-900">
            <input
              type="radio"
              name="price"
              checked={!hasFilters}
              onChange={() => setPriceRange(0, 0)}
              className="rounded"
            />
            <span>Tất cả mức giá</span>
          </label>
          {PRICE_RANGES.map((range) => {
            const isActive = currentMin === range.min && currentMax === range.max
            return (
              <label
                key={range.label}
                className={`flex items-center gap-2 cursor-pointer ${isActive ? 'text-brand-900 font-semibold' : 'hover:text-brand-900'}`}
              >
                <input
                  type="radio"
                  name="price"
                  checked={isActive}
                  onChange={() => setPriceRange(range.min, range.max)}
                  className="rounded"
                />
                <span>{range.label}</span>
              </label>
            )
          })}
        </div>
      </div>

      {/* Custom range display */}
      {hasFilters && (
        <div className="mb-4 p-3 bg-brand-50 rounded-lg text-sm">
          <div className="font-semibold mb-1">Đang lọc:</div>
          <div className="text-brand-900">
            {formatPrice(currentMin)} – {formatPrice(currentMax)}
          </div>
        </div>
      )}

      {/* Brand filter — placeholder for future */}
      <div className="mb-6 pb-6 border-b">
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
