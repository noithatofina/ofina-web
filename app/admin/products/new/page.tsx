import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase-admin'
import { createProductAction } from './actions'

export const dynamic = 'force-dynamic'

const ERRORS: Record<string, string> = {
  missing_name: 'Thiếu tên sản phẩm',
  missing_sku: 'Thiếu SKU OFINA',
  duplicate: 'SKU OFINA hoặc slug đã tồn tại — chọn SKU khác',
  db: 'Lỗi khi lưu. Chi tiết:',
}

export default async function NewProductPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; msg?: string }>
}) {
  const sp = await searchParams
  const errorMsg = sp.error ? (ERRORS[sp.error] || 'Lỗi') + (sp.msg ? ` ${decodeURIComponent(sp.msg)}` : '') : null

  const admin = createAdminClient()
  const { data: categories } = await admin
    .from('categories')
    .select('id,name,slug,parent_id')
    .order('name', { ascending: true })

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-4">
        <Link href="/admin/products" className="text-sm text-neutral-600 hover:text-blue-600">
          ← Danh sách sản phẩm
        </Link>
      </div>

      <h1 className="text-2xl font-bold mb-1">Thêm sản phẩm mới</h1>
      <p className="text-sm text-neutral-500 mb-6">
        Nhập thông tin cơ bản. Sau khi lưu sẽ chuyển sang trang sửa chi tiết để upload ảnh + điền mô tả đầy đủ.
      </p>

      {errorMsg && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {errorMsg}
        </div>
      )}

      <form action={createProductAction} className="bg-white rounded-lg shadow p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Tên sản phẩm <span className="text-red-600">*</span>
          </label>
          <input
            name="name"
            required
            placeholder="VD: Ghế xoay văn phòng Venus V08B-BL"
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              SKU OFINA <span className="text-red-600">*</span>
            </label>
            <input
              name="ofina_sku"
              required
              placeholder="VD: OFN-GXV-0123"
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg font-mono uppercase"
            />
            <p className="text-xs text-neutral-500 mt-1">
              Format: OFN-[loại]-[số]. Ví dụ OFN-GXV-0123.
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">SKU Govi (nếu có)</label>
            <input
              name="govi_sku"
              placeholder="VD: V08B-BL"
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg font-mono"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Slug URL (đường dẫn trên site)
          </label>
          <input
            name="slug"
            placeholder="Để trống → tự sinh từ tên"
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg font-mono text-sm"
          />
          <p className="text-xs text-neutral-500 mt-1">
            URL sản phẩm sẽ là <span className="font-mono">ofina.vn/san-pham/[slug]</span>.
            Chỉ chữ thường + số + dấu gạch ngang.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Giá bán (VNĐ) <span className="text-red-600">*</span>
            </label>
            <input
              name="price"
              type="number"
              required
              placeholder="2500000"
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Danh mục</label>
            <select
              name="category_id"
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg bg-white"
            >
              <option value="">— Chưa gán danh mục —</option>
              {categories?.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Mô tả ngắn</label>
          <textarea
            name="short_description"
            rows={3}
            placeholder="1-2 dòng mô tả sản phẩm..."
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg"
          />
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
          💡 Sản phẩm sẽ được tạo ở trạng thái <b>Draft</b> (ẩn). Sau khi điền đầy đủ mô tả + upload ảnh,
          anh/chị đổi sang <b>Active</b> để hiển thị trên site.
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg"
          >
            Tạo sản phẩm
          </button>
          <Link
            href="/admin/products"
            className="px-5 py-2 border border-neutral-300 hover:bg-neutral-50 rounded-lg"
          >
            Hủy
          </Link>
        </div>
      </form>
    </div>
  )
}
