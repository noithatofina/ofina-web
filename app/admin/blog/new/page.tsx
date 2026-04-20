import Link from 'next/link'
import { createBlogPostAction } from '../actions'
import { BlogForm } from '../_BlogForm'

const ERRORS: Record<string, string> = {
  missing_title: 'Thiếu tiêu đề',
  missing_content: 'Thiếu nội dung bài viết',
  duplicate: 'Slug đã tồn tại — chọn slug khác',
  db: 'Lỗi khi lưu:',
}

export default async function NewBlogPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; msg?: string }>
}) {
  const sp = await searchParams
  const errorMsg = sp.error
    ? (ERRORS[sp.error] || 'Lỗi') + (sp.msg ? ` ${decodeURIComponent(sp.msg)}` : '')
    : null

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-4">
        <Link href="/admin/blog" className="text-sm text-neutral-600 hover:text-blue-600">
          ← Danh sách bài viết
        </Link>
      </div>

      <h1 className="text-2xl font-bold mb-6">Viết bài mới</h1>

      <BlogForm
        action={createBlogPostAction}
        submitLabel="Lưu bài viết"
        cancelHref="/admin/blog"
        errorMsg={errorMsg}
      />
    </div>
  )
}
