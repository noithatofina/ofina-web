'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'

type Slide = {
  image: string
  alt: string
  href: string
}

const STORAGE = 'https://ivxdwqsqveqsjcsdvewq.supabase.co/storage/v1/object/public/branding/hero-slider'

/**
 * 5 banner OFINA tự thiết kế. Mỗi ảnh đã có headline + subtitle + CTA
 * in sẵn trong design — slider chỉ render ảnh full + dots + click navigate.
 */
const SLIDES: Slide[] = [
  {
    image: `${STORAGE}/noi-that-van-phong-chuan-ofina.png`,
    alt: 'Nội thất văn phòng chuẩn — ghế công thái học, ghế giám đốc, bàn làm việc OFINA',
    href: '/san-pham',
  },
  {
    image: `${STORAGE}/ghe-cong-thai-hoc-giam-doc-ofina.png`,
    alt: 'Ghế công thái học và ghế giám đốc cao cấp — trải nghiệm làm việc tốt mỗi ngày — OFINA',
    href: '/danh-muc/ghe-cong-thai-hoc',
  },
  {
    image: `${STORAGE}/van-phong-chuyen-nghiep-ofina.png`,
    alt: 'Văn phòng chuyên nghiệp — giải pháp nội thất cho cá nhân, doanh nghiệp và dự án — OFINA',
    href: '/bao-gia-b2b',
  },
  {
    image: `${STORAGE}/giai-phap-van-phong-doanh-nghiep-ofina.png`,
    alt: 'Đủ giải pháp nội thất văn phòng — bàn làm việc, tủ kệ, sofa văn phòng cho doanh nghiệp — OFINA',
    href: '/bao-gia-b2b',
  },
  {
    image: `${STORAGE}/phong-hop-noi-that-cao-cap-ofina.png`,
    alt: 'Phòng họp nội thất cao cấp — không gian làm việc đẹp cho doanh nghiệp chuyên nghiệp — OFINA',
    href: '/danh-muc/ban-hop-van-phong-chan-sat',
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
      className="relative overflow-hidden bg-[#F7F9FC] aspect-[16/9] sm:aspect-[16/9] md:aspect-[21/9] lg:aspect-[21/9]"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      role="region"
      aria-label="Banner OFINA"
    >
      {SLIDES.map((slide, i) => (
        <Link
          key={i}
          href={slide.href}
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
            i === index ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
          }`}
          aria-hidden={i !== index}
        >
          <Image
            src={slide.image}
            alt={slide.alt}
            fill
            sizes="100vw"
            className="object-cover"
            priority={i === 0}
            unoptimized
          />
        </Link>
      ))}

      {/* Dots indicator */}
      <div
        className="absolute left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 md:gap-2"
        style={{ bottom: 'max(12px, env(safe-area-inset-bottom))' }}
      >
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`h-1.5 md:h-2 rounded-full transition-all duration-300 ${
              i === index
                ? 'w-7 md:w-9 bg-gray-900/85 shadow-sm'
                : 'w-1.5 md:w-2 bg-gray-900/35 hover:bg-gray-900/55'
            }`}
            aria-label={`Chuyển sang slide ${i + 1}`}
            aria-current={i === index}
          />
        ))}
      </div>
    </div>
  )
}
