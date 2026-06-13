/**
 * AI Content Writer — sinh bài blog chuẩn SEO bằng Claude API.
 *
 * Dùng tool-use để ép output có cấu trúc (không phải parse text tự do).
 * Có prompt caching cho system prompt (TTL 5 phút) để rẻ hơn khi chạy chùm.
 *
 * Env: ANTHROPIC_API_KEY
 */

import Anthropic from '@anthropic-ai/sdk'
import type { SeoTopic } from './seo-topics'

const MODEL = 'claude-sonnet-4-6'

export interface GeneratedPost {
  title: string
  slug: string
  excerpt: string
  content: string // HTML
  seo_title: string
  seo_description: string
  tags: string[]
  category: string
}

const SYSTEM_PROMPT = `Bạn là chuyên gia content SEO của OFINA — thương hiệu nội thất văn phòng cao cấp, chính hãng tại Việt Nam (website ofina.vn, hotline 0325669996, showroom Hà Nội & TP.HCM, bảo hành 24 tháng, giao lắp tận nơi).

Nhiệm vụ: viết một bài blog tiếng Việt chuẩn SEO cho khách hàng đang tìm hiểu/mua nội thất văn phòng.

YÊU CẦU NỘI DUNG:
- Giọng văn chuyên nghiệp, hữu ích, đáng tin — KHÔNG sáo rỗng, KHÔNG nhồi từ khoá lộ liễu.
- Dài 900–1400 từ, chia rõ heading (H2/H3), có đoạn mở bài hấp dẫn và kết bài kêu gọi hành động nhẹ nhàng (tư vấn/xem sản phẩm tại OFINA).
- Viết dạng dễ trích dẫn cho AI: có câu trả lời ngắn gọn, súc tích cho các câu hỏi chính; dùng bullet/đánh số khi liệt kê.
- Thông tin chính xác, thực tế với thị trường VN. KHÔNG bịa số liệu, KHÔNG bịa giải thưởng/chứng nhận.
- Lồng ghép tên thương hiệu OFINA tự nhiên (2–4 lần), nhắc bảo hành 24 tháng/giao lắp tận nơi khi hợp ngữ cảnh.
- Nếu được cung cấp internalLinks, chèn 1–2 link nội bộ tự nhiên trong bài bằng thẻ <a href="...">.

ĐỊNH DẠNG content (HTML):
- Chỉ dùng các thẻ: <h2>, <h3>, <p>, <ul>, <ol>, <li>, <strong>, <em>, <a>, <blockquote>, <table>, <tr>, <td>, <th>.
- KHÔNG dùng <h1> (tiêu đề bài đã là H1). KHÔNG dùng inline style, class, script, hình ảnh.
- Mở đầu bằng <p>, không bọc toàn bài trong 1 thẻ wrapper.

YÊU CẦU SEO META:
- title: tiêu đề bài hấp dẫn, chứa từ khoá chính, ≤ 65 ký tự, KHÔNG kèm "| OFINA".
- slug: viết-thường-có-dấu-gạch-ngang, không dấu tiếng Việt, không ký tự đặc biệt.
- excerpt: tóm tắt 1–2 câu (≤ 160 ký tự).
- seo_title: ≤ 60 ký tự, có thể khác title đôi chút để tối ưu CTR.
- seo_description: ≤ 155 ký tự, kêu gọi click, chứa từ khoá.
- tags: 3–6 từ khoá liên quan.`

const POST_TOOL: Anthropic.Tool = {
  name: 'save_blog_post',
  description: 'Lưu bài blog đã viết xong với đầy đủ nội dung và metadata SEO.',
  input_schema: {
    type: 'object',
    properties: {
      title: { type: 'string', description: 'Tiêu đề bài (H1), ≤65 ký tự, không kèm | OFINA' },
      slug: { type: 'string', description: 'Slug không dấu, dạng kebab-case' },
      excerpt: { type: 'string', description: 'Tóm tắt 1-2 câu ≤160 ký tự' },
      content: { type: 'string', description: 'Nội dung bài viết dạng HTML (h2/h3/p/ul/...)' },
      seo_title: { type: 'string', description: 'SEO title ≤60 ký tự' },
      seo_description: { type: 'string', description: 'SEO meta description ≤155 ký tự' },
      tags: { type: 'array', items: { type: 'string' }, description: '3-6 tags' },
    },
    required: ['title', 'slug', 'excerpt', 'content', 'seo_title', 'seo_description', 'tags'],
  },
}

/** Bỏ dấu tiếng Việt + chuẩn hoá slug (phòng khi model trả slug chưa chuẩn) */
function normalizeSlug(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'd')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export async function generateBlogPost(topic: SeoTopic): Promise<GeneratedPost> {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) throw new Error('Thiếu ANTHROPIC_API_KEY')

  const client = new Anthropic({ apiKey })

  const internalHint = topic.internalLinks?.length
    ? `\n\nLink nội bộ nên chèn tự nhiên trong bài (dùng <a href="...">): ${topic.internalLinks.join(', ')}`
    : ''

  const userPrompt = `Viết bài blog cho chủ đề/từ khoá: "${topic.keyword}".
Danh mục blog: ${topic.category}.${internalHint}

Sau khi viết xong, gọi tool save_blog_post với đầy đủ các trường.`

  const resp = await client.messages.create({
    model: MODEL,
    max_tokens: 8000,
    system: [{ type: 'text', text: SYSTEM_PROMPT, cache_control: { type: 'ephemeral' } }],
    tools: [POST_TOOL],
    tool_choice: { type: 'tool', name: 'save_blog_post' },
    messages: [{ role: 'user', content: userPrompt }],
  })

  const toolUse = resp.content.find((b): b is Anthropic.ToolUseBlock => b.type === 'tool_use')
  if (!toolUse) throw new Error('Claude không trả về tool_use')

  const data = toolUse.input as Record<string, any>

  return {
    title: String(data.title || topic.keyword).trim(),
    slug: normalizeSlug(String(data.slug || topic.keyword)),
    excerpt: String(data.excerpt || '').trim(),
    content: String(data.content || '').trim(),
    seo_title: String(data.seo_title || data.title || '').trim(),
    seo_description: String(data.seo_description || data.excerpt || '').trim(),
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    category: topic.category,
  }
}
