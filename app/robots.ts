import type { MetadataRoute } from 'next'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://ofina.vn'

// Bot của các Answer Engine 2026 — cho phép đọc để OFINA được trích dẫn
// trong câu trả lời AI (ChatGPT, Claude, Perplexity, Gemini, Google AI Overviews).
const AI_BOTS = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-Web',
  'PerplexityBot',
  'Google-Extended',
  'Applebot-Extended',
  'Bingbot',
]

const DISALLOW = ['/api/', '/gio-hang', '/thanh-toan', '/tra-cuu-don-hang', '/admin']

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: DISALLOW,
      },
      // Chào đón AI crawler một cách tường minh (vẫn chặn các path riêng tư)
      {
        userAgent: AI_BOTS,
        allow: '/',
        disallow: DISALLOW,
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
