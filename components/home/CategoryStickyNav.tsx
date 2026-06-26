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
 * Strip danh mục ngay dưới Hero. Mobile: carousel scroll ngang gọn
 * (card 116px, scrollbar ẩn). Desktop: grid 8 cột 1 hàng.
 */
export function CategoryStickyNav({ categories }: Props) {
  const items = categories.slice(0, 8)
  if (items.length === 0) return null
  return (
    <section aria-label="Danh mục nổi bật" className="bg-white border-b border-[#E5EAF1]">
      <div className="container-custom py-4 md:py-6">
        <div
          className="flex md:grid md:grid-cols-8 gap-2.5 md:gap-3 overflow-x-auto md:overflow-visible snap-x snap-mandatory md:snap-none -mx-4 px-4 md:mx-0 md:px-0 pb-1 md:pb-0"
          style={{ scrollbarWidth: 'none' }}
        >
          {items.map((cat) => (
            <Link
              key={cat.slug}
              href={`/danh-muc/${cat.slug}`}
              className="flex-shrink-0 snap-start group w-[116px] md:w-auto"
            >
              <div className="bg-white border border-[#E5EAF1] rounded-2xl px-2 py-3 hover:border-[#155EEF] hover:shadow-sm transition-all flex flex-col items-center gap-1.5 h-full">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-[#F7F9FC] overflow-hidden relative flex items-center justify-center flex-shrink-0">
                  {cat.image ? (
                    <Image src={cat.image} alt={cat.name} fill className="object-cover" sizes="56px" />
                  ) : (
                    <Sparkles className="w-5 h-5 text-[#155EEF]" aria-hidden="true" />
                  )}
                </div>
                <span className="text-[12px] md:text-[13px] font-medium text-center text-gray-800 group-hover:text-[#155EEF] transition-colors line-clamp-2 leading-[1.25]">
                  {cat.name}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <style>{`
        section[aria-label="Danh mục nổi bật"] > div > div::-webkit-scrollbar { display: none; }
      `}</style>
    </section>
  )
}
