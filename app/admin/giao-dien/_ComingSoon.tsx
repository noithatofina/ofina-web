import Link from 'next/link'

export function ComingSoon({ title, desc }: { title: string; desc?: string }) {
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-4">
        <Link href="/admin/giao-dien" className="text-sm text-neutral-600 hover:text-blue-600">
          ← Quay lại Quản lý giao diện
        </Link>
      </div>
      <h1 className="text-2xl font-bold mb-2">{title}</h1>
      {desc && <p className="text-sm text-neutral-600 mb-6">{desc}</p>}
      <div className="p-8 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800">
        🚧 Trang này đang được xây dựng. Em sẽ cập nhật trong sprint tiếp theo.
      </div>
    </div>
  )
}
