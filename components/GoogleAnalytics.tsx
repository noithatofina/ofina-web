import Script from 'next/script'

/**
 * Google Analytics 4 tracking.
 * Ưu tiên env NEXT_PUBLIC_GA_ID (dạng G-XXXXXXXXXX); mặc định property OFINA
 * (tạo 25/09/2026, tài khoản GA của chủ site) vì Vercel env chưa truy cập được.
 * Không track trên /admin/* (lọc bên trong gtag config).
 */
export function GoogleAnalytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID || 'G-E21KNR2D3J'
  if (!gaId || !gaId.startsWith('G-')) return null

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}', {
            anonymize_ip: true,
            send_page_view: !window.location.pathname.startsWith('/admin'),
          });
        `}
      </Script>
    </>
  )
}
