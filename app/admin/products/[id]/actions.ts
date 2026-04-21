'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createServerSupabase } from '@/lib/supabase'
import { createAdminClient, isStaffEmail } from '@/lib/supabase-admin'

async function assertStaff() {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !(await isStaffEmail(user.email))) {
    redirect('/admin/login')
  }
  return user
}

export async function updateProductAction(id: string, formData: FormData) {
  await assertStaff()
  const admin = createAdminClient()

  const asInt = (v: FormDataEntryValue | null) => {
    const n = parseInt(String(v || '0').replace(/[^\d-]/g, ''), 10)
    return isNaN(n) ? null : n
  }
  const asBool = (v: FormDataEntryValue | null) => v === 'on' || v === 'true' || v === '1'

  const patch = {
    name: String(formData.get('name') || '').trim(),
    short_description: String(formData.get('short_description') || '').trim() || null,
    description: String(formData.get('description') || '').trim() || null,
    price: asInt(formData.get('price')) || 0,
    compare_price: asInt(formData.get('compare_price')),
    is_price_hidden: asBool(formData.get('is_price_hidden')),
    in_stock: asBool(formData.get('in_stock')),
    status: String(formData.get('status') || 'active'),
    is_featured: asBool(formData.get('is_featured')),
    is_bestseller: asBool(formData.get('is_bestseller')),
    is_new: asBool(formData.get('is_new')),
    is_sale: asBool(formData.get('is_sale')),
  }

  const { error } = await admin.from('products').update(patch).eq('id', id)
  if (error) throw new Error(error.message)

  revalidatePath(`/admin/products/${id}`)
  revalidatePath('/admin/products')
  revalidatePath(`/san-pham`)
}

export async function uploadImageAction(productId: string, govi_sku: string, formData: FormData) {
  await assertStaff()
  const admin = createAdminClient()
  const file = formData.get('file') as File | null
  if (!file || file.size === 0) throw new Error('Không có file')

  // Find next available position
  const { data: existing } = await admin
    .from('product_images')
    .select('position')
    .eq('product_id', productId)
    .order('position', { ascending: false })
    .limit(1)
  const nextPos = ((existing?.[0]?.position ?? -1) + 1)

  // Use timestamp-based filename to avoid collision with existing keys
  const ext = (file.name.split('.').pop() || 'webp').toLowerCase()
  const filename = `user-${Date.now()}.${ext}`
  const key = `${govi_sku}/${filename}`

  const { error: upErr } = await admin.storage
    .from('products')
    .upload(key, file, { upsert: true, contentType: file.type })
  if (upErr) throw new Error(upErr.message)

  const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/products/${key}`

  const { error: dbErr } = await admin.from('product_images').insert({
    product_id: productId,
    url,
    position: nextPos,
    is_primary: false,
  })
  if (dbErr) throw new Error(dbErr.message)

  revalidatePath(`/admin/products/${productId}`)
}

export async function deleteImageAction(productId: string, imageId: string) {
  await assertStaff()
  const admin = createAdminClient()

  const { data: img } = await admin
    .from('product_images')
    .select('url')
    .eq('id', imageId)
    .single()

  const { error } = await admin.from('product_images').delete().eq('id', imageId)
  if (error) throw new Error(error.message)

  // Best-effort delete from storage (skip if URL points elsewhere)
  if (img?.url) {
    const prefix = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/products/`
    if (img.url.startsWith(prefix)) {
      const key = decodeURIComponent(img.url.slice(prefix.length))
      await admin.storage.from('products').remove([key])
    }
  }

  revalidatePath(`/admin/products/${productId}`)
}

export async function setPrimaryImageAction(productId: string, imageId: string) {
  await assertStaff()
  const admin = createAdminClient()

  await admin.from('product_images').update({ is_primary: false }).eq('product_id', productId)
  const { error } = await admin
    .from('product_images')
    .update({ is_primary: true })
    .eq('id', imageId)
  if (error) throw new Error(error.message)

  revalidatePath(`/admin/products/${productId}`)
}

export async function reorderImagesAction(productId: string, orderedIds: string[]) {
  await assertStaff()
  const admin = createAdminClient()

  await Promise.all(
    orderedIds.map((id, i) =>
      admin.from('product_images').update({ position: i }).eq('id', id)
    )
  )

  revalidatePath(`/admin/products/${productId}`)
}
