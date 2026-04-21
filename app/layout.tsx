import type { Metadata } from 'next'
import './globals.css'
import { ShopChrome } from '@/components/layout/ShopChrome'
import { CartProvider } from '@/lib/cart'
import { Toaster } from 'react-hot-toast'
import { getSetting } from '@/lib/site-settings'
import type { ShopChromeSettings } from '@/lib/shop-chrome-context'
import { GoogleAnalytics } from '@/components/GoogleAnalytics'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://ofina.vn'
const HOTLINE = '0325669996'

export const metadata: Metadata = {
  title: {
    default: 'OFINA — Nội Thất Văn Phòng Cao Cấp Chính Hãng',
    template: '%s | OFINA'
  },
  description: 'OFINA cung cấp 2,400+ sản phẩm nội thất văn phòng chính hãng: ghế công thái học, bàn làm việc, tủ hồ sơ, sofa. Bảo hành 24 tháng, miễn phí giao Hà Nội/HCM.',
  keywords: ['nội thất văn phòng', 'ghế văn phòng', 'ghế công thái học', 'bàn làm việc', 'tủ hồ sơ', 'sofa văn phòng', 'nội thất văn phòng giá rẻ', 'OFINA'],
  authors: [{ name: 'OFINA' }],
  metadataBase: new URL(SITE_URL),
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    url: SITE_URL,
    siteName: 'OFINA',
    title: 'OFINA — Nội Thất Văn Phòng Cao Cấp Cho Doanh Nghiệp Việt',
    description: '2,400+ sản phẩm nội thất văn phòng chính hãng — bảo hành 24 tháng, miễn phí giao Hà Nội/HCM.',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'OFINA Nội thất văn phòng' }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@ofina_vn',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
}

const ORGANIZATION_LD = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'OFINA',
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  description: 'Nội thất văn phòng cao cấp, chính hãng — ghế, bàn, tủ, sofa cho doanh nghiệp Việt Nam.',
  contactPoint: [{
    '@type': 'ContactPoint',
    telephone: `+84${HOTLINE.slice(1)}`,
    contactType: 'customer service',
    areaServed: 'VN',
    availableLanguage: ['Vietnamese'],
  }],
  sameAs: [
    'https://facebook.com/ofina.vn',
    'https://zalo.me/0325669996',
  ],
}

const WEBSITE_LD = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'OFINA',
  url: SITE_URL,
  inLanguage: 'vi-VN',
  potentialAction: {
    '@type': 'SearchAction',
    target: { '@type': 'EntryPoint', urlTemplate: `${SITE_URL}/tim-kiem?q={search_term_string}` },
    'query-input': 'required name=search_term_string',
  },
}

const LOCAL_BUSINESS_LD = [
  {
    '@context': 'https://schema.org',
    '@type': 'FurnitureStore',
    name: 'OFINA — Trụ sở Hà Nội',
    image: `${SITE_URL}/showroom-hn.jpg`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: '135 đường K2',
      addressLocality: 'Phường Phú Đô',
      addressRegion: 'Hà Nội',
      addressCountry: 'VN',
    },
    telephone: `+84${HOTLINE.slice(1)}`,
    url: `${SITE_URL}/showroom`,
    openingHours: 'Mo-Su 08:00-18:00',
    priceRange: '$$',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FurnitureStore',
    name: 'OFINA — Chi nhánh TP.HCM',
    image: `${SITE_URL}/showroom-hcm.jpg`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Tầng 2, số 36 Lương Định Của',
      addressLocality: 'Quận 2',
      addressRegion: 'TP.HCM',
      addressCountry: 'VN',
    },
    telephone: `+84${HOTLINE.slice(1)}`,
    url: `${SITE_URL}/showroom`,
    openingHours: 'Mo-Su 08:00-18:00',
    priceRange: '$$',
  },
]

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [topbar, contact, branchesRaw, branding] = await Promise.all([
    getSetting<{ messages: string[] }>('home.topbar', { messages: [] }),
    getSetting<any>('contact.info', {}),
    getSetting<{ items: any[] }>('contact.branches', { items: [] }),
    getSetting<any>('branding', {}),
  ])
  const chromeSettings: ShopChromeSettings = {
    topbar,
    contact: contact.hotline ? contact : undefined,
    branches: branchesRaw.items,
    branding: branding.logo_url || branding.favicon_url || branding.og_image_url ? branding : undefined,
  }
  return (
    <html lang="vi">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANIZATION_LD) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(WEBSITE_LD) }} />
        {LOCAL_BUSINESS_LD.map((b, i) => (
          <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(b) }} />
        ))}
        <CartProvider>
          <ShopChrome settings={chromeSettings}>{children}</ShopChrome>
          <Toaster position="top-center" toastOptions={{ duration: 2500 }} />
        </CartProvider>
        <GoogleAnalytics />
      </body>
    </html>
  )
}
