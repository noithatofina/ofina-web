import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ProductCard } from '@/components/product/ProductCard'
import { getProductsByCategory } from '@/lib/queries'
import { ChevronRight, SlidersHorizontal } from 'lucide-react'

interface Props {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ sort?: string; min?: string; max?: string }>
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const name = slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  return {
    title: `${name} - Mua Online Giá Tốt | OFINA`,
    description: `${name} chính hãng tại OFINA. Giao hàng miễn phí HCM, bảo hành 2 năm, đa dạng mẫu mã. Xem ngay!`
  }
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params
  const { sort } = await searchParams

  const { products, total } = await getProductsByCategory(slug)
  if (!products.length) return notFound()

  const categoryName = slug.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ')

  return (
    <div className="container-custom py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-brand-900">Trang chủ</Link>
        <ChevronRight className="w-4 h-4" />
        <Link href="/san-pham" className="hover:text-brand-900">Sản phẩm</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-brand-900 font-semibold">{categoryName}</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-4xl md:text-5xl font-bold text-brand-950 mb-3">
          {categoryName}
        </h1>
        <p className="text-gray-600 text-lg">
          {total.toLocaleString('vi-VN')} sản phẩm · Giao hàng toàn quốc · Bảo hành chính hãng
        </p>
      </div>

      <div className="grid lg:grid-cols-[280px_1fr] gap-8">
        {/* Sidebar Filters */}
        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <div className="card p-6">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5" /> Bộ lọc
            </h3>

            {/* Giá */}
            <div className="mb-6 pb-6 border-b">
              <h4 className="font-semibold mb-3">Khoảng giá</h4>
              <div className="space-y-2 text-sm">
                {[
                  ['Dưới 1 triệu', 0, 1000000],
                  ['1 - 3 triệu', 1000000, 3000000],
                  ['3 - 5 triệu', 3000000, 5000000],
                  ['5 - 10 triệu', 5000000, 10000000],
                  ['Trên 10 triệu', 10000000, 999999999],
                ].map(([label]) => (
                  <label key={label as string} className="flex items-center gap-2 cursor-pointer hover:text-brand-900">
                    <input type="checkbox" className="rounded" />
                    <span>{label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Thương hiệu */}
            <div className="mb-6 pb-6 border-b">
              <h4 className="font-semibold mb-3">Thương hiệu</h4>
              <div className="space-y-2 text-sm">
                {['OFINA', 'Fami', 'Hòa Phát', 'Xuân Hòa', 'Navi'].map((brand) => (
                  <label key={brand} className="flex items-center gap-2 cursor-pointer hover:text-brand-900">
                    <input type="checkbox" className="rounded" />
                    <span>{brand}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Chất liệu */}
            <div>
              <h4 className="font-semibold mb-3">Chất liệu</h4>
              <div className="space-y-2 text-sm">
                {['Da PU', 'Da thật', 'Lưới', 'Gỗ MDF', 'Gỗ công nghiệp', 'Sắt/Thép'].map((m) => (
                  <label key={m} className="flex items-center gap-2 cursor-pointer hover:text-brand-900">
                    <input type="checkbox" className="rounded" />
                    <span>{m}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Products */}
        <div>
          {/* Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6 p-4 bg-white rounded-lg border">
            <span className="text-gray-600">Hiển thị <strong>{products.length}</strong> / {total} sản phẩm</span>
            <select defaultValue={sort} className="px-4 py-2 border rounded-lg focus:outline-none focus:border-brand-900">
              <option value="newest">Mới nhất</option>
              <option value="bestseller">Bán chạy</option>
              <option value="price-asc">Giá thấp → cao</option>
              <option value="price-desc">Giá cao → thấp</option>
              <option value="rating">Đánh giá cao</option>
            </select>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {products.map((p: any) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center gap-2 mt-12">
            <button className="px-4 py-2 border rounded-lg hover:bg-brand-50" disabled>← Trước</button>
            <button className="w-10 h-10 rounded-lg bg-brand-900 text-white font-semibold">1</button>
            <button className="w-10 h-10 rounded-lg hover:bg-brand-50 font-semibold">2</button>
            <button className="w-10 h-10 rounded-lg hover:bg-brand-50 font-semibold">3</button>
            <button className="px-4 py-2 border rounded-lg hover:bg-brand-50">Tiếp →</button>
          </div>
        </div>
      </div>
    </div>
  )
}
