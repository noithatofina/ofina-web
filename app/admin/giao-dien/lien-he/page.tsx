import Link from 'next/link'
import { requireStaff } from '@/lib/auth-guard'
import { getSetting } from '@/lib/site-settings'
import { updateContactInfoAction, updateBranchesAction } from '../actions'

export const dynamic = 'force-dynamic'

export default async function LienHeEditorPage() {
  await requireStaff({ requireAdmin: true })

  const info = await getSetting<any>('contact.info', {
    hotline: '',
    email: '',
    zalo_url: '',
    facebook_url: '',
    working_hours: '',
  })
  const branches = await getSetting<{ items: Array<{ name: string; address: string; phone: string; maps_query: string }> }>(
    'contact.branches',
    { items: [] },
  )

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-4">
        <Link href="/admin/giao-dien" className="text-sm text-neutral-600 hover:text-blue-600">
          ← Quản lý giao diện
        </Link>
      </div>
      <h1 className="text-2xl font-bold mb-2">Thông tin liên hệ</h1>
      <p className="text-sm text-neutral-600 mb-6">
        Hotline, email, social links, địa chỉ showroom. Ảnh hưởng toàn site (Header, Footer, chat widget).
      </p>

      <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 text-sm p-3 rounded-lg mb-6">
        ⚠️ Thay đổi ảnh hưởng toàn site + structured data SEO. Cân nhắc kỹ trước khi lưu.
      </div>

      <section className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="font-bold mb-4">Thông tin cơ bản</h2>
        <form action={updateContactInfoAction} className="space-y-3">
          <Field label="Hotline" name="hotline" defaultValue={info.hotline} placeholder="0325669996" />
          <Field label="Email" name="email" defaultValue={info.email} placeholder="admin@ofina.vn" />
          <Field label="Zalo URL" name="zalo_url" defaultValue={info.zalo_url} placeholder="https://zalo.me/..." />
          <Field label="Facebook URL" name="facebook_url" defaultValue={info.facebook_url} placeholder="https://facebook.com/..." />
          <Field label="Giờ mở cửa (schema.org format)" name="working_hours" defaultValue={info.working_hours} placeholder="Mo-Su 08:00-18:00" />
          <button
            type="submit"
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
          >
            Lưu thông tin
          </button>
        </form>
      </section>

      <section className="bg-white rounded-lg shadow p-6">
        <h2 className="font-bold mb-4">Showroom</h2>
        <form action={updateBranchesAction} className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => {
            const b = branches.items[i] || { name: '', address: '', phone: '', maps_query: '' }
            return (
              <div key={i} className="border border-neutral-200 rounded-lg p-3 space-y-2 bg-neutral-50">
                <input
                  name={`name_${i}`}
                  defaultValue={b.name}
                  placeholder={`Tên showroom ${i + 1} (vd: Trụ sở Hà Nội)`}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg bg-white"
                />
                <input
                  name={`address_${i}`}
                  defaultValue={b.address}
                  placeholder="Địa chỉ đầy đủ"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg bg-white"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    name={`phone_${i}`}
                    defaultValue={b.phone}
                    placeholder="SĐT (optional)"
                    className="px-3 py-2 border border-neutral-300 rounded-lg bg-white"
                  />
                  <input
                    name={`maps_query_${i}`}
                    defaultValue={b.maps_query}
                    placeholder="Từ khoá Google Maps (optional)"
                    className="px-3 py-2 border border-neutral-300 rounded-lg bg-white"
                  />
                </div>
              </div>
            )
          })}
          <button
            type="submit"
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
          >
            Lưu showroom
          </button>
        </form>
      </section>
    </div>
  )
}

function Field({
  label,
  name,
  defaultValue,
  placeholder,
}: {
  label: string
  name: string
  defaultValue?: string
  placeholder?: string
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input
        name={name}
        defaultValue={defaultValue || ''}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-neutral-300 rounded-lg"
      />
    </div>
  )
}
