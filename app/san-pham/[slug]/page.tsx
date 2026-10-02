import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight, Shield, Truck, RefreshCw, Phone, MessageCircle, Award, BadgeCheck, Sparkles } from 'lucide-react'
import { getProductBySlug, getRelatedProducts, getCategoryById } from '@/lib/queries'
import { formatPrice, calcDiscountPercent, CONTACT } from '@/lib/utils'
import { findVariantGroup } from '@/lib/variant-groups'
import { ProductGallery } from '@/components/product/ProductGallery'
import { ProductActions } from '@/components/product/ProductActions'
import { ProductCard } from '@/components/product/ProductCard'
import { StickyMobileBar } from '@/components/product/StickyMobileBar'
import { VariantSwitcher } from '@/components/product/VariantSwitcher'
import {
  parseDescription,
  HighlightsList,
  SpecsTable,
  FaqAccordion,
} from '@/components/product/ProductDescription'

export const revalidate = 3600

/**
 * Prerender sẵn một phần trang sản phẩm để Next xếp route này vào nhóm
 * được đệm (ISR) thay vì render theo yêu cầu mỗi lượt. Không dựng sẵn cả
 * 2.664 trang vì build sẽ rất lâu — phần còn lại sinh ở lần truy cập đầu
 * rồi được đệm lại, nhờ dynamicParams mặc định bật.
 */
export async function generateStaticParams() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return []
  try {
    const { createPublicSupabase } = await import('@/lib/supabase-public')
    const { data } = await createPublicSupabase()
      .from('products')
      .select('slug')
      .eq('status', 'active')
      .gt('price', 0)
      .order('created_at', { ascending: false })
      .limit(100)
    return (data || []).map((p: { slug: string }) => ({ slug: p.slug }))
  } catch {
    return []
  }
}

interface Props {
  params: Promise<{ slug: string }>
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://ofina.vn'

/**
 * Trên ngưỡng này thì điều khoản bán lẻ không còn đúng: hàng đóng theo đơn,
 * lắp đặt tại chỗ, phải khảo sát mặt bằng trước khi giao. Đo ngày 02/10/2026:
 * 142 trong 2.664 sản phẩm đang bán nằm trên ngưỡng, gồm toàn bộ 11 cabin cách âm.
 */
const HIGH_VALUE_THRESHOLD = 20_000_000

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) return {}
  const title = product.seo_title || `${product.name} | OFINA`
  const description = product.seo_description || product.short_description || ''
  const url = `${SITE_URL}/san-pham/${product.slug}`
  const image = product.primary_image || product.images?.[0]
  return {
    title: { absolute: title }, // bypass layout template "%s | OFINA"
    description,
    keywords: product.seo_keywords,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      url,
      title,
      description,
      images: image ? [{ url: image, width: 800, height: 800, alt: product.name }] : [],
    },
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
  const images = (product.images || []).filter(Boolean) as string[]
  const mainImage = product.primary_image || images[0] || null

  const { meta, bodyHtml } = parseDescription(product.description || '')
  const highlights = meta.highlights || []
  const specs = meta.specs || {}
  const faq = meta.faq || []

  /** Hàng giá trị lớn dùng điều khoản khác: đóng theo đơn, lắp tại chỗ, cần khảo sát mặt bằng. */
  const isHighValue = price >= HIGH_VALUE_THRESHOLD

  const category = product.category_id ? await getCategoryById(product.category_id) : null
  const variantGroup = findVariantGroup(product.slug)
  const related = await getRelatedProducts({
    productId: product.id,
    categoryId: product.category_id,
    limit: 8,
  })

  // ============ JSON-LD SCHEMAS ============
  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    sku: product.ofina_sku,
    image: images.length ? images.slice(0, 8) : undefined,
    description: product.short_description || product.seo_description,
    brand: { '@type': 'Brand', name: product.brand || 'OFINA' },
    offers: !product.is_price_hidden && price ? {
      '@type': 'Offer',
      url: `${SITE_URL}/san-pham/${product.slug}`,
      priceCurrency: 'VND',
      price,
      availability: product.in_stock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
      seller: { '@type': 'Organization', name: 'OFINA' },
    } : undefined,
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Sản phẩm', item: `${SITE_URL}/san-pham` },
      ...(category
        ? [{ '@type': 'ListItem', position: 3, name: category.name, item: `${SITE_URL}/danh-muc/${category.slug}` }]
        : []),
      { '@type': 'ListItem', position: category ? 4 : 3, name: product.name, item: `${SITE_URL}/san-pham/${product.slug}` },
    ],
  }

  const faqSchema = faq.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faq.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      }
    : null

  // ============ RENDER ============
  return (
    <>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      <div className="container-custom py-6 lg:py-8 pb-24 lg:pb-12">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-gray-500 mb-6 flex-wrap">
          <Link href="/" className="hover:text-brand-900">Trang chủ</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/san-pham" className="hover:text-brand-900">Sản phẩm</Link>
          {category && (
            <>
              <ChevronRight className="w-3.5 h-3.5" />
              <Link href={`/danh-muc/${category.slug}`} className="hover:text-brand-900">{category.name}</Link>
            </>
          )}
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-brand-900 font-semibold truncate">{product.name}</span>
        </nav>

        {/* Product main */}
        <div className="grid lg:grid-cols-[minmax(0,1fr)_460px] gap-8 lg:gap-10 mb-12">
          {/* Gallery (sticky on desktop) */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <ProductGallery images={images.length ? images : (mainImage ? [mainImage] : [])} productName={product.name} />
          </div>

          {/* Info */}
          <div>
            {/* SKU + brand */}
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-3 flex-wrap">
              {product.ofina_sku && <span>Mã SP: <strong className="text-gray-900">{product.ofina_sku}</strong></span>}
              {product.brand && <><span>·</span><span>Thương hiệu: <strong className="text-gray-900">{product.brand}</strong></span></>}
              {category && <><span>·</span><Link href={`/danh-muc/${category.slug}`} className="hover:text-brand-900">{category.name}</Link></>}
            </div>

            <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 leading-snug">
              {product.name}
            </h1>

            {/* Short desc */}
            {product.short_description && (
              <p className="text-gray-600 mb-4 leading-relaxed">{product.short_description}</p>
            )}

            {/* Rating + stock — chỉ hiện sao khi CÓ đánh giá thật, tuyệt đối không gắn số bịa */}
            <div className="flex items-center gap-3 mb-5 text-sm">
              {(product.review_count ?? 0) > 0 && (
                <>
                  <div className="flex items-center gap-1 text-accent-500">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <svg
                        key={i}
                        className={`w-4 h-4 ${i <= Math.round(product.avg_rating ?? 0) ? 'fill-current' : 'fill-gray-200'}`}
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                      </svg>
                    ))}
                    <span className="ml-1 font-semibold text-gray-900">
                      {Number(product.avg_rating ?? 0).toFixed(1)}
                    </span>
                    <span className="ml-1 text-gray-500">({product.review_count} đánh giá)</span>
                  </div>
                  <span className="text-gray-300">|</span>
                </>
              )}
              {product.in_stock ? (
                <span className="text-green-700 font-semibold flex items-center gap-1">
                  <BadgeCheck className="w-4 h-4" /> Còn hàng
                </span>
              ) : (
                <span className="text-red-600 font-semibold">Hết hàng</span>
              )}
            </div>

            {/* Price */}
            <div className="bg-gray-50 rounded-2xl p-5 mb-6 border border-gray-200">
              {product.is_price_hidden || !price ? (
                <div className="text-2xl font-bold text-gray-900">Liên hệ báo giá</div>
              ) : (
                <>
                  <div className="flex items-baseline gap-3 flex-wrap">
                    <span className="text-4xl font-bold text-gray-900">{formatPrice(price)}</span>
                    {hasDiscount && (
                      <>
                        <span className="text-lg text-gray-400 line-through">{formatPrice(compare)}</span>
                        <span className="text-xs font-bold bg-red-500 text-white rounded px-2 py-0.5">-{discount}%</span>
                      </>
                    )}
                  </div>
                  {hasDiscount && (
                    <div className="text-sm text-green-700 font-semibold mt-1">Tiết kiệm {formatPrice(compare - price)}</div>
                  )}
                  {product.low_price && product.high_price && product.low_price !== product.high_price && (
                    <p className="text-sm text-gray-600 mt-2">
                      Có nhiều phiên bản: {formatPrice(product.low_price)} – {formatPrice(product.high_price)}
                    </p>
                  )}
                  <p className="text-sm text-gray-700 mt-3 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-gray-500" />
                    Trả góp chỉ <strong className="text-gray-900">{formatPrice(Math.ceil(price / 12))}</strong>/tháng (0% lãi suất)
                  </p>
                </>
              )}
            </div>

            {/* Variant switcher (nếu SP thuộc nhóm phiên bản) */}
            {variantGroup && (
              <VariantSwitcher options={variantGroup.options} currentSlug={product.slug} />
            )}

            {/* Highlights summary (top 3) */}
            {highlights.length > 0 && (
              <ul className="mb-6 space-y-2">
                {highlights.slice(0, 3).map((h, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="text-green-600 mt-0.5">✓</span>
                    <span className="text-gray-700">{h}</span>
                  </li>
                ))}
              </ul>
            )}

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
            <div className="grid grid-cols-2 gap-3 mb-6">
              {[
                { icon: Truck, title: 'Giao 2-3 ngày', desc: 'Miễn phí HN/HCM' },
                { icon: Shield, title: 'Bảo hành 24 tháng', desc: '1 đổi 1 nếu lỗi' },
                { icon: RefreshCw, title: 'Đổi trả 7 ngày', desc: 'Không cần lý do' },
                { icon: Award, title: 'Lắp đặt miễn phí', desc: 'Nội thành HN/HCM' },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg">
                  <item.icon className="w-5 h-5 text-brand-900 flex-shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <div className="font-semibold text-xs text-brand-950">{item.title}</div>
                    <div className="text-xs text-gray-600 truncate">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Contact CTAs */}
            <div className="grid grid-cols-2 gap-3">
              <a href={`tel:${CONTACT.hotline}`} className="flex items-center justify-center gap-2 p-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 font-semibold text-sm">
                <Phone className="w-4 h-4" /> Gọi {CONTACT.hotline}
              </a>
              <a href={CONTACT.zaloUrl} className="flex items-center justify-center gap-2 p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 font-semibold text-sm">
                <MessageCircle className="w-4 h-4" /> Chat Zalo
              </a>
            </div>
          </div>
        </div>

        {/* ============ Tabs / Sections ============ */}
        <nav className="sticky top-16 z-20 bg-white/95 backdrop-blur border-y mb-8 -mx-4 px-4 lg:mx-0 lg:px-0 lg:rounded-xl lg:border">
          <ul className="flex gap-6 lg:gap-8 px-2 overflow-x-auto whitespace-nowrap text-sm font-semibold text-gray-600">
            <li><a href="#mo-ta" className="inline-block py-4 hover:text-brand-900 border-b-2 border-transparent hover:border-brand-900">Mô tả chi tiết</a></li>
            <li><a href="#thong-so" className="inline-block py-4 hover:text-brand-900 border-b-2 border-transparent hover:border-brand-900">Thông số kỹ thuật</a></li>
            <li><a href="#bao-hanh" className="inline-block py-4 hover:text-brand-900 border-b-2 border-transparent hover:border-brand-900">Bảo hành & Vận chuyển</a></li>
            <li><a href="#cau-hoi" className="inline-block py-4 hover:text-brand-900 border-b-2 border-transparent hover:border-brand-900">Câu hỏi thường gặp</a></li>
            <li><a href="#san-pham-lien-quan" className="inline-block py-4 hover:text-brand-900 border-b-2 border-transparent hover:border-brand-900">Sản phẩm liên quan</a></li>
          </ul>
        </nav>

        {/* Highlights big */}
        {highlights.length > 0 && (
          <section className="bg-gradient-to-br from-brand-50 to-accent-50/30 rounded-2xl p-6 md:p-8 mb-10">
            <h2 className="text-xl md:text-2xl font-bold text-brand-950 mb-5">
              Điểm nổi bật
            </h2>
            <HighlightsList highlights={highlights} />
          </section>
        )}

        {/* Mô tả */}
        <section id="mo-ta" className="bg-white rounded-2xl border p-6 md:p-10 mb-10 scroll-mt-32">
          <h2 className="text-xl md:text-2xl font-bold mb-6 text-brand-950">Mô tả chi tiết</h2>
          {bodyHtml ? (
            <div className="max-w-none" dangerouslySetInnerHTML={{ __html: bodyHtml }} />
          ) : (
            <p className="text-gray-500">Đang cập nhật mô tả chi tiết...</p>
          )}
        </section>

        {/* Specs */}
        {Object.keys(specs).length > 0 && (
          <section id="thong-so" className="bg-white rounded-2xl border p-6 md:p-10 mb-10 scroll-mt-32">
            <h2 className="text-xl md:text-2xl font-bold mb-6 text-brand-950">Thông số kỹ thuật</h2>
            <SpecsTable specs={specs} />
          </section>
        )}

        {/* Bảo hành & Vận chuyển.
            Điều khoản bán lẻ (đổi trả 7 ngày, ship 100k-500k, giao 1-2 ngày) không áp
            được cho hàng giá trị lớn như cabin cách âm 89-231tr: hàng đóng theo đơn,
            lắp đặt tại chỗ, cần khảo sát mặt bằng. 142/2.664 sản phẩm thuộc nhóm này. */}
        <section id="bao-hanh" className="bg-white rounded-2xl border p-6 md:p-10 mb-10 scroll-mt-32">
          <h2 className="text-xl md:text-2xl font-bold mb-6 text-brand-950">Bảo hành & Vận chuyển</h2>
          <div className="grid md:grid-cols-2 gap-6 text-gray-700">
            <div>
              <h3 className="font-bold text-brand-900 mb-2 flex items-center gap-2"><Shield className="w-5 h-5" /> Chính sách bảo hành</h3>
              <ul className="space-y-1.5 text-sm list-disc list-outside ml-5">
                <li>Khung kim loại và phần gỗ: bảo hành <strong>24 tháng</strong></li>
                <li>Đệm mút, da, nỉ, cơ xoay, piston: bảo hành <strong>12 tháng</strong></li>
                <li>1 đổi 1 nếu lỗi do nhà sản xuất trong 30 ngày đầu</li>
                {isHighValue ? (
                  <li>Hạng mục lắp đặt tại chỗ: bảo trì tại nơi sử dụng, xem{' '}
                    <Link href="/chinh-sach/doi-tra" className="text-brand-900 underline">chính sách đổi trả</Link> để biết điều kiện áp dụng</li>
                ) : (
                  <>
                    <li>Sửa chữa miễn phí tại nhà (nội thành HN &amp; HCM)</li>
                    <li>Đổi trả trong 7 ngày theo{' '}
                      <Link href="/chinh-sach/doi-tra" className="text-brand-900 underline">chính sách đổi trả</Link></li>
                  </>
                )}
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-brand-900 mb-2 flex items-center gap-2"><Truck className="w-5 h-5" /> Vận chuyển & Lắp đặt</h3>
              {isHighValue ? (
                <ul className="space-y-1.5 text-sm list-disc list-outside ml-5">
                  <li><strong>Miễn phí</strong> vận chuyển và lắp đặt tận nơi</li>
                  <li>Khảo sát mặt bằng trước khi giao: lối vào, chiều cao trần và thang máy quyết định cấu kiện đưa vào được hay không</li>
                  <li>Thời gian giao thống nhất khi chốt đơn — hạng mục này không giao theo lịch bán lẻ</li>
                  <li>Xuất hoá đơn VAT đầy đủ, nhận{' '}
                    <Link href="/bao-gia-b2b" className="text-brand-900 underline">báo giá theo số lượng</Link> nếu mua nhiều</li>
                </ul>
              ) : (
                <ul className="space-y-1.5 text-sm list-disc list-outside ml-5">
                  <li><strong>Miễn phí</strong> giao hàng + lắp đặt nội thành HN/HCM (đơn từ 500k)</li>
                  <li>Ngoại thành: phí 50k–200k tuỳ khu vực</li>
                  <li>Toàn quốc: 100k–500k qua đơn vị vận chuyển</li>
                  <li>Thời gian giao: 1-2 ngày HN/HCM, 3-7 ngày tỉnh khác</li>
                </ul>
              )}
            </div>
          </div>
        </section>

        {/* FAQ */}
        {faq.length > 0 && (
          <section id="cau-hoi" className="mb-10 scroll-mt-32">
            <h2 className="text-xl md:text-2xl font-bold mb-6 text-brand-950">Câu hỏi thường gặp</h2>
            <FaqAccordion faq={faq} />
          </section>
        )}

        {/* Related products */}
        {related.length > 0 && (
          <section id="san-pham-lien-quan" className="mb-10 scroll-mt-32">
            <div className="flex items-end justify-between mb-6 flex-wrap gap-3">
              <h2 className="text-xl md:text-2xl font-bold text-brand-950">
                Sản phẩm liên quan
              </h2>
              {category && (
                <Link href={`/danh-muc/${category.slug}`} className="text-brand-900 font-semibold hover:underline text-sm">
                  Xem tất cả {category.name} →
                </Link>
              )}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {related.map((p: any) => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}

        {/* Final CTA */}
        <section className="bg-gradient-to-r from-brand-900 to-brand-800 text-white rounded-2xl p-8 md:p-12 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">
            Cần tư vấn thêm về {product.name}?
          </h2>
          <p className="text-lg text-gray-200 mb-6">
            Đội ngũ OFINA sẵn sàng hỗ trợ bạn — gọi hotline hoặc chat Zalo để nhận giá tốt nhất hôm nay.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <a href={`tel:${CONTACT.hotline}`} className="btn-accent">📞 Gọi {CONTACT.hotline}</a>
            <a href={CONTACT.zaloUrl} className="btn-ghost !border-white !text-white hover:!bg-white hover:!text-brand-900">
              💬 Chat Zalo
            </a>
          </div>
        </section>
      </div>

      <StickyMobileBar product={{
        id: product.id,
        slug: product.slug,
        name: product.name,
        ofina_sku: product.ofina_sku,
        price,
        compare_price: compare,
        is_price_hidden: product.is_price_hidden,
        primary_image: mainImage,
      }} />
    </>
  )
}
