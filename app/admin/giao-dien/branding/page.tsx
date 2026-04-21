import Link from 'next/link'
import { requireStaff } from '@/lib/auth-guard'
import { getSetting } from '@/lib/site-settings'
import { updateBrandingAction, uploadBrandingImageAction } from '../actions'

export const dynamic = 'force-dynamic'

export default async function BrandingEditorPage() {
  await requireStaff({ requireAdmin: true })
  const data = await getSetting<{ logo_url: string; favicon_url: string; og_image_url: string }>(
    'branding',
    { logo_url: '', favicon_url: '', og_image_url: '' },
  )

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-4">
        <Link href="/admin/giao-dien" className="text-sm text-neutral-600 hover:text-blue-600">
          ← Quản lý giao diện
        </Link>
      </div>
      <h1 className="text-2xl font-bold mb-2">Logo &amp; Branding</h1>
      <p className="text-sm text-neutral-600 mb-6">
        Upload ảnh trực tiếp hoặc dán URL có sẵn. Để trống = dùng file mặc định trong{' '}
        <span className="font-mono">/public/</span>.
      </p>

      <form action={updateBrandingAction} className="bg-white rounded-lg shadow p-6 space-y-6">
        <ImageSection
          label="Logo chính (header + footer)"
          target="logo_url"
          currentUrl={data.logo_url}
          desc="Khuyến nghị PNG nền trong suốt, 400×400 hoặc tỷ lệ vuông"
        />
        <ImageSection
          label="Favicon (icon browser tab)"
          target="favicon_url"
          currentUrl={data.favicon_url}
          desc="Ảnh vuông 64×64 hoặc 128×128, PNG / ICO"
        />
        <ImageSection
          label="OG Image (ảnh share Facebook/Zalo)"
          target="og_image_url"
          currentUrl={data.og_image_url}
          desc="Ảnh 1200×630 — hiển thị khi share link site trên mạng xã hội"
        />

        <button
          type="submit"
          className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
        >
          Lưu URL (nếu đã sửa)
        </button>
      </form>
    </div>
  )
}

function ImageSection({
  label,
  target,
  currentUrl,
  desc,
}: {
  label: string
  target: 'logo_url' | 'favicon_url' | 'og_image_url'
  currentUrl: string
  desc: string
}) {
  return (
    <div className="border border-neutral-200 rounded-lg p-4 space-y-3">
      <div>
        <div className="font-medium">{label}</div>
        <div className="text-xs text-neutral-500">{desc}</div>
      </div>

      {currentUrl && (
        <div className="flex items-center gap-3">
          <img
            src={currentUrl}
            alt=""
            className="max-h-20 max-w-[160px] object-contain rounded border bg-neutral-50 p-2"
          />
          <div className="text-xs text-neutral-500 font-mono break-all flex-1">{currentUrl}</div>
        </div>
      )}

      {/* Upload form — tách riêng để submit độc lập */}
      <form
        action={uploadBrandingImageAction}
        className="flex items-center gap-2"
        encType="multipart/form-data"
      >
        <input type="hidden" name="target" value={target} />
        <input
          type="file"
          name="file"
          required
          accept="image/png,image/jpeg,image/webp,image/svg+xml,image/x-icon"
          className="text-xs flex-1"
        />
        <button
          type="submit"
          className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs rounded font-medium"
        >
          Upload
        </button>
      </form>

      <div>
        <label className="block text-xs text-neutral-500 mb-1">Hoặc dán URL trực tiếp:</label>
        <input
          name={target}
          type="url"
          defaultValue={currentUrl || ''}
          placeholder="https://..."
          className="w-full px-3 py-1.5 border border-neutral-300 rounded text-sm"
        />
      </div>
    </div>
  )
}
