import Link from 'next/link'

export const metadata = {
  title: 'Blog — Kiến thức nội thất văn phòng | OFINA',
  description: 'Cẩm nang chọn nội thất văn phòng, mẹo setup không gian làm việc, xu hướng thiết kế 2026.',
}

const POSTS = [
  {
    slug: 'cach-chon-ghe-van-phong-phu-hop',
    title: 'Cách chọn ghế văn phòng phù hợp cho từng đối tượng',
    excerpt: 'Hướng dẫn chọn ghế văn phòng theo chiều cao, công việc, ngân sách. Tư vấn từ chuyên gia OFINA.',
    category: 'Ghế văn phòng',
    image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=800&q=80',
    date: '15/04/2026',
  },
  {
    slug: 'top-10-ban-lam-viec-tot-nhat-2026',
    title: 'Top 10 bàn làm việc tốt nhất 2026',
    excerpt: 'Đánh giá chi tiết 10 mẫu bàn làm việc bán chạy nhất, phù hợp văn phòng Việt Nam.',
    category: 'Bàn làm việc',
    image: 'https://images.unsplash.com/photo-1518051870910-a46e30d9db16?w=800&q=80',
    date: '12/04/2026',
  },
  {
    slug: 'setup-ban-lam-viec-tai-nha',
    title: 'Hướng dẫn setup bàn làm việc tại nhà đẹp & khoa học',
    excerpt: 'Tối ưu không gian làm việc tại nhà với ngân sách từ 5 triệu. Tips từ kiến trúc sư.',
    category: 'Tips & Tricks',
    image: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&q=80',
    date: '08/04/2026',
  },
  {
    slug: 'ghe-cong-thai-hoc-la-gi',
    title: 'Ghế công thái học là gì? Có đáng mua không?',
    excerpt: 'Giải đáp mọi thắc mắc về ghế công thái học, lợi ích và cách chọn.',
    category: 'Kiến thức',
    image: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=800&q=80',
    date: '05/04/2026',
  },
  {
    slug: 'xu-huong-noi-that-van-phong-2026',
    title: 'Xu hướng nội thất văn phòng 2026',
    excerpt: 'Các xu hướng thiết kế văn phòng hot nhất năm 2026: biophilic design, tối giản, smart office.',
    category: 'Xu hướng',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
    date: '02/04/2026',
  },
]

export default function BlogPage() {
  return (
    <div className="container-custom py-12">
      <div className="text-center mb-12">
        <h1 className="font-display text-5xl font-bold text-brand-950 mb-4">Blog OFINA</h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Kiến thức, cảm hứng và xu hướng nội thất văn phòng mới nhất từ các chuyên gia
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {POSTS.map(post => (
          <article key={post.slug} className="card group">
            <Link href={`/blog/${post.slug}`} className="block">
              <div className="aspect-video overflow-hidden">
                <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between mb-2 text-xs text-gray-500">
                  <span className="bg-brand-50 text-brand-900 px-2 py-1 rounded font-semibold">{post.category}</span>
                  <span>{post.date}</span>
                </div>
                <h2 className="font-bold text-lg mb-2 group-hover:text-brand-900 line-clamp-2">{post.title}</h2>
                <p className="text-sm text-gray-600 line-clamp-3">{post.excerpt}</p>
              </div>
            </Link>
          </article>
        ))}
      </div>

      <div className="mt-16 text-center">
        <p className="text-gray-600 mb-4">Các bài viết mới sẽ được cập nhật thường xuyên</p>
        <Link href="/san-pham" className="btn-primary">Xem sản phẩm</Link>
      </div>
    </div>
  )
}
