import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ProductCard } from '@/components/product/ProductCard'
import { getProductsBySubcategories } from '@/lib/queries'
import { ChevronRight } from 'lucide-react'
import { NAV_MENU } from '@/lib/nav-menu'

interface Props {
  params: Promise<{ group: string }>
  searchParams: Promise<{ sort?: string; page?: string; min?: string; max?: string }>
}

const GROUPS = {
  'ghe': {
    title: 'Tất cả Ghế Văn Phòng',
    seoTitle: 'Ghế văn phòng — Ghế xoay, da giám đốc, công thái học, chân quỳ | OFINA',
    description: 'Bộ sưu tập ghế văn phòng đầy đủ tại OFINA: ghế xoay, ghế da giám đốc, ghế công thái học, ghế chân quỳ, ghế training. Bảo hành 24 tháng, miễn phí giao Hà Nội/HCM.',
    matchLabel: 'Ghế',
  },
  'ban': {
    title: 'Tất cả Bàn Văn Phòng',
    seoTitle: 'Bàn văn phòng — Bàn làm việc, bàn họp, cụm bàn, bàn nâng hạ | OFINA',
    description: 'Bộ sưu tập bàn văn phòng đầy đủ tại OFINA: bàn làm việc chân sắt/gỗ, bàn giám đốc, cụm bàn, bàn họp, bàn nâng hạ thông minh. Bảo hành 24 tháng.',
    matchLabel: 'Bàn',
  },
  'tu-ke': {
    title: 'Tất cả Tủ & Kệ',
    seoTitle: 'Tủ & Kệ văn phòng — Tủ hồ sơ, locker, giá kệ | OFINA',
    description: 'Tủ hồ sơ, tủ locker, kệ trang trí, giá kệ sắt — giải pháp lưu trữ tối ưu cho văn phòng. Chất liệu cao cấp, chống ẩm, bảo hành 24 tháng.',
    matchLabel: 'Tủ & Kệ',
  },
  'sofa': {
    title: 'Tất cả Sofa & Ghế Thư Giãn',
    seoTitle: 'Sofa văn phòng & Ghế thư giãn — Đa dạng mẫu | OFINA',
    description: 'Sofa văn phòng, sofa đơn/đôi/góc, ghế thư giãn, ghế armchair — nâng tầm không gian tiếp khách doanh nghiệp.',
    matchLabel: 'Sofa',
  },
  'cafe-bar': {
    title: 'Tất cả Cafe & Bar',
    seoTitle: 'Bàn ghế cafe, ghế bar, hội trường | OFINA',
    description: 'Bàn ghế cafe, ghế bar, ghế hội trường, ghế phòng chờ, bàn họp gỗ — giải pháp đa dạng cho không gian thương mại.',
    matchLabel: 'Cafe & Bar',
  },
} as const

type GroupKey = keyof typeof GROUPS

export async function generateStaticParams() {
  return Object.keys(GROUPS).map((group) => ({ group }))
}

export async function generateMetadata({ params }: Props) {
  const { group } = await params
  const cfg = GROUPS[group as GroupKey]
  if (!cfg) return { title: 'Không tìm thấy nhóm sản phẩm | OFINA' }
  return {
    title: cfg.seoTitle,
    description: cfg.description,
    alternates: { canonical: `/nhom/${group}` },
  }
}

const PER_PAGE = 24

function getSubcategoriesFromNav(matchLabel: string): { slug: string; name: string }[] {
  // Find the menu item matching this label, flatten its mega columns
  const item = NAV_MENU.find((m) => m.label === matchLabel)
  if (!item || !item.mega) return []
  const out: { slug: string; name: string }[] = []
  for (const col of item.mega.columns) {
    for (const cat of col.items) out.push(cat)
  }
  return out
}

export default async function GroupPage({ params, searchParams }: Props) {
  const { group } = await params
  const cfg = GROUPS[group as GroupKey]
  if (!cfg) return notFound()

  const sp = await searchParams
  const currentPage = Math.max(1, parseInt(sp.page || '1', 10))
  const sort = sp.sort || 'newest'
  const minPrice = parseInt(sp.min || '0', 10) || undefined
  const maxPrice = parseInt(sp.max || '0', 10) || undefined

  const subcats = getSubcategoriesFromNav(cfg.matchLabel)
  const slugs = subcats.map((c) => c.slug)

  const { products, total } = await getProductsBySubcategories(slugs, {
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
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-brand-900">Trang chủ</Link>
        <ChevronRight className="w-4 h-4" />
        <Link href="/san-pham" className="hover:text-brand-900">Sản phẩm</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-900 font-semibold">{cfg.title}</span>
      </nav>

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          {cfg.title}
        </h1>
        <p className="text-gray-600">
          <strong>{total.toLocaleString('vi-VN')}</strong> sản phẩm · {subcats.length} danh mục con · Bảo hành 24 tháng
        </p>
      </div>

      {/* Subcategory chips (filter quick-jump) */}
      {subcats.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          {subcats.map((c) => (
            <Link
              key={c.slug}
              href={`/danh-muc/${c.slug}`}
              className="px-3.5 py-1.5 text-sm bg-white border border-gray-200 hover:border-brand-900 hover:text-brand-900 rounded-full text-gray-700 transition-colors"
            >
              {c.name}
            </Link>
          ))}
        </div>
      )}

      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <span className="text-gray-600 text-sm">
          Hiển thị <strong>{(currentPage - 1) * PER_PAGE + 1}–{Math.min(currentPage * PER_PAGE, total)}</strong> / <strong>{total}</strong> sản phẩm
        </span>
        <form action={`/nhom/${group}`} className="flex items-center gap-2">
          <select
            name="sort"
            defaultValue={sort}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-brand-900 text-sm"
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
          <p className="text-gray-600">Chưa có sản phẩm nào trong nhóm này.</p>
        </div>
      ) : (
        <>
          {/* Product Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((p: any) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-12 flex-wrap">
              <Link
                href={`/nhom/${group}${buildQuery({ page: currentPage - 1, sort })}`}
                className={`px-4 py-2 border rounded-lg ${currentPage === 1 ? 'pointer-events-none opacity-40' : 'hover:bg-gray-50'}`}
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
                    href={`/nhom/${group}${buildQuery({ page: p, sort })}`}
                    className={`w-10 h-10 rounded-lg font-semibold flex items-center justify-center ${
                      p === currentPage
                        ? 'bg-brand-900 text-white'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    {p}
                  </Link>
                )
              )}

              <Link
                href={`/nhom/${group}${buildQuery({ page: currentPage + 1, sort })}`}
                className={`px-4 py-2 border rounded-lg ${currentPage === totalPages ? 'pointer-events-none opacity-40' : 'hover:bg-gray-50'}`}
                aria-disabled={currentPage === totalPages}
              >
                Tiếp →
              </Link>
            </div>
          )}
        </>
      )}
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
