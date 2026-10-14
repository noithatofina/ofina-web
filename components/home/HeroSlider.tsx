'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

type Slide = {
  image: string
  alt: string
  title: string
  subtitle: string
  ctaLabel: string
  ctaHref: string
  /** Vị trí object-fit cho background ảnh (mặc định 'center center'). */
  bgPosition?: string
}

// ảnh hero WebP nằm trong public/ — phục vụ thẳng từ CDN Vercel, không qua Supabase
const STORAGE = '/hero'

/**
 * 5 slide. Ảnh CHỈ làm background, không có chữ trong ảnh.
 * Text + CTA + dots là code HTML/CSS thật, responsive theo viewport.
 */
const SLIDES: Slide[] = [
  {
    image: `${STORAGE}/noi-that-van-phong-cao-cap-ofina`,
    alt: 'Nội thất văn phòng cao cấp — phòng giám đốc OFINA với view thành phố',
    title: 'Nội thất văn phòng chuẩn',
    subtitle: 'Ghế công thái học, ghế giám đốc, bàn làm việc và giải pháp cho cá nhân, doanh nghiệp, dự án.',
    ctaLabel: 'Khám phá ngay',
    ctaHref: '/san-pham',
  },
  {
    image: `${STORAGE}/ghe-cong-thai-hoc-da-mau-ofina`,
    alt: 'Ghế công thái học đa màu — xanh mint, xám, đen — OFINA',
    title: 'Ghế công thái học',
    subtitle: 'Đa dạng phong cách và màu sắc — bảo vệ cột sống cho dân văn phòng ngồi 8+ giờ/ngày.',
    ctaLabel: 'Xem bộ sưu tập',
    ctaHref: '/danh-muc/ghe-cong-thai-hoc',
  },
  {
    image: `${STORAGE}/ghe-giam-doc-van-phong-cao-cap-ofina`,
    alt: 'Ghế giám đốc cao cấp — đẳng cấp phòng giám đốc — OFINA',
    title: 'Ghế giám đốc cao cấp',
    subtitle: 'Da bò thật, khung thép — đẳng cấp sang trọng cho phòng giám đốc.',
    ctaLabel: 'Xem bộ sưu tập',
    ctaHref: '/danh-muc/ghe-da-giam-doc',
  },
  {
    image: `${STORAGE}/giai-phap-noi-that-van-phong-ofina`,
    alt: 'Đủ giải pháp nội thất văn phòng cho doanh nghiệp — collage không gian OFINA',
    title: 'Đủ giải pháp cho doanh nghiệp',
    subtitle: 'Bàn làm việc, tủ kệ, sofa văn phòng đồng bộ cho dự án và setup văn phòng quy mô.',
    ctaLabel: 'Nhận tư vấn B2B',
    ctaHref: '/bao-gia-b2b',
  },
  {
    image: `${STORAGE}/phong-hop-noi-that-doanh-nghiep-ofina`,
    alt: 'Phòng họp nội thất cao cấp cho doanh nghiệp — OFINA',
    title: 'Phòng họp cao cấp',
    subtitle: 'Bàn họp, ghế hội nghị và không gian phòng họp chuyên nghiệp cho doanh nghiệp hiện đại.',
    ctaLabel: 'Xem sản phẩm',
    ctaHref: '/danh-muc/ban-hop-van-phong-chan-sat',
  },
]

const AUTOPLAY_MS = 5000

export function HeroSlider() {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const touchStartX = useRef<number | null>(null)
  const total = SLIDES.length

  useEffect(() => {
    if (paused) return
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % total)
    }, AUTOPLAY_MS)
    return () => clearInterval(id)
  }, [paused, total])

  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX
    setPaused(true)
  }

  function onTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) {
      setPaused(false)
      return
    }
    const diff = e.changedTouches[0].clientX - touchStartX.current
    const threshold = 50
    if (diff > threshold) setIndex((i) => (i - 1 + total) % total)
    else if (diff < -threshold) setIndex((i) => (i + 1) % total)
    touchStartX.current = null
    window.setTimeout(() => setPaused(false), 200)
  }

  return (
    <div
      className="relative overflow-hidden bg-[#F7F9FC] h-[320px] sm:h-[400px] md:h-[520px] lg:h-[580px]"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      role="region"
      aria-label="Banner OFINA"
    >
      {SLIDES.map((slide, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
            i === index ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
          }`}
          aria-hidden={i !== index}
        >
          {/* Layer 1: Background image */}
          <img
            src={`${slide.image}.webp`}
            srcSet={`${slide.image}-m.webp 828w, ${slide.image}.webp 1672w`}
            sizes="100vw"
            alt={slide.alt}
            width={1672}
            height={941}
            fetchPriority={i === 0 ? 'high' : undefined}
            loading={i === 0 ? 'eager' : 'lazy'}
            decoding={i === 0 ? 'sync' : 'async'}
            className="absolute inset-0 w-full h-full object-cover"
            style={{ objectPosition: slide.bgPosition || 'center right' }}
          />

          {/* Layer 2: Overlay gradient — desktop white-left, mobile dark-bottom */}
          <div
            className="hidden md:block absolute inset-0"
            style={{
              background:
                'linear-gradient(90deg, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.65) 42%, rgba(255,255,255,0.10) 100%)',
            }}
            aria-hidden="true"
          />
          <div
            className="md:hidden absolute inset-0"
            style={{
              background:
                'linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(15,23,42,0.15) 40%, rgba(15,23,42,0.55) 100%)',
            }}
            aria-hidden="true"
          />

          {/* Layer 3: Chữ + nút.
              Trước đây dựng HAI khối riêng (một `hidden md:flex` cho máy tính, một
              `md:hidden` cho điện thoại), mỗi khối một thẻ h2 — nên 5 slide đẻ ra 10 thẻ
              H2 trong DOM, nửa số đó luôn `display:none`. Nay gộp làm một khối, khác biệt
              giữa hai cỡ màn hình diễn đạt bằng lớp responsive.

              Nhịp hiện chữ tách khỏi nhịp mờ ảnh: ảnh vẫn chuyển chéo 700ms cho mượt,
              nhưng chữ của slide cũ tắt nhanh (150ms) và chữ slide mới chỉ hiện sau 350ms
              — nếu để cùng nhịp thì giữa lúc chuyển, chữ hai slide chồng lên nhau, đọc
              không ra. */}
          <div
            className={`absolute inset-0 flex flex-col justify-end md:justify-center ${
              i === index
                ? 'opacity-100 transition-opacity duration-300 delay-[350ms]'
                : 'opacity-0 transition-opacity duration-150'
            }`}
          >
            <div className="container-custom w-full pb-12 md:pb-0">
              <div className="md:max-w-[520px] text-white md:text-gray-900">
                <h2 className="text-[26px] sm:text-[30px] md:text-[40px] lg:text-[52px] xl:text-[56px] font-bold leading-[1.15] md:leading-[1.08] tracking-tight mb-2 md:mb-4 drop-shadow-sm md:drop-shadow-none">
                  {slide.title}
                </h2>
                <p className="text-[14px] sm:text-[15px] md:text-[17px] lg:text-[19px] opacity-95 md:opacity-100 md:text-gray-700 leading-relaxed mb-3.5 md:mb-6 line-clamp-2 md:line-clamp-none drop-shadow-sm md:drop-shadow-none">
                  {slide.subtitle}
                </p>
                <Link
                  href={slide.ctaHref}
                  className="inline-flex items-center justify-center gap-1.5 md:gap-2 h-10 md:h-12 px-4 md:px-6 bg-[#155EEF] text-white text-[13px] md:text-[15px] font-semibold rounded-lg md:rounded-xl hover:bg-[#1D4ED8] transition-colors shadow-sm w-fit"
                >
                  {slide.ctaLabel}
                  <ArrowRight className="w-3.5 h-3.5 md:w-4 md:h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Dots indicator — màu #155EEF active */}
      <div
        className="absolute left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5 md:gap-2"
        style={{ bottom: 'max(14px, env(safe-area-inset-bottom))' }}
      >
        {SLIDES.map((_, i) => (
          // Vùng bấm phải đủ 24×24 (WCAG 2.2 §2.5.8); trước đây chính thẻ button là
          // cái chấm 8×8 nên rất khó bấm trúng trên điện thoại. Nay button là vùng
          // bấm trong suốt 24×24, cái chấm là thẻ span bên trong.
          <button
            key={i}
            onClick={() => setIndex(i)}
            className="h-6 min-w-6 flex items-center justify-center"
            aria-label={`Chuyển sang slide ${i + 1}`}
            aria-current={i === index}
          >
            <span
              className={`block h-1.5 md:h-2 rounded-full transition-all duration-300 ${
                i === index
                  ? 'w-7 md:w-9 bg-[#155EEF] shadow-sm'
                  : 'w-1.5 md:w-2 bg-white/70 md:bg-gray-400/60'
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  )
}
