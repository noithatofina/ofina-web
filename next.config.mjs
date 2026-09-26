/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    loader: 'custom',
    loaderFile: './lib/supabase-image-loader.ts',
    remotePatterns: [
      { protocol: 'https', hostname: '*.supabase.co' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  compress: true,
  poweredByHeader: false,
  async redirects() {
    // Dọn 13 bài blog trùng chủ đề (bot spin 06-07/2026) — 301 về bài giữ lại.
    const keeper = '/blog/cach-chon-ghe-cong-thai-hoc-chong-dau-lung'
    const duplicated = [
      'cach-chon-ghe-cong-thai-hoc-phu-hop-de-chong-dau-lung-r5ym',
      'cach-chon-ghe-cong-thai-hoc-chong-dau-lung-n8q2',
      'cach-chon-ghe-cong-thai-hoc-phu-hop-de-chong-dau-lung-g2gh',
      'cach-chon-ghe-cong-thai-hoc-chong-dau-lung-iy9c',
      'cach-chon-ghe-cong-thai-hoc-chong-dau-lung-pjwk',
      'cach-chon-ghe-cong-thai-hoc-chong-dau-lung-qa6h',
      'cach-chon-ghe-cong-thai-hoc-chong-dau-lung-oims',
      'cach-chon-ghe-cong-thai-hoc-chong-dau-lung-lkln',
      'cach-chon-ghe-cong-thai-hoc-phu-hop-de-chong-dau-lung-cwyp',
      'cach-chon-ghe-cong-thai-hoc-chong-dau-lung-h6mo',
      'cach-chon-ghe-cong-thai-hoc-phu-hop-de-chong-dau-lung-tncl',
      'cach-chon-ghe-cong-thai-hoc-chong-dau-lung-xwco',
      'cach-chon-ghe-cong-thai-hoc-phu-hop-de-chong-dau-lung-mduc',
    ]
    return duplicated.map((slug) => ({
      source: `/blog/${slug}`,
      destination: keeper,
      permanent: true,
    }))
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ]
  },
}

export default nextConfig
