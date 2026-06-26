/**
 * AI Product Writer — Claude viết MỚI hoàn toàn trang sản phẩm OFINA từ
 * facts đã extract. Không paraphrase câu chữ nguồn — chỉ dùng FACTS (specs,
 * dimensions, materials, features) làm input.
 *
 * Dùng tool-use để ép output structured JSON.
 */

import Anthropic from '@anthropic-ai/sdk'
import { CONTACT } from '@/lib/utils'
import type { ExtractedProduct } from './product-extractor'

const MODEL = 'claude-sonnet-4-6'
const HOTLINE_HN = CONTACT.hotline
const HOTLINE_HCM = CONTACT.branches[1].phones[0]

export interface GeneratedProduct {
  name: string
  slug: string
  short_description: string
  description: string // HTML body (KHÔNG có META prefix — orchestrator tự ghép)
  specs: Record<string, string>
  highlights: string[]
  faq: { q: string; a: string }[]
  seo_title: string
  seo_description: string
  seo_keywords: string[]
}

const SYSTEM_PROMPT = `Bạn là chuyên gia content sản phẩm của OFINA — thương hiệu nội thất văn phòng chính hãng tại Việt Nam (website ofina.vn, hotline HN ${HOTLINE_HN} / HCM ${HOTLINE_HCM}, showroom Hà Nội & TP.HCM, miễn phí giao + lắp nội thành 1-2 ngày, bảo hành 24 tháng).

Nhiệm vụ: dựa trên dữ liệu THÔ về 1 sản phẩm nội thất văn phòng, viết MỚI HOÀN TOÀN một trang sản phẩm chuẩn SEO theo giọng OFINA.

NGUYÊN TẮC TUYỆT ĐỐI:
1. CHỈ dùng SỰ THẬT (specs, kích thước, chất liệu, tính năng kỹ thuật, giá) từ input. KHÔNG bịa số liệu, tính năng, giải thưởng, chứng nhận không có trong input.
2. Viết MỚI bằng giọng OFINA. KHÔNG paraphrase câu chữ từ "rawDescription". rawDescription chỉ để bạn HIỂU sản phẩm — không trích dẫn, không sao chép cấu trúc.
3. KHÔNG nhắc tên website/cửa hàng khác trong content. Không "theo SMA / theo Govi"...
4. Lồng OFINA tự nhiên 2-4 lần, nhắc miễn phí giao + bảo hành 24 tháng khi hợp ngữ cảnh.
5. Nếu input thiếu giá/chất liệu/kích thước → bỏ qua, không bịa. Specs nào không rõ ghi "Đang cập nhật".

CẤU TRÚC BÀI CẦN VIẾT:

A) "name" (H1 sản phẩm): mô tả sản phẩm cao cấp, có thương hiệu nếu có. Tối đa 110 ký tự. VD: "Ghế công thái học XYZ – ghế làm việc cao cấp cho văn phòng hiện đại".

B) "slug": viết-thường-kebab-case, không dấu tiếng Việt, không ký tự đặc biệt.

C) "short_description": 3-5 câu, ≤ 500 ký tự. Nhấn vào tính năng cốt lõi + đối tượng phù hợp + lợi ích.

D) "description" (HTML body — KHÔNG có thẻ <h1>, không có <!--META-->):
   - Mở đầu: <h2>Giới thiệu ngắn về sản phẩm</h2><p>...2-3 đoạn về định vị + đối tượng + giá trị cốt lõi.</p>
   - <h2>Điểm nổi bật của [tên SP]</h2> với 4-6 <h3>tên-tính-năng</h3><p>giải thích...</p>
   - <h2>Phù hợp với ai?</h2> với <ul> 4-5 <li>✅ ...
   - <h2>Lợi ích khi mua tại OFINA</h2> với <ul> 6-7 <li>...
   - Chỉ HTML: <h2>, <h3>, <p>, <ul>, <ol>, <li>, <strong>, <em>, <table>, <tr>, <td>, <th>
   - KHÔNG inline style/class/script/img. KHÔNG dùng <h1>.

E) "specs" (object): khoá là tên thông số tiếng Việt (vd "Chất liệu khung", "Tải trọng tối đa"), value là giá trị cụ thể. Tối thiểu 8 specs nếu input đủ — bao gồm: Thương hiệu, Mã sản phẩm, Chất liệu khung/vải, Kích thước (nếu có), Tải trọng, Bảo hành, Xuất xứ.

F) "highlights" (array 6-8 chuỗi): mỗi dòng 1 lợi ích/tính năng cốt lõi, ngắn gọn dưới 100 ký tự.

G) "faq" (array 5 object {q, a}): câu hỏi thực tế khách hay hỏi.
   - "Sản phẩm này phù hợp với ai?"
   - "Có phù hợp ngồi/dùng nhiều giờ không?"
   - "Có bảo hành không?"
   - "OFINA có hỗ trợ giao hàng và lắp đặt không?"
   - "Doanh nghiệp mua số lượng có báo giá riêng không?"
   - Câu trả lời 2-4 câu, có call-to-action nhẹ về OFINA.

H) "seo_title": ≤ 60 ký tự, kèm "| OFINA". VD: "Ghế công thái học XYZ chính hãng | OFINA".

I) "seo_description": 140-160 ký tự, có CTA "Tư vấn tại OFINA" hoặc tương đương.

J) "seo_keywords" (array 5-8): từ khoá liên quan SEO tiếng Việt (kebab-case-có-dấu OK), bao gồm tên SP + biến thể + đối tượng.`

const PRODUCT_TOOL: Anthropic.Tool = {
  name: 'save_product_page',
  description: 'Lưu trang sản phẩm OFINA đã viết MỚI hoàn toàn từ facts.',
  input_schema: {
    type: 'object',
    properties: {
      name: { type: 'string' },
      slug: { type: 'string' },
      short_description: { type: 'string' },
      description: { type: 'string', description: 'HTML body' },
      specs: { type: 'object', additionalProperties: { type: 'string' } },
      highlights: { type: 'array', items: { type: 'string' } },
      faq: {
        type: 'array',
        items: {
          type: 'object',
          properties: { q: { type: 'string' }, a: { type: 'string' } },
          required: ['q', 'a'],
        },
      },
      seo_title: { type: 'string' },
      seo_description: { type: 'string' },
      seo_keywords: { type: 'array', items: { type: 'string' } },
    },
    required: ['name', 'slug', 'short_description', 'description', 'specs', 'highlights', 'faq', 'seo_title', 'seo_description', 'seo_keywords'],
  },
}

function normalizeSlug(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'd')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80)
}

export async function generateProductPage(input: ExtractedProduct): Promise<GeneratedProduct> {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) throw new Error('Thiếu ANTHROPIC_API_KEY')
  const client = new Anthropic({ apiKey })

  const userPayload = {
    name: input.name || 'Sản phẩm nội thất văn phòng',
    brand: input.brand,
    categoryHint: input.categoryHint,
    price: input.price,
    originalPrice: input.originalPrice,
    short_description_source: input.shortDescription || null,
    raw_description_source: input.rawDescription || null,
    specs_source: input.specs || {},
    image_count: input.imageUrls?.length || 0,
    source_url: input.sourceUrl,
  }

  const message = await client.messages.create({
    model: MODEL,
    max_tokens: 4096,
    temperature: 0.6,
    system: [{ type: 'text', text: SYSTEM_PROMPT, cache_control: { type: 'ephemeral' } }],
    tools: [PRODUCT_TOOL],
    tool_choice: { type: 'tool', name: 'save_product_page' },
    messages: [
      {
        role: 'user',
        content: `Dữ liệu thô về sản phẩm (chỉ dùng FACTS, KHÔNG paraphrase rawDescription):\n\`\`\`json\n${JSON.stringify(userPayload, null, 2)}\n\`\`\`\n\nHãy viết MỚI hoàn toàn trang sản phẩm OFINA. Gọi tool save_product_page.`,
      },
    ],
  })

  const toolUse = message.content.find((b): b is Anthropic.ToolUseBlock => b.type === 'tool_use')
  if (!toolUse) throw new Error('Claude không trả tool_use')
  const out = toolUse.input as GeneratedProduct

  return {
    ...out,
    slug: normalizeSlug(out.slug || out.name),
  }
}
