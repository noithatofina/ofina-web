'use client'

import { usePathname } from 'next/navigation'
import { Header } from './Header'
import { Footer } from './Footer'
import { FloatingActions } from './FloatingActions'
import type { ShopChromeSettings } from '@/lib/shop-chrome-context'

export function ShopChrome({
  children,
  settings,
}: {
  children: React.ReactNode
  settings?: ShopChromeSettings
}) {
  const pathname = usePathname()
  const isAdmin = pathname?.startsWith('/admin')

  if (isAdmin) return <>{children}</>

  return (
    <>
      <Header
        topbarMessages={settings?.topbar?.messages}
        contact={settings?.contact}
        logoUrl={settings?.branding?.logo_url}
      />
      <main className="min-h-screen">{children}</main>
      <Footer
        contact={settings?.contact}
        branches={settings?.branches}
      />
      {/* Spacer mobile: tránh sticky bottom bar che footer */}
      <div className="md:hidden" style={{ height: 64 }} aria-hidden="true" />
      <FloatingActions contact={settings?.contact} />
    </>
  )
}
