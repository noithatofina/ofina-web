import Link from 'next/link'
import type { Metadata } from 'next'
import { ChevronRight } from 'lucide-react'
import { createAdminClient } from '@/lib/supabase-admin'

export const revalidate = 300

async function getPost(slug: string) {
  const admin = createAdminClient()
  const { data } = await admin
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .maybeSingle()
  return data
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) {
    return {
      title: 'Bài viết đang cập nhật | OFINA',
    }
  }
  const title = post.seo_title || post.title
  const description = post.seo_description || post.excerpt || 'Bài viết từ OFINA — Nội thất văn phòng.'
  return {
    title: { absolute: `${title} | OFINA Blog` },
    description,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      type: 'article',
      title,
      description,
      url: `https://ofina.vn/blog/${slug}`,
      images: post.cover_image
        ? [{ url: post.cover_image, width: 1200, height: 630, alt: post.title }]
        : undefined,
      publishedTime: post.published_at || undefined,
      authors: post.author ? [post.author] : undefined,
      tags: post.tags || undefined,
    },
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await getPost(slug)

  if (!post) {
    return (
      <div className="container-custom py-12 max-w-3xl">
        <nav className="text-sm text-gray-500 mb-6 flex items-center gap-2">
          <Link href="/" className="hover:text-brand-900">
            Trang chủ
          </Link>
          <ChevronRight className="w-4 h-4" />
          <Link href="/blog" className="hover:text-brand-900">
            Blog
          </Link>
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
              <Link href="/danh-muc/ghe-van-phong" className="btn-primary">
                Ghế văn phòng
              </Link>
              <Link href="/danh-muc/ban-lam-viec" className="btn-ghost">
                Bàn làm việc
              </Link>
              <Link href="/blog" className="btn-ghost">
                ← Về Blog
              </Link>
            </div>
          </div>
        </article>
      </div>
    )
  }

  const publishedStr = post.published_at
    ? new Date(post.published_at).toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
    : null

  return (
    <div className="container-custom py-12 max-w-3xl">
      <nav className="text-sm text-gray-500 mb-6 flex items-center gap-2">
        <Link href="/" className="hover:text-brand-900">
          Trang chủ
        </Link>
        <ChevronRight className="w-4 h-4" />
        <Link href="/blog" className="hover:text-brand-900">
          Blog
        </Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-700 line-clamp-1">{post.title}</span>
      </nav>

      <article>
        <div className="flex items-center gap-3 mb-4 text-sm text-gray-500">
          {post.category && (
            <span className="bg-brand-50 text-brand-900 px-2 py-1 rounded font-semibold">
              {post.category}
            </span>
          )}
          {publishedStr && <span>{publishedStr}</span>}
          {post.author && <span>· {post.author}</span>}
        </div>

        <h1 className="font-display text-4xl font-bold text-brand-950 mb-4">{post.title}</h1>

        {post.excerpt && <p className="text-lg text-gray-600 mb-8">{post.excerpt}</p>}

        {post.cover_image && (
          <div className="aspect-video overflow-hidden rounded-2xl mb-8">
            <img src={post.cover_image} alt={post.title} className="w-full h-full object-cover" />
          </div>
        )}

        <div
          className="blog-content"
          dangerouslySetInnerHTML={{ __html: post.content || '' }}
        />

        {post.tags && post.tags.length > 0 && (
          <div className="mt-12 pt-6 border-t border-gray-200">
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="mt-12 pt-6 border-t border-gray-200 flex items-center justify-between">
          <Link href="/blog" className="btn-ghost">
            ← Về Blog
          </Link>
          <Link href="/san-pham" className="btn-primary">
            Xem sản phẩm
          </Link>
        </div>
      </article>
    </div>
  )
}
