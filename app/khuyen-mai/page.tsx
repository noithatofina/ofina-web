import Link from 'next/link'
import { ProductCard } from '@/components/product/ProductCard'
import { createClient } from '@supabase/supabase-js'
import { getSetting } from '@/lib/site-settings'

export const metadata = {
  title: 'Khuyến mãi - Giảm đến 20% | OFINA',
  description: 'Các sản phẩm nội thất văn phòng đang khuyến mãi tại OFINA. Giảm giá đến 20%, miễn phí giao hàng.',
}

export const revalidate = 300

async function getSaleProducts() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  // SP đang có giảm giá (compare_price > price)
  const { data, count } = await supabase
    .from('products')
    .select(`
      *,
      product_images(url, position, is_primary)
    `, { count: 'exact' })
    .eq('status', 'active')
    .gt('price', 0)
    .not('compare_price', 'is', null)
    .order('price', { ascending: false })
    .limit(48)

  const products = (data || [])
    .filter((p: any) => p.compare_price && p.compare_price > p.price)
    .map((p: any) => {
      const imgs = (p.product_images || []).sort((a: any, b: any) => a.position - b.position)
      return {
        ...p,
        images: imgs.map((i: any) => i.url),
        primary_image: imgs.find((i: any) => i.is_primary)?.url || imgs[0]?.url || null,
      }
    })

  return { products, total: count || 0 }
}

export default async function SalePage() {
  const [{ products }, cms] = await Promise.all([
    getSaleProducts(),
    getSetting<{ title: string; banner_image: string; content: string }>('page.khuyen_mai', {
      title: '',
      banner_image: '',
      content: '',
    }),
  ])

  return (
    <div>
      <section className="relative overflow-hidden">
        {cms.banner_image ? (
          <div
            className="bg-cover bg-center text-white py-20"
            style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.5),rgba(0,0,0,0.5)), url(${cms.banner_image})` }}
          >
            <div className="container-custom text-center relative z-10">
              <h1 className="font-display text-5xl md:text-6xl font-bold mb-4">
                {cms.title || 'Khuyến mãi sốc — Giảm đến 20%'}
              </h1>
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-r from-red-600 via-red-500 to-orange-500 text-white py-16">
            <div className="absolute inset-0 opacity-20 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(255,255,255,0.1)_10px,rgba(255,255,255,0.1)_20px)]" />
            <div className="container-custom text-center relative z-10">
              <div className="inline-block px-4 py-1 bg-white/20 rounded-full text-sm font-bold uppercase tracking-wider mb-4">
                🔥 MEGA SALE
              </div>
              <h1 className="font-display text-5xl md:text-6xl font-bold mb-4">
                {cms.title || 'Khuyến mãi sốc — Giảm đến 20%'}
              </h1>
              <p className="text-xl opacity-95 max-w-2xl mx-auto">
                Hàng trăm sản phẩm nội thất văn phòng đang được giảm giá — số lượng có hạn!
              </p>
            </div>
          </div>
        )}
      </section>

      {cms.content && (
        <section className="container-custom py-10">
          <div
            className="blog-content max-w-4xl mx-auto"
            dangerouslySetInnerHTML={{ __html: cms.content }}
          />
        </section>
      )}

      <div className="container-custom py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-bold text-2xl">Sản phẩm đang khuyến mãi ({products.length})</h2>
          <Link href="/san-pham" className="text-brand-900 hover:underline font-semibold">
            Xem tất cả sản phẩm →
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            Chưa có sản phẩm khuyến mãi. Mời bạn xem <Link href="/san-pham" className="text-brand-900 underline">tất cả sản phẩm</Link>.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((p: any) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
