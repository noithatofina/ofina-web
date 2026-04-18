import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return (
    <div className="container-custom py-12 max-w-3xl">
      <nav className="text-sm text-gray-500 mb-6 flex items-center gap-2">
        <Link href="/" className="hover:text-brand-900">Trang chủ</Link>
        <ChevronRight className="w-4 h-4" />
        <Link href="/blog" className="hover:text-brand-900">Blog</Link>
      </nav>

      <article>
        <h1 className="font-display text-4xl font-bold text-brand-950 mb-4">
          Bài viết đang được cập nhật
        </h1>
        <p className="text-gray-600 mb-8">
          Bài viết "{slug.replace(/-/g, ' ')}" sẽ được OFINA đăng tải trong thời gian tới.
        </p>
        <div className="bg-brand-50 p-8 rounded-2xl">
          <h2 className="font-bold text-xl mb-3">Trong lúc chờ đợi</h2>
          <p className="text-gray-700 mb-4">
            Khám phá ngay các sản phẩm nội thất văn phòng chất lượng cao tại OFINA:
          </p>
          <div className="flex gap-3 flex-wrap">
            <Link href="/danh-muc/ghe-van-phong" className="btn-primary">Ghế văn phòng</Link>
            <Link href="/danh-muc/ban-lam-viec" className="btn-ghost">Bàn làm việc</Link>
            <Link href="/blog" className="btn-ghost">← Về Blog</Link>
          </div>
        </div>
      </article>
    </div>
  )
}
