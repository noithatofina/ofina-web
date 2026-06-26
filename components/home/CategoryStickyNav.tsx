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

/**
 * Hàng card danh mục ngang đặt dưới Hero. KHÔNG sticky — chỉ render 1 lần.
 * Mobile cho phép scroll ngang mượt.
 */
export function CategoryStickyNav({ categories }: Props) {
  const items = categories.slice(0, 8)
  if (items.length === 0) return null
  return (
    <section aria-label="Danh mục nổi bật" className="bg-white border-b border-[#E5EAF1]">
      <div className="container-custom py-5 md:py-7">
        <div className="flex gap-3 md:gap-4 overflow-x-auto scrollbar-none pb-1 snap-x snap-mandatory md:justify-center md:flex-wrap md:overflow-visible">
          {items.map((cat) => (
            <Link
              key={cat.slug}
              href={`/danh-muc/${cat.slug}`}
              className="flex-shrink-0 snap-start group min-w-[120px] md:min-w-[140px]"
            >
              <div className="bg-white border border-[#E5EAF1] rounded-2xl p-3 hover:border-brand-900 hover:shadow-sm transition-all flex flex-col items-center gap-2">
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl bg-[#F7F9FC] overflow-hidden relative flex items-center justify-center">
                  {cat.image ? (
                    <Image src={cat.image} alt={cat.name} fill className="object-cover" sizes="64px" />
                  ) : (
                    <Sparkles className="w-6 h-6 text-brand-900" aria-hidden="true" />
                  )}
                </div>
                <span className="text-xs md:text-sm font-medium text-center text-gray-700 group-hover:text-brand-900 transition-colors line-clamp-2 leading-tight">
                  {cat.name}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
