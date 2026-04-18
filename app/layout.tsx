import type { Metadata } from 'next'
import './globals.css'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { FloatingActions } from '@/components/layout/FloatingActions'

export const metadata: Metadata = {
  title: {
    default: 'OFINA — Nội Thất Văn Phòng Việt Nam | Chuẩn Quốc Tế, Giá Hợp Lý',
    template: '%s | OFINA'
  },
  description: 'OFINA cung cấp nội thất văn phòng cao cấp: ghế văn phòng, bàn làm việc, tủ hồ sơ, sofa văn phòng. Miễn phí giao HCM, bảo hành 2 năm, giá tốt nhất thị trường.',
  keywords: ['nội thất văn phòng', 'ghế văn phòng', 'bàn làm việc', 'tủ hồ sơ', 'sofa văn phòng', 'OFINA'],
  authors: [{ name: 'OFINA' }],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://ofina.vn'),
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    url: 'https://ofina.vn',
    siteName: 'OFINA',
    title: 'OFINA — Nội Thất Văn Phòng Việt Nam',
    description: 'Nội thất văn phòng chuẩn quốc tế, giá hợp lý cho người Việt.',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@300;400;500;600;700;800&family=Playfair+Display:wght@700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <FloatingActions />
      </body>
    </html>
  )
}
