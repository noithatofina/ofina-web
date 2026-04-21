import Link from 'next/link'
import { requireStaff } from '@/lib/auth-guard'
import { createAdminClient } from '@/lib/supabase-admin'

export const dynamic = 'force-dynamic'

const POLICIES: Array<{ slug: string; label: string }> = [
  { slug: 'doi-tra', label: 'Đổi trả hàng' },
  { slug: 'bao-hanh', label: 'Bảo hành' },
  { slug: 'van-chuyen', label: 'Vận chuyển' },
  { slug: 'thanh-toan', label: 'Thanh toán' },
  { slug: 'bao-mat', label: 'Bảo mật' },
  { slug: 'dieu-khoan', label: 'Điều khoản sử dụng' },
]

export default async function ChinhSachListPage() {
  await requireStaff({ requireAdmin: true })
  const admin = createAdminClient()
  const { data: rows } = await admin
    .from('site_settings')
    .select('key, updated_at')
    .like('key', 'policy.%')

  const updatedByKey = new Map<string, string>()
  for (const r of rows || []) {
    if (r.updated_at) updatedByKey.set(r.key, r.updated_at)
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-4">
        <Link href="/admin/giao-dien" className="text-sm text-neutral-600 hover:text-blue-600">
          ← Quản lý giao diện
        </Link>
      </div>
      <h1 className="text-2xl font-bold mb-2">Các trang Chính sách</h1>
      <p className="text-sm text-neutral-600 mb-6">
        6 trang chính sách pháp lý tại <span className="font-mono">ofina.vn/chinh-sach/[slug]</span>
      </p>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {POLICIES.map((p, i) => {
          const updated = updatedByKey.get(`policy.${p.slug}`)
          return (
            <Link
              key={p.slug}
              href={`/admin/giao-dien/chinh-sach/${p.slug}`}
              className={`flex items-center justify-between p-4 hover:bg-neutral-50 ${i > 0 ? 'border-t' : ''}`}
            >
              <div>
                <div className="font-medium">{p.label}</div>
                <div className="text-xs text-neutral-500 font-mono">/chinh-sach/{p.slug}</div>
              </div>
              <div className="flex items-center gap-3">
                {updated && (
                  <span className="text-xs text-neutral-500">
                    Cập nhật: {new Date(updated).toLocaleDateString('vi-VN')}
                  </span>
                )}
                <span className="text-blue-600 text-sm">Sửa →</span>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
