'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
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

const STORAGE = 'https://ivxdwqsqveqsjcsdvewq.supabase.co/storage/v1/object/public/branding/hero-slider'

/**
 * 5 slide. Ảnh CHỈ làm background, không có chữ trong ảnh.
 * Text + CTA + dots là code HTML/CSS thật, responsive theo viewport.
 */
const SLIDES: Slide[] = [
  {
    image: `${STORAGE}/noi-that-van-phong-cao-cap-ofina.png`,
    alt: 'Nội thất văn phòng cao cấp — phòng giám đốc OFINA với view thành phố',
    title: 'Nội thất văn phòng chuẩn',
    subtitle: 'Ghế công thái học, ghế giám đốc, bàn làm việc và giải pháp cho cá nhân, doanh nghiệp, dự án.',
    ctaLabel: 'Khám phá ngay',
    ctaHref: '/san-pham',
  },
  {
    image: `${STORAGE}/ghe-cong-thai-hoc-da-mau-ofina.png`,
    alt: 'Ghế công thái học đa màu — xanh mint, xám, đen — OFINA',
    title: 'Ghế công thái học',
    subtitle: 'Đa dạng phong cách và màu sắc — bảo vệ cột sống cho dân văn phòng ngồi 8+ giờ/ngày.',
    ctaLabel: 'Xem bộ sưu tập',
    ctaHref: '/danh-muc/ghe-cong-thai-hoc',
  },
  {
    image: `${STORAGE}/ghe-giam-doc-van-phong-cao-cap-ofina.png`,
    alt: 'Ghế giám đốc cao cấp — đẳng cấp phòng giám đốc — OFINA',
    title: 'Ghế giám đốc cao cấp',
    subtitle: 'Da chính hãng, khung bền — đẳng cấp sang trọng cho phòng giám đốc.',
    ctaLabel: 'Xem bộ sưu tập',
    ctaHref: '/danh-muc/ghe-da-giam-doc',
  },
  {
    image: `${STORAGE}/giai-phap-noi-that-van-phong-ofina.png`,
    alt: 'Đủ giải pháp nội thất văn phòng cho doanh nghiệp — collage không gian OFINA',
    title: 'Đủ giải pháp cho doanh nghiệp',
    subtitle: 'Bàn làm việc, tủ kệ, sofa văn phòng đồng bộ cho dự án và setup văn phòng quy mô.',
    ctaLabel: 'Nhận tư vấn B2B',
    ctaHref: '/bao-gia-b2b',
  },
  {
    image: `${STORAGE}/phong-hop-noi-that-doanh-nghiep-ofina.png`,
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
          <Image
            src={slide.image}
            alt={slide.alt}
            fill
            sizes="100vw"
            priority={i === 0}
            unoptimized
            className="object-cover"
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

          {/* Layer 3: Text + CTA — DESKTOP */}
          <div className="hidden md:flex absolute inset-0 items-center">
            <div className="container-custom w-full">
              <div className="max-w-[520px] text-gray-900">
                <h2 className="text-[40px] lg:text-[52px] xl:text-[56px] font-bold leading-[1.08] tracking-tight mb-4">
                  {slide.title}
                </h2>
                <p className="text-[17px] lg:text-[19px] text-gray-700 leading-relaxed mb-6">
                  {slide.subtitle}
                </p>
                <Link
                  href={slide.ctaHref}
                  className="inline-flex items-center justify-center gap-2 h-12 px-6 bg-[#155EEF] text-white text-[15px] font-semibold rounded-xl hover:bg-[#1D4ED8] transition-colors shadow-sm"
                >
                  {slide.ctaLabel}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* Layer 3: Text + CTA — MOBILE (bottom-left, white text) */}
          <div className="md:hidden absolute inset-0 flex flex-col justify-end">
            <div className="container-custom pb-12 text-white">
              <h2 className="text-[26px] sm:text-[30px] font-bold leading-[1.15] tracking-tight mb-2 drop-shadow-sm">
                {slide.title}
              </h2>
              <p className="text-[14px] sm:text-[15px] opacity-95 mb-3.5 line-clamp-2 drop-shadow-sm">
                {slide.subtitle}
              </p>
              <Link
                href={slide.ctaHref}
                className="inline-flex items-center gap-1.5 h-10 px-4 bg-[#155EEF] text-white text-[13px] font-semibold rounded-lg shadow-sm w-fit"
              >
                {slide.ctaLabel}
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
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
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`h-1.5 md:h-2 rounded-full transition-all duration-300 ${
              i === index
                ? 'w-7 md:w-9 bg-[#155EEF] shadow-sm'
                : 'w-1.5 md:w-2 bg-white/70 hover:bg-white md:bg-gray-400/60 md:hover:bg-gray-500'
            }`}
            aria-label={`Chuyển sang slide ${i + 1}`}
            aria-current={i === index}
          />
        ))}
      </div>
    </div>
  )
}
