import Script from 'next/script'

/**
 * Google Analytics 4 tracking.
 * Chỉ render khi có env NEXT_PUBLIC_GA_ID (dạng G-XXXXXXXXXX).
 * Không track trên /admin/* (lọc bên trong gtag config).
 */
export function GoogleAnalytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID
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
