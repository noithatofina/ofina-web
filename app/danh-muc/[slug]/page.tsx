import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ProductCard } from '@/components/product/ProductCard'
import { CategoryFilters } from '@/components/product/CategoryFilters'
import { getProductsByCategory, getCategoryInfo } from '@/lib/queries'
import { ChevronRight } from 'lucide-react'

interface Props {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ sort?: string; page?: string; min?: string; max?: string }>
}

export const revalidate = 3600

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const cat = await getCategoryInfo(slug)
  const name = cat?.name || slug.replace(/-/g, ' ')
  const title = `${name} — chính hãng, giá tốt | OFINA`
  const description = `${name} tại OFINA — đa dạng mẫu, giá cạnh tranh, bảo hành 24 tháng. Miễn phí giao Hà Nội & TP.HCM, lắp đặt tận nơi, trả góp 0%. Hotline 0325669996.`
  return {
    title: { absolute: title }, // bypass layout template
    description,
    alternates: { canonical: `/danh-muc/${slug}` },
    openGraph: {
      type: 'website',
      title,
      description,
      url: `https://ofina.vn/danh-muc/${slug}`,
      images: [{
        url: cat?.image || 'https://ofina.vn/logo.png',
        width: 800,
        height: 800,
        alt: name,
      }],
    },
  }
}

const PER_PAGE = 24

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params
  const sp = await searchParams
  const currentPage = Math.max(1, parseInt(sp.page || '1', 10))
  const sort = sp.sort || 'newest'

  const cat = await getCategoryInfo(slug)
  if (!cat) return notFound()

  const minPrice = parseInt(sp.min || '0', 10) || undefined
  const maxPrice = parseInt(sp.max || '0', 10) || undefined

  const { products, total } = await getProductsByCategory(slug, {
    limit: PER_PAGE,
    offset: (currentPage - 1) * PER_PAGE,
    sort,
    minPrice,
    maxPrice,
  })

  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE))
  const pageNumbers = getPageNumbers(currentPage, totalPages)

  return (
    <div className="container-custom py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-brand-900">Trang chủ</Link>
        <ChevronRight className="w-4 h-4" />
        <Link href="/san-pham" className="hover:text-brand-900">Sản phẩm</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-brand-900 font-semibold">{cat.name}</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-4xl md:text-5xl font-bold text-brand-950 mb-3">
          {cat.name}
        </h1>
        <p className="text-gray-600 text-lg">
          <strong>{total.toLocaleString('vi-VN')}</strong> sản phẩm · Giao hàng toàn quốc · Bảo hành chính hãng
        </p>
      </div>

      <div className="grid lg:grid-cols-[280px_1fr] gap-8">
        {/* Sidebar Filters */}
        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <CategoryFilters />
        </aside>

        {/* Products */}
        <div>
          {/* Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6 p-4 bg-white rounded-lg border">
            <span className="text-gray-600">
              Hiển thị <strong>{(currentPage - 1) * PER_PAGE + 1}–{Math.min(currentPage * PER_PAGE, total)}</strong> / <strong>{total}</strong> sản phẩm
            </span>
            <form action={`/danh-muc/${slug}`} className="flex items-center gap-2">
              <select
                name="sort"
                defaultValue={sort}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:border-brand-900"
              >
                <option value="newest">Mới nhất</option>
                <option value="price-asc">Giá thấp → cao</option>
                <option value="price-desc">Giá cao → thấp</option>
                <option value="name">Tên A–Z</option>
              </select>
              <button className="btn-primary py-2 px-4 text-sm">Sắp xếp</button>
            </form>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-20 bg-gray-50 rounded-xl">
              <p className="text-gray-600">Chưa có sản phẩm nào trong danh mục này.</p>
            </div>
          ) : (
            <>
              {/* Product Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {products.map((p: any) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-12 flex-wrap">
                  <Link
                    href={`/danh-muc/${slug}${buildQuery({ page: currentPage - 1, sort })}`}
                    className={`px-4 py-2 border rounded-lg ${currentPage === 1 ? 'pointer-events-none opacity-40' : 'hover:bg-brand-50'}`}
                    aria-disabled={currentPage === 1}
                  >
                    ← Trước
                  </Link>

                  {pageNumbers.map((p, idx) =>
                    p === '...' ? (
                      <span key={`dot-${idx}`} className="px-2">…</span>
                    ) : (
                      <Link
                        key={p}
                        href={`/danh-muc/${slug}${buildQuery({ page: p, sort })}`}
                        className={`w-10 h-10 rounded-lg font-semibold flex items-center justify-center ${
                          p === currentPage
                            ? 'bg-brand-900 text-white'
                            : 'hover:bg-brand-50'
                        }`}
                      >
                        {p}
                      </Link>
                    )
                  )}

                  <Link
                    href={`/danh-muc/${slug}${buildQuery({ page: currentPage + 1, sort })}`}
                    className={`px-4 py-2 border rounded-lg ${currentPage === totalPages ? 'pointer-events-none opacity-40' : 'hover:bg-brand-50'}`}
                    aria-disabled={currentPage === totalPages}
                  >
                    Tiếp →
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function buildQuery(params: Record<string, any>) {
  const qs = new URLSearchParams()
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== '') qs.set(k, String(v))
  }
  const s = qs.toString()
  return s ? `?${s}` : ''
}

function getPageNumbers(current: number, total: number): (number | '...')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  if (current <= 3) return [1, 2, 3, 4, '...', total]
  if (current >= total - 2) return [1, '...', total - 3, total - 2, total - 1, total]
  return [1, '...', current - 1, current, current + 1, '...', total]
}
