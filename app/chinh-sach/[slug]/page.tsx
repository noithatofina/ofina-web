import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase-admin'

export const revalidate = 300

const POLICY_SLUGS = ['doi-tra', 'bao-hanh', 'van-chuyen', 'thanh-toan', 'bao-mat', 'dieu-khoan'] as const

async function getPolicy(slug: string) {
  if (!POLICY_SLUGS.includes(slug as any)) return null
  const admin = createAdminClient()
  const { data } = await admin
    .from('site_settings')
    .select('value')
    .eq('key', `policy.${slug}`)
    .maybeSingle()
  return (data?.value as { title: string; content: string }) || null
}

export function generateStaticParams() {
  return POLICY_SLUGS.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const p = await getPolicy(slug)
  if (!p) return {}
  return { title: `${p.title} | OFINA`, description: p.title }
}

export default async function PolicyPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const policy = await getPolicy(slug)
  if (!policy) return notFound()

  return (
    <div className="container-custom py-12 max-w-4xl">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-brand-900">
          Trang chủ
        </Link>
        <span className="mx-2">/</span>
        <span className="text-brand-900 font-semibold">{policy.title}</span>
      </nav>

      <h1 className="font-display text-4xl md:text-5xl font-bold text-brand-950 mb-8">
        {policy.title}
      </h1>

      <article
        className="blog-content max-w-none text-gray-700"
        dangerouslySetInnerHTML={{ __html: policy.content || '' }}
      />

      <div className="mt-12 p-6 bg-brand-50 rounded-xl">
        <h3 className="font-bold text-lg mb-3">Cần hỗ trợ thêm?</h3>
        <p className="text-gray-700 mb-4">Liên hệ OFINA qua các kênh sau để được tư vấn nhanh nhất:</p>
        <div className="flex gap-3 flex-wrap">
          <Link href="/" className="btn-primary">Về trang chủ</Link>
          <Link href="/san-pham" className="btn-ghost">Xem sản phẩm</Link>
        </div>
      </div>
    </div>
  )
}
