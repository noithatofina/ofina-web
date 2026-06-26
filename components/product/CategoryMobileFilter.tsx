'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { SlidersHorizontal, X, Check, ChevronDown } from 'lucide-react'

type PriceChip = {
  label: string
  min?: number
  max?: number
}

const PRICE_CHIPS: PriceChip[] = [
  { label: 'Tất cả' },
  { label: 'Dưới 1 triệu', max: 999_999 },
  { label: '1 – 3 triệu', min: 1_000_000, max: 3_000_000 },
  { label: '3 – 5 triệu', min: 3_000_000, max: 5_000_000 },
  { label: '5 – 10 triệu', min: 5_000_000, max: 10_000_000 },
  { label: 'Trên 10 triệu', min: 10_000_000 },
]

const SORT_OPTIONS = [
  { value: 'newest', label: 'Mới nhất' },
  { value: 'price-asc', label: 'Giá thấp → cao' },
  { value: 'price-desc', label: 'Giá cao → thấp' },
  { value: 'name', label: 'Tên A–Z' },
]

function matchesChip(chip: PriceChip, min: number, max: number): boolean {
  return (chip.min || 0) === min && (chip.max || 0) === max
}

export function CategoryMobileFilter() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const currentMin = parseInt(searchParams.get('min') || '0', 10)
  const currentMax = parseInt(searchParams.get('max') || '0', 10)
  const currentSort = searchParams.get('sort') || 'newest'
  const hasFilters = currentMin > 0 || currentMax > 0

  const initialIdx = PRICE_CHIPS.findIndex((c) => matchesChip(c, currentMin, currentMax))
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<number>(initialIdx >= 0 ? initialIdx : 0)

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
      return () => { document.body.style.overflow = '' }
    }
  }, [open])

  function buildQuery(min?: number, max?: number, sort?: string): string {
    const qs = new URLSearchParams()
    if (sort && sort !== 'newest') qs.set('sort', sort)
    if (min && min > 0) qs.set('min', String(min))
    if (max && max > 0) qs.set('max', String(max))
    const s = qs.toString()
    return s ? `?${s}` : ''
  }

  function applyFilter() {
    const chip = PRICE_CHIPS[selected]
    router.push(`${pathname}${buildQuery(chip.min, chip.max, currentSort)}`)
    setOpen(false)
  }

  function clearFilter() {
    setSelected(0)
    router.push(`${pathname}${buildQuery(undefined, undefined, currentSort)}`)
    setOpen(false)
  }

  function changeSort(value: string) {
    router.push(`${pathname}${buildQuery(currentMin || undefined, currentMax || undefined, value)}`)
  }

  return (
    <>
      {/* Thanh thao tác — 2 nút ngang gọn */}
      <div className="md:hidden flex items-center gap-2 mb-4">
        <button
          onClick={() => setOpen(true)}
          className={`flex-1 inline-flex items-center justify-center gap-2 h-11 px-4 rounded-xl border text-[14px] font-semibold transition-colors ${
            hasFilters ? 'bg-[#155EEF] text-white border-[#155EEF]' : 'bg-white text-gray-900 border-[#E5EAF1]'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" strokeWidth={2} />
          Lọc{hasFilters ? ' · 1' : ''}
        </button>
        <div className="flex-1 relative">
          <select
            value={currentSort}
            onChange={(e) => changeSort(e.target.value)}
            className="w-full h-11 px-4 pr-9 rounded-xl border border-[#E5EAF1] bg-white text-[14px] font-semibold text-gray-900 appearance-none focus:outline-none focus:border-[#155EEF]"
            aria-label="Sắp xếp sản phẩm"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Bottom sheet */}
      {open && (
        <div className="md:hidden fixed inset-0 z-[60]">
          <div
            className="absolute inset-0 bg-black/40 animate-fade-in"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute inset-x-0 bottom-0 bg-white rounded-t-[20px] shadow-2xl flex flex-col animate-slide-in-bottom" style={{ maxHeight: '80vh' }}>
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#E5EAF1]">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#155EEF]" />
                <h3 className="font-bold text-[16px] text-gray-900">Bộ lọc</h3>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-1.5 hover:bg-gray-100 rounded-lg"
                aria-label="Đóng bộ lọc"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
              <div className="mb-5">
                <h4 className="text-[13px] font-semibold text-gray-900 mb-3 uppercase tracking-wider">Khoảng giá</h4>
                <div className="flex flex-wrap gap-2">
                  {PRICE_CHIPS.map((chip, i) => {
                    const active = selected === i
                    return (
                      <button
                        key={chip.label}
                        onClick={() => setSelected(i)}
                        className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[13px] font-medium transition-colors ${
                          active
                            ? 'bg-[#155EEF] text-white border border-[#155EEF]'
                            : 'bg-white text-gray-700 border border-[#E5EAF1] hover:border-[#155EEF]/40'
                        }`}
                      >
                        {active && <Check className="w-3 h-3" />}
                        {chip.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              <details className="border border-[#E5EAF1] rounded-xl mb-3">
                <summary className="cursor-pointer list-none px-4 py-3 flex items-center justify-between font-semibold text-[14px] text-gray-900">
                  <span>Thương hiệu</span>
                  <ChevronDown className="w-4 h-4 text-gray-400 transition-transform [details[open]>&]:rotate-180" />
                </summary>
                <div className="px-4 pb-4 text-[13px] text-gray-500">
                  Đang cập nhật danh sách thương hiệu.
                </div>
              </details>

              <details className="border border-[#E5EAF1] rounded-xl">
                <summary className="cursor-pointer list-none px-4 py-3 flex items-center justify-between font-semibold text-[14px] text-gray-900">
                  <span>Chất liệu</span>
                  <ChevronDown className="w-4 h-4 text-gray-400 transition-transform" />
                </summary>
                <div className="px-4 pb-4 text-[13px] text-gray-500">
                  Thông tin chất liệu chi tiết có trong từng sản phẩm.
                </div>
              </details>
            </div>

            {/* Footer */}
            <div
              className="border-t border-[#E5EAF1] px-5 py-3 flex items-center gap-2 bg-white"
              style={{ paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom))' }}
            >
              <button
                onClick={clearFilter}
                className="px-4 h-11 text-[14px] font-semibold text-gray-700 hover:text-[#155EEF] underline underline-offset-2"
              >
                Xoá lọc
              </button>
              <button
                onClick={applyFilter}
                className="flex-1 h-11 bg-[#155EEF] text-white rounded-xl font-semibold text-[14px] hover:bg-[#1D4ED8] transition-colors"
              >
                Áp dụng
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
