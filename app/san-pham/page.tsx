import Link from 'next/link'
import { ProductCard } from '@/components/product/ProductCard'
import { getAllProducts, getHomepageData } from '@/lib/queries'

export const metadata = {
  title: 'Tất cả sản phẩm | OFINA',
  description: 'Danh sách tất cả sản phẩm nội thất văn phòng tại OFINA.',
}

const PER_PAGE = 24

export default async function AllProductsPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const sp = await searchParams
  const page = Math.max(1, parseInt(sp.page || '1', 10))
  const { products, total } = await getAllProducts({ limit: PER_PAGE, offset: (page - 1) * PER_PAGE })
  const { categories } = await getHomepageData()
  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE))

  return (
    <div className="container-custom py-8">
      <h1 className="font-display text-4xl md:text-5xl font-bold text-brand-950 mb-3">Tất cả sản phẩm</h1>
      <p className="text-gray-600 text-lg mb-8">
        <strong>{total.toLocaleString('vi-VN')}</strong> sản phẩm · Giao hàng toàn quốc
      </p>

      {/* Category quick links */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.slice(0, 15).map((c: any) => (
          <Link
            key={c.slug}
            href={`/danh-muc/${c.slug}`}
            className="px-4 py-2 bg-white border rounded-full hover:border-brand-900 hover:text-brand-900 text-sm"
          >
            {c.name}
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {products.map((p: any) => <ProductCard key={p.id} product={p} />)}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-12 flex-wrap">
          {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={`/san-pham?page=${p}`}
              className={`w-10 h-10 rounded-lg font-semibold flex items-center justify-center ${
                p === page ? 'bg-brand-900 text-white' : 'hover:bg-brand-50'
              }`}
            >
              {p}
            </Link>
          ))}
          {totalPages > 10 && <span>... ({totalPages})</span>}
        </div>
      )}
    </div>
  )
}
