import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase-admin'

export const dynamic = 'force-dynamic'

type SP = { q?: string; status?: string; page?: string }

const PER_PAGE = 30

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<SP>
}) {
  const sp = await searchParams
  const q = (sp.q || '').trim()
  const status = sp.status || ''
  const page = Math.max(1, parseInt(sp.page || '1', 10))
  const from = (page - 1) * PER_PAGE
  const to = from + PER_PAGE - 1

  const admin = createAdminClient()
  let query = admin
    .from('products')
    .select('id,ofina_sku,name,price,status,is_featured,is_bestseller,is_new,is_sale,in_stock,updated_at,product_images(url,is_primary)', { count: 'exact' })
    .order('updated_at', { ascending: false })
    .range(from, to)

  if (q) {
    query = query.or(`name.ilike.%${q}%,ofina_sku.ilike.%${q}%`)
  }
  if (status) {
    query = query.eq('status', status)
  }

  const { data: products, count, error } = await query

  const totalPages = Math.max(1, Math.ceil((count || 0) / PER_PAGE))

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Sản phẩm ({count?.toLocaleString() ?? 0})</h1>
        <Link
          href="/admin/products/new"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm"
        >
          + Thêm sản phẩm
        </Link>
      </div>

      <form className="flex gap-3 mb-4" method="get">
        <input
          name="q"
          defaultValue={q}
          placeholder="Tìm theo tên / SKU OFINA..."
          className="flex-1 px-3 py-2 border border-neutral-300 rounded-lg"
        />
        <select
          name="status"
          defaultValue={status}
          className="px-3 py-2 border border-neutral-300 rounded-lg bg-white"
        >
          <option value="">Tất cả trạng thái</option>
          <option value="active">Active</option>
          <option value="draft">Draft</option>
          <option value="archived">Archived</option>
        </select>
        <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium">
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
              <th className="text-left px-3 py-2 w-16">Ảnh</th>
              <th className="text-left px-3 py-2">Tên</th>
              <th className="text-left px-3 py-2">SKU OFINA</th>
              <th className="text-right px-3 py-2">Giá</th>
              <th className="text-center px-3 py-2">Status</th>
              <th className="text-center px-3 py-2">Flags</th>
            </tr>
          </thead>
          <tbody>
            {products?.map((p: any) => {
              const primary = p.product_images?.find((i: any) => i.is_primary) || p.product_images?.[0]
              return (
                <tr key={p.id} className="border-b hover:bg-neutral-50">
                  <td className="px-3 py-2">
                    {primary?.url ? (
                      <img src={primary.url} alt="" className="w-12 h-12 object-cover rounded" />
                    ) : (
                      <div className="w-12 h-12 bg-neutral-200 rounded" />
                    )}
                  </td>
                  <td className="px-3 py-2">
                    <Link href={`/admin/products/${p.id}`} className="font-medium hover:text-blue-600">
                      {p.name}
                    </Link>
                    {!p.in_stock && <span className="ml-2 text-xs text-red-600">Hết hàng</span>}
                  </td>
                  <td className="px-3 py-2 text-neutral-600 font-mono text-xs">{p.ofina_sku}</td>
                  <td className="px-3 py-2 text-right font-medium">{(p.price || 0).toLocaleString('vi-VN')}đ</td>
                  <td className="px-3 py-2 text-center">
                    <span className={`inline-block px-2 py-0.5 rounded text-xs ${
                      p.status === 'active' ? 'bg-green-100 text-green-700' :
                      p.status === 'draft' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-neutral-200 text-neutral-600'
                    }`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-center text-xs space-x-1">
                    {p.is_featured && <span className="inline-block px-1.5 py-0.5 bg-purple-100 text-purple-700 rounded">Nổi bật</span>}
                    {p.is_bestseller && <span className="inline-block px-1.5 py-0.5 bg-orange-100 text-orange-700 rounded">Bán chạy</span>}
                    {p.is_new && <span className="inline-block px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded">Mới</span>}
                    {p.is_sale && <span className="inline-block px-1.5 py-0.5 bg-red-100 text-red-700 rounded">Sale</span>}
                  </td>
                </tr>
              )
            })}
            {(!products || products.length === 0) && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-neutral-500">
                  Không có sản phẩm nào.
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
              href={`/admin/products?${new URLSearchParams({ ...(q && { q }), ...(status && { status }), page: String(page - 1) })}`}
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
              href={`/admin/products?${new URLSearchParams({ ...(q && { q }), ...(status && { status }), page: String(page + 1) })}`}
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
