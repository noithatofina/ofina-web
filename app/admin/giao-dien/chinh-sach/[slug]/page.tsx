import Link from 'next/link'
import { notFound } from 'next/navigation'
import { requireStaff } from '@/lib/auth-guard'
import { createAdminClient } from '@/lib/supabase-admin'
import { updatePolicyAction } from './actions'

export const dynamic = 'force-dynamic'

const ALLOWED_SLUGS = new Set(['doi-tra', 'bao-hanh', 'van-chuyen', 'thanh-toan', 'bao-mat', 'dieu-khoan'])

export default async function PolicyEditorPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  await requireStaff({ requireAdmin: true })
  const { slug } = await params
  if (!ALLOWED_SLUGS.has(slug)) notFound()

  const admin = createAdminClient()
  const { data } = await admin
    .from('site_settings')
    .select('value')
    .eq('key', `policy.${slug}`)
    .maybeSingle()

  const policy = (data?.value as { title: string; content: string }) || { title: '', content: '' }

  async function update(formData: FormData) {
    'use server'
    await updatePolicyAction(slug, formData)
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-4 flex items-center justify-between">
        <Link href="/admin/giao-dien/chinh-sach" className="text-sm text-neutral-600 hover:text-blue-600">
          ← Danh sách chính sách
        </Link>
        <Link
          href={`/chinh-sach/${slug}`}
          target="_blank"
          className="text-sm text-blue-600 hover:underline"
        >
          Xem trên site ↗
        </Link>
      </div>
      <h1 className="text-2xl font-bold mb-2">Sửa: {policy.title || slug}</h1>
      <p className="text-sm text-neutral-600 mb-6">
        Nội dung hiển thị tại <span className="font-mono">ofina.vn/chinh-sach/{slug}</span>
      </p>

      <form action={update} className="bg-white rounded-lg shadow p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Tiêu đề trang</label>
          <input
            name="title"
            required
            defaultValue={policy.title}
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Nội dung (HTML)</label>
          <textarea
            name="content"
            rows={25}
            defaultValue={policy.content}
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg font-mono text-sm"
          />
          <p className="text-xs text-neutral-500 mt-1">
            Dùng HTML cơ bản: <span className="font-mono">&lt;h2&gt;</span>, <span className="font-mono">&lt;h3&gt;</span>,{' '}
            <span className="font-mono">&lt;p&gt;</span>, <span className="font-mono">&lt;ul&gt;/&lt;li&gt;</span>,{' '}
            <span className="font-mono">&lt;ol&gt;/&lt;li&gt;</span>, <span className="font-mono">&lt;strong&gt;</span>,{' '}
            <span className="font-mono">&lt;a&gt;</span>. Inline style sẽ bị xoá tự động khi lưu.
          </p>
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
