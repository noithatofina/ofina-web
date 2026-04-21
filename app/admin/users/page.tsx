import Link from 'next/link'
import { requireStaff } from '@/lib/auth-guard'
import { createAdminClient } from '@/lib/supabase-admin'

export const dynamic = 'force-dynamic'

export default async function UsersPage() {
  await requireStaff({ requireAdmin: true })

  const admin = createAdminClient()
  const { data: users, error } = await admin
    .from('admin_users')
    .select('email, role, created_at')
    .order('role')
    .order('email')

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">Quản lý người dùng</h1>
      <p className="text-sm text-neutral-600 mb-6">
        Tài khoản có quyền truy cập admin panel. Thêm/đổi role — coming soon (sprint tiếp).
      </p>

      {error && /relation.*does not exist/i.test(error.message) && (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800 mb-4">
          ⚠️ Bảng <span className="font-mono">admin_users</span> chưa được tạo trong Supabase.
          Chạy file SQL migration <span className="font-mono">database/migrations/001_site_settings_and_users.sql</span> tại Supabase SQL Editor.
        </div>
      )}

      {error && !/relation.*does not exist/i.test(error.message) && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 mb-4">
          Lỗi: {error.message}
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-neutral-100 border-b">
            <tr>
              <th className="text-left px-4 py-2">Email</th>
              <th className="text-left px-4 py-2 w-36">Role</th>
              <th className="text-left px-4 py-2 w-48">Tạo lúc</th>
            </tr>
          </thead>
          <tbody>
            {users?.map((u: any) => (
              <tr key={u.email} className="border-b">
                <td className="px-4 py-2 font-mono">{u.email}</td>
                <td className="px-4 py-2">
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-xs ${
                      u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {u.role === 'admin' ? 'Quản trị viên' : 'Biên tập viên'}
                  </span>
                </td>
                <td className="px-4 py-2 text-neutral-600 text-xs">
                  {u.created_at ? new Date(u.created_at).toLocaleString('vi-VN') : ''}
                </td>
              </tr>
            ))}
            {(!users || users.length === 0) && !error && (
              <tr>
                <td colSpan={3} className="px-4 py-6 text-center text-neutral-500">
                  Chưa có user trong DB.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
