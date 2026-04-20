import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase-admin'
import { updateProductAction } from './actions'
import { ImageManager } from './image-manager'

export const dynamic = 'force-dynamic'

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const admin = createAdminClient()

  const { data: product } = await admin
    .from('products')
    .select('*')
    .eq('id', id)
    .single()

  if (!product) notFound()

  const { data: images } = await admin
    .from('product_images')
    .select('id,url,position,is_primary,alt_text')
    .eq('product_id', id)
    .order('position', { ascending: true })

  async function update(formData: FormData) {
    'use server'
    await updateProductAction(id, formData)
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-4">
        <Link href="/admin/products" className="text-sm text-neutral-600 hover:text-blue-600">
          ← Danh sách sản phẩm
        </Link>
      </div>

      <h1 className="text-2xl font-bold mb-1">{product.name}</h1>
      <div className="text-sm text-neutral-500 mb-6">
        <span className="font-mono">{product.ofina_sku}</span>
        {product.govi_sku && <span className="ml-3 font-mono">Govi: {product.govi_sku}</span>}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6">
        <form action={update} className="bg-white rounded-lg shadow p-6 space-y-4">
          <h2 className="font-bold text-lg border-b pb-2 mb-2">Thông tin sản phẩm</h2>

          <div>
            <label className="block text-sm font-medium mb-1">Tên sản phẩm</label>
            <input
              name="name"
              defaultValue={product.name}
              required
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Mô tả ngắn</label>
            <textarea
              name="short_description"
              defaultValue={product.short_description || ''}
              rows={2}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Mô tả chi tiết (HTML hoặc văn bản)</label>
            <textarea
              name="description"
              defaultValue={product.description || ''}
              rows={8}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg font-mono text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Giá bán (VNĐ)</label>
              <input
                name="price"
                type="number"
                defaultValue={product.price || 0}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Giá niêm yết (gạch chéo)</label>
              <input
                name="compare_price"
                type="number"
                defaultValue={product.compare_price || ''}
                placeholder="Để trống nếu không dùng"
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Trạng thái</label>
            <select
              name="status"
              defaultValue={product.status}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg bg-white"
            >
              <option value="active">Active (hiển thị trên site)</option>
              <option value="draft">Draft (nháp, ẩn)</option>
              <option value="archived">Archived (lưu trữ, ẩn)</option>
            </select>
          </div>

          <fieldset className="border border-neutral-200 rounded-lg p-4">
            <legend className="px-2 text-sm font-medium">Nhãn hiển thị</legend>
            <div className="grid grid-cols-2 gap-2">
              <label className="flex items-center gap-2">
                <input type="checkbox" name="in_stock" defaultChecked={product.in_stock} />
                <span className="text-sm">Còn hàng</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" name="is_price_hidden" defaultChecked={product.is_price_hidden} />
                <span className="text-sm">Ẩn giá (hiển thị "Liên hệ")</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" name="is_featured" defaultChecked={product.is_featured} />
                <span className="text-sm">Nổi bật</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" name="is_bestseller" defaultChecked={product.is_bestseller} />
                <span className="text-sm">Bán chạy</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" name="is_new" defaultChecked={product.is_new} />
                <span className="text-sm">Mới</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" name="is_sale" defaultChecked={product.is_sale} />
                <span className="text-sm">Sale</span>
              </label>
            </div>
          </fieldset>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg"
            >
              Lưu thay đổi
            </button>
            <Link
              href={`/san-pham/${product.slug}`}
              target="_blank"
              className="px-5 py-2 border border-neutral-300 hover:bg-neutral-50 rounded-lg"
            >
              Xem trên site ↗
            </Link>
          </div>
        </form>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="font-bold text-lg border-b pb-2 mb-4">Ảnh sản phẩm ({images?.length || 0})</h2>
          <ImageManager productId={id} govi_sku={product.govi_sku} initialImages={images || []} />
        </div>
      </div>
    </div>
  )
}
