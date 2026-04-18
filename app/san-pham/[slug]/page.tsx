import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight, Shield, Truck, RefreshCw, Phone, MessageCircle, Award } from 'lucide-react'
import { getProductBySlug } from '@/lib/queries'
import { formatPrice, calcDiscountPercent, CONTACT } from '@/lib/utils'
import { ProductGallery } from '@/components/product/ProductGallery'
import { ProductActions } from '@/components/product/ProductActions'

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

function parseDescription(markdown: string) {
  if (!markdown) return ''
  // Simple markdown-to-HTML for our description format
  let html = markdown
  // Headings
  html = html.replace(/^### (.+)$/gm, '<h3 class="font-bold text-xl mt-8 mb-3 text-brand-900">$1</h3>')
  html = html.replace(/^## (.+)$/gm, '<h2 class="font-display font-bold text-2xl mt-10 mb-4 text-brand-900">$1</h2>')
  // Bold
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  // Horizontal rules
  html = html.replace(/^---$/gm, '<hr class="my-8 border-t border-gray-200" />')
  // Lists
  html = html.replace(/^- (.+)$/gm, '<li class="mb-1">$1</li>')
  // Wrap consecutive <li> in <ul>
  html = html.replace(/(<li class="mb-1">.+<\/li>\n?)+/g, (match) => `<ul class="list-disc list-inside space-y-1 my-4 ml-2">${match}</ul>`)
  // Paragraphs
  html = html.split('\n\n').map(p => {
    p = p.trim()
    if (!p) return ''
    if (p.startsWith('<h') || p.startsWith('<ul') || p.startsWith('<hr')) return p
    return `<p class="mb-4 leading-relaxed">${p.replace(/\n/g, '<br/>')}</p>`
  }).join('\n')
  return html
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  const product: any = await getProductBySlug(slug)
  if (!product) return notFound()

  const price = product.price
  const compare = product.compare_price
  const discount = calcDiscountPercent(compare || price, price)
  const hasDiscount = compare && compare > price
  const images = (product.images || []).filter(Boolean) as string[]
  const mainImage = product.primary_image || images[0] || null

  const descriptionHtml = parseDescription(product.description || '')

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
          <ProductGallery images={images.length ? images : (mainImage ? [mainImage] : [])} productName={product.name} />
        </div>

        {/* Info */}
        <div>
          {product.ofina_sku && (
            <div className="text-sm text-gray-500 mb-2">
              Mã SP: <strong className="text-brand-900">{product.ofina_sku}</strong>
              {product.brand && <span> · Thương hiệu: <strong>{product.brand}</strong></span>}
            </div>
          )}

          <h1 className="font-display text-3xl md:text-4xl font-bold text-brand-950 mb-3">
            {product.name}
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex text-accent-500">
              {[1,2,3,4,5].map((i) => (
                <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                </svg>
              ))}
            </div>
            <span className="font-semibold">5.0</span>
            <span className="text-gray-500">· 0 đánh giá</span>
            <span className="text-gray-300">|</span>
            {product.in_stock ? (
              <span className="text-green-600 font-semibold">Còn hàng</span>
            ) : (
              <span className="text-red-600 font-semibold">Hết hàng</span>
            )}
          </div>

          {/* Price */}
          <div className="bg-brand-50 rounded-2xl p-5 mb-6">
            {product.is_price_hidden || !price ? (
              <div className="text-2xl font-bold text-brand-900">Liên hệ báo giá</div>
            ) : (
              <>
                <div className="flex items-baseline gap-3 flex-wrap">
                  <span className="text-4xl font-bold text-brand-900">{formatPrice(price)}</span>
                  {hasDiscount && (
                    <>
                      <span className="text-xl text-gray-400 line-through">{formatPrice(compare)}</span>
                      <span className="text-green-600 font-semibold">Tiết kiệm {formatPrice(compare - price)}</span>
                    </>
                  )}
                </div>
                {product.low_price && product.high_price && product.low_price !== product.high_price && (
                  <p className="text-sm text-gray-600 mt-2">
                    Có nhiều phiên bản: {formatPrice(product.low_price)} – {formatPrice(product.high_price)}
                  </p>
                )}
                <p className="text-sm text-gray-600 mt-2">
                  Trả góp chỉ <strong>{formatPrice(Math.ceil(price / 12))}</strong>/tháng (0% lãi suất)
                </p>
              </>
            )}
          </div>

          <ProductActions product={{
            id: product.id,
            slug: product.slug,
            name: product.name,
            ofina_sku: product.ofina_sku,
            price,
            compare_price: compare,
            is_price_hidden: product.is_price_hidden,
            primary_image: mainImage,
          }} />

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
            <a href={`tel:${CONTACT.hotline}`} className="flex items-center justify-center gap-2 p-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 font-semibold">
              <Phone className="w-4 h-4" /> Gọi hotline
            </a>
            <a href={CONTACT.zaloUrl} className="flex items-center justify-center gap-2 p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 font-semibold">
              <MessageCircle className="w-4 h-4" /> Chat Zalo
            </a>
          </div>
        </div>
      </div>

      {/* Description + Specs (Full width) */}
      <div className="bg-white rounded-2xl border p-6 md:p-10 mb-12">
        <div className="max-w-none">
          <h2 className="font-display text-3xl font-bold mb-6 text-brand-950">Thông tin chi tiết sản phẩm</h2>
          {descriptionHtml ? (
            <div
              className="prose max-w-none text-gray-700"
              dangerouslySetInnerHTML={{ __html: descriptionHtml }}
            />
          ) : (
            <div className="text-gray-500">Đang cập nhật mô tả chi tiết...</div>
          )}
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
          <a href={`tel:${CONTACT.hotline}`} className="btn-accent">📞 Gọi hotline</a>
          <a href={CONTACT.zaloUrl} className="btn-ghost !border-white !text-white hover:!bg-white hover:!text-brand-900">
            💬 Chat tư vấn
          </a>
        </div>
      </section>
    </div>
  )
}
