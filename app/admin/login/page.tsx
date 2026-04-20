import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createServerSupabase } from '@/lib/supabase'
import { loginAction } from './actions'

export const metadata: Metadata = { title: 'Đăng nhập quản trị · OFINA' }

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string; error?: string }>
}) {
  const sp = await searchParams
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (user) redirect(sp.redirect || '/admin/products')

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-bold mb-2">OFINA Admin</h1>
        <p className="text-neutral-600 text-sm mb-6">Đăng nhập để quản lý sản phẩm</p>
        {sp.error === 'forbidden' && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded text-sm">
            Tài khoản này không có quyền truy cập trang quản trị.
          </div>
        )}
        {sp.error === 'invalid' && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded text-sm">
            Email hoặc mật khẩu không đúng.
          </div>
        )}
        <form action={loginAction} className="space-y-4">
          <input type="hidden" name="redirect" value={sp.redirect || '/admin/products'} />
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              name="email"
              type="email"
              required
              autoComplete="email"
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="content@ofina.vn"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Mật khẩu</label>
            <input
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition"
          >
            Đăng nhập
          </button>
        </form>
      </div>
    </div>
  )
}
