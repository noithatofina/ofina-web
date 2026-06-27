'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requireStaff } from '@/lib/auth-guard'
import { createAdminClient } from '@/lib/supabase-admin'

/**
 * Xoá sản phẩm hẳn khỏi DB + ảnh trong Supabase Storage.
 *
 * Quy trình:
 * 1. Load product để lấy ofina_sku (folder Storage) + slug (revalidate)
 * 2. Delete product_images rows trước (foreign key)
 * 3. List file trong bucket products/<ofina_sku>/ → delete hết
 * 4. Delete product row
 * 5. Revalidate /admin/products + trang public
 */
export async function deleteProductAction(formData: FormData) {
  await requireStaff({ requireAdmin: true })

  const id = String(formData.get('id') || '').trim()
  if (!id) redirect('/admin/products?error=missing_id')

  const admin = createAdminClient()
  const { data: product } = await admin
    .from('products')
    .select('id, slug, ofina_sku, name')
    .eq('id', id)
    .maybeSingle()

  if (!product) {
    redirect('/admin/products?error=not_found')
  }

  // 1. Delete product_images rows
  await admin.from('product_images').delete().eq('product_id', id)

  // 2. List + delete files trong Storage bucket products/<ofina_sku>/
  try {
    const folder = product!.ofina_sku
    const { data: files } = await admin.storage.from('products').list(folder)
    if (files && files.length > 0) {
      const paths = files.map((f: any) => `${folder}/${f.name}`)
      await admin.storage.from('products').remove(paths)
    }
  } catch (err) {
    console.warn('[delete-product] storage cleanup lỗi:', err)
    // không fail toàn bộ — vẫn xoá product row
  }

  // 3. Delete product row
  const { error } = await admin.from('products').delete().eq('id', id)
  if (error) {
    const msg = encodeURIComponent(error.message)
    redirect(`/admin/products?error=db&msg=${msg}`)
  }

  // 4. Revalidate
  try {
    revalidatePath('/admin/products')
    revalidatePath(`/san-pham/${product!.slug}`)
    revalidatePath('/')
  } catch {}

  const successName = encodeURIComponent(product!.name.slice(0, 60))
  redirect(`/admin/products?ok=deleted&name=${successName}`)
}
