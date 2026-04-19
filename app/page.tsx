import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Shield, Truck, RefreshCw, Sparkles, MessageSquare, BadgeCheck, Headphones, MapPin, CreditCard, Star } from 'lucide-react'
import { ProductCard } from '@/components/product/ProductCard'
import { getHomepageData, getNewProductsByCategory } from '@/lib/queries'
import { NAV_MENU } from '@/lib/nav-menu'
import { CONTACT, formatPrice } from '@/lib/utils'
import { CategoryStickyNav } from '@/components/home/CategoryStickyNav'
import { ProductTabs } from '@/components/home/ProductTabs'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://ofina-web-9c7z.vercel.app'

export const revalidate = 3600

export const metadata: Metadata = {
  title: { absolute: 'OFINA — Nội Thất Văn Phòng Cao Cấp Chính Hãng' },
  description: 'OFINA — 2,400+ sản phẩm nội thất văn phòng chính hãng: ghế ergonomic, bàn làm việc, tủ hồ sơ, sofa. Bảo hành 24 tháng, miễn phí giao HN/HCM, trả góp 0%.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'OFINA — Nội Thất Văn Phòng Cao Cấp Chính Hãng',
    description: '2,400+ sản phẩm nội thất văn phòng — bảo hành 24 tháng, miễn phí giao HN/HCM.',
    url: SITE_URL,
    images: [{ url: `${SITE_URL}/logo.png`, width: 800, height: 800, alt: 'OFINA logo' }],
  },
}

const HOMEPAGE_FAQ = [
  {
    q: 'OFINA có phải đơn vị phân phối chính hãng không?',
    a: 'Đúng. OFINA cam kết 100% sản phẩm chính hãng, có tem chống giả và đầy đủ giấy tờ chứng nhận xuất xứ. Hoàn tiền gấp đôi nếu phát hiện hàng giả.',
  },
  {
    q: 'OFINA có showroom trải nghiệm trực tiếp không?',
    a: 'Có. OFINA có 2 showroom: Trụ sở Hà Nội — 135 đường K2, Phường Phú Đô; Chi nhánh TP.HCM — Tầng 2, số 36 Lương Định Của, Quận 2. Mở cửa 8h-18h hàng ngày.',
  },
  {
    q: 'Chính sách giao hàng và lắp đặt thế nào?',
    a: 'Miễn phí giao hàng + lắp đặt nội thành Hà Nội & TP.HCM (đơn từ 500.000đ). Các tỉnh khác phí ship 50k-500k tùy khu vực, thời gian giao 1-7 ngày.',
  },
  {
    q: 'Có hỗ trợ trả góp 0% không?',
    a: 'Có. OFINA hỗ trợ trả góp 0% qua thẻ tín dụng các ngân hàng (Sacombank, VPBank, Techcombank...) với kỳ hạn 3-12 tháng cho đơn hàng từ 3 triệu đồng.',
  },
  {
    q: 'Khách doanh nghiệp/B2B có được ưu đãi gì?',
    a: 'Khách B2B nhận được: chiết khấu sỉ theo số lượng, hóa đơn VAT đầy đủ, miễn phí khảo sát + thiết kế bố trí văn phòng, lắp đặt toàn quốc, hỗ trợ thanh toán linh hoạt.',
  },
]

const WHY_CHOOSE = [
  { icon: BadgeCheck, title: 'Chính hãng 100%', desc: 'Tem chống giả + giấy tờ xuất xứ. Hoàn tiền gấp đôi nếu hàng giả.' },
  { icon: Shield, title: 'Bảo hành 24 tháng', desc: '1 đổi 1 nếu lỗi NSX. Sửa chữa miễn phí tại nhà HN/HCM.' },
  { icon: Truck, title: 'Giao + lắp miễn phí', desc: '1-2 ngày HN/HCM. Đội kỹ thuật chuyên nghiệp.' },
  { icon: CreditCard, title: 'Trả góp 0% lãi', desc: 'Qua thẻ tín dụng các ngân hàng lớn — kỳ hạn 3-12 tháng.' },
  { icon: RefreshCw, title: 'Đổi trả 7 ngày', desc: 'Không cần lý do. Hoàn tiền 100% nếu còn nguyên vẹn.' },
  { icon: Headphones, title: 'Tư vấn 24/7', desc: 'Đội am hiểu nội thất văn phòng — gọi/chat bất cứ lúc nào.' },
]

const STATS = [
  { value: '2,400+', label: 'Sản phẩm chính hãng' },
  { value: '95', label: 'Danh mục đa dạng' },
  { value: '24', label: 'Tháng bảo hành' },
  { value: '2', label: 'Showroom HN & HCM' },
]

const COLLECTIONS = [
  {
    slug: 'ban-lam-viec-chan-sat',
    title: 'Setup văn phòng nhỏ',
    subtitle: 'Bàn ghế làm việc cho team < 10 người',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
    gradient: 'from-gray-900/80 via-gray-900/30 to-transparent',
  },
  {
    slug: 'ghe-da-giam-doc',
    title: 'Phòng giám đốc cao cấp',
    subtitle: 'Ghế da, bàn làm việc, tủ hồ sơ sang trọng',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80',
    gradient: 'from-gray-900/80 via-gray-900/30 to-transparent',
  },
  {
    slug: 'ghe-cafe',
    title: 'Cafe & nhà hàng',
    subtitle: 'Bàn ghế cafe, ghế bar, sofa quầy lễ tân',
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80',
    gradient: 'from-gray-900/80 via-gray-900/30 to-transparent',
  },
]

export default async function HomePage() {
  const { newest, categories } = await getHomepageData()

  const [ergonomicChairs, executiveDesks, executiveChairs, featured2026] = await Promise.all([
    getNewProductsByCategory(['ghe-cong-thai-hoc'], 8),
    getNewProductsByCategory(['ban-lanh-dao', 'ban-giam-doc-chan-sat', 'ban-giam-doc'], 8),
    getNewProductsByCategory(['ghe-da-giam-doc', 'ghe-lanh-dao'], 8),
    getNewProductsByCategory(
      ['ghe-xoay-van-phong', 'ghe-da-giam-doc', 'ghe-cong-thai-hoc', 'ghe-xoay-luoi', 'ban-nang-ha-thong-minh', 'ban-lanh-dao'],
      1
    ),
  ])

  const featuredHeroProduct = featured2026[0] || (newest || [])[0]

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: HOMEPAGE_FAQ.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* ============ HERO 2026 — Editorial Bento + Depth ============ */}
      <section className="relative overflow-hidden">
        {/* Layer 1: Background 3D meeting room photo */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=85')" }}
          role="presentation"
          aria-hidden="true"
        />

        {/* Layer 2: Blue gradient overlay (lighter — let photo show through clearly) */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100/65 via-blue-50/55 to-white/50" aria-hidden="true" />

        {/* Layer 3: Aurora blue blobs (subtle so không che ảnh) */}
        <div className="absolute -top-32 -right-32 w-[800px] h-[800px] bg-blue-400/25 rounded-full blur-3xl" aria-hidden="true" />
        <div className="absolute top-1/3 -left-48 w-[700px] h-[700px] bg-blue-300/20 rounded-full blur-3xl" aria-hidden="true" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-200/20 rounded-full blur-3xl" aria-hidden="true" />

        <div className="container-custom relative z-10 py-12 md:py-16 lg:py-20">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">

            {/* LEFT: Editorial copy (col 1-7) */}
            <div className="lg:col-span-7">
              {/* Live pulse tagline */}
              <div className="flex items-center gap-3 mb-6 flex-wrap">
                <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-900 text-white rounded-full text-xs font-bold uppercase tracking-wider">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400"></span>
                  </span>
                  Khai trương 2026
                </span>
                <span className="text-sm text-gray-600">Giảm đến <strong className="text-gray-900">20%</strong> cho đơn đầu tiên</span>
              </div>

              {/* Editorial display heading */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight text-gray-900 mb-6">
                Nội Thất<br/>
                Văn Phòng<br/>
                Cao Cấp.
              </h1>

              <p className="text-base md:text-lg text-gray-600 max-w-xl mb-8 leading-relaxed">
                2,400+ sản phẩm tuyển chọn từ thương hiệu uy tín. Bảo hành 24 tháng · Miễn phí giao Hà Nội & HCM · Trả góp 0%.
              </p>

              {/* CTA pill with floating arrow circle */}
              <div className="flex flex-wrap items-center gap-4 mb-10">
                <Link
                  href="/san-pham-moi-2026"
                  className="group inline-flex items-center gap-3 pl-7 pr-3 py-3 bg-gray-900 text-white font-bold rounded-full hover:bg-gray-800 transition-all shadow-2xl shadow-gray-900/20"
                >
                  Khám phá sản phẩm
                  <span className="w-9 h-9 bg-white text-gray-900 rounded-full flex items-center justify-center group-hover:translate-x-1 transition-transform">
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </Link>
                <Link href="/tu-van" className="text-gray-900 font-semibold underline underline-offset-4 decoration-2 hover:text-brand-900 transition-colors">
                  Tư vấn miễn phí →
                </Link>
              </div>

              {/* Inline stats row with avatar stack */}
              <div className="flex flex-wrap items-center gap-x-6 gap-y-4 pt-6 border-t border-gray-200">
                <div className="flex items-center gap-2.5">
                  <div className="flex -space-x-2">
                    {['#1A5FBF', '#F59E0B', '#10B981', '#6366F1'].map((c, i) => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-white shadow-sm" style={{ background: c }} aria-hidden="true" />
                    ))}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 text-sm leading-tight">1,234+</div>
                    <div className="text-xs text-gray-500 leading-tight">khách hài lòng</div>
                  </div>
                </div>
                <div className="h-8 w-px bg-gray-200" aria-hidden="true" />
                <div>
                  <div className="flex items-center gap-1 text-amber-500">
                    {[1,2,3,4,5].map(i => <Star key={i} className="w-3.5 h-3.5 fill-current" />)}
                    <span className="text-gray-900 font-bold ml-1 text-sm">4.8</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">điểm trung bình</div>
                </div>
                <div className="h-8 w-px bg-gray-200" aria-hidden="true" />
                <div>
                  <div className="font-bold text-gray-900 text-sm leading-tight">95</div>
                  <div className="text-xs text-gray-500 leading-tight">danh mục SP</div>
                </div>
              </div>
            </div>

            {/* RIGHT: Featured product with depth + floating cards (col 8-12) */}
            <div className="lg:col-span-5">
              {featuredHeroProduct ? (
                <div className="relative">
                  <Link href={`/san-pham/${featuredHeroProduct.slug}`} className="block group">
                    <div className="aspect-[4/5] rounded-[2rem] bg-gradient-to-br from-gray-100 to-gray-50 overflow-hidden relative shadow-2xl shadow-gray-900/15 ring-1 ring-gray-900/5">
                      {featuredHeroProduct.primary_image && (
                        <Image
                          src={featuredHeroProduct.primary_image}
                          alt={featuredHeroProduct.name}
                          fill
                          sizes="(max-width: 1024px) 100vw, 40vw"
                          className="object-cover group-hover:scale-[1.03] transition-transform duration-700"
                          priority
                        />
                      )}

                      {/* Top badges */}
                      <div className="absolute top-5 left-5 right-5 flex items-start justify-between">
                        <span className="px-3 py-1.5 rounded-full bg-gray-900/95 backdrop-blur text-white text-[11px] font-bold uppercase tracking-wider shadow-lg">
                          Mới 2026
                        </span>
                        {featuredHeroProduct.compare_price && featuredHeroProduct.compare_price > featuredHeroProduct.price && (
                          <span className="px-3 py-1.5 rounded-full bg-red-500 text-white text-[11px] font-bold shadow-lg">
                            -{Math.round(((featuredHeroProduct.compare_price - featuredHeroProduct.price) / featuredHeroProduct.compare_price) * 100)}%
                          </span>
                        )}
                      </div>

                      {/* Bottom info overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/85 via-black/40 to-transparent text-white">
                        <div className="text-[10px] uppercase tracking-[0.2em] opacity-80 mb-1.5">Featured Product</div>
                        <h2 className="font-bold text-base md:text-lg mb-2 line-clamp-1">{featuredHeroProduct.name}</h2>
                        <div className="flex items-baseline justify-between gap-3">
                          <div>
                            <div className="text-2xl font-bold leading-tight">{formatPrice(featuredHeroProduct.price)}</div>
                            {featuredHeroProduct.compare_price && featuredHeroProduct.compare_price > featuredHeroProduct.price && (
                              <div className="text-xs line-through opacity-60">{formatPrice(featuredHeroProduct.compare_price)}</div>
                            )}
                          </div>
                          <span className="text-sm font-semibold inline-flex items-center gap-1.5 group-hover:gap-2.5 transition-all bg-white/15 backdrop-blur px-3 py-1.5 rounded-full">
                            Xem ngay <ArrowRight className="w-4 h-4" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>

                  {/* Floating trust card 1 — top-right offset */}
                  <div className="absolute -top-4 -right-3 md:-right-6 bg-white rounded-2xl shadow-2xl shadow-gray-900/10 p-3 flex items-center gap-2.5 border border-gray-100 rotate-[3deg]" aria-hidden="true">
                    <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-green-700">
                      <Truck className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-xs text-gray-900 leading-tight">Giao 1-2 ngày</div>
                      <div className="text-[10px] text-gray-500 leading-tight mt-0.5">Miễn phí HN/HCM</div>
                    </div>
                  </div>

                  {/* Floating trust card 2 — bottom-left offset */}
                  <div className="absolute -bottom-3 -left-3 md:-left-6 bg-white rounded-2xl shadow-2xl shadow-gray-900/10 p-3 flex items-center gap-2.5 border border-gray-100 rotate-[-3deg]" aria-hidden="true">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-brand-900">
                      <Shield className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-xs text-gray-900 leading-tight">Bảo hành 24 tháng</div>
                      <div className="text-[10px] text-gray-500 leading-tight mt-0.5">1 đổi 1 nếu lỗi</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-[2rem] aspect-[4/5]" aria-hidden="true" />
              )}
            </div>
          </div>
        </div>

      </section>

      {/* ============ STICKY CATEGORY NAV ============ */}
      <CategoryStickyNav categories={categories || []} />

      {/* ============ TRUST BAR (compact) ============ */}
      <section aria-label="Cam kết của OFINA" className="bg-gray-50 border-b">
        <div className="container-custom py-5 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Truck, title: 'Miễn phí giao HN/HCM', desc: 'Đơn từ 500k' },
            { icon: Shield, title: 'Bảo hành 24 tháng', desc: 'Chính hãng' },
            { icon: RefreshCw, title: 'Đổi trả 7 ngày', desc: 'Không lý do' },
            { icon: CreditCard, title: 'Trả góp 0%', desc: 'Qua thẻ tín dụng' },
          ].map((item) => (
            <div key={item.title} className="flex items-center gap-2.5">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-brand-900 shadow-sm flex-shrink-0">
                <item.icon className="w-5 h-5" aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <div className="font-semibold text-sm text-brand-900 truncate">{item.title}</div>
                <div className="text-xs text-gray-600 truncate">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============ FEATURED COLLECTIONS (3 editorial cards) ============ */}
      <section className="py-14">
        <div className="container-custom">
          <div className="text-center mb-10">
            <span className="text-accent-600 font-semibold text-sm uppercase tracking-wider">Bộ sưu tập</span>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-brand-950 mt-2">
              Setup văn phòng theo nhu cầu
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {COLLECTIONS.map((c) => (
              <Link
                key={c.slug}
                href={`/danh-muc/${c.slug}`}
                className="group relative aspect-[4/5] md:aspect-[3/4] rounded-3xl overflow-hidden hover:shadow-2xl transition-shadow"
              >
                <Image
                  src={c.image}
                  alt={c.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${c.gradient}`} aria-hidden="true" />
                <div className="absolute inset-0 p-6 md:p-7 flex flex-col justify-end text-white">
                  <h3 className="font-display text-2xl md:text-3xl font-bold mb-2 leading-tight">{c.title}</h3>
                  <p className="text-sm md:text-base opacity-95 mb-4">{c.subtitle}</p>
                  <span className="inline-flex items-center gap-2 text-sm font-semibold w-fit border-b-2 border-accent-400 pb-1 group-hover:gap-3 transition-all">
                    Khám phá ngay <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ============ TABBED PRODUCT SHOWCASE ============ */}
      <section className="py-14 bg-gray-50/40">
        <div className="container-custom">
          <div className="text-center mb-8">
            <span className="text-accent-600 font-semibold text-sm uppercase tracking-wider">Sản phẩm OFINA</span>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-brand-950 mt-2 mb-3">
              Bộ sưu tập nổi bật
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Ghế công thái học · Bàn làm việc giám đốc · Sản phẩm 2026 — chọn đúng nhu cầu của doanh nghiệp bạn
            </p>
          </div>

          <ProductTabs
            tabs={[
              {
                id: 'ergonomic',
                label: 'Ghế công thái học',
                badge: 'Top',
                cta: { label: 'Xem tất cả ghế công thái học', href: '/danh-muc/ghe-cong-thai-hoc' },
                products: ergonomicChairs || [],
              },
              {
                id: 'exec-desk',
                label: 'Bàn giám đốc',
                cta: { label: 'Xem tất cả bàn giám đốc', href: '/danh-muc/ban-lanh-dao' },
                products: executiveDesks || [],
              },
              {
                id: 'exec-chair',
                label: 'Ghế giám đốc',
                cta: { label: 'Xem tất cả ghế giám đốc', href: '/danh-muc/ghe-da-giam-doc' },
                products: executiveChairs || [],
              },
              {
                id: 'new',
                label: 'Mới 2026',
                badge: 'New',
                cta: { label: 'Xem bộ sưu tập 2026', href: '/san-pham-moi-2026' },
                products: newest || [],
              },
            ]}
          />
        </div>
      </section>

      {/* ============ DANH MỤC NỔI BẬT ============ */}
      <section className="py-14">
        <div className="container-custom">
          <div className="flex items-end justify-between mb-8 flex-wrap gap-3">
            <div>
              <span className="text-accent-600 font-semibold text-sm uppercase tracking-wider">Theo danh mục</span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-brand-950 mt-2">
                Khám phá theo nhóm sản phẩm
              </h2>
            </div>
            <Link href="/san-pham" className="text-brand-900 hover:text-accent-600 font-semibold inline-flex items-center text-sm">
              Tất cả 95 danh mục <ArrowRight className="ml-1 w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
            {(categories.slice(0, 8) || []).map((cat) => (
              <Link
                key={cat.slug}
                href={`/danh-muc/${cat.slug}`}
                className="group relative aspect-square rounded-2xl overflow-hidden hover:shadow-xl transition-all"
              >
                {cat.image && (
                  <Image
                    src={cat.image}
                    alt={`Danh mục ${cat.name}`}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" aria-hidden="true" />
                <div className="absolute inset-0 flex items-end p-4">
                  <div className="text-white">
                    <h3 className="font-bold text-base md:text-lg leading-tight drop-shadow-lg">{cat.name}</h3>
                    <p className="text-xs opacity-90 drop-shadow mt-0.5">{cat.product_count} sản phẩm</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ============ STATS COUNTER ============ */}
      <section aria-label="Thống kê OFINA" className="py-12 bg-gray-900 text-white">
        <div className="container-custom grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {STATS.map((s) => (
            <div key={s.label}>
              <div className="text-4xl md:text-5xl font-bold text-white">{s.value}</div>
              <div className="text-sm md:text-base text-gray-400 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ============ VÌ SAO CHỌN OFINA ============ */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-10">
            <span className="text-gray-500 font-semibold text-sm uppercase tracking-wider">Cam kết OFINA</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-3">
              Vì sao 1,200+ doanh nghiệp chọn OFINA?
            </h2>
            <p className="text-gray-600">Cam kết chất lượng — dịch vụ tận tâm — giá tốt nhất thị trường</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {WHY_CHOOSE.map((r) => (
              <div key={r.title} className="bg-white border border-gray-200 rounded-2xl p-5 hover:border-gray-900 hover:shadow-lg transition-all">
                <div className="w-11 h-11 rounded-xl bg-gray-900 text-white flex items-center justify-center mb-3">
                  <r.icon className="w-5 h-5" aria-hidden="true" />
                </div>
                <h3 className="font-bold text-base text-gray-900 mb-1">{r.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ QUIZ AI (slim banner) ============ */}
      <section className="py-12 bg-gray-900 text-white">
        <div className="container-custom flex flex-col md:flex-row items-center gap-6 justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-white" />
              <span className="text-sm font-bold uppercase tracking-wider text-gray-400">Trợ lý AI</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold mb-1">
              Tìm sản phẩm hoàn hảo trong 30 giây
            </h2>
            <p className="text-gray-400 text-sm md:text-base">AI gợi ý sản phẩm phù hợp nhu cầu, không gian và ngân sách của bạn</p>
          </div>
          <Link href="/quiz" className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-lg bg-white text-gray-900 font-semibold hover:bg-gray-100 transition-colors text-base md:text-lg whitespace-nowrap">
            Bắt đầu quiz <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ============ B2B + SHOWROOM ============ */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="container-custom grid md:grid-cols-2 gap-6">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-7">
            <div className="flex items-center gap-2 text-accent-400 mb-3">
              <MapPin className="w-5 h-5" /> <span className="font-semibold uppercase tracking-wider text-xs">Showroom OFINA</span>
            </div>
            <h2 className="font-display text-2xl md:text-3xl font-bold mb-3">Trải nghiệm trực tiếp tại 2 chi nhánh</h2>
            <p className="text-gray-300 mb-5 text-sm md:text-base">Ngồi thử ghế, kiểm tra chất liệu bàn, nhận tư vấn chuyên sâu từ kiến trúc sư OFINA</p>
            <ul className="mb-5 space-y-2 text-accent-400">
              {CONTACT.branches.map((b) => (
                <li key={b.address} className="flex items-start gap-2">
                  <span aria-hidden="true">📍</span>
                  <span>
                    <span className="block font-semibold">{b.name}</span>
                    <span className="block text-sm text-gray-200">{b.address}</span>
                  </span>
                </li>
              ))}
            </ul>
            <Link href="/showroom" className="btn-accent">Xem đường đi →</Link>
          </div>
          <div className="bg-gradient-to-br from-accent-500 to-accent-600 rounded-2xl p-7">
            <div className="flex items-center gap-2 text-white/80 mb-3">
              <MessageSquare className="w-5 h-5" /> <span className="font-semibold uppercase tracking-wider text-xs">B2B Quote</span>
            </div>
            <h2 className="font-display text-2xl md:text-3xl font-bold mb-3">Khách doanh nghiệp?</h2>
            <p className="mb-5 opacity-95 text-sm md:text-base">Báo giá ưu đãi cho đơn lớn — VAT — lắp đặt toàn quốc — thiết kế bố trí miễn phí</p>
            <Link href="/bao-gia-b2b" className="inline-flex items-center justify-center px-5 py-3 bg-white text-accent-600 font-bold rounded-lg hover:bg-gray-100">
              Nhận báo giá B2B <MessageSquare className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ============ BRAND STORY (rich SEO content) ============ */}
      <section className="py-16">
        <div className="container-custom max-w-4xl">
          <div className="text-center mb-8">
            <span className="text-accent-600 font-semibold text-sm uppercase tracking-wider">Về OFINA</span>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-brand-950 mt-2">
              Nội thất văn phòng thay đổi trải nghiệm làm việc
            </h2>
          </div>

          <div className="prose prose-lg max-w-none text-gray-700 space-y-4">
            <p>
              <strong>OFINA</strong> là đơn vị phân phối nội thất văn phòng cao cấp tại Việt Nam, với sứ mệnh mang đến
              giải pháp không gian làm việc <strong>hiện đại, tiện nghi và bền vững</strong> cho mọi quy mô doanh nghiệp.
              Bộ sưu tập <strong>2,400+ sản phẩm</strong> được tuyển chọn kỹ càng — đảm bảo tiêu chuẩn công thái học
              quốc tế, vật liệu cao cấp và độ bền vượt trội.
            </p>
            <p>
              Với <strong>2 showroom</strong> tại Hà Nội và TP.HCM, khách hàng có thể trải nghiệm trực tiếp sản phẩm.
              Đội ngũ kiến trúc sư hỗ trợ <strong>khảo sát + thiết kế bố trí văn phòng miễn phí</strong> cho đơn B2B
              từ 50 triệu đồng. Cam kết <strong>giá tốt nhất</strong> — hoàn tiền nếu khách tìm được nơi rẻ hơn.
              Liên hệ hotline <a href={`tel:${CONTACT.hotline}`} className="text-brand-900 font-semibold hover:underline">{CONTACT.hotline}</a> để được tư vấn miễn phí 24/7.
            </p>
          </div>
        </div>
      </section>

      {/* ============ FAQ HOMEPAGE ============ */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom max-w-4xl">
          <div className="text-center mb-8">
            <span className="text-gray-500 font-semibold text-sm uppercase tracking-wider">FAQ</span>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-brand-950 mt-2 mb-3">
              Câu hỏi thường gặp
            </h2>
          </div>

          <div className="space-y-3">
            {HOMEPAGE_FAQ.map((item, i) => (
              <details
                key={i}
                className="group rounded-xl border bg-white open:shadow-md transition-shadow"
                {...(i === 0 ? { open: true } : {})}
              >
                <summary className="cursor-pointer list-none px-5 py-4 flex items-center justify-between gap-4 font-semibold text-brand-950">
                  <span>{item.q}</span>
                  <svg className="w-5 h-5 text-gray-500 transition-transform group-open:rotate-180 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
                  </svg>
                </summary>
                <div className="px-5 pb-5 -mt-1 text-gray-700 leading-relaxed">{item.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ============ TẤT CẢ DANH MỤC (mega list) ============ */}
      <section className="py-14 bg-gray-50 border-t">
        <div className="container-custom">
          <div className="text-center mb-8">
            <span className="text-accent-600 font-semibold text-sm uppercase tracking-wider">95 danh mục</span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-brand-950 mt-2">
              Toàn bộ danh mục sản phẩm
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {NAV_MENU.filter(m => m.mega).map((group) => (
              <div key={group.label} className="bg-white rounded-2xl p-5 border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all">
                <h3 className="font-display font-bold text-lg text-brand-900 mb-3 pb-2 border-b-2 border-accent-500 inline-block">
                  <Link href={group.href} className="hover:underline">{group.label}</Link>
                </h3>
                <div className="space-y-3">
                  {group.mega!.columns.map((col) => (
                    <div key={col.heading}>
                      <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                        {col.heading}
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {col.items.slice(0, 6).map((cat) => (
                          <Link
                            key={cat.slug}
                            href={`/danh-muc/${cat.slug}`}
                            className="text-xs px-2.5 py-1 bg-white hover:bg-brand-900 hover:text-white rounded-full text-gray-700 transition-colors border border-gray-200"
                          >
                            {cat.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/san-pham" className="btn-primary">
              Xem tất cả 2,400+ sản phẩm →
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
