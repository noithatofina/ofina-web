import type { Metadata } from 'next'
import Link from 'next/link'
import { createServerSupabase } from '@/lib/supabase'
import { getUserRole } from '@/lib/supabase-admin'
import { logoutAction } from './login/actions'

export const metadata: Metadata = {
  title: 'OFINA Admin',
  robots: { index: false, follow: false },
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  const role = await getUserRole(user?.email)

  // If no role (e.g. on /admin/login) — render children without shell.
  if (!user || !role) {
    return <>{children}</>
  }

  const isAdmin = role === 'admin'

  return (
    <div className="min-h-screen flex bg-neutral-50">
      <aside className="w-60 bg-neutral-900 text-white flex flex-col">
        <div className="p-5 border-b border-neutral-800">
          <div className="font-bold text-lg">OFINA Admin</div>
          <div className="text-xs text-neutral-400 mt-1 truncate">{user.email}</div>
          <div className="text-[10px] text-blue-300 mt-1 uppercase tracking-wider">
            {isAdmin ? 'Quản trị viên' : 'Biên tập viên'}
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-4 overflow-y-auto">
          <div>
            <div className="text-[10px] text-neutral-500 uppercase tracking-wider mb-2 px-3">Nội dung</div>
            <Link href="/admin/products" className="block px-3 py-2 rounded hover:bg-neutral-800 text-sm">
              Sản phẩm
            </Link>
            <Link href="/admin/blog" className="block px-3 py-2 rounded hover:bg-neutral-800 text-sm">
              Bài viết blog
            </Link>
          </div>

          <div>
            <div className="text-[10px] text-neutral-500 uppercase tracking-wider mb-2 px-3">Giao diện</div>
            <Link href="/admin/giao-dien/home" className="block px-3 py-2 rounded hover:bg-neutral-800 text-sm">
              Trang chủ
            </Link>
            <Link href="/admin/giao-dien/khuyen-mai" className="block px-3 py-2 rounded hover:bg-neutral-800 text-sm">
              Trang khuyến mãi
            </Link>
            {isAdmin && (
              <>
                <Link href="/admin/giao-dien/lien-he" className="block px-3 py-2 rounded hover:bg-neutral-800 text-sm">
                  Thông tin liên hệ
                </Link>
                <Link href="/admin/giao-dien/gioi-thieu" className="block px-3 py-2 rounded hover:bg-neutral-800 text-sm">
                  Trang Giới thiệu
                </Link>
                <Link href="/admin/giao-dien/branding" className="block px-3 py-2 rounded hover:bg-neutral-800 text-sm">
                  Logo &amp; Branding
                </Link>
              </>
            )}
          </div>

          {isAdmin && (
            <div>
              <div className="text-[10px] text-neutral-500 uppercase tracking-wider mb-2 px-3">Quản trị</div>
              <Link href="/admin/users" className="block px-3 py-2 rounded hover:bg-neutral-800 text-sm">
                Người dùng
              </Link>
            </div>
          )}
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
