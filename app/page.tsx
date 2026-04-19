import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Shield, Truck, RefreshCw, Award, Sparkles, MessageSquare } from 'lucide-react'
import { ProductCard } from '@/components/product/ProductCard'
import { getHomepageData } from '@/lib/queries'
import { NAV_MENU } from '@/lib/nav-menu'
import { CONTACT } from '@/lib/utils'

export default async function HomePage() {
  const { featured, bestsellers, newest, categories } = await getHomepageData()

  return (
    <>
      {/* ============ HERO ============ */}
      <section className="relative h-[85vh] min-h-[600px] flex items-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-900 via-brand-800 to-brand-950">
          <div
            className="absolute inset-0 opacity-30 bg-cover bg-center"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=80')" }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-950/90 to-transparent" />
        </div>

        <div className="container-custom relative z-10 text-white">
          <div className="max-w-2xl animate-slide-up">
            <span className="inline-block px-4 py-1.5 bg-accent-500/20 text-accent-400 rounded-full text-sm font-semibold mb-4">
              ✨ Mùa khai trương — Giảm đến 20%
            </span>
            <h1 className="font-display text-5xl md:text-7xl font-bold leading-tight mb-6">
              Nội Thất<br/>Văn Phòng Việt Nam
            </h1>
            <p className="text-xl text-gray-200 mb-8 leading-relaxed">
              Chuẩn quốc tế · Giá hợp lý · 2,400+ sản phẩm cao cấp từ các thương hiệu uy tín
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/san-pham" className="btn-accent text-lg px-8 py-4">
                Khám phá sản phẩm <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link href="/tu-van" className="btn-ghost text-lg px-8 py-4 !border-white !text-white hover:!bg-white hover:!text-brand-900">
                Nhận tư vấn miễn phí
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 animate-bounce">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 5v14M5 12l7 7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
      </section>

      {/* ============ TRUST BAR ============ */}
      <section className="bg-brand-50 border-y">
        <div className="container-custom py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: Truck, title: 'Miễn phí giao HCM', desc: 'Đơn từ 500k' },
            { icon: Shield, title: 'Bảo hành 2 năm', desc: 'Chính hãng' },
            { icon: RefreshCw, title: 'Đổi trả 7 ngày', desc: 'Miễn phí' },
            { icon: Award, title: 'Trả góp 0%', desc: 'Qua thẻ tín dụng' },
          ].map((item) => (
            <div key={item.title} className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-brand-900 shadow-sm">
                <item.icon className="w-6 h-6" />
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
            {(categories.slice(0, 8) || []).map((cat, idx) => (
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
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                {cat.image && (
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                )}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ============ TẤT CẢ DANH MỤC (mega list) ============ */}
      <section className="py-16 bg-gradient-to-b from-white to-brand-50">
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

      {/* ============ QUIZ AI ============ */}
      <section className="py-20 bg-gradient-to-br from-brand-900 to-brand-800 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent-500/20 rounded-full blur-3xl" />
        <div className="container-custom relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <Sparkles className="w-12 h-12 mx-auto text-accent-400 mb-4" />
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Tìm ghế hoàn hảo trong 30 giây
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Trợ lý AI của OFINA sẽ gợi ý sản phẩm phù hợp với nhu cầu và ngân sách của bạn
            </p>
            <Link href="/quiz" className="btn-accent text-lg px-10 py-4">
              Bắt đầu quiz <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ============ SẢN PHẨM MỚI 2026 ============ */}
      <section className="py-16 bg-gradient-to-br from-brand-950 via-brand-900 to-brand-800 text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-accent-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-400/20 rounded-full blur-3xl" />

        <div className="container-custom relative z-10">
          <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent-500/20 text-accent-400 rounded-full text-xs font-bold uppercase tracking-wider mb-3 border border-accent-500/30">
                <Sparkles className="w-3 h-3" /> New Collection 2026
              </div>
              <h2 className="font-display text-4xl md:text-5xl font-bold">
                Sản Phẩm Mới <span className="text-accent-400">2026</span>
              </h2>
              <p className="text-gray-300 mt-2">Thiết kế hiện đại nhất, cập nhật liên tục</p>
            </div>
            <Link
              href="/san-pham-moi-2026"
              className="inline-flex items-center gap-2 px-6 py-3 bg-accent-500 text-white font-bold rounded-lg hover:bg-accent-600 transition-colors"
            >
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
            {(bestsellers || []).slice(0, 8).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* ============ COMBO/BUNDLE ============ */}
      <section className="py-20 bg-brand-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <span className="text-accent-600 font-semibold text-sm uppercase tracking-wider">Combo tiết kiệm</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-brand-950 mt-2 mb-4">
              Setup văn phòng hoàn chỉnh
            </h2>
            <p className="text-gray-600 text-lg">Chọn combo phù hợp — tiết kiệm đến 20%</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: 'Gói Nhân Viên', price: '4.990.000đ', includes: 'Bàn + Ghế + Phụ kiện', saved: '15%', img: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=600&q=80' },
              { name: 'Gói Giám Đốc', price: '14.990.000đ', includes: 'Bàn GĐ + Ghế da + Tủ HS', saved: '18%', img: 'https://images.unsplash.com/photo-1549497538-303791108f95?w=600&q=80' },
              { name: 'Gói Văn Phòng Nhỏ', price: '29.990.000đ', includes: '5 bộ bàn ghế + tủ + kệ', saved: '20%', img: 'https://images.unsplash.com/photo-1604328698692-f76ea9498e76?w=600&q=80' },
            ].map((combo) => (
              <div key={combo.name} className="card group cursor-pointer">
                <div className="aspect-video relative overflow-hidden">
                  <Image
                    src={combo.img}
                    alt={combo.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 bg-accent-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    Tiết kiệm {combo.saved}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-xl mb-2">{combo.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{combo.includes}</p>
                  <div className="flex items-end justify-between">
                    <span className="text-2xl font-bold text-brand-900">{combo.price}</span>
                    <button className="text-accent-600 font-semibold hover:underline">Xem combo →</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ SẢN PHẨM MỚI ============ */}
      <section className="py-20">
        <div className="container-custom">
          <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
            <div>
              <span className="text-accent-600 font-semibold text-sm uppercase tracking-wider">Mới về</span>
              <h2 className="font-display text-4xl font-bold text-brand-950 mt-2">Sản phẩm mới nhất</h2>
            </div>
            <Link href="/san-pham?sort=newest" className="text-brand-900 hover:text-accent-600 font-semibold inline-flex items-center">
              Xem tất cả <ArrowRight className="ml-1 w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {(newest || []).slice(0, 8).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* ============ ĐÁNH GIÁ KHÁCH HÀNG ============ */}
      <section className="py-20 bg-gradient-to-br from-brand-50 to-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <div className="flex justify-center gap-1 mb-4 text-accent-500">
              {[1,2,3,4,5].map((i) => (
                <svg key={i} className="w-6 h-6 fill-current" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/></svg>
              ))}
            </div>
            <h2 className="font-display text-4xl font-bold text-brand-950 mb-2">
              1,200+ khách hàng tin tưởng
            </h2>
            <p className="text-gray-600">Điểm trung bình: 4.8/5 từ 1,234 đánh giá</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: 'Anh Minh', role: 'GĐ Công ty ABC', text: 'Sản phẩm chất lượng, đóng gói cẩn thận, giao hàng nhanh. Ghế ngồi cả ngày không đau lưng. Rất hài lòng!' },
              { name: 'Chị Lan', role: 'Kiến trúc sư', text: 'OFINA tư vấn tận tình, thiết kế văn phòng 50m² từ A-Z. Đội lắp đặt chuyên nghiệp, sạch sẽ.' },
              { name: 'Anh Hùng', role: 'CEO Startup', text: 'Mua combo setup văn phòng 20 người. Giá tốt hơn các đơn vị khác 10-15%, chất lượng không thua kém.' },
            ].map((review, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-shadow">
                <div className="flex gap-1 text-accent-500 mb-4">
                  {[1,2,3,4,5].map((i) => (
                    <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/></svg>
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">"{review.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-brand-900 text-white rounded-full flex items-center justify-center font-bold">
                    {review.name[0]}
                  </div>
                  <div>
                    <div className="font-semibold">{review.name}</div>
                    <div className="text-sm text-gray-500">{review.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ B2B + SHOWROOM ============ */}
      <section className="py-20 bg-brand-950 text-white">
        <div className="container-custom grid md:grid-cols-2 gap-8">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
            <h3 className="font-display text-3xl font-bold mb-3">Showroom OFINA</h3>
            <p className="text-gray-300 mb-6">Ghé showroom để trải nghiệm trực tiếp sản phẩm, nhận tư vấn chi tiết từ chuyên gia</p>
            <ul className="mb-4 space-y-2 text-accent-400">
              {CONTACT.branches.map((b) => (
                <li key={b.address} className="flex items-start gap-2">
                  <span>📍</span>
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
            <h3 className="font-display text-3xl font-bold mb-3">Khách doanh nghiệp?</h3>
            <p className="mb-6 opacity-95">Nhận báo giá ưu đãi cho đơn hàng số lượng lớn, có hóa đơn VAT, lắp đặt toàn quốc</p>
            <Link href="/bao-gia-b2b" className="inline-flex items-center justify-center px-6 py-3 bg-white text-accent-600 font-bold rounded-lg hover:bg-gray-100">
              Nhận báo giá B2B <MessageSquare className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
