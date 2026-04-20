import type { Metadata } from 'next'
import Link from 'next/link'
import { createServerSupabase } from '@/lib/supabase'
import { isStaffEmail } from '@/lib/supabase-admin'
import { logoutAction } from './login/actions'

export const metadata: Metadata = {
  title: 'OFINA Admin',
  robots: { index: false, follow: false },
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()

  // If no user (e.g. on /admin/login) — render children without shell.
  // Middleware already guards authenticated admin routes.
  if (!user || !isStaffEmail(user.email)) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen flex bg-neutral-50">
      <aside className="w-60 bg-neutral-900 text-white flex flex-col">
        <div className="p-5 border-b border-neutral-800">
          <div className="font-bold text-lg">OFINA Admin</div>
          <div className="text-xs text-neutral-400 mt-1 truncate">{user.email}</div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <Link
            href="/admin/products"
            className="block px-3 py-2 rounded hover:bg-neutral-800 text-sm"
          >
            Sản phẩm
          </Link>
          <Link
            href="/admin/blog"
            className="block px-3 py-2 rounded hover:bg-neutral-800 text-sm"
          >
            Bài viết blog
          </Link>
        </nav>
        <form action={logoutAction} className="p-4 border-t border-neutral-800">
          <button
            type="submit"
            className="w-full text-left px-3 py-2 rounded hover:bg-neutral-800 text-sm text-neutral-300"
          >
            Đăng xuất
          </button>
        </form>
      </aside>
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
