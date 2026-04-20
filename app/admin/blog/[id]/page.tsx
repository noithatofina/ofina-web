import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase-admin'
import { updateBlogPostAction, deleteBlogPostAction } from '../actions'
import { BlogForm } from '../_BlogForm'

export const dynamic = 'force-dynamic'

export default async function EditBlogPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ created?: string }>
}) {
  const { id } = await params
  const { created } = await searchParams
  const admin = createAdminClient()

  const { data: post } = await admin
    .from('blog_posts')
    .select('*')
    .eq('id', id)
    .single()

  if (!post) notFound()

  async function update(formData: FormData) {
    'use server'
    await updateBlogPostAction(id, formData)
  }

  async function del() {
    'use server'
    await deleteBlogPostAction(id)
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-4 flex items-center justify-between">
        <Link href="/admin/blog" className="text-sm text-neutral-600 hover:text-blue-600">
          ← Danh sách bài viết
        </Link>
        {post.is_published && (
          <Link
            href={`/blog/${post.slug}`}
            target="_blank"
            className="text-sm text-blue-600 hover:underline"
          >
            Xem trên site ↗
          </Link>
        )}
      </div>

      {created && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-800">
          ✅ Đã tạo bài viết. Có thể tiếp tục chỉnh sửa hoặc tick "Đã đăng" rồi Lưu để xuất bản.
        </div>
      )}

      <h1 className="text-2xl font-bold mb-1">{post.title}</h1>
      <div className="text-sm text-neutral-500 font-mono mb-6">/blog/{post.slug}</div>

      <BlogForm
        action={update}
        post={post}
        submitLabel="Lưu thay đổi"
        cancelHref="/admin/blog"
      />

      <form action={del} className="mt-8 p-4 border border-red-200 bg-red-50 rounded-lg">
        <h3 className="font-bold text-red-700 mb-1">Vùng nguy hiểm</h3>
        <p className="text-sm text-red-600 mb-3">
          Xoá bài viết vĩnh viễn — không khôi phục được.
        </p>
        <button
          type="submit"
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm"
        >
          Xoá bài viết này
        </button>
      </form>
    </div>
  )
}
