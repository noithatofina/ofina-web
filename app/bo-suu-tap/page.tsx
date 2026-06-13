import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { COLLECTIONS } from '@/lib/collections'

export const revalidate = 86400
const SITE_URL = 'https://ofina.vn'

export const metadata: Metadata = {
  title: { absolute: 'Bộ sưu tập nội thất văn phòng theo nhu cầu | OFINA' },
  description:
    'Khám phá các bộ sưu tập nội thất văn phòng OFINA theo nhu cầu: ghế giám đốc cao cấp, ghế công thái học, bàn họp, trọn bộ phòng giám đốc, góc làm việc tại nhà...',
  alternates: { canonical: '/bo-suu-tap' },
}

export default function CollectionsIndexPage() {
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Bộ sưu tập', item: `${SITE_URL}/bo-suu-tap` },
    ],
  }

  return (
    <div className="container-custom py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-brand-900">Trang chủ</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-brand-900 font-semibold">Bộ sưu tập</span>
      </nav>

      <div className="mb-8">
        <h1 className="font-display text-4xl md:text-5xl font-bold text-brand-950 mb-3">
          Bộ sưu tập theo nhu cầu
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl">
          OFINA tuyển chọn các bộ sưu tập nội thất văn phòng theo nhu cầu thực tế — giúp bạn nhanh chóng
          tìm đúng sản phẩm cho phòng giám đốc, phòng họp, góc làm việc tại nhà và nhiều hơn nữa.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {COLLECTIONS.map((c) => (
          <Link
            key={c.slug}
            href={`/bo-suu-tap/${c.slug}`}
            className="group block p-6 rounded-2xl border border-gray-200 bg-white hover:border-brand-900 hover:shadow-lg transition-all"
          >
            <h2 className="font-display text-xl font-bold text-brand-950 mb-2 group-hover:text-brand-900">
              {c.name}
            </h2>
            <p className="text-sm text-gray-600 line-clamp-3">{c.metaDescription}</p>
            <span className="inline-flex items-center gap-1 mt-4 text-brand-900 font-semibold text-sm">
              Xem bộ sưu tập <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
