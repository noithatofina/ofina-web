import Link from 'next/link'
import { requireStaff } from '@/lib/auth-guard'
import { getSetting } from '@/lib/site-settings'
import { updateBrandingAction } from '../actions'

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
        Logo, favicon, ảnh OG preview. Để trống = dùng file mặc định trong <span className="font-mono">/public/</span>.
      </p>

      <div className="bg-blue-50 border border-blue-200 text-blue-800 text-sm p-3 rounded-lg mb-6">
        💡 Upload ảnh lên Supabase Storage (bucket <span className="font-mono">branding</span>) hoặc dùng URL public từ nguồn uy tín.
        Upload trực tiếp từ đây sẽ có trong sprint tiếp theo.
      </div>

      <form action={updateBrandingAction} className="bg-white rounded-lg shadow p-6 space-y-4">
        <ImageField
          label="Logo URL"
          name="logo_url"
          defaultValue={data.logo_url}
          desc="Khuyến nghị PNG nền trong suốt, 400×400 hoặc tỷ lệ vuông"
        />
        <ImageField
          label="Favicon URL"
          name="favicon_url"
          defaultValue={data.favicon_url}
          desc="Ảnh vuông 64×64 hoặc 128×128, ICO/PNG"
        />
        <ImageField
          label="OG Image URL (share preview)"
          name="og_image_url"
          defaultValue={data.og_image_url}
          desc="Ảnh 1200×630 cho Facebook/Zalo share preview"
        />

        <button
          type="submit"
          className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
        >
          Lưu Branding
        </button>
      </form>
    </div>
  )
}

function ImageField({
  label,
  name,
  defaultValue,
  desc,
}: {
  label: string
  name: string
  defaultValue?: string
  desc?: string
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input
        name={name}
        type="url"
        defaultValue={defaultValue || ''}
        placeholder="https://..."
        className="w-full px-3 py-2 border border-neutral-300 rounded-lg"
      />
      {desc && <p className="text-xs text-neutral-500 mt-1">{desc}</p>}
      {defaultValue && (
        <div className="mt-2">
          <img src={defaultValue} alt="" className="max-h-20 object-contain rounded border bg-white p-2" />
        </div>
      )}
    </div>
  )
}
