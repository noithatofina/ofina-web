import Link from 'next/link'
import { requireStaff } from '@/lib/auth-guard'
import { getSetting } from '@/lib/site-settings'
import { updateKhuyenMaiAction } from '../actions'

export const dynamic = 'force-dynamic'

export default async function KhuyenMaiEditorPage() {
  await requireStaff()
  const data = await getSetting<{ title: string; banner_image: string; content: string }>(
    'page.khuyen_mai',
    { title: '', banner_image: '', content: '' },
  )

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-4 flex items-center justify-between">
        <Link href="/admin/giao-dien" className="text-sm text-neutral-600 hover:text-blue-600">
          ← Quản lý giao diện
        </Link>
        <Link href="/khuyen-mai" target="_blank" className="text-sm text-blue-600 hover:underline">
          Xem trên site ↗
        </Link>
      </div>
      <h1 className="text-2xl font-bold mb-2">Trang Khuyến mãi</h1>
      <p className="text-sm text-neutral-600 mb-6">
        Nội dung hiển thị tại <span className="font-mono">ofina.vn/khuyen-mai</span>
      </p>

      <form action={updateKhuyenMaiAction} className="bg-white rounded-lg shadow p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Tiêu đề trang</label>
          <input
            name="title"
            defaultValue={data.title}
            placeholder="VD: Khuyến mãi mùa Tết 2026 — Giảm đến 40%"
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">URL ảnh banner</label>
          <input
            name="banner_image"
            type="url"
            defaultValue={data.banner_image}
            placeholder="https://..."
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg"
          />
          <p className="text-xs text-neutral-500 mt-1">
            Ảnh banner hiển thị đầu trang. Khuyến nghị 1920×600.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Nội dung (HTML)</label>
          <textarea
            name="content"
            rows={20}
            defaultValue={data.content}
            placeholder={`<h2>Ưu đãi đặc biệt</h2>\n<p>Mua 1 ghế + 1 bàn → giảm 15%</p>\n<ul>\n  <li>Điều kiện 1</li>\n</ul>`}
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
