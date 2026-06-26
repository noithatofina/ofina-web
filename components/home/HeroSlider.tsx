'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'

type Slide = {
  image: string
  topic: string
  title: string
  subtitle: string
  ctaHref: string
}

/**
 * 5 slide chủ đề nội thất văn phòng. Ảnh Unsplash royalty-free
 * (Unsplash License — free commercial). Khi có ảnh OFINA tự chụp,
 * thay từng URL trong SLIDES.
 */
const SLIDES: Slide[] = [
  {
    image: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=2000&q=85',
    topic: 'Ghế công thái học',
    title: 'Ghế công thái học',
    subtitle: 'Bảo vệ cột sống cho dân văn phòng ngồi 8+ giờ/ngày.',
    ctaHref: '/danh-muc/ghe-cong-thai-hoc',
  },
  {
    image: 'https://images.unsplash.com/photo-1541558869434-2840d308329a?w=2000&q=85',
    topic: 'Ghế giám đốc',
    title: 'Ghế giám đốc cao cấp',
    subtitle: 'Da chính hãng, khung bền — đẳng cấp cho phòng giám đốc.',
    ctaHref: '/danh-muc/ghe-da-giam-doc',
  },
  {
    image: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=2000&q=85',
    topic: 'Bàn nâng hạ',
    title: 'Bàn nâng hạ thông minh',
    subtitle: 'Đứng — ngồi linh hoạt, giảm đau lưng và tăng năng suất.',
    ctaHref: '/danh-muc/ban-nang-ha-thong-minh',
  },
  {
    image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=2000&q=85',
    topic: 'Phòng họp & tủ hồ sơ',
    title: 'Đồng bộ phòng họp',
    subtitle: 'Bàn họp, ghế hội nghị và tủ hồ sơ chuẩn doanh nghiệp.',
    ctaHref: '/nhom/ban',
  },
  {
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=2000&q=85',
    topic: 'Doanh nghiệp & dự án',
    title: 'Giải pháp văn phòng cho doanh nghiệp',
    subtitle: 'Tư vấn, báo giá và đồng bộ sản phẩm cho dự án văn phòng.',
    ctaHref: '/bao-gia-b2b',
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
    if (diff > threshold) {
      setIndex((i) => (i - 1 + total) % total)
    } else if (diff < -threshold) {
      setIndex((i) => (i + 1) % total)
    }
    touchStartX.current = null
    window.setTimeout(() => setPaused(false), 200)
  }

  return (
    <div
      className="relative overflow-hidden bg-[#0F172A] h-[340px] sm:h-[420px] md:h-[520px] lg:h-[580px]"
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
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            sizes="100vw"
            className="object-cover"
            priority={i === 0}
            unoptimized
          />
          {/* Gradient navy đáy + side cho text đọc rõ */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to top, rgba(15,23,42,0.72) 0%, rgba(15,23,42,0.35) 45%, rgba(15,23,42,0.10) 75%, rgba(15,23,42,0) 100%)',
            }}
            aria-hidden="true"
          />

          {/* Text + CTA */}
          <div className="absolute inset-x-0 bottom-0 z-10">
            <div className="container-custom pb-10 md:pb-16">
              <div className="max-w-xl text-white">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/15 backdrop-blur rounded-full text-[11px] md:text-xs font-semibold uppercase tracking-wider mb-3">
                  OFINA · {slide.topic}
                </div>
                <h2 className="text-[26px] sm:text-[32px] md:text-[42px] lg:text-[50px] font-bold leading-[1.1] mb-2 drop-shadow-md">
                  {slide.title}
                </h2>
                <p className="text-[14px] sm:text-base md:text-lg opacity-95 mb-4 md:mb-6 max-w-md drop-shadow">
                  {slide.subtitle}
                </p>
                <Link
                  href={slide.ctaHref}
                  className="inline-flex items-center gap-2 px-5 py-2.5 md:px-6 md:py-3 bg-white text-gray-900 text-sm md:text-[15px] font-semibold rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Xem sản phẩm
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Dots indicator */}
      <div
        className="absolute left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 md:gap-2"
        style={{ bottom: 'max(16px, env(safe-area-inset-bottom))' }}
      >
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`h-1.5 md:h-[7px] rounded-full transition-all duration-300 ${
              i === index
                ? 'w-7 md:w-9 bg-white'
                : 'w-1.5 md:w-2 bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Chuyển sang slide ${i + 1}`}
            aria-current={i === index}
          />
        ))}
      </div>
    </div>
  )
}
