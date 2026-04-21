import Link from 'next/link'
import { notFound } from 'next/navigation'
import { requireStaff } from '@/lib/auth-guard'
import { createAdminClient } from '@/lib/supabase-admin'
import { updateOrderAction } from './actions'

export const dynamic = 'force-dynamic'

const STATUS_LABELS: Record<string, { label: string; cls: string }> = {
  new: { label: 'Mới', cls: 'bg-blue-100 text-blue-700' },
  confirmed: { label: 'Đã xác nhận', cls: 'bg-purple-100 text-purple-700' },
  shipping: { label: 'Đang giao', cls: 'bg-amber-100 text-amber-700' },
  delivered: { label: 'Đã giao', cls: 'bg-green-100 text-green-700' },
  cancelled: { label: 'Đã huỷ', cls: 'bg-neutral-200 text-neutral-600' },
}

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  await requireStaff()
  const { id } = await params
  const admin = createAdminClient()

  const { data: order } = await admin.from('orders').select('*').eq('id', id).single()
  if (!order) notFound()

  const { data: items } = await admin
    .from('order_items')
    .select('*')
    .eq('order_id', id)
    .order('id')

  async function update(formData: FormData) {
    'use server'
    await updateOrderAction(id, formData)
  }

  const st = STATUS_LABELS[order.status] || STATUS_LABELS.new
  const addr = [order.address_line, order.ward, order.district, order.city]
    .filter(Boolean)
    .join(', ')

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-4 flex items-center justify-between">
        <Link href="/admin/orders" className="text-sm text-neutral-600 hover:text-blue-600">
          ← Danh sách đơn hàng
        </Link>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${st.cls}`}>
          {st.label}
        </span>
      </div>

      <h1 className="text-2xl font-bold mb-1">
        Đơn hàng <span className="font-mono">#{order.order_number}</span>
      </h1>
      <div className="text-sm text-neutral-500 mb-6">
        Đặt lúc {new Date(order.created_at).toLocaleString('vi-VN')}
      </div>

      <div className="grid lg:grid-cols-[1fr_380px] gap-6">
        {/* Main: items + customer */}
        <div className="space-y-6">
          <section className="bg-white rounded-lg shadow p-5">
            <h2 className="font-bold mb-3">Sản phẩm ({items?.length || 0})</h2>
            <table className="w-full text-sm">
              <thead className="text-xs text-neutral-500 border-b">
                <tr>
                  <th className="text-left py-2">Tên</th>
                  <th className="text-center py-2 w-20">SL</th>
                  <th className="text-right py-2 w-28">Đơn giá</th>
                  <th className="text-right py-2 w-32">Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                {items?.map((i: any) => (
                  <tr key={i.id} className="border-b">
                    <td className="py-3">
                      <Link
                        href={`/admin/products/${i.product_id}`}
                        className="font-medium hover:text-blue-600"
                      >
                        {i.product_name}
                      </Link>
                      <div className="text-xs text-neutral-500 font-mono">{i.product_sku}</div>
                    </td>
                    <td className="py-3 text-center">{i.quantity}</td>
                    <td className="py-3 text-right">{i.price.toLocaleString('vi-VN')}đ</td>
                    <td className="py-3 text-right font-medium">
                      {i.subtotal.toLocaleString('vi-VN')}đ
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="text-sm">
                <tr>
                  <td colSpan={3} className="text-right py-2 text-neutral-600">
                    Tạm tính
                  </td>
                  <td className="text-right py-2">{order.subtotal.toLocaleString('vi-VN')}đ</td>
                </tr>
                <tr>
                  <td colSpan={3} className="text-right py-1 text-neutral-600">
                    Phí ship
                  </td>
                  <td className="text-right py-1">
                    {(order.shipping_fee || 0).toLocaleString('vi-VN')}đ
                  </td>
                </tr>
                {order.discount > 0 && (
                  <tr>
                    <td colSpan={3} className="text-right py-1 text-neutral-600">
                      Giảm {order.coupon_code && `(${order.coupon_code})`}
                    </td>
                    <td className="text-right py-1 text-red-600">
                      -{order.discount.toLocaleString('vi-VN')}đ
                    </td>
                  </tr>
                )}
                <tr className="border-t">
                  <td colSpan={3} className="text-right py-2 font-bold">
                    Tổng cộng
                  </td>
                  <td className="text-right py-2 font-bold text-lg text-red-600">
                    {order.total.toLocaleString('vi-VN')}đ
                  </td>
                </tr>
              </tfoot>
            </table>
          </section>

          <section className="bg-white rounded-lg shadow p-5">
            <h2 className="font-bold mb-3">Thông tin khách hàng</h2>
            <dl className="grid grid-cols-[140px_1fr] gap-y-2 text-sm">
              <dt className="text-neutral-500">Họ tên</dt>
              <dd className="font-medium">{order.customer_name}</dd>
              <dt className="text-neutral-500">Điện thoại</dt>
              <dd>
                <a href={`tel:${order.customer_phone}`} className="text-blue-600 hover:underline">
                  {order.customer_phone}
                </a>
              </dd>
              {order.customer_email && (
                <>
                  <dt className="text-neutral-500">Email</dt>
                  <dd>
                    <a
                      href={`mailto:${order.customer_email}`}
                      className="text-blue-600 hover:underline"
                    >
                      {order.customer_email}
                    </a>
                  </dd>
                </>
              )}
              <dt className="text-neutral-500">Địa chỉ</dt>
              <dd>{addr}</dd>
              {order.note && (
                <>
                  <dt className="text-neutral-500">Ghi chú KH</dt>
                  <dd className="italic">{order.note}</dd>
                </>
              )}
            </dl>
          </section>
        </div>

        {/* Sidebar: status update */}
        <aside>
          <form action={update} className="bg-white rounded-lg shadow p-5 space-y-4 sticky top-4">
            <h2 className="font-bold">Cập nhật đơn hàng</h2>

            <div>
              <label className="block text-sm font-medium mb-1">Trạng thái đơn</label>
              <select
                name="status"
                defaultValue={order.status}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg bg-white"
              >
                <option value="new">Mới</option>
                <option value="confirmed">Đã xác nhận</option>
                <option value="shipping">Đang giao</option>
                <option value="delivered">Đã giao</option>
                <option value="cancelled">Đã huỷ</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Trạng thái thanh toán</label>
              <select
                name="payment_status"
                defaultValue={order.payment_status}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg bg-white"
              >
                <option value="pending">Chưa thanh toán</option>
                <option value="paid">Đã thanh toán</option>
                <option value="failed">Thất bại</option>
              </select>
              <p className="text-xs text-neutral-500 mt-1">
                Phương thức: <strong>{order.payment_method}</strong>
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Ghi chú nội bộ</label>
              <textarea
                name="admin_note"
                rows={3}
                defaultValue={order.admin_note || ''}
                placeholder="VD: đã gọi xác nhận, khách chọn giao chiều..."
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm"
              />
              <p className="text-xs text-neutral-500 mt-1">Khách không thấy ghi chú này.</p>
            </div>

            <button
              type="submit"
              className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
            >
              Lưu thay đổi
            </button>

            <div className="pt-3 border-t">
              <Link
                href={`/tra-cuu-don-hang?order=${order.order_number}&phone=${order.customer_phone}`}
                target="_blank"
                className="text-sm text-blue-600 hover:underline"
              >
                Xem dưới góc nhìn khách ↗
              </Link>
            </div>
          </form>
        </aside>
      </div>
    </div>
  )
}
