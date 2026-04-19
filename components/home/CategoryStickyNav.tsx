'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Sparkles } from 'lucide-react'

interface Category {
  slug: string
  name: string
  image?: string | null
  product_count?: number
}

interface Props {
  categories: Category[]
}

export function CategoryStickyNav({ categories }: Props) {
  const [stuck, setStuck] = useState(false)

  useEffect(() => {
    function onScroll() {
      // Sticky activates after hero (~480px)
      setStuck(window.scrollY > 480)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      aria-label="Danh mục nhanh"
      className={`bg-white border-b z-30 transition-shadow ${
        stuck ? 'sticky top-16 shadow-md' : 'relative'
      }`}
    >
      <div className="container-custom py-3">
        <div className="flex gap-2 md:gap-3 overflow-x-auto scrollbar-thin pb-1">
          {categories.slice(0, 12).map((cat) => (
            <Link
              key={cat.slug}
              href={`/danh-muc/${cat.slug}`}
              className="flex-shrink-0 flex flex-col items-center gap-1.5 group min-w-[78px] py-1"
            >
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl bg-brand-50 group-hover:ring-2 group-hover:ring-brand-900 border border-brand-100 flex items-center justify-center text-brand-900 transition-all overflow-hidden relative">
                {cat.image ? (
                  <Image src={cat.image} alt={cat.name} fill className="object-cover" sizes="64px" />
                ) : (
                  <Sparkles className="w-6 h-6" aria-hidden="true" />
                )}
              </div>
              <span className="text-[11px] md:text-xs font-semibold text-center text-gray-700 group-hover:text-brand-900 transition-colors line-clamp-2 max-w-[78px] leading-tight">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}
