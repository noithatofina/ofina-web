import Link from 'next/link'
import { ProductCard } from '@/components/product/ProductCard'
import { getNewProducts } from '@/lib/queries'
import { Sparkles, TrendingUp, ArrowRight } from 'lucide-react'

export const metadata = {
  title: 'Sản phẩm mới 2026 | OFINA - Nội Thất Văn Phòng',
  description: 'Bộ sưu tập nội thất văn phòng mới nhất 2026 tại OFINA. Thiết kế hiện đại, xu hướng toàn cầu, giá tốt nhất thị trường.',
  keywords: ['sản phẩm mới 2026', 'nội thất mới', 'ghế văn phòng 2026', 'xu hướng nội thất'],
}

export const revalidate = 600

const PER_PAGE = 24

export default async function NewProductsPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const sp = await searchParams
  const page = Math.max(1, parseInt(sp.page || '1', 10))

  const { products, total } = await getNewProducts({
    limit: PER_PAGE,
    offset: (page - 1) * PER_PAGE,
  })

  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE))

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-brand-900 via-brand-800 to-brand-950 text-white py-20 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-accent-500/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-400/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

        <div className="container-custom text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-accent-500/20 text-accent-400 rounded-full text-sm font-bold uppercase tracking-wider mb-4 border border-accent-500/30">
            <Sparkles className="w-4 h-4" /> New Collection
          </div>
          <h1 className="font-display text-5xl md:text-7xl font-bold mb-4">
            Sản Phẩm Mới <span className="text-accent-400">2026</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto mb-8">
            Bộ sưu tập nội thất văn phòng mới nhất — thiết kế hiện đại, xu hướng quốc tế, cập nhật liên tục mỗi tuần
          </p>
          <div className="flex items-center justify-center gap-6 text-sm md:text-base">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-accent-400" />
              <span><strong>{total.toLocaleString('vi-VN')}</strong> sản phẩm mới</span>
            </div>
            <div className="w-px h-5 bg-white/30" />
            <div>
              <span className="text-accent-400 font-bold">Mới nhất:</span> Cập nhật tuần này
            </div>
          </div>
        </div>
      </section>

      {/* Filter bar */}
      <div className="bg-white border-b sticky top-16 z-30 shadow-sm">
        <div className="container-custom py-4 flex items-center justify-between flex-wrap gap-3">
          <div className="text-gray-600">
            Hiển thị <strong>{(page - 1) * PER_PAGE + 1}-{Math.min(page * PER_PAGE, total)}</strong> / <strong>{total}</strong> sản phẩm
          </div>
          <div className="flex gap-2 flex-wrap">
            {[
              { label: 'Tất cả mới', href: '/san-pham-moi-2026' },
              { label: 'Ghế mới', href: '/san-pham-moi-2026?type=ghe' },
              { label: 'Bàn mới', href: '/san-pham-moi-2026?type=ban' },
              { label: 'Sofa mới', href: '/san-pham-moi-2026?type=sofa' },
            ].map(t => (
              <Link
                key={t.label}
                href={t.href}
                className="px-4 py-1.5 border rounded-full text-sm hover:bg-brand-900 hover:text-white hover:border-brand-900 transition-colors"
              >
                {t.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="container-custom py-12">
        {products.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <Sparkles className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <p>Chưa có sản phẩm mới. Quay lại sau nhé!</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {products.map((p: any) => (
                <div key={p.id} className="relative">
                  {/* NEW 2026 badge */}
                  <div className="absolute -top-2 -right-2 z-10">
                    <div className="bg-gradient-to-br from-accent-500 to-accent-600 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg animate-pulse">
                      NEW
                    </div>
                  </div>
                  <ProductCard product={p} />
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-12 flex-wrap">
                {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => i + 1).map((p) => (
                  <Link
                    key={p}
                    href={`/san-pham-moi-2026?page=${p}`}
                    className={`w-10 h-10 rounded-lg font-semibold flex items-center justify-center ${
                      p === page ? 'bg-brand-900 text-white' : 'hover:bg-brand-50'
                    }`}
                  >
                    {p}
                  </Link>
                ))}
                {totalPages > 10 && <span className="mx-2">...</span>}
              </div>
            )}
          </>
        )}
      </div>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-brand-50 to-accent-50 py-16 border-t">
        <div className="container-custom text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-brand-950 mb-4">
            Muốn xem thêm?
          </h2>
          <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
            Khám phá hơn 2,400 sản phẩm nội thất văn phòng chất lượng cao tại OFINA
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link href="/san-pham" className="btn-primary">
              Tất cả sản phẩm <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
            <Link href="/khuyen-mai" className="btn-accent">
              🔥 Xem khuyến mãi
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
