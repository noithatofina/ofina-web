import type { MetadataRoute } from 'next'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://ofina-web-9c7z.vercel.app'

export const revalidate = 3600

const STATIC_PAGES: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] }[] = [
  { path: '/', priority: 1.0, changeFrequency: 'daily' },
  { path: '/san-pham', priority: 0.9, changeFrequency: 'daily' },
  { path: '/san-pham-moi-2026', priority: 0.9, changeFrequency: 'weekly' },
  { path: '/khuyen-mai', priority: 0.9, changeFrequency: 'daily' },
  { path: '/showroom', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/gioi-thieu', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/blog', priority: 0.6, changeFrequency: 'weekly' },
  { path: '/tu-van', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/bao-gia-b2b', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/chinh-sach/doi-tra', priority: 0.4, changeFrequency: 'yearly' },
  { path: '/chinh-sach/bao-hanh', priority: 0.4, changeFrequency: 'yearly' },
  { path: '/chinh-sach/van-chuyen', priority: 0.4, changeFrequency: 'yearly' },
  { path: '/chinh-sach/thanh-toan', priority: 0.4, changeFrequency: 'yearly' },
  { path: '/chinh-sach/bao-mat', priority: 0.4, changeFrequency: 'yearly' },
  { path: '/chinh-sach/dieu-khoan', priority: 0.4, changeFrequency: 'yearly' },
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  const staticEntries: MetadataRoute.Sitemap = STATIC_PAGES.map((p) => ({
    url: `${SITE_URL}${p.path}`,
    lastModified: now,
    changeFrequency: p.changeFrequency,
    priority: p.priority,
  }))

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return staticEntries
  }

  const { createServerSupabase } = await import('@/lib/supabase')
  const supabase = await createServerSupabase()

  const PAGE_SIZE = 1000
  async function fetchAll(table: 'categories' | 'products') {
    const all: Array<{ slug: string; updated_at: string | null }> = []
    let offset = 0
    while (true) {
      let q = supabase.from(table).select('slug, updated_at').range(offset, offset + PAGE_SIZE - 1)
      if (table === 'products') q = q.eq('status', 'active')
      const { data, error } = await q
      if (error || !data) break
      all.push(...data)
      if (data.length < PAGE_SIZE) break
      offset += PAGE_SIZE
    }
    return all
  }

  const [cats, prods] = await Promise.all([fetchAll('categories'), fetchAll('products')])

  const categoryEntries: MetadataRoute.Sitemap = cats.map((c) => ({
    url: `${SITE_URL}/danh-muc/${c.slug}`,
    lastModified: c.updated_at ? new Date(c.updated_at) : now,
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  const productEntries: MetadataRoute.Sitemap = prods.map((p) => ({
    url: `${SITE_URL}/san-pham/${p.slug}`,
    lastModified: p.updated_at ? new Date(p.updated_at) : now,
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  return [...staticEntries, ...categoryEntries, ...productEntries]
}
