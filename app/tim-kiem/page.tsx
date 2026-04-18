import Link from 'next/link'
import { Search } from 'lucide-react'
import { ProductCard } from '@/components/product/ProductCard'
import { searchProducts } from '@/lib/queries'

interface Props {
  searchParams: Promise<{ q?: string; page?: string }>
}

export async function generateMetadata({ searchParams }: Props) {
  const { q } = await searchParams
  return {
    title: q ? `Tìm kiếm: "${q}" | OFINA` : 'Tìm kiếm sản phẩm | OFINA',
    description: `Kết quả tìm kiếm cho "${q || ''}" tại OFINA.`,
  }
}

const PER_PAGE = 24

export default async function SearchPage({ searchParams }: Props) {
  const sp = await searchParams
  const q = (sp.q || '').trim()
  const currentPage = Math.max(1, parseInt(sp.page || '1', 10))

  const { products, total } = q
    ? await searchProducts(q, { limit: PER_PAGE, offset: (currentPage - 1) * PER_PAGE })
    : { products: [], total: 0 }

  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE))

  return (
    <div className="container-custom py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-brand-900">Trang chủ</Link>
        <span className="mx-2">/</span>
        <span className="text-brand-900 font-semibold">Tìm kiếm</span>
      </nav>

      {/* Search form */}
      <form action="/tim-kiem" className="mb-8 flex gap-2 max-w-3xl">
        <div className="flex-1 relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            name="q"
            defaultValue={q}
            placeholder="Nhập tên sản phẩm, SKU..."
            className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:border-brand-900"
          />
        </div>
        <button className="btn-primary">Tìm kiếm</button>
      </form>

      {!q ? (
        <div className="text-center py-20">
          <Search className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Nhập từ khóa để tìm kiếm</h2>
          <p className="text-gray-500">Ví dụ: "ghế xoay", "bàn họp", "OFN-GXV"</p>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20">
          <Search className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Không tìm thấy sản phẩm</h2>
          <p className="text-gray-500 mb-6">Không có sản phẩm nào khớp với từ khóa <strong>"{q}"</strong></p>
          <Link href="/san-pham" className="btn-primary">Xem tất cả sản phẩm</Link>
        </div>
      ) : (
        <>
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-2">
              Kết quả cho "<span className="text-brand-900">{q}</span>"
            </h1>
            <p className="text-gray-600">Tìm thấy <strong>{total}</strong> sản phẩm</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((p: any) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-12">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Link
                  key={p}
                  href={`/tim-kiem?q=${encodeURIComponent(q)}&page=${p}`}
                  className={`w-10 h-10 rounded-lg font-semibold flex items-center justify-center ${
                    p === currentPage ? 'bg-brand-900 text-white' : 'hover:bg-brand-50'
                  }`}
                >
                  {p}
                </Link>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
