import Link from 'next/link'
import { requireStaff } from '@/lib/auth-guard'
import { createAdminClient } from '@/lib/supabase-admin'
import { addUserAction, updateUserRoleAction, deleteUserAction } from './actions'

export const dynamic = 'force-dynamic'

const ERRORS: Record<string, string> = {
  invalid_email: 'Email không hợp lệ',
  invalid_role: 'Role không hợp lệ',
  db: 'Lỗi DB:',
}

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; msg?: string; ok?: string }>
}) {
  const { email: currentEmail } = await requireStaff({ requireAdmin: true })
  const sp = await searchParams
  const errorMsg = sp.error
    ? (ERRORS[sp.error] || 'Lỗi') + (sp.msg ? ` ${decodeURIComponent(sp.msg)}` : '')
    : null
  const okMsg = sp.ok === 'added' ? '✅ Đã thêm người dùng' : null

  const admin = createAdminClient()
  const { data: users, error } = await admin
    .from('admin_users')
    .select('email, role, created_at')
    .order('role', { ascending: false })
    .order('email')

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">Quản lý người dùng</h1>
      <p className="text-sm text-neutral-600 mb-6">
        Tài khoản có quyền truy cập admin panel. <strong>Admin</strong> có toàn quyền,{' '}
        <strong>Editor</strong> chỉ sửa nội dung (sản phẩm, blog, hero, khuyến mãi, FAQ).
      </p>

      {errorMsg && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {errorMsg}
        </div>
      )}
      {okMsg && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-800">
          {okMsg}
        </div>
      )}

      {/* Add user form */}
      <section className="bg-white rounded-lg shadow p-5 mb-6">
        <h2 className="font-bold mb-3">Thêm người dùng mới</h2>
        <p className="text-xs text-neutral-500 mb-3">
          ⚠️ Email phải đã được tạo tài khoản trước trong Supabase Auth (tự đăng ký hoặc admin invite qua Supabase Dashboard).
          Bảng này chỉ quản lý role — không tạo auth account.
        </p>
        <form action={addUserAction} className="grid md:grid-cols-[1fr_150px_auto] gap-3">
          <input
            name="email"
            type="email"
            required
            placeholder="nhanvien@ofina.vn"
            className="px-3 py-2 border border-neutral-300 rounded-lg"
          />
          <select
            name="role"
            defaultValue="editor"
            className="px-3 py-2 border border-neutral-300 rounded-lg bg-white"
          >
            <option value="editor">Editor (biên tập viên)</option>
            <option value="admin">Admin (quản trị viên)</option>
          </select>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium"
          >
            Thêm
          </button>
        </form>
      </section>

      {/* User list */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 mb-4">
          Lỗi: {error.message}
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-neutral-100 border-b">
            <tr>
              <th className="text-left px-4 py-2">Email</th>
              <th className="text-left px-4 py-2 w-48">Role</th>
              <th className="text-left px-4 py-2 w-40">Tạo lúc</th>
              <th className="text-right px-4 py-2 w-28"></th>
            </tr>
          </thead>
          <tbody>
            {users?.map((u: any) => {
              const isSelf = u.email.toLowerCase() === currentEmail.toLowerCase()
              return (
                <tr key={u.email} className="border-b">
                  <td className="px-4 py-2 font-mono">
                    {u.email}
                    {isSelf && <span className="ml-2 text-xs text-blue-600">(bạn)</span>}
                  </td>
                  <td className="px-4 py-2">
                    <form action={updateUserRoleAction} className="flex items-center gap-2">
                      <input type="hidden" name="email" value={u.email} />
                      <select
                        name="role"
                        defaultValue={u.role}
                        disabled={isSelf}
                        className="px-2 py-1 border border-neutral-300 rounded text-xs bg-white disabled:bg-neutral-100"
                      >
                        <option value="editor">Editor</option>
                        <option value="admin">Admin</option>
                      </select>
                      <button
                        type="submit"
                        disabled={isSelf}
                        className="px-2 py-1 text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 rounded disabled:opacity-50"
                      >
                        Lưu
                      </button>
                    </form>
                  </td>
                  <td className="px-4 py-2 text-neutral-600 text-xs">
                    {u.created_at ? new Date(u.created_at).toLocaleDateString('vi-VN') : ''}
                  </td>
                  <td className="px-4 py-2 text-right">
                    <form action={deleteUserAction}>
                      <input type="hidden" name="email" value={u.email} />
                      <button
                        type="submit"
                        disabled={isSelf}
                        className="px-2 py-1 text-xs bg-red-50 hover:bg-red-100 text-red-700 rounded disabled:opacity-30"
                        onClick={(e) => {
                          if (!confirm(`Xoá quyền admin của ${u.email}?`)) e.preventDefault()
                        }}
                      >
                        Xoá
                      </button>
                    </form>
                  </td>
                </tr>
              )
            })}
            {(!users || users.length === 0) && !error && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-neutral-500">
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
