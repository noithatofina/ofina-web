import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Shield, Truck, RefreshCw, Award, Sparkles, MessageSquare, BadgeCheck, Headphones, MapPin, CreditCard } from 'lucide-react'
import { ProductCard } from '@/components/product/ProductCard'
import { getHomepageData } from '@/lib/queries'
import { NAV_MENU } from '@/lib/nav-menu'
import { CONTACT } from '@/lib/utils'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://ofina-web-9c7z.vercel.app'

export const metadata = {
  title: 'OFINA — Nội Thất Văn Phòng Cao Cấp | Ghế, Bàn, Tủ Chính Hãng Giá Tốt',
  description: 'OFINA — đơn vị phân phối nội thất văn phòng chính hãng tại Việt Nam. 2,400+ mẫu ghế công thái học, bàn làm việc, tủ hồ sơ, sofa văn phòng. Bảo hành 24 tháng, miễn phí giao Hà Nội/HCM.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'OFINA — Nội Thất Văn Phòng Cao Cấp Cho Doanh Nghiệp Việt',
    description: 'Khám phá 2,400+ sản phẩm nội thất văn phòng tại OFINA — bảo hành 24 tháng, miễn phí giao Hà Nội/HCM.',
    url: SITE_URL,
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
  { icon: BadgeCheck, title: 'Chính hãng 100%', desc: 'Tem chống giả + giấy tờ xuất xứ đầy đủ. Hoàn tiền gấp đôi nếu hàng giả.' },
  { icon: Shield, title: 'Bảo hành 24 tháng', desc: '1 đổi 1 nếu lỗi nhà sản xuất, sửa chữa miễn phí tại nhà nội thành HN/HCM.' },
  { icon: Truck, title: 'Giao nhanh + lắp miễn phí', desc: '1-2 ngày HN/HCM. Đội kỹ thuật chuyên nghiệp lắp đặt + dọn dẹp tận nơi.' },
  { icon: CreditCard, title: 'Trả góp 0% lãi suất', desc: 'Hỗ trợ qua thẻ tín dụng các ngân hàng lớn — kỳ hạn 3-12 tháng.' },
  { icon: RefreshCw, title: 'Đổi trả 7 ngày', desc: 'Không cần lý do. Hoàn tiền 100% nếu sản phẩm còn nguyên vẹn.' },
  { icon: Headphones, title: 'Tư vấn 24/7', desc: 'Đội ngũ am hiểu nội thất văn phòng — gọi hotline hoặc Zalo bất cứ lúc nào.' },
]

const STATS = [
  { value: '2,400+', label: 'Sản phẩm chính hãng' },
  { value: '95', label: 'Danh mục đa dạng' },
  { value: '24', label: 'Tháng bảo hành' },
  { value: '2', label: 'Showroom HN & HCM' },
]

export default async function HomePage() {
  const { featured, bestsellers, newest, categories } = await getHomepageData()

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

      {/* ============ HERO ============ */}
      <section className="relative h-[80vh] min-h-[560px] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-900 via-brand-800 to-brand-950">
          <div
            className="absolute inset-0 opacity-30 bg-cover bg-center"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=80')" }}
            role="presentation"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-950/90 to-transparent" />
        </div>

        <div className="container-custom relative z-10 text-white">
          <div className="max-w-2xl animate-slide-up">
            <span className="inline-block px-4 py-1.5 bg-accent-500/20 text-accent-400 rounded-full text-sm font-semibold mb-4">
              ✨ Khai trương 2026 — Giảm đến 20%
            </span>
            <h1 className="font-display text-5xl md:text-7xl font-bold leading-tight mb-6">
              Nội Thất<br/>Văn Phòng
            </h1>
            <p className="text-xl text-gray-200 mb-8 leading-relaxed">
              2,400+ ghế công thái học, bàn làm việc, tủ hồ sơ, sofa cao cấp · Bảo hành 24 tháng · Giao miễn phí Hà Nội & HCM
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/san-pham-moi-2026" className="btn-accent text-lg px-8 py-4">
                Khám phá sản phẩm <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link href="/tu-van" className="btn-ghost text-lg px-8 py-4 !border-white !text-white hover:!bg-white hover:!text-brand-900">
                Nhận tư vấn miễn phí
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============ CATEGORY QUICK NAV (icon row) ============ */}
      <section aria-label="Danh mục nhanh" className="bg-white border-b">
        <div className="container-custom py-6">
          <div className="flex gap-3 md:gap-4 overflow-x-auto scrollbar-thin pb-2">
            {(categories.slice(0, 10) || []).map((cat) => (
              <Link
                key={cat.slug}
                href={`/danh-muc/${cat.slug}`}
                className="flex-shrink-0 flex flex-col items-center gap-2 group min-w-[88px]"
              >
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-brand-50 group-hover:bg-brand-900 group-hover:text-white border border-brand-100 flex items-center justify-center text-brand-900 transition-colors overflow-hidden relative">
                  {cat.image ? (
                    <Image src={cat.image} alt={cat.name} fill className="object-cover" sizes="80px" />
                  ) : (
                    <Sparkles className="w-7 h-7" />
                  )}
                </div>
                <span className="text-xs md:text-sm font-semibold text-center text-gray-700 group-hover:text-brand-900 transition-colors line-clamp-2 max-w-[88px]">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ============ TRUST BAR ============ */}
      <section aria-label="Cam kết của OFINA" className="bg-brand-50 border-b">
        <div className="container-custom py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: Truck, title: 'Miễn phí giao HN/HCM', desc: 'Đơn từ 500k' },
            { icon: Shield, title: 'Bảo hành 24 tháng', desc: 'Chính hãng' },
            { icon: RefreshCw, title: 'Đổi trả 7 ngày', desc: 'Không lý do' },
            { icon: CreditCard, title: 'Trả góp 0%', desc: 'Qua thẻ tín dụng' },
          ].map((item) => (
            <div key={item.title} className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-brand-900 shadow-sm">
                <item.icon className="w-6 h-6" aria-hidden="true" />
              </div>
              <div>
                <div className="font-semibold text-brand-900">{item.title}</div>
                <div className="text-sm text-gray-600">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============ DANH MỤC NỔI BẬT ============ */}
      <section className="py-20">
        <div className="container-custom">
          <div className="text-center mb-12">
            <span className="text-accent-600 font-semibold text-sm uppercase tracking-wider">Bộ sưu tập</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-brand-950 mt-2 mb-4">
              Khám phá theo danh mục
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Từ ghế văn phòng công thái học đến bàn họp cao cấp — OFINA có mọi thứ văn phòng hiện đại cần
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {(categories.slice(0, 8) || []).map((cat) => (
              <Link
                key={cat.slug}
                href={`/danh-muc/${cat.slug}`}
                className="group relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-brand-100 to-brand-50 hover:shadow-2xl transition-all"
              >
                <div className="absolute inset-0 flex items-end p-6">
                  <div className="text-white z-10">
                    <h3 className="font-bold text-xl md:text-2xl mb-1 drop-shadow-lg">{cat.name}</h3>
                    <p className="text-sm opacity-90 drop-shadow">{cat.product_count} sản phẩm</p>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-[5]" />
                {cat.image && (
                  <Image
                    src={cat.image}
                    alt={`Danh mục ${cat.name} OFINA`}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                )}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ============ SẢN PHẨM MỚI 2026 ============ */}
      <section className="py-16 bg-gradient-to-br from-brand-950 via-brand-900 to-brand-800 text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-accent-500/20 rounded-full blur-3xl" aria-hidden="true" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-400/20 rounded-full blur-3xl" aria-hidden="true" />

        <div className="container-custom relative z-10">
          <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent-500/20 text-accent-400 rounded-full text-xs font-bold uppercase tracking-wider mb-3 border border-accent-500/30">
                <Sparkles className="w-3 h-3" /> New Collection 2026
              </div>
              <h2 className="font-display text-4xl md:text-5xl font-bold">
                Sản Phẩm Mới <span className="text-accent-400">2026</span>
              </h2>
              <p className="text-gray-300 mt-2">Thiết kế hiện đại nhất, cập nhật liên tục mỗi tuần</p>
            </div>
            <Link href="/san-pham-moi-2026" className="inline-flex items-center gap-2 px-6 py-3 bg-accent-500 text-white font-bold rounded-lg hover:bg-accent-600 transition-colors">
              Xem tất cả <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {(newest || []).slice(0, 8).map((p: any) => (
              <div key={p.id} className="relative">
                <div className="absolute -top-2 -right-2 z-20">
                  <div className="bg-gradient-to-br from-accent-500 to-accent-600 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg">
                    NEW
                  </div>
                </div>
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ SẢN PHẨM BÁN CHẠY ============ */}
      <section className="py-20">
        <div className="container-custom">
          <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
            <div>
              <span className="text-accent-600 font-semibold text-sm uppercase tracking-wider">Hot sales</span>
              <h2 className="font-display text-4xl font-bold text-brand-950 mt-2">Sản phẩm bán chạy</h2>
            </div>
            <Link href="/san-pham?sort=bestseller" className="text-brand-900 hover:text-accent-600 font-semibold inline-flex items-center">
              Xem tất cả <ArrowRight className="ml-1 w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {(bestsellers || []).slice(0, 8).map((p: any) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      {/* ============ VÌ SAO CHỌN OFINA ============ */}
      <section className="py-20 bg-brand-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <span className="text-accent-600 font-semibold text-sm uppercase tracking-wider">Cam kết OFINA</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-brand-950 mt-2 mb-4">
              Vì sao 1,200+ doanh nghiệp chọn OFINA?
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Cam kết chất lượng — dịch vụ tận tâm — giá tốt nhất thị trường
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {WHY_CHOOSE.map((r) => (
              <div key={r.title} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-brand-900 text-white flex items-center justify-center mb-4">
                  <r.icon className="w-6 h-6" aria-hidden="true" />
                </div>
                <h3 className="font-bold text-lg text-brand-950 mb-2">{r.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ STATS COUNTER ============ */}
      <section aria-label="Thống kê OFINA" className="py-12 bg-gradient-to-r from-brand-900 to-brand-800 text-white">
        <div className="container-custom grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {STATS.map((s) => (
            <div key={s.label}>
              <div className="font-display text-4xl md:text-5xl font-bold text-accent-400">{s.value}</div>
              <div className="text-sm md:text-base text-gray-300 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ============ QUIZ AI ============ */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <Sparkles className="w-12 h-12 mx-auto text-accent-500 mb-4" aria-hidden="true" />
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4 text-brand-950">
              Tìm sản phẩm hoàn hảo trong 30 giây
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Trợ lý AI của OFINA gợi ý sản phẩm phù hợp nhất với nhu cầu, không gian và ngân sách của bạn
            </p>
            <Link href="/quiz" className="btn-accent text-lg px-10 py-4">
              Bắt đầu quiz <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ============ B2B + SHOWROOM ============ */}
      <section className="py-20 bg-brand-950 text-white">
        <div className="container-custom grid md:grid-cols-2 gap-8">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
            <div className="flex items-center gap-2 text-accent-400 mb-3">
              <MapPin className="w-5 h-5" /> <span className="font-semibold uppercase tracking-wider text-sm">Showroom OFINA</span>
            </div>
            <h2 className="font-display text-3xl font-bold mb-3">Trải nghiệm trực tiếp tại 2 chi nhánh</h2>
            <p className="text-gray-300 mb-6">Ngồi thử ghế, kiểm tra chất liệu bàn, nhận tư vấn chuyên sâu từ kiến trúc sư OFINA</p>
            <ul className="mb-4 space-y-2 text-accent-400">
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
          <div className="bg-gradient-to-br from-accent-500 to-accent-600 rounded-2xl p-8">
            <div className="flex items-center gap-2 text-white/80 mb-3">
              <MessageSquare className="w-5 h-5" /> <span className="font-semibold uppercase tracking-wider text-sm">B2B Quote</span>
            </div>
            <h2 className="font-display text-3xl font-bold mb-3">Khách doanh nghiệp?</h2>
            <p className="mb-6 opacity-95">Nhận báo giá ưu đãi cho đơn hàng số lượng lớn — hóa đơn VAT — lắp đặt toàn quốc — hỗ trợ thiết kế bố trí miễn phí</p>
            <Link href="/bao-gia-b2b" className="inline-flex items-center justify-center px-6 py-3 bg-white text-accent-600 font-bold rounded-lg hover:bg-gray-100">
              Nhận báo giá B2B <MessageSquare className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ============ BRAND STORY (rich SEO content) ============ */}
      <section className="py-20 bg-white">
        <div className="container-custom max-w-5xl">
          <div className="text-center mb-10">
            <span className="text-accent-600 font-semibold text-sm uppercase tracking-wider">Về OFINA</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-brand-950 mt-2 mb-4">
              Nội thất văn phòng thay đổi trải nghiệm làm việc
            </h2>
          </div>

          <div className="prose prose-lg max-w-none text-gray-700 space-y-5">
            <p>
              <strong>OFINA</strong> là đơn vị phân phối nội thất văn phòng cao cấp tại Việt Nam, ra đời với sứ mệnh mang đến
              giải pháp không gian làm việc <strong>hiện đại, tiện nghi và bền vững</strong> cho mọi quy mô doanh nghiệp — từ
              startup khởi nghiệp đến tập đoàn đa quốc gia. Chúng tôi tin rằng một chiếc ghế ngồi êm ái, một mặt bàn rộng rãi
              hay một chiếc tủ tài liệu được sắp xếp khoa học có thể tạo ra sự khác biệt thực sự cho năng suất và sức khỏe của
              người lao động.
            </p>
            <p>
              Bộ sưu tập <strong>2,400+ sản phẩm</strong> tại OFINA được tuyển chọn kỹ càng từ các nhà sản xuất uy tín, đảm bảo
              tiêu chuẩn <strong>công thái học (Ergonomic) quốc tế</strong>, vật liệu cao cấp và độ bền vượt trội. Mỗi sản phẩm
              đều có chứng nhận xuất xứ rõ ràng, tem chống giả và bảo hành chính hãng <strong>24 tháng</strong> — đủ để bạn yên
              tâm sử dụng lâu dài.
            </p>
            <p>
              Với <strong>2 showroom</strong> tại Hà Nội (135 đường K2, Phú Đô) và TP.HCM (Tầng 2, 36 Lương Định Của, Quận 2),
              khách hàng có thể trải nghiệm trực tiếp sản phẩm trước khi quyết định. Đội ngũ kiến trúc sư của OFINA cũng sẵn
              sàng hỗ trợ <strong>khảo sát + thiết kế bố trí văn phòng miễn phí</strong> cho đơn hàng B2B từ 50 triệu đồng,
              giúp bạn tối ưu không gian và ngân sách.
            </p>
            <p>
              Cam kết <strong>giá tốt nhất thị trường</strong> — OFINA hoàn tiền nếu khách tìm được nơi khác bán rẻ hơn cho cùng
              sản phẩm. Hỗ trợ <strong>trả góp 0% lãi suất</strong> qua thẻ tín dụng các ngân hàng lớn (Sacombank, VPBank,
              Techcombank, ACB...) với kỳ hạn 3-12 tháng. Miễn phí giao hàng + lắp đặt nội thành Hà Nội và TP.HCM cho đơn
              hàng từ 500.000đ. Liên hệ hotline <a href={`tel:${CONTACT.hotline}`} className="text-brand-900 font-semibold hover:underline">{CONTACT.hotline}</a> hoặc
              chat Zalo để được tư vấn miễn phí 24/7.
            </p>
          </div>
        </div>
      </section>

      {/* ============ FAQ HOMEPAGE ============ */}
      <section className="py-20 bg-brand-50">
        <div className="container-custom max-w-4xl">
          <div className="text-center mb-10">
            <span className="text-accent-600 font-semibold text-sm uppercase tracking-wider">FAQ</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-brand-950 mt-2 mb-4">
              Câu hỏi thường gặp
            </h2>
            <p className="text-gray-600 text-lg">Mọi thông tin bạn cần biết khi mua nội thất tại OFINA</p>
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
      <section className="py-16 bg-gradient-to-b from-white to-brand-50 border-t">
        <div className="container-custom">
          <div className="text-center mb-10">
            <span className="text-accent-600 font-semibold text-sm uppercase tracking-wider">95 danh mục</span>
            <h2 className="font-display text-4xl font-bold text-brand-950 mt-2 mb-3">
              Toàn bộ danh mục sản phẩm
            </h2>
            <p className="text-gray-600">Khám phá từng dòng sản phẩm OFINA</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {NAV_MENU.filter(m => m.mega).map((group) => (
              <div key={group.label} className="bg-white rounded-2xl shadow-sm hover:shadow-lg p-6 transition-shadow">
                <h3 className="font-display font-bold text-xl text-brand-900 mb-4 pb-2 border-b-2 border-accent-500 inline-block">
                  <Link href={group.href} className="hover:underline">{group.label}</Link>
                </h3>
                <div className="space-y-4">
                  {group.mega!.columns.map((col) => (
                    <div key={col.heading}>
                      <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                        {col.heading}
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {col.items.slice(0, 6).map((cat) => (
                          <Link
                            key={cat.slug}
                            href={`/danh-muc/${cat.slug}`}
                            className="text-xs px-2.5 py-1 bg-gray-100 hover:bg-brand-900 hover:text-white rounded-full text-gray-700 transition-colors"
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

          <div className="text-center mt-10">
            <Link href="/san-pham" className="btn-primary text-lg">
              Xem tất cả 2,400+ sản phẩm →
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
