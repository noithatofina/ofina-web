'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createServerSupabase } from '@/lib/supabase'
import { createAdminClient, isStaffEmail } from '@/lib/supabase-admin'
import { slugify } from '@/lib/utils'

async function assertStaff() {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !isStaffEmail(user.email)) {
    redirect('/admin/login')
  }
}

export async function createProductAction(formData: FormData) {
  await assertStaff()
  const admin = createAdminClient()

  const name = String(formData.get('name') || '').trim()
  const ofina_sku = String(formData.get('ofina_sku') || '').trim().toUpperCase()
  const priceRaw = String(formData.get('price') || '0').replace(/[^\d]/g, '')
  const price = parseInt(priceRaw, 10) || 0
  const category_id = String(formData.get('category_id') || '').trim() || null
  const short_description = String(formData.get('short_description') || '').trim() || null
  const slugInput = String(formData.get('slug') || '').trim()

  if (!name) redirect('/admin/products/new?error=missing_name')
  if (!ofina_sku) redirect('/admin/products/new?error=missing_sku')

  const slug = slugify(slugInput || `${name}-${ofina_sku.toLowerCase()}`)

  const { data: existing } = await admin
    .from('products')
    .select('id')
    .or(`ofina_sku.eq.${ofina_sku},slug.eq.${slug}`)
    .limit(1)
    .maybeSingle()

  if (existing) {
    redirect('/admin/products/new?error=duplicate')
  }

  const { data: created, error } = await admin
    .from('products')
    .insert({
      name,
      ofina_sku,
      slug,
      price,
      category_id,
      short_description,
      status: 'draft',
      in_stock: true,
    })
    .select('id')
    .single()

  if (error || !created) {
    const msg = encodeURIComponent(error?.message || 'Không tạo được sản phẩm')
    redirect(`/admin/products/new?error=db&msg=${msg}`)
  }

  revalidatePath('/admin/products')
  redirect(`/admin/products/${created.id}?created=1`)
}
