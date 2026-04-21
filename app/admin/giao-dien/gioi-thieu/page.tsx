import Link from 'next/link'
import { requireStaff } from '@/lib/auth-guard'
import { getSetting } from '@/lib/site-settings'
import { updateGioiThieuAction } from '../actions'

export const dynamic = 'force-dynamic'

export default async function GioiThieuEditorPage() {
  await requireStaff({ requireAdmin: true })
  const data = await getSetting<{ title: string; content: string }>('page.gioi_thieu', {
    title: '',
    content: '',
  })

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-4 flex items-center justify-between">
        <Link href="/admin/giao-dien" className="text-sm text-neutral-600 hover:text-blue-600">
          ← Quản lý giao diện
        </Link>
        <Link href="/gioi-thieu" target="_blank" className="text-sm text-blue-600 hover:underline">
          Xem trên site ↗
        </Link>
      </div>
      <h1 className="text-2xl font-bold mb-2">Trang Giới thiệu</h1>
      <p className="text-sm text-neutral-600 mb-6">
        Nội dung hiển thị tại <span className="font-mono">ofina.vn/gioi-thieu</span>
      </p>

      <form action={updateGioiThieuAction} className="bg-white rounded-lg shadow p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Tiêu đề trang</label>
          <input
            name="title"
            defaultValue={data.title}
            placeholder="Giới thiệu OFINA"
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Nội dung (HTML)</label>
          <textarea
            name="content"
            rows={25}
            defaultValue={data.content}
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg font-mono text-sm"
          />
        </div>

        <button
          type="submit"
          className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
        >
          Lưu thay đổi
        </button>
      </form>
    </div>
  )
}
