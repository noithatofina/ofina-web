import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase-admin'

export const dynamic = 'force-dynamic'

const PER_PAGE = 30

export default async function AdminBlogPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; page?: string }>
}) {
  const sp = await searchParams
  const q = (sp.q || '').trim()
  const status = sp.status || ''
  const page = Math.max(1, parseInt(sp.page || '1', 10))
  const from = (page - 1) * PER_PAGE
  const to = from + PER_PAGE - 1

  const admin = createAdminClient()
  let query = admin
    .from('blog_posts')
    .select('id,slug,title,excerpt,cover_image,category,is_published,published_at,updated_at', {
      count: 'exact',
    })
    .order('updated_at', { ascending: false })
    .range(from, to)

  if (q) query = query.or(`title.ilike.%${q}%,slug.ilike.%${q}%`)
  if (status === 'published') query = query.eq('is_published', true)
  if (status === 'draft') query = query.eq('is_published', false)

  const { data: posts, count, error } = await query
  const totalPages = Math.max(1, Math.ceil((count || 0) / PER_PAGE))

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Bài viết blog ({count?.toLocaleString() ?? 0})</h1>
        <Link
          href="/admin/blog/new"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm"
        >
          + Viết bài mới
        </Link>
      </div>

      <form className="flex gap-3 mb-4" method="get">
        <input
          name="q"
          defaultValue={q}
          placeholder="Tìm theo tiêu đề / slug..."
          className="flex-1 px-3 py-2 border border-neutral-300 rounded-lg"
        />
        <select
          name="status"
          defaultValue={status}
          className="px-3 py-2 border border-neutral-300 rounded-lg bg-white"
        >
          <option value="">Tất cả</option>
          <option value="published">Đã đăng</option>
          <option value="draft">Nháp</option>
        </select>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
        >
          Tìm
        </button>
      </form>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded mb-4 text-sm">
          Lỗi: {error.message}
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-neutral-100 border-b">
            <tr>
              <th className="text-left px-3 py-2 w-24">Ảnh bìa</th>
              <th className="text-left px-3 py-2">Tiêu đề</th>
              <th className="text-left px-3 py-2 w-40">Danh mục</th>
              <th className="text-center px-3 py-2 w-28">Trạng thái</th>
              <th className="text-left px-3 py-2 w-36">Cập nhật</th>
            </tr>
          </thead>
          <tbody>
            {posts?.map((p: any) => (
              <tr key={p.id} className="border-b hover:bg-neutral-50">
                <td className="px-3 py-2">
                  {p.cover_image ? (
                    <img src={p.cover_image} alt="" className="w-20 h-12 object-cover rounded" />
                  ) : (
                    <div className="w-20 h-12 bg-neutral-200 rounded" />
                  )}
                </td>
                <td className="px-3 py-2">
                  <Link href={`/admin/blog/${p.id}`} className="font-medium hover:text-blue-600">
                    {p.title}
                  </Link>
                  <div className="text-xs text-neutral-500 font-mono mt-0.5">{p.slug}</div>
                </td>
                <td className="px-3 py-2 text-neutral-600">{p.category || '—'}</td>
                <td className="px-3 py-2 text-center">
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-xs ${
                      p.is_published
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {p.is_published ? 'Đã đăng' : 'Nháp'}
                  </span>
                </td>
                <td className="px-3 py-2 text-neutral-600 text-xs">
                  {p.updated_at ? new Date(p.updated_at).toLocaleString('vi-VN') : ''}
                </td>
              </tr>
            ))}
            {(!posts || posts.length === 0) && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-neutral-500">
                  Chưa có bài viết nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          {page > 1 && (
            <Link
              href={`/admin/blog?${new URLSearchParams({
                ...(q && { q }),
                ...(status && { status }),
                page: String(page - 1),
              })}`}
              className="px-3 py-1 border border-neutral-300 rounded hover:bg-neutral-100"
            >
              ← Trước
            </Link>
          )}
          <span className="text-sm text-neutral-600">
            Trang {page} / {totalPages}
          </span>
          {page < totalPages && (
            <Link
              href={`/admin/blog?${new URLSearchParams({
                ...(q && { q }),
                ...(status && { status }),
                page: String(page + 1),
              })}`}
              className="px-3 py-1 border border-neutral-300 rounded hover:bg-neutral-100"
            >
              Sau →
            </Link>
          )}
        </div>
      )}
    </div>
  )
}
