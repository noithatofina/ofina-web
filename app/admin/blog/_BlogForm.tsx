import Link from 'next/link'

type Post = {
  id?: string
  title?: string
  slug?: string
  excerpt?: string | null
  content?: string | null
  cover_image?: string | null
  category?: string | null
  tags?: string[] | null
  seo_title?: string | null
  seo_description?: string | null
  author?: string | null
  is_published?: boolean | null
}

export function BlogForm({
  action,
  post,
  submitLabel,
  cancelHref,
  errorMsg,
}: {
  action: (formData: FormData) => void | Promise<void>
  post?: Post
  submitLabel: string
  cancelHref: string
  errorMsg?: string | null
}) {
  return (
    <form action={action} className="bg-white rounded-lg shadow p-6 space-y-4">
      {errorMsg && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {errorMsg}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-1">
          Tiêu đề <span className="text-red-600">*</span>
        </label>
        <input
          name="title"
          required
          defaultValue={post?.title || ''}
          placeholder="VD: Cách chọn ghế văn phòng phù hợp cho từng đối tượng"
          className="w-full px-3 py-2 border border-neutral-300 rounded-lg"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Slug URL</label>
        <input
          name="slug"
          defaultValue={post?.slug || ''}
          placeholder="Để trống → tự sinh từ tiêu đề"
          className="w-full px-3 py-2 border border-neutral-300 rounded-lg font-mono text-sm"
        />
        <p className="text-xs text-neutral-500 mt-1">
          URL sẽ là <span className="font-mono">ofina.vn/blog/[slug]</span>
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Trích dẫn (excerpt)</label>
        <textarea
          name="excerpt"
          rows={2}
          defaultValue={post?.excerpt || ''}
          placeholder="Mô tả ngắn hiển thị ngoài list blog + SEO description mặc định"
          className="w-full px-3 py-2 border border-neutral-300 rounded-lg"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Nội dung (HTML) <span className="text-red-600">*</span>
        </label>
        <textarea
          name="content"
          required
          rows={20}
          defaultValue={post?.content || ''}
          placeholder={`<h2>Mở đầu</h2>
<p>Nội dung đoạn mở đầu...</p>

<h2>Tiêu đề chính</h2>
<p>Đoạn văn. Có thể dùng <strong>in đậm</strong>, <em>in nghiêng</em>, <a href="/san-pham">liên kết</a>.</p>

<ul>
  <li>Điểm thứ nhất</li>
  <li>Điểm thứ hai</li>
</ul>

<img src="https://..." alt="Mô tả ảnh" />`}
          className="w-full px-3 py-2 border border-neutral-300 rounded-lg font-mono text-sm"
        />
        <p className="text-xs text-neutral-500 mt-1">
          Dùng HTML cơ bản: <span className="font-mono">&lt;h2&gt;</span>,{' '}
          <span className="font-mono">&lt;p&gt;</span>, <span className="font-mono">&lt;ul&gt;</span>,{' '}
          <span className="font-mono">&lt;strong&gt;</span>, <span className="font-mono">&lt;em&gt;</span>,{' '}
          <span className="font-mono">&lt;a&gt;</span>, <span className="font-mono">&lt;img&gt;</span>.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">URL ảnh bìa</label>
        <input
          name="cover_image"
          type="url"
          defaultValue={post?.cover_image || ''}
          placeholder="https://..."
          className="w-full px-3 py-2 border border-neutral-300 rounded-lg"
        />
        <p className="text-xs text-neutral-500 mt-1">
          Upload ảnh lên Supabase Storage hoặc dùng URL từ nguồn uy tín. Tỷ lệ 16:9 (1200×675 khuyến nghị).
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Danh mục</label>
          <input
            name="category"
            defaultValue={post?.category || ''}
            placeholder="VD: Ghế văn phòng, Tips, Kiến thức"
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Tác giả</label>
          <input
            name="author"
            defaultValue={post?.author || 'OFINA Team'}
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Tags (phân cách bởi dấu phẩy)</label>
        <input
          name="tags"
          defaultValue={post?.tags?.join(', ') || ''}
          placeholder="ghe-van-phong, cong-thai-hoc, huong-dan"
          className="w-full px-3 py-2 border border-neutral-300 rounded-lg"
        />
      </div>

      <details className="border border-neutral-200 rounded-lg p-3">
        <summary className="cursor-pointer font-medium text-sm">SEO nâng cao (tuỳ chọn)</summary>
        <div className="space-y-3 pt-3">
          <div>
            <label className="block text-sm font-medium mb-1">SEO Title</label>
            <input
              name="seo_title"
              defaultValue={post?.seo_title || ''}
              placeholder="Để trống → dùng Tiêu đề"
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">SEO Description</label>
            <textarea
              name="seo_description"
              rows={2}
              defaultValue={post?.seo_description || ''}
              placeholder="Để trống → dùng Trích dẫn"
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg"
            />
          </div>
        </div>
      </details>

      <fieldset className="border border-neutral-200 rounded-lg p-4">
        <legend className="px-2 text-sm font-medium">Trạng thái xuất bản</legend>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="is_published"
            defaultChecked={!!post?.is_published}
          />
          <span className="text-sm">
            Đã đăng — hiển thị công khai trên <span className="font-mono">ofina.vn/blog</span>
          </span>
        </label>
      </fieldset>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg"
        >
          {submitLabel}
        </button>
        <Link
          href={cancelHref}
          className="px-5 py-2 border border-neutral-300 hover:bg-neutral-50 rounded-lg"
        >
          Hủy
        </Link>
      </div>
    </form>
  )
}
