import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { ProductCard } from '@/components/product/ProductCard'
import { getCollectionProducts } from '@/lib/queries'
import { COLLECTIONS, getCollection, MIN_PRODUCTS } from '@/lib/collections'

interface Props {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ sort?: string; page?: string }>
}

export const revalidate = 3600
const SITE_URL = 'https://ofina.vn'
const PER_PAGE = 24

export function generateStaticParams() {
  return COLLECTIONS.map((c) => ({ slug: c.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const col = getCollection(slug)
  if (!col) return { title: 'Bộ sưu tập | OFINA' }
  return {
    title: { absolute: col.title || `${col.name} | OFINA` },
    description: col.metaDescription,
    alternates: { canonical: `/bo-suu-tap/${slug}` },
    openGraph: {
      type: 'website',
      title: col.title || col.name,
      description: col.metaDescription,
      url: `${SITE_URL}/bo-suu-tap/${slug}`,
      images: [{ url: `${SITE_URL}/og-image.jpg`, width: 1200, height: 630, alt: col.name }],
    },
  }
}

export default async function CollectionPage({ params, searchParams }: Props) {
  const { slug } = await params
  const sp = await searchParams
  const col = getCollection(slug)
  if (!col) return notFound()

  const currentPage = Math.max(1, parseInt(sp.page || '1', 10))
  const sort = sp.sort || col.sort || 'newest'

  const { products, total } = await getCollectionProducts(col.filter, {
    limit: PER_PAGE,
    offset: (currentPage - 1) * PER_PAGE,
    sort,
  })

  // Tránh thin/doorway page: collection không đủ sản phẩm → 404
  if (total < MIN_PRODUCTS) return notFound()

  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE))
  const pageNumbers = getPageNumbers(currentPage, totalPages)

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Bộ sưu tập', item: `${SITE_URL}/bo-suu-tap` },
      { '@type': 'ListItem', position: 3, name: col.name, item: `${SITE_URL}/bo-suu-tap/${slug}` },
    ],
  }
  const collectionLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: col.name,
    description: col.metaDescription,
    url: `${SITE_URL}/bo-suu-tap/${slug}`,
    inLanguage: 'vi-VN',
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: total,
      itemListElement: products.slice(0, 12).map((p: any, i: number) => ({
        '@type': 'ListItem',
        position: (currentPage - 1) * PER_PAGE + i + 1,
        url: `${SITE_URL}/san-pham/${p.slug}`,
        name: p.name,
      })),
    },
  }
  const faqLd = col.faqs.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: col.faqs.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      }
    : null

  return (
    <div className="container-custom py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionLd) }} />
      {faqLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />}

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-brand-900">Trang chủ</Link>
        <ChevronRight className="w-4 h-4" />
        <Link href="/bo-suu-tap" className="hover:text-brand-900">Bộ sưu tập</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-brand-900 font-semibold">{col.name}</span>
      </nav>

      {/* Header + Intro */}
      <div className="mb-8">
        <h1 className="font-display text-4xl md:text-5xl font-bold text-brand-950 mb-3">{col.name}</h1>
        <p className="text-gray-600 text-lg mb-4">
          <strong>{total.toLocaleString('vi-VN')}</strong> sản phẩm · Chính hãng · Bảo hành 24 tháng · Giao lắp tận nơi
        </p>
        <div
          className="prose prose-sm max-w-none text-gray-700 [&_p]:mb-3 [&_strong]:text-brand-900"
          dangerouslySetInnerHTML={{ __html: col.intro }}
        />
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 p-4 bg-white rounded-lg border">
        <span className="text-gray-600">
          Hiển thị <strong>{(currentPage - 1) * PER_PAGE + 1}–{Math.min(currentPage * PER_PAGE, total)}</strong> / <strong>{total}</strong> sản phẩm
        </span>
        <form action={`/bo-suu-tap/${slug}`} className="flex items-center gap-2">
          <select name="sort" defaultValue={sort} className="px-4 py-2 border rounded-lg focus:outline-none focus:border-brand-900">
            <option value="newest">Mới nhất</option>
            <option value="price-asc">Giá thấp → cao</option>
            <option value="price-desc">Giá cao → thấp</option>
            <option value="name">Tên A–Z</option>
          </select>
          <button className="btn-primary py-2 px-4 text-sm">Sắp xếp</button>
        </form>
      </div>

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
            href={`/bo-suu-tap/${slug}${buildQuery({ page: currentPage - 1, sort })}`}
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
                href={`/bo-suu-tap/${slug}${buildQuery({ page: p, sort })}`}
                className={`w-10 h-10 rounded-lg font-semibold flex items-center justify-center ${
                  p === currentPage ? 'bg-brand-900 text-white' : 'hover:bg-brand-50'
                }`}
              >
                {p}
              </Link>
            )
          )}
          <Link
            href={`/bo-suu-tap/${slug}${buildQuery({ page: currentPage + 1, sort })}`}
            className={`px-4 py-2 border rounded-lg ${currentPage === totalPages ? 'pointer-events-none opacity-40' : 'hover:bg-brand-50'}`}
            aria-disabled={currentPage === totalPages}
          >
            Tiếp →
          </Link>
        </div>
      )}

      {/* FAQ */}
      {col.faqs.length > 0 && (
        <section className="mt-16 max-w-3xl">
          <h2 className="font-display text-2xl font-bold text-brand-950 mb-6">Câu hỏi thường gặp</h2>
          <div className="space-y-4">
            {col.faqs.map((f, i) => (
              <details key={i} className="group border rounded-xl p-4 bg-white">
                <summary className="font-semibold text-brand-900 cursor-pointer list-none flex items-center justify-between">
                  {f.q}
                  <ChevronRight className="w-5 h-5 transition-transform group-open:rotate-90" />
                </summary>
                <p className="mt-3 text-gray-700 leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      )}

      {/* Internal links — các bộ sưu tập khác */}
      <section className="mt-16 pt-8 border-t border-gray-200">
        <h2 className="font-semibold text-lg text-brand-950 mb-4">Khám phá thêm bộ sưu tập</h2>
        <div className="flex flex-wrap gap-2">
          {COLLECTIONS.filter((c) => c.slug !== slug).map((c) => (
            <Link
              key={c.slug}
              href={`/bo-suu-tap/${c.slug}`}
              className="text-sm bg-brand-50 text-brand-900 px-3 py-1.5 rounded-full hover:bg-brand-100 transition-colors"
            >
              {c.name}
            </Link>
          ))}
        </div>
      </section>
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
