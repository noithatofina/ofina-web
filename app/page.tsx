import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Shield, Truck, RefreshCw, MessageSquare, BadgeCheck, Headphones, MapPin, CreditCard } from 'lucide-react'
import { getHomepageData, getNewProductsByCategory } from '@/lib/queries'
import { CONTACT } from '@/lib/utils'
import { CategoryStickyNav } from '@/components/home/CategoryStickyNav'
import { HeroSlider } from '@/components/home/HeroSlider'
import { ProductTabs } from '@/components/home/ProductTabs'
import { getAllSettings } from '@/lib/site-settings'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://ofina.vn'

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
    q: 'OFINA có showroom để xem trực tiếp không?',
    a: 'Có. OFINA có 2 showroom trải nghiệm trực tiếp: Trụ sở Hà Nội — 135 đường K2, Phường Phú Đô; Chi nhánh TP.HCM — Tầng 2, số 36 Lương Định Của, Quận 2. Mở cửa 8h-18h hàng ngày. Gọi 0325629996 (HN) hoặc 0777569996 (HCM) để đặt lịch.',
  },
  {
    q: 'Có hỗ trợ báo giá cho doanh nghiệp không?',
    a: 'Có. OFINA hỗ trợ báo giá cho khách doanh nghiệp, dự án, setup văn phòng và phòng họp. Gửi yêu cầu qua /bao-gia-b2b hoặc gọi hotline để được tư vấn cụ thể về chiết khấu theo số lượng và phương thức thanh toán.',
  },
  {
    q: 'Ghế được bảo hành bao lâu?',
    a: 'Hầu hết sản phẩm tại OFINA được bảo hành 24 tháng kể từ ngày mua. Một số dòng cao cấp (Libernovo Omni, ghế công thái học...) có bảo hành khung dài hơn theo chính sách của nhà sản xuất. Chi tiết bảo hành ghi rõ trên trang từng sản phẩm.',
  },
  {
    q: 'Có giao hàng và lắp đặt tại HN/HCM không?',
    a: 'Có. OFINA miễn phí giao hàng và lắp đặt nội thành Hà Nội và TP.HCM cho đơn từ 500.000đ. Các tỉnh khác phí ship dao động 50.000-500.000đ tuỳ khu vực, kỹ thuật viên hỗ trợ hướng dẫn lắp qua video call.',
  },
  {
    q: 'Tôi chưa biết chọn ghế nào thì có được tư vấn không?',
    a: 'Có. OFINA tư vấn miễn phí qua hotline (HN 0325629996 / HCM 0777569996) hoặc Zalo. Đội ngũ tư vấn sẽ hỏi về dáng người, thời gian ngồi mỗi ngày, ngân sách và không gian làm việc để gợi ý mẫu ghế phù hợp nhất.',
  },
]

const WHY_CHOOSE = [
  { icon: BadgeCheck, title: 'Sản phẩm chọn lọc', desc: 'Các dòng ghế và nội thất văn phòng được OFINA tuyển kỹ theo chất liệu, độ bền, công năng — không nhập tràn lan.' },
  { icon: Shield, title: 'Bảo hành 24 tháng', desc: 'Bảo hành chính hãng 24 tháng cho hầu hết sản phẩm. Ghế cao cấp có bảo hành khung dài hơn theo NSX.' },
  { icon: Truck, title: 'Giao hàng HN/HCM', desc: 'Miễn phí giao và lắp đặt nội thành HN, TP.HCM 1-2 ngày làm việc. Các tỉnh hỗ trợ theo nhu cầu.' },
  { icon: Headphones, title: 'Tư vấn chọn ghế theo nhu cầu', desc: 'Hỏi về dáng người, thời gian ngồi, ngân sách, không gian — OFINA gợi ý đúng mẫu phù hợp, không bán theo combo.' },
  { icon: CreditCard, title: 'Báo giá số lượng cho doanh nghiệp', desc: 'Chiết khấu theo số lượng, hoá đơn VAT, hỗ trợ thanh toán linh hoạt cho khách doanh nghiệp.' },
  { icon: RefreshCw, title: 'Hỗ trợ dự án văn phòng', desc: 'Khảo sát mặt bằng, tư vấn bố trí, đồng bộ sản phẩm cho dự án văn phòng, coworking, phòng họp.' },
]


export default async function HomePage() {
  // 1 fetch settings (cached 1h) + 5 product queries song song
  const [{ newest, categories }, allSettings, ergonomicChairs, staffChairs, executiveChairs, workDesks] = await Promise.all([
    getHomepageData(),
    getAllSettings(),
    getNewProductsByCategory(['ghe-cong-thai-hoc'], 8),
    getNewProductsByCategory(['ghe-xoay-van-phong', 'ghe-xoay-luoi', 'ghe-xoay-lung-cao'], 8),
    getNewProductsByCategory(['ghe-da-giam-doc', 'ghe-lanh-dao'], 8),
    getNewProductsByCategory(['ban-lam-viec-chan-sat', 'ban-lam-viec-chan-go', 'ban-giam-doc-chan-sat', 'ban-giam-doc'], 8),
  ])

  const faqSetting: { items: Array<{ q: string; a: string }> } = allSettings['home.faq'] || { items: [] }
  const brandStorySetting: { title: string; content: string } = allSettings['home.brand_story'] || { title: '', content: '' }
  const whyUsSetting: any = allSettings['home.why_us'] || { heading_title: '', heading_desc: '', items: [] }

  // FAQ: ưu tiên DB, fallback HOMEPAGE_FAQ
  const faqItems = faqSetting.items.length > 0 ? faqSetting.items : HOMEPAGE_FAQ

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* ============ HERO SLIDER — 5 slide chủ đề ============ */}
      <HeroSlider />

      {/* ============ STICKY CATEGORY NAV ============ */}
      <CategoryStickyNav categories={categories || []} />

      {/* ============ TRUST POLICY BAR (2 items gọn) ============ */}
      <section aria-label="Cam kết OFINA" className="bg-[#F7F9FC] border-y border-[#E5EAF1]">
        <div className="container-custom py-4 md:py-6 grid grid-cols-2 gap-3 md:gap-6 max-w-3xl mx-auto">
          {[
            { Icon: Truck, title: 'Miễn phí giao HN/HCM', desc: 'Đơn nội thành từ 500k' },
            { Icon: Shield, title: 'Bảo hành 24 tháng', desc: 'Hỗ trợ tại nhà HN/HCM' },
          ].map(({ Icon, title, desc }) => (
            <div key={title} className="flex items-center gap-2.5">
              <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-white border border-[#E5EAF1] flex items-center justify-center text-[#155EEF] flex-shrink-0">
                <Icon className="w-4 h-4 md:w-5 md:h-5" strokeWidth={1.75} aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <div className="font-semibold text-[13px] md:text-[14px] text-gray-900 leading-tight">{title}</div>
                <div className="text-[11px] md:text-xs text-gray-500 mt-0.5 leading-tight">{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============ BỘ SƯU TẬP NỔI BẬT (Product tabs) ============ */}
      <section className="py-8 md:py-12">
        <div className="container-custom">
          <div className="text-center mb-5 md:mb-7">
            <h2 className="text-[18px] md:text-[22px] font-bold text-gray-900 leading-tight tracking-wider uppercase">
              Bộ sưu tập nổi bật
            </h2>
          </div>

          <ProductTabs
            tabs={[
              {
                id: 'ergonomic',
                label: 'Ghế công thái học',
                cta: { label: 'Xem tất cả', href: '/danh-muc/ghe-cong-thai-hoc' },
                products: ergonomicChairs || [],
              },
              {
                id: 'exec-chair',
                label: 'Ghế giám đốc',
                cta: { label: 'Xem tất cả', href: '/danh-muc/ghe-da-giam-doc' },
                products: executiveChairs || [],
              },
              {
                id: 'staff-chair',
                label: 'Ghế nhân viên',
                cta: { label: 'Xem tất cả', href: '/danh-muc/ghe-xoay-van-phong' },
                products: staffChairs || [],
              },
              {
                id: 'work-desk',
                label: 'Bàn làm việc',
                cta: { label: 'Xem tất cả', href: '/danh-muc/ban-lam-viec-chan-sat' },
                products: workDesks || [],
              },
              {
                id: 'new',
                label: 'Mới 2026',
                cta: { label: 'Xem bộ sưu tập 2026', href: '/san-pham-moi-2026' },
                products: newest || [],
              },
            ]}
          />
        </div>
      </section>

      {/* ============ GIẢI PHÁP NỘI THẤT VĂN PHÒNG CHO DOANH NGHIỆP ============ */}
      <section className="py-16 md:py-20 bg-[#F7F9FC]">
        <div className="container-custom">
          <div className="grid lg:grid-cols-[52fr_48fr] gap-10 lg:gap-14 items-center max-w-6xl mx-auto">

            {/* LEFT: collage product grid (4 ô) — đại diện catalog OFINA cho doanh nghiệp */}
            <div className="order-2 lg:order-1">
              <div className="grid grid-cols-2 gap-3 md:gap-4">
                {(newest || []).filter((p: any) => p?.primary_image).slice(0, 4).map((p: any) => (
                  <Link
                    key={p.id}
                    href={`/san-pham/${p.slug}`}
                    className="group relative aspect-square rounded-[18px] bg-white border border-[#E5EAF1] overflow-hidden hover:border-[#155EEF]/40 transition-colors"
                  >
                    <Image
                      src={p.primary_image}
                      alt={p.name}
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-contain p-3 group-hover:scale-[1.04] transition-transform duration-500"
                    />
                  </Link>
                ))}
              </div>
            </div>

            {/* RIGHT: title + subtitle + checklist + CTA */}
            <div className="order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#155EEF]/10 text-[#155EEF] text-xs font-semibold uppercase tracking-wider mb-4">
                <MessageSquare className="w-3.5 h-3.5" strokeWidth={2} />
                Doanh nghiệp & Dự án
              </div>
              <h2 className="text-[30px] md:text-[38px] font-bold text-gray-900 leading-[1.15] mb-4">
                Giải pháp nội thất văn phòng cho doanh nghiệp
              </h2>
              <p className="text-gray-500 text-base md:text-[17px] mb-6 leading-relaxed">
                OFINA hỗ trợ tư vấn, báo giá số lượng và gợi ý sản phẩm phù hợp cho văn phòng, phòng họp, phòng giám đốc và dự án.
              </p>

              <ul className="space-y-3 mb-7">
                {[
                  'Tư vấn chọn ghế, bàn, tủ theo không gian',
                  'Báo giá theo số lượng',
                  'Hỗ trợ giao hàng HN/HCM',
                  'Có showroom trải nghiệm trực tiếp',
                  'Phù hợp doanh nghiệp, coworking, văn phòng mới setup',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#155EEF]/10 text-[#155EEF] inline-flex items-center justify-center mt-0.5">
                      <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.5 6.5l2.5 2.5L9.5 3.5" />
                      </svg>
                    </span>
                    <span className="text-gray-700 text-[15px] md:text-base leading-snug">{item}</span>
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap gap-3">
                <Link
                  href="/bao-gia-b2b"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#155EEF] text-white font-semibold rounded-xl hover:bg-[#1D4ED8] transition-colors"
                >
                  Nhận báo giá doanh nghiệp
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href={`https://zalo.me/${CONTACT.branches[0].phones[0]}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-[#E5EAF1] bg-white text-gray-900 font-semibold rounded-xl hover:border-[#155EEF] hover:text-[#155EEF] transition-colors"
                >
                  Liên hệ Zalo
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ============ VÌ SAO KHÁCH HÀNG CHỌN OFINA ============ */}
      <section className="py-16 md:py-20">
        <div className="container-custom">
          <div className="text-center max-w-2xl mx-auto mb-10 md:mb-12">
            <h2 className="text-[32px] md:text-[40px] font-bold text-gray-900 leading-[1.15] mb-3">
              {whyUsSetting.heading_title || 'Vì sao khách hàng chọn OFINA?'}
            </h2>
            <p className="text-gray-500 text-base md:text-lg">
              {whyUsSetting.heading_desc || 'Chọn lọc sản phẩm kỹ, tư vấn đúng nhu cầu, chính sách rõ ràng.'}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {(() => {
              const icons = [BadgeCheck, Shield, Truck, Headphones, CreditCard, RefreshCw]
              const items = whyUsSetting.items && whyUsSetting.items.length > 0
                ? whyUsSetting.items
                : WHY_CHOOSE.map(w => ({ title: w.title, desc: w.desc }))
              return items.slice(0, 6).map((r: any, i: number) => {
                const Icon = icons[i] || Shield
                return (
                  <div key={`${r.title}-${i}`} className="bg-white border border-[#E5EAF1] rounded-[20px] p-5 hover:border-[#155EEF] transition-colors">
                    <div className="w-11 h-11 rounded-xl bg-[#F7F9FC] text-[#155EEF] flex items-center justify-center mb-3">
                      <Icon className="w-5 h-5" strokeWidth={1.75} aria-hidden="true" />
                    </div>
                    <h3 className="font-semibold text-[17px] text-gray-900 mb-1.5">{r.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{r.desc}</p>
                  </div>
                )
              })
            })()}
          </div>
        </div>
      </section>

      {/* ============ VỀ OFINA — 2 cột text + 3 highlight ============ */}
      <section className="py-16 md:py-20">
        <div className="container-custom">
          <div className="grid lg:grid-cols-[55fr_45fr] gap-10 lg:gap-14 items-start max-w-6xl mx-auto">
            <div>
              <div className="text-[12px] font-semibold uppercase tracking-wider text-[#155EEF] mb-3">Về OFINA</div>
              <h1 className="text-[28px] md:text-[40px] font-bold text-gray-900 leading-[1.15] mb-5">
                Ghế &amp; nội thất văn phòng OFINA
              </h1>
              <div className="space-y-4 text-gray-600 text-[15px] md:text-[17px] leading-relaxed">
                <p>
                  OFINA cung cấp ghế công thái học, ghế giám đốc, bàn làm việc, tủ hồ sơ và giải pháp nội thất văn phòng cho cá nhân, doanh nghiệp và dự án.
                </p>
                {brandStorySetting.content ? (
                  <div className="blog-content" dangerouslySetInnerHTML={{ __html: brandStorySetting.content }} />
                ) : (
                  <p>
                    Chúng tôi tập trung vào các dòng nội thất hiện đại, phù hợp cho cá nhân làm việc tại nhà, doanh nghiệp đang setup văn phòng và các dự án cần đồng bộ sản phẩm. Ưu tiên thiết kế gọn, chất liệu bền, chính sách rõ ràng và tư vấn đúng nhu cầu sử dụng.
                  </p>
                )}
              </div>
            </div>
            <div className="space-y-3">
              {[
                { Icon: BadgeCheck, title: 'Chuyên ghế & nội thất văn phòng', desc: 'Ghế công thái học, ghế giám đốc, bàn làm việc, tủ hồ sơ — tập trung 1 ngành.' },
                { Icon: MapPin, title: 'Có showroom HN/HCM', desc: '2 showroom trải nghiệm trực tiếp 8h-18h hàng ngày.' },
                { Icon: Headphones, title: 'Hỗ trợ cá nhân và doanh nghiệp', desc: 'Tư vấn theo nhu cầu — báo giá riêng cho dự án, văn phòng và doanh nghiệp.' },
              ].map(({ Icon, title, desc }) => (
                <div key={title} className="flex items-start gap-3.5 bg-[#F7F9FC] border border-[#E5EAF1] rounded-[18px] p-4 md:p-5">
                  <div className="w-10 h-10 rounded-xl bg-white border border-[#E5EAF1] flex items-center justify-center text-[#155EEF] flex-shrink-0">
                    <Icon className="w-5 h-5" strokeWidth={1.75} aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-[16px] text-gray-900 mb-0.5">{title}</div>
                    <div className="text-sm text-gray-500 leading-snug">{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============ FAQ (max-w 900, gọn) ============ */}
      <section className="py-16 md:py-20 bg-[#F7F9FC]">
        <div className="container-custom max-w-[900px]">
          <div className="text-center mb-10">
            <h2 className="text-[32px] md:text-[40px] font-bold text-gray-900 leading-[1.15] mb-3">
              Câu hỏi thường gặp
            </h2>
            <p className="text-gray-500 text-base">Những câu khách hàng OFINA thường hỏi nhất.</p>
          </div>

          <div className="space-y-2.5">
            {faqItems.map((item, i) => (
              <details
                key={i}
                className="group rounded-[14px] border border-[#E5EAF1] bg-white open:border-[#155EEF]/40 transition-colors"
                {...(i === 0 ? { open: true } : {})}
              >
                <summary className="cursor-pointer list-none px-5 py-4 flex items-center justify-between gap-4 font-semibold text-gray-900 text-[15px]">
                  <span>{item.q}</span>
                  <svg className="w-4 h-4 text-gray-400 transition-transform group-open:rotate-180 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
                  </svg>
                </summary>
                <div className="px-5 pb-5 -mt-1 text-gray-600 leading-relaxed text-[15px]">{item.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CTA xem toàn bộ danh mục (cuối trang chủ) ============ */}
      <section className="py-14 md:py-16 border-t border-[#E5EAF1]">
        <div className="container-custom text-center">
          <p className="text-gray-500 text-sm md:text-base mb-4">Xem hết tất cả danh mục ghế, bàn, tủ và nội thất văn phòng tại OFINA.</p>
          <Link
            href="/san-pham"
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#155EEF] text-white font-semibold rounded-xl hover:bg-[#1D4ED8] transition-colors"
          >
            Xem toàn bộ danh mục
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </>
  )
}
