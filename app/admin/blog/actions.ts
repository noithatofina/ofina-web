'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createServerSupabase } from '@/lib/supabase'
import { createAdminClient, isStaffEmail } from '@/lib/supabase-admin'
import { slugify } from '@/lib/utils'
import { sanitizeHtml } from '@/lib/sanitize-html'

async function assertStaff() {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !(await isStaffEmail(user.email))) {
    redirect('/admin/login')
  }
}

function parsePostData(formData: FormData) {
  const title = String(formData.get('title') || '').trim()
  const slugInput = String(formData.get('slug') || '').trim()
  const excerpt = String(formData.get('excerpt') || '').trim() || null
  const content = sanitizeHtml(String(formData.get('content') || '').trim())
  const cover_image = String(formData.get('cover_image') || '').trim() || null
  const category = String(formData.get('category') || '').trim() || null
  const tagsRaw = String(formData.get('tags') || '').trim()
  const tags = tagsRaw ? tagsRaw.split(',').map((t) => t.trim()).filter(Boolean) : null
  const seo_title = String(formData.get('seo_title') || '').trim() || null
  const seo_description = String(formData.get('seo_description') || '').trim() || null
  const is_published = formData.get('is_published') === 'on' || formData.get('is_published') === 'true'
  const author = String(formData.get('author') || 'OFINA Team').trim()

  return {
    title,
    slug: slugify(slugInput || title),
    excerpt,
    content,
    cover_image,
    category,
    tags,
    seo_title,
    seo_description,
    is_published,
    author,
  }
}

export async function createBlogPostAction(formData: FormData) {
  await assertStaff()
  const admin = createAdminClient()
  const data = parsePostData(formData)

  if (!data.title) redirect('/admin/blog/new?error=missing_title')
  if (!data.content) redirect('/admin/blog/new?error=missing_content')

  const { data: dup } = await admin
    .from('blog_posts')
    .select('id')
    .eq('slug', data.slug)
    .maybeSingle()

  if (dup) redirect('/admin/blog/new?error=duplicate')

  const { data: created, error } = await admin
    .from('blog_posts')
    .insert({
      ...data,
      published_at: data.is_published ? new Date().toISOString() : null,
    })
    .select('id')
    .single()

  if (error || !created) {
    const msg = encodeURIComponent(error?.message || 'Không tạo được bài viết')
    redirect(`/admin/blog/new?error=db&msg=${msg}`)
  }

  revalidatePath('/admin/blog')
  revalidatePath('/blog')
  if (data.is_published) revalidatePath(`/blog/${data.slug}`)
  redirect(`/admin/blog/${created.id}?created=1`)
}

export async function updateBlogPostAction(id: string, formData: FormData) {
  await assertStaff()
  const admin = createAdminClient()
  const data = parsePostData(formData)

  if (!data.title) throw new Error('Thiếu tiêu đề')
  if (!data.content) throw new Error('Thiếu nội dung')

  const { data: current } = await admin
    .from('blog_posts')
    .select('slug,is_published,published_at')
    .eq('id', id)
    .single()

  const { data: dup } = await admin
    .from('blog_posts')
    .select('id')
    .eq('slug', data.slug)
    .neq('id', id)
    .maybeSingle()

  if (dup) throw new Error('Slug đã tồn tại ở bài khác — đổi slug')

  const published_at =
    data.is_published && !current?.is_published
      ? new Date().toISOString()
      : data.is_published
        ? current?.published_at
        : null

  const { error } = await admin
    .from('blog_posts')
    .update({ ...data, published_at })
    .eq('id', id)

  if (error) throw new Error(error.message)

  revalidatePath('/admin/blog')
  revalidatePath(`/admin/blog/${id}`)
  revalidatePath('/blog')
  revalidatePath(`/blog/${data.slug}`)
  if (current?.slug && current.slug !== data.slug) revalidatePath(`/blog/${current.slug}`)
}

export async function deleteBlogPostAction(id: string) {
  await assertStaff()
  const admin = createAdminClient()

  const { data: post } = await admin.from('blog_posts').select('slug').eq('id', id).single()

  const { error } = await admin.from('blog_posts').delete().eq('id', id)
  if (error) throw new Error(error.message)

  revalidatePath('/admin/blog')
  revalidatePath('/blog')
  if (post?.slug) revalidatePath(`/blog/${post.slug}`)
  redirect('/admin/blog')
}
