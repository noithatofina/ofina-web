import Link from 'next/link'
import { requireStaff } from '@/lib/auth-guard'
import { createAdminClient } from '@/lib/supabase-admin'

export const dynamic = 'force-dynamic'

const STATUS_LABELS: Record<string, { label: string; cls: string }> = {
  new: { label: 'Mới', cls: 'bg-blue-100 text-blue-700' },
  confirmed: { label: 'Đã xác nhận', cls: 'bg-purple-100 text-purple-700' },
  shipping: { label: 'Đang giao', cls: 'bg-amber-100 text-amber-700' },
  delivered: { label: 'Đã giao', cls: 'bg-green-100 text-green-700' },
  cancelled: { label: 'Đã huỷ', cls: 'bg-neutral-200 text-neutral-600' },
}

const PAYMENT_LABELS: Record<string, { label: string; cls: string }> = {
  pending: { label: 'Chưa thanh toán', cls: 'bg-neutral-100 text-neutral-700' },
  paid: { label: 'Đã thanh toán', cls: 'bg-green-100 text-green-700' },
  failed: { label: 'Thất bại', cls: 'bg-red-100 text-red-700' },
}

const PER_PAGE = 30

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; page?: string }>
}) {
  await requireStaff()
  const sp = await searchParams
  const q = (sp.q || '').trim()
  const status = sp.status || ''
  const page = Math.max(1, parseInt(sp.page || '1', 10))
  const from = (page - 1) * PER_PAGE
  const to = from + PER_PAGE - 1

  const admin = createAdminClient()
  let query = admin
    .from('orders')
    .select(
      'id, order_number, customer_name, customer_phone, city, total, payment_method, payment_status, status, created_at',
      { count: 'exact' },
    )
    .order('created_at', { ascending: false })
    .range(from, to)

  if (q) {
    query = query.or(
      `order_number.ilike.%${q}%,customer_name.ilike.%${q}%,customer_phone.ilike.%${q}%`,
    )
  }
  if (status) query = query.eq('status', status)

  const { data: orders, count, error } = await query
  const totalPages = Math.max(1, Math.ceil((count || 0) / PER_PAGE))

  // Aggregate stats
  const { data: statsRaw } = await admin
    .from('orders')
    .select('status, total')

  const stats = {
    total: statsRaw?.length || 0,
    new: statsRaw?.filter((o: any) => o.status === 'new').length || 0,
    revenue: statsRaw
      ?.filter((o: any) => o.status === 'delivered')
      .reduce((s: number, o: any) => s + (o.total || 0), 0) || 0,
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Đơn hàng ({count?.toLocaleString() ?? 0})</h1>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <StatCard label="Tổng đơn" value={stats.total.toLocaleString('vi-VN')} />
        <StatCard label="Đơn mới (chưa xác nhận)" value={stats.new.toLocaleString('vi-VN')} highlight={stats.new > 0} />
        <StatCard label="Doanh thu (đã giao)" value={`${stats.revenue.toLocaleString('vi-VN')}đ`} />
      </div>

      {/* Filters */}
      <form className="flex gap-3 mb-4" method="get">
        <input
          name="q"
          defaultValue={q}
          placeholder="Tìm theo mã đơn / tên KH / SĐT..."
          className="flex-1 px-3 py-2 border border-neutral-300 rounded-lg"
        />
        <select
          name="status"
          defaultValue={status}
          className="px-3 py-2 border border-neutral-300 rounded-lg bg-white"
        >
          <option value="">Tất cả trạng thái</option>
          <option value="new">Mới</option>
          <option value="confirmed">Đã xác nhận</option>
          <option value="shipping">Đang giao</option>
          <option value="delivered">Đã giao</option>
          <option value="cancelled">Đã huỷ</option>
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
              <th className="text-left px-3 py-2">Mã đơn</th>
              <th className="text-left px-3 py-2">Khách hàng</th>
              <th className="text-left px-3 py-2 w-32">Địa điểm</th>
              <th className="text-right px-3 py-2 w-32">Tổng</th>
              <th className="text-center px-3 py-2 w-36">Thanh toán</th>
              <th className="text-center px-3 py-2 w-36">Trạng thái</th>
              <th className="text-left px-3 py-2 w-36">Thời gian</th>
            </tr>
          </thead>
          <tbody>
            {orders?.map((o: any) => {
              const st = STATUS_LABELS[o.status] || STATUS_LABELS.new
              const pm = PAYMENT_LABELS[o.payment_status] || PAYMENT_LABELS.pending
              return (
                <tr key={o.id} className="border-b hover:bg-neutral-50">
                  <td className="px-3 py-2">
                    <Link
                      href={`/admin/orders/${o.id}`}
                      className="font-mono font-medium text-blue-600 hover:underline"
                    >
                      #{o.order_number}
                    </Link>
                  </td>
                  <td className="px-3 py-2">
                    <div className="font-medium">{o.customer_name}</div>
                    <div className="text-xs text-neutral-500">{o.customer_phone}</div>
                  </td>
                  <td className="px-3 py-2 text-neutral-600 text-xs">{o.city}</td>
                  <td className="px-3 py-2 text-right font-medium">
                    {(o.total || 0).toLocaleString('vi-VN')}đ
                  </td>
                  <td className="px-3 py-2 text-center">
                    <span className={`inline-block px-2 py-0.5 rounded text-xs ${pm.cls}`}>
                      {pm.label}
                    </span>
                    <div className="text-[10px] text-neutral-500 mt-0.5">{o.payment_method}</div>
                  </td>
                  <td className="px-3 py-2 text-center">
                    <span className={`inline-block px-2 py-0.5 rounded text-xs ${st.cls}`}>
                      {st.label}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-neutral-600 text-xs">
                    {o.created_at
                      ? new Date(o.created_at).toLocaleString('vi-VN', {
                          day: '2-digit',
                          month: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : ''}
                  </td>
                </tr>
              )
            })}
            {(!orders || orders.length === 0) && (
              <tr>
                <td colSpan={7} className="p-8 text-center text-neutral-500">
                  Chưa có đơn hàng nào.
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
              href={`/admin/orders?${new URLSearchParams({
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
              href={`/admin/orders?${new URLSearchParams({
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

function StatCard({
  label,
  value,
  highlight,
}: {
  label: string
  value: string
  highlight?: boolean
}) {
  return (
    <div
      className={`p-4 rounded-lg shadow bg-white ${
        highlight ? 'border-2 border-orange-400' : ''
      }`}
    >
      <div className="text-xs text-neutral-500 mb-1">{label}</div>
      <div className={`text-2xl font-bold ${highlight ? 'text-orange-600' : ''}`}>{value}</div>
    </div>
  )
}
