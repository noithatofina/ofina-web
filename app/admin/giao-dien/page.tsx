import Link from 'next/link'
import { requireStaff } from '@/lib/auth-guard'

export const dynamic = 'force-dynamic'

export default async function GiaoDienIndexPage() {
  const { role } = await requireStaff()
  const isAdmin = role === 'admin'

  const editorSections = [
    { href: '/admin/giao-dien/home', title: 'Trang chủ', desc: 'Banner thông báo, Hero, Stats, FAQ, Giới thiệu thương hiệu' },
    { href: '/admin/giao-dien/khuyen-mai', title: 'Trang Khuyến mãi', desc: 'Nội dung chương trình khuyến mãi' },
  ]

  const adminSections = [
    { href: '/admin/giao-dien/lien-he', title: 'Thông tin liên hệ', desc: 'Hotline, email, địa chỉ showroom, social links' },
    { href: '/admin/giao-dien/gioi-thieu', title: 'Trang Giới thiệu', desc: 'Nội dung /gioi-thieu' },
    { href: '/admin/giao-dien/chinh-sach', title: 'Các trang Chính sách', desc: '6 trang: đổi trả, bảo hành, vận chuyển, thanh toán, bảo mật, điều khoản' },
    { href: '/admin/giao-dien/branding', title: 'Logo & Branding', desc: 'Logo, favicon, OG image, ảnh showroom' },
  ]

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">Quản lý giao diện</h1>
      <p className="text-sm text-neutral-600 mb-6">
        Chọn khu vực cần chỉnh sửa. Thay đổi được lưu vào database và hiển thị trên site sau ~1 phút (CDN cache).
      </p>

      <h2 className="text-sm font-semibold text-neutral-500 uppercase tracking-wider mb-3">
        Nội dung site
      </h2>
      <div className="grid sm:grid-cols-2 gap-3 mb-6">
        {editorSections.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="block bg-white p-4 rounded-lg shadow hover:shadow-md border border-neutral-200 hover:border-blue-300 transition"
          >
            <div className="font-medium mb-1">{s.title}</div>
            <div className="text-xs text-neutral-500">{s.desc}</div>
          </Link>
        ))}
      </div>

      {isAdmin && (
        <>
          <h2 className="text-sm font-semibold text-neutral-500 uppercase tracking-wider mb-3">
            Chỉ Quản trị viên
          </h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {adminSections.map((s) => (
              <Link
                key={s.href}
                href={s.href}
                className="block bg-white p-4 rounded-lg shadow hover:shadow-md border border-neutral-200 hover:border-blue-300 transition"
              >
                <div className="font-medium mb-1">{s.title}</div>
                <div className="text-xs text-neutral-500">{s.desc}</div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
