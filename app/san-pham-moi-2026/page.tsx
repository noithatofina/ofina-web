import type { Metadata } from 'next'
import Link from 'next/link'
import { ProductCard } from '@/components/product/ProductCard'
import { getNewProductsByCategory, getNewProducts } from '@/lib/queries'
import { Sparkles, TrendingUp, ArrowRight, Award, Zap, Star, Armchair, Monitor, Archive, Sofa, CalendarDays, PenLine, Flame, Filter, RefreshCw, FileCheck } from 'lucide-react'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://ofina.vn'

export const metadata: Metadata = {
  title: { absolute: 'Sản phẩm mới 2026 — Bộ sưu tập nội thất | OFINA' },
  description: 'Khám phá bộ sưu tập nội thất văn phòng mới 2026 tại OFINA: ghế ergonomic, bàn nâng hạ, tủ thông minh, sofa cao cấp. Cập nhật mỗi tuần, bảo hành 24 tháng.',
  keywords: ['sản phẩm mới 2026', 'nội thất 2026', 'ghế mới', 'bàn mới', 'sofa mới', 'OFINA'],
  alternates: { canonical: '/san-pham-moi-2026' },
  openGraph: {
    title: 'Sản phẩm mới 2026 — Bộ sưu tập nội thất',
    description: 'Bộ sưu tập nội thất văn phòng mới nhất 2026 — cập nhật liên tục mỗi tuần',
    url: `${SITE_URL}/san-pham-moi-2026`,
    images: [{ url: `${SITE_URL}/logo.png`, width: 800, height: 800, alt: 'OFINA Sản phẩm mới 2026' }],
  },
}

export const revalidate = 600

const GROUPED_CATEGORIES = [
  {
    title: 'Ghế văn phòng mới',
    slug: 'ghe-van-phong',
    icon: Armchair,
    description: 'Ghế xoay, ghế lãnh đạo, ghế công thái học mẫu mới — ngồi thoải mái 8 tiếng không đau lưng',
    categorySlugs: ['ghe-xoay-van-phong', 'ghe-da-giam-doc', 'ghe-cong-thai-hoc', 'ghe-xoay-luoi', 'ghe-lanh-dao', 'ghe-chan-quy-luoi', 'ghe-xoay-lung-trung'],
  },
  {
    title: 'Bàn làm việc mới',
    slug: 'ban-lam-viec',
    icon: Monitor,
    description: 'Bàn giám đốc, bàn nhân viên, bàn nâng hạ thông minh thế hệ mới — thiết kế tối giản Hàn Quốc',
    categorySlugs: ['ban-lam-viec-chan-sat', 'ban-giam-doc-chan-sat', 'ban-lanh-dao', 'ban-hop-van-phong-chan-sat', 'ban-nang-ha-thong-minh', 'cum-ban-lam-viec-4-nguoi'],
  },
  {
    title: 'Tủ & Kệ mới',
    slug: 'tu-ho-so-cao',
    icon: Archive,
    description: 'Tủ hồ sơ, tủ locker, kệ trang trí mẫu mới — giải pháp lưu trữ tối ưu không gian',
    categorySlugs: ['tu-ho-so-cao', 'tu-ho-so-thap-tu-cay', 'tu-locker-go', 'tu-giam-doc', 'ke-trang-tri', 'tu-tai-lieu-sat'],
  },
  {
    title: 'Sofa & Ghế thư giãn mới',
    slug: 'sofa-van-phong',
    icon: Sofa,
    description: 'Sofa văn phòng, ghế thư giãn, ghế armchair — tạo không gian tiếp khách sang trọng',
    categorySlugs: ['sofa-van-phong', 'sofa-don', 'ghe-thu-gian', 'ghe-armchair', 'bo-ghe-sofa'],
  },
]

export default async function NewProductsPage() {
  // Fetch top 8 mới nhất cho mỗi group
  const groupsData = await Promise.all(
    GROUPED_CATEGORIES.map(async (g) => ({
      ...g,
      products: await getNewProductsByCategory(g.categorySlugs, 8),
    }))
  )

  const { total } = await getNewProducts({ limit: 1 })

  return (
    <div>
      {/* ============ HERO ============ */}
      <section className="relative bg-gradient-to-br from-brand-900 via-brand-800 to-brand-950 text-white py-20 md:py-28 overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-accent-500/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-brand-400/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

        <div className="container-custom text-center relative z-10 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-accent-500/20 text-accent-400 rounded-full text-sm font-bold uppercase tracking-wider mb-6 border border-accent-500/30">
            <Sparkles className="w-4 h-4" /> New Collection 2026
          </div>
          <h1 className="font-display text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Sản Phẩm Mới <span className="text-accent-400">2026</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-8 leading-relaxed">
            <strong className="text-white">Bộ sưu tập nội thất văn phòng mới nhất 2026</strong> tại OFINA — tuyển chọn kỹ càng từ các xu hướng thiết kế
            đương đại Hàn Quốc, Nhật Bản, Bắc Âu. Từ ghế công thái học cao cấp, bàn nâng hạ thông minh đến sofa tiếp khách
            hiện đại — tất cả đều có mặt tại đây.
          </p>

          <div className="grid grid-cols-3 gap-4 md:gap-6 max-w-2xl mx-auto">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 md:p-5">
              <TrendingUp className="w-6 h-6 mx-auto text-accent-400 mb-2" />
              <div className="text-2xl md:text-3xl font-bold">{total}+</div>
              <div className="text-xs md:text-sm text-gray-300">Mẫu mới</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 md:p-5">
              <Zap className="w-6 h-6 mx-auto text-accent-400 mb-2" />
              <div className="text-2xl md:text-3xl font-bold">24h</div>
              <div className="text-xs md:text-sm text-gray-300">Giao hàng nhanh</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 md:p-5">
              <Award className="w-6 h-6 mx-auto text-accent-400 mb-2" />
              <div className="text-2xl md:text-3xl font-bold">2 năm</div>
              <div className="text-xs md:text-sm text-gray-300">Bảo hành</div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ GROUPED SECTIONS ============ */}
      {groupsData.map((group, idx) => (
        <section
          key={group.slug}
          className={`py-16 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
        >
          <div className="container-custom">
            <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="w-12 h-12 rounded-xl bg-brand-900/5 flex items-center justify-center flex-shrink-0">
                    <group.icon className="w-6 h-6 text-brand-900" strokeWidth={1.75} aria-hidden />
                  </span>
                  <h2 className="font-display text-3xl md:text-4xl font-bold text-brand-950">
                    {group.title}
                  </h2>
                </div>
                <p className="text-gray-600 max-w-2xl">{group.description}</p>
              </div>
              <Link
                href={`/danh-muc/${group.slug}`}
                className="inline-flex items-center gap-2 text-brand-900 font-semibold hover:text-accent-600 transition-colors"
              >
                Xem tất cả {group.title.toLowerCase()} <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {group.products.length === 0 ? (
              <p className="text-gray-500 italic">Chưa có sản phẩm mới trong danh mục này</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {group.products.map((p: any) => (
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
            )}
          </div>
        </section>
      ))}

      {/* ============ INTRO BLOG-STYLE (đẩy xuống sau danh mục) ============ */}
      <section className="py-12 bg-gray-50 border-y">
        <div className="container-custom max-w-4xl">
          <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12">
            <div className="flex items-start gap-4 mb-6">
              <div className="flex-shrink-0 w-12 h-12 bg-brand-900 rounded-full flex items-center justify-center">
                <Star className="w-6 h-6 text-white fill-white" />
              </div>
              <div>
                <div className="text-sm text-gray-500 font-semibold uppercase tracking-wider mb-1">Góc nội thất OFINA</div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                  Xu hướng nội thất văn phòng 2026 — OFINA mang về gì?
                </h2>
              </div>
            </div>

            <div className="prose prose-lg max-w-none text-gray-700 space-y-4">
              <p>
                Bước vào năm <strong>2026</strong>, nội thất văn phòng đang chứng kiến sự thay đổi mạnh mẽ với 3 xu hướng chủ đạo:
                <strong> Công thái học (Ergonomic) toàn diện</strong>, <strong>Smart Office</strong> tích hợp công nghệ,
                và <strong>Biophilic Design</strong> — thiết kế gần gũi thiên nhiên.
              </p>
              <p>
                OFINA tự hào là đơn vị tiên phong cập nhật những mẫu sản phẩm mới nhất từ các thương hiệu nội thất hàng đầu thế giới.
                Mỗi tuần, chúng tôi bổ sung <strong>hàng chục mẫu ghế, bàn, tủ, sofa mới</strong> vào bộ sưu tập — đảm bảo khách
                hàng OFINA luôn có lựa chọn hiện đại, thời thượng và chất lượng nhất.
              </p>
              <p>
                <strong>🆕 Cập nhật mới nhất:</strong> Bộ sưu tập ghế công thái học CAT với da Silicon chống xước,
                dòng bàn nâng hạ 2 motor thế hệ 3 điều khiển bằng app, và sofa văn phòng phong cách Nhật Bản tối giản.
                Tất cả đều đã có mặt tại OFINA với giá tốt nhất thị trường.
              </p>
            </div>

            <div className="mt-6 pt-6 border-t flex items-center justify-between text-sm">
              <div className="text-gray-500">
                <CalendarDays className="w-4 h-4 inline-block align-[-3px] mr-1.5" strokeWidth={2} aria-hidden />
                Cập nhật: <strong>Hàng tuần</strong>
                <span className="mx-2 text-gray-300">·</span>
                <PenLine className="w-4 h-4 inline-block align-[-3px] mr-1.5" strokeWidth={2} aria-hidden />
                Biên tập: OFINA
              </div>
              <Link href="/blog" className="text-brand-900 font-semibold hover:underline">
                Xem thêm blog →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============ CTA CUỐI ============ */}
      <section className="bg-gradient-to-r from-brand-900 to-brand-800 text-white py-16">
        <div className="container-custom text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Muốn xem tất cả sản phẩm mới?
          </h2>
          <p className="text-gray-200 text-lg mb-8 max-w-2xl mx-auto">
            Khám phá hơn <strong className="text-accent-400">{total}+ sản phẩm</strong> mới cập nhật —
            từ ghế công thái học đến bàn nâng hạ thông minh
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link href="/san-pham" className="btn-accent text-lg px-8 py-4">
              Xem tất cả {total}+ sản phẩm <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <Link href="/khuyen-mai" className="btn-ghost text-lg px-8 py-4 !border-white !text-white hover:!bg-white hover:!text-brand-900">
              <Flame className="w-5 h-5 mr-2" strokeWidth={2} aria-hidden />Xem khuyến mãi
            </Link>
          </div>
        </div>
      </section>

      {/* ============ META INFO ============ */}
      <section className="py-12 bg-white border-t">
        <div className="container-custom max-w-4xl text-center">
          <h3 className="font-display text-2xl font-bold text-brand-950 mb-4">
            Tại sao chọn "Sản phẩm mới 2026" từ OFINA?
          </h3>
          <div className="grid md:grid-cols-3 gap-6 text-left mt-8">
            <div>
              <div className="w-12 h-12 mb-3 rounded-xl bg-brand-900/5 flex items-center justify-center">
                <Filter className="w-6 h-6 text-brand-900" strokeWidth={1.75} aria-hidden />
              </div>
              <h4 className="font-bold mb-2">Thông số ghi rõ nguồn</h4>
              <p className="text-sm text-gray-600">
                Thông số lấy từ bảng kỹ thuật của nhà sản xuất. Chỗ nào tài liệu chưa rõ,
                trang sản phẩm ghi thẳng là chưa xác nhận.
              </p>
            </div>
            <div>
              <div className="w-12 h-12 mb-3 rounded-xl bg-brand-900/5 flex items-center justify-center">
                <RefreshCw className="w-6 h-6 text-brand-900" strokeWidth={1.75} aria-hidden />
              </div>
              <h4 className="font-bold mb-2">Cập nhật mỗi tuần</h4>
              <p className="text-sm text-gray-600">
                Mẫu mới được bổ sung liên tục, kèm ảnh và thông số đầy đủ chứ không chỉ tên gọi.
              </p>
            </div>
            <div>
              <div className="w-12 h-12 mb-3 rounded-xl bg-brand-900/5 flex items-center justify-center">
                <FileCheck className="w-6 h-6 text-brand-900" strokeWidth={1.75} aria-hidden />
              </div>
              <h4 className="font-bold mb-2">Báo giá theo số lượng</h4>
              <p className="text-sm text-gray-600">
                Đơn doanh nghiệp tính lại theo danh mục thực tế, xuất hoá đơn VAT đầy đủ.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
