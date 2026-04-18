import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronRight, Minus, Plus, ShoppingCart, Heart, Shield, Truck, RefreshCw, Phone, MessageCircle, Award } from 'lucide-react'
import { getProductBySlug } from '@/lib/queries'
import { formatPrice, calcDiscountPercent } from '@/lib/utils'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) return {}
  return {
    title: product.seo_title || `${product.name} | OFINA`,
    description: product.seo_description || product.short_description || '',
  }
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  const product: any = await getProductBySlug(slug)
  if (!product) return notFound()

  const price = product.price
  const compare = product.compare_price
  const discount = calcDiscountPercent(compare || price, price)
  const hasDiscount = compare && compare > price
  const mainImage = product.primary_image || product.images?.[0] || 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=800&q=80'

  return (
    <div className="container-custom py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6 flex-wrap">
        <Link href="/" className="hover:text-brand-900">Trang chủ</Link>
        <ChevronRight className="w-4 h-4" />
        <Link href="/san-pham" className="hover:text-brand-900">Sản phẩm</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-brand-900 font-semibold truncate">{product.name}</span>
      </nav>

      {/* Product main */}
      <div className="grid lg:grid-cols-[1fr_480px] gap-8 mb-12">
        {/* Gallery */}
        <div>
          <div className="aspect-square bg-gray-50 rounded-2xl overflow-hidden mb-4 relative">
            <Image src={mainImage} alt={product.name} fill className="object-contain" priority />
            {hasDiscount && (
              <span className="absolute top-4 left-4 bg-sale text-white px-3 py-1.5 rounded-full font-bold text-sm">
                -{discount}%
              </span>
            )}
          </div>
          {/* Thumbnails */}
          <div className="grid grid-cols-5 gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <button key={i} className="aspect-square bg-gray-50 rounded-lg overflow-hidden border-2 hover:border-brand-900 transition-colors relative">
                <Image src={mainImage} alt="" fill className="object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div>
          {product.ofina_sku && (
            <div className="text-sm text-gray-500 mb-2">
              Mã SP: <strong className="text-brand-900">{product.ofina_sku}</strong>
            </div>
          )}

          <h1 className="font-display text-3xl md:text-4xl font-bold text-brand-950 mb-3">
            {product.name}
          </h1>

          {/* Rating */}
          {product.avg_rating > 0 && (
            <div className="flex items-center gap-3 mb-4">
              <div className="flex text-accent-500">
                {[1,2,3,4,5].map((i) => (
                  <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                  </svg>
                ))}
              </div>
              <span className="font-semibold">{product.avg_rating.toFixed(1)}</span>
              <span className="text-gray-500">· {product.review_count} đánh giá</span>
              <span className="text-gray-300">|</span>
              <span className="text-green-600 font-semibold">Còn hàng</span>
            </div>
          )}

          {/* Price */}
          <div className="bg-brand-50 rounded-2xl p-5 mb-6">
            <div className="flex items-baseline gap-3 flex-wrap">
              <span className="text-4xl font-bold text-brand-900">{formatPrice(price)}</span>
              {hasDiscount && (
                <>
                  <span className="text-xl text-gray-400 line-through">{formatPrice(compare)}</span>
                  <span className="text-green-600 font-semibold">Tiết kiệm {formatPrice(compare - price)}</span>
                </>
              )}
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Trả góp chỉ <strong>{formatPrice(Math.ceil(price / 12))}</strong>/tháng (0% lãi suất)
            </p>
          </div>

          {/* Color selector (mock) */}
          <div className="mb-5">
            <div className="font-semibold mb-2">Màu sắc:</div>
            <div className="flex gap-2">
              {['#0F172A', '#78350F', '#FFFFFF', '#DC2626'].map((c, i) => (
                <button key={i} className="w-12 h-12 rounded-lg border-2 border-gray-200 hover:border-brand-900" style={{ backgroundColor: c }} />
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div className="mb-5">
            <div className="font-semibold mb-2">Số lượng:</div>
            <div className="inline-flex items-center gap-3 border-2 rounded-lg">
              <button className="p-3 hover:bg-gray-100"><Minus className="w-4 h-4" /></button>
              <span className="w-12 text-center font-semibold">1</span>
              <button className="p-3 hover:bg-gray-100"><Plus className="w-4 h-4" /></button>
            </div>
          </div>

          {/* CTA */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button className="btn-primary py-4 text-base">
              <ShoppingCart className="w-5 h-5 mr-2" /> Thêm vào giỏ
            </button>
            <button className="btn-accent py-4 text-base">
              Mua ngay →
            </button>
          </div>

          <button className="w-full flex items-center justify-center gap-2 py-3 border rounded-lg hover:bg-gray-50 mb-6">
            <Heart className="w-4 h-4" /> Thêm vào yêu thích
          </button>

          {/* Trust signals */}
          <div className="bg-white border rounded-xl p-4 space-y-3">
            {[
              { icon: Truck, title: 'Giao hàng 2–3 ngày', desc: 'Miễn phí nội thành HCM' },
              { icon: Shield, title: 'Bảo hành chính hãng 2 năm', desc: '1 đổi 1 nếu lỗi NSX' },
              { icon: RefreshCw, title: 'Đổi trả miễn phí 7 ngày', desc: 'Không lý do' },
              { icon: Award, title: 'Lắp đặt miễn phí', desc: 'Nội thành TP.HCM' },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-3">
                <item.icon className="w-5 h-5 text-brand-900 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-sm">{item.title}</div>
                  <div className="text-xs text-gray-600">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Contact */}
          <div className="mt-6 grid grid-cols-2 gap-3">
            <a href="tel:0909xxxxxx" className="flex items-center justify-center gap-2 p-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 font-semibold">
              <Phone className="w-4 h-4" /> Gọi hotline
            </a>
            <a href="#" className="flex items-center justify-center gap-2 p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 font-semibold">
              <MessageCircle className="w-4 h-4" /> Chat Zalo
            </a>
          </div>
        </div>
      </div>

      {/* Description & Specs Tabs */}
      <div className="bg-white rounded-2xl border p-8 mb-12">
        <div className="prose max-w-none">
          <h2 className="font-display text-3xl font-bold mb-6">Thông tin chi tiết</h2>
          <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
            {product.description || 'Đang cập nhật mô tả chi tiết...'}
          </div>
        </div>
      </div>

      {/* CTA Final */}
      <section className="bg-gradient-to-r from-brand-900 to-brand-800 text-white rounded-2xl p-8 md:p-12 text-center">
        <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">
          Cần tư vấn thêm về sản phẩm?
        </h2>
        <p className="text-lg text-gray-200 mb-6">
          Đội ngũ OFINA sẵn sàng hỗ trợ bạn 24/7
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <a href="tel:0909xxxxxx" className="btn-accent">📞 Gọi hotline</a>
          <a href="#" className="btn-ghost !border-white !text-white hover:!bg-white hover:!text-brand-900">
            💬 Chat tư vấn
          </a>
        </div>
      </section>
    </div>
  )
}
