'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useState } from 'react'
import { SlidersHorizontal, ChevronDown } from 'lucide-react'

const MAX = 100_000_000 // 100 triệu
const STEP = 500_000
const fmt = (v: number) => v.toLocaleString('vi-VN')

/** Lọc khoảng giá — mobile thu gọn sau nút "Khoảng giá", desktop hiện luôn. */
export function PriceRangeSlider() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [lo, setLo] = useState(parseInt(searchParams.get('min') || '0', 10) || 0)
  const [hi, setHi] = useState(parseInt(searchParams.get('max') || '0', 10) || MAX)
  const [open, setOpen] = useState(false)

  const loPct = (Math.min(lo, hi) / MAX) * 100
  const hiPct = (Math.max(lo, hi) / MAX) * 100

  function apply() {
    const params = new URLSearchParams(searchParams.toString())
    const a = Math.min(lo, hi), b = Math.max(lo, hi)
    if (a <= 0 && b >= MAX) { params.delete('min'); params.delete('max') }
    else { params.set('min', String(a)); params.set('max', String(b)) }
    params.delete('page')
    setOpen(false)
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="w-full">
      {/* Nút mở trên mobile */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="sm:hidden flex items-center gap-2 h-10 px-3 border border-gray-200 rounded-lg text-sm text-gray-700 w-full justify-between"
      >
        <span className="flex items-center gap-2"><SlidersHorizontal className="w-4 h-4 text-gray-500" /> Khoảng giá</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {/* Panel slider */}
      <div className={`${open ? 'flex' : 'hidden'} sm:flex mt-2 sm:mt-0 w-full items-center gap-3 p-3 sm:p-3 border border-gray-200 rounded-lg bg-white flex-wrap`}>
        <span className="text-sm font-semibold text-gray-700 hidden sm:inline">Khoảng giá</span>
        <div className="price-slider relative h-6 flex-1 min-w-[120px] flex items-center">
          <div className="absolute h-1 w-full rounded bg-gray-200" />
          <div className="absolute h-1 rounded bg-brand-900" style={{ left: `${loPct}%`, width: `${hiPct - loPct}%` }} />
          <input type="range" min={0} max={MAX} step={STEP} value={Math.min(lo, hi)}
            onChange={(e) => setLo(Math.min(Number(e.target.value), hi))} aria-label="Giá thấp nhất" />
          <input type="range" min={0} max={MAX} step={STEP} value={Math.max(lo, hi)}
            onChange={(e) => setHi(Math.max(Number(e.target.value), lo))} aria-label="Giá cao nhất" />
        </div>
        <span className="text-xs text-gray-500 tabular-nums whitespace-nowrap w-full sm:w-auto">
          {fmt(Math.min(lo, hi))}đ – {Math.max(lo, hi) >= MAX ? '100.000.000đ+' : fmt(Math.max(lo, hi)) + 'đ'}
        </span>
        <button onClick={apply} className="ml-auto px-3 h-8 rounded-md border border-brand-900 text-brand-900 text-xs font-medium hover:bg-brand-50">
          Áp dụng
        </button>
      </div>
    </div>
  )
}
