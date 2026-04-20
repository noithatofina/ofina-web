import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase-admin'

export const metadata = {
  title: 'Blog — Kiến thức nội thất văn phòng | OFINA',
  description: 'Cẩm nang chọn nội thất văn phòng, mẹo setup không gian làm việc, xu hướng thiết kế 2026.',
}

export const revalidate = 300

export default async function BlogPage() {
  const admin = createAdminClient()
  const { data: posts } = await admin
    .from('blog_posts')
    .select('id,slug,title,excerpt,cover_image,category,published_at')
    .eq('is_published', true)
    .order('published_at', { ascending: false })
    .limit(60)

  return (
    <div className="container-custom py-12">
      <div className="text-center mb-12">
        <h1 className="font-display text-5xl font-bold text-brand-950 mb-4">Blog OFINA</h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Kiến thức, cảm hứng và xu hướng nội thất văn phòng mới nhất từ các chuyên gia
        </p>
      </div>

      {posts && posts.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <article key={post.id} className="card group">
              <Link href={`/blog/${post.slug}`} className="block">
                <div className="aspect-video overflow-hidden bg-brand-50">
                  {post.cover_image && (
                    <img
                      src={post.cover_image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  )}
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between mb-2 text-xs text-gray-500">
                    {post.category && (
                      <span className="bg-brand-50 text-brand-900 px-2 py-1 rounded font-semibold">
                        {post.category}
                      </span>
                    )}
                    {post.published_at && (
                      <span>
                        {new Date(post.published_at).toLocaleDateString('vi-VN')}
                      </span>
                    )}
                  </div>
                  <h2 className="font-bold text-lg mb-2 group-hover:text-brand-900 line-clamp-2">
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p className="text-sm text-gray-600 line-clamp-3">{post.excerpt}</p>
                  )}
                </div>
              </Link>
            </article>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-gray-500 mb-6">Blog đang được cập nhật. Các bài viết mới sẽ sớm có mặt.</p>
          <Link href="/san-pham" className="btn-primary">
            Xem sản phẩm
          </Link>
        </div>
      )}

      {posts && posts.length > 0 && (
        <div className="mt-16 text-center">
          <p className="text-gray-600 mb-4">Các bài viết mới được cập nhật thường xuyên</p>
          <Link href="/san-pham" className="btn-primary">
            Xem sản phẩm
          </Link>
        </div>
      )}
    </div>
  )
}
