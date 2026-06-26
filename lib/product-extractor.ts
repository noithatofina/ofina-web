/**
 * Product extractor — fetch URL + extract FACTS (specs, dimensions, materials,
 * price, image URLs). KHÔNG paraphrase câu chữ nguồn. Output là dữ liệu thô,
 * Claude writer sẽ viết MỚI từ facts này.
 *
 * Strategy ưu tiên:
 *  1. WooCommerce Store API (/wp-json/wc/store/v1/products) — nhiều site VN dùng
 *  2. JSON-LD schema.org/Product
 *  3. Open Graph + heuristic HTML parsing
 */

export interface ExtractedProduct {
  sourceUrl: string
  name?: string
  price?: number
  originalPrice?: number
  shortDescription?: string
  /** Raw description text — CHỈ dùng làm input cho AI extract facts, KHÔNG paraphrase. */
  rawDescription?: string
  specs?: Record<string, string>
  imageUrls?: string[]
  brand?: string
  categoryHint?: string
}

const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36'

async function fetchText(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': UA, Accept: 'text/html,application/xhtml+xml' },
      signal: AbortSignal.timeout(15000),
    })
    if (!res.ok) return null
    return await res.text()
  } catch {
    return null
  }
}

async function fetchJson(url: string): Promise<any | null> {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': UA, Accept: 'application/json' },
      signal: AbortSignal.timeout(15000),
    })
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

function parseVnPrice(s: string): number | undefined {
  if (!s) return undefined
  const digits = s.replace(/[^\d]/g, '')
  if (!digits) return undefined
  const n = parseInt(digits, 10)
  if (n < 10000 || n > 1_000_000_000) return undefined
  return n
}

function stripHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
}

/** Lấy product qua WC Store API nếu site dùng WooCommerce */
async function tryWooCommerce(url: string): Promise<ExtractedProduct | null> {
  const u = new URL(url)
  const slug = u.pathname.replace(/\/+$/, '').split('/').pop()
  if (!slug) return null
  const apiUrl = `${u.origin}/wp-json/wc/store/v1/products?slug=${encodeURIComponent(slug)}`
  const data = await fetchJson(apiUrl)
  if (!Array.isArray(data) || data.length === 0) return null
  const p = data[0]

  const specs: Record<string, string> = {}
  for (const attr of p.attributes || []) {
    const label = attr.name?.trim()
    const value = (attr.terms || []).map((t: any) => t.name).join(', ')
    if (label && value) specs[label] = value
  }

  return {
    sourceUrl: url,
    name: p.name,
    price: parseVnPrice(p.prices?.price || ''),
    originalPrice: parseVnPrice(p.prices?.regular_price || ''),
    shortDescription: stripHtml(p.short_description || '').slice(0, 600),
    rawDescription: stripHtml(p.description || '').slice(0, 4000),
    specs,
    imageUrls: (p.images || []).map((i: any) => i.src).filter(Boolean).slice(0, 12),
    brand: p.brands?.[0]?.name,
    categoryHint: p.categories?.[0]?.name,
  }
}

/** Lấy product qua JSON-LD schema.org/Product trong HTML */
function tryJsonLd(html: string, url: string): ExtractedProduct | null {
  const ldMatches = html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)
  for (const m of ldMatches) {
    let json: any
    try { json = JSON.parse(m[1].trim()) } catch { continue }
    const items = Array.isArray(json) ? json : [json]
    for (const item of items) {
      const arr = Array.isArray(item['@graph']) ? item['@graph'] : [item]
      for (const node of arr) {
        const type = node['@type']
        if (type === 'Product' || (Array.isArray(type) && type.includes('Product'))) {
          const offer = Array.isArray(node.offers) ? node.offers[0] : node.offers
          const images = Array.isArray(node.image) ? node.image : node.image ? [node.image] : []
          return {
            sourceUrl: url,
            name: node.name,
            price: parseVnPrice(String(offer?.price || '')),
            shortDescription: typeof node.description === 'string' ? node.description.slice(0, 600) : undefined,
            rawDescription: typeof node.description === 'string' ? node.description.slice(0, 4000) : undefined,
            brand: typeof node.brand === 'string' ? node.brand : node.brand?.name,
            imageUrls: images.filter(Boolean).slice(0, 12),
          }
        }
      }
    }
  }
  return null
}

/** Heuristic parse Open Graph + img tags + price patterns trong HTML */
function tryHtmlHeuristic(html: string, url: string): ExtractedProduct {
  const og = (prop: string): string | undefined => {
    const m = html.match(new RegExp(`<meta[^>]+property=["']og:${prop}["'][^>]+content=["']([^"']+)["']`, 'i'))
    return m?.[1]
  }
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i)

  // Tất cả img tag trong HTML
  const imgUrls = new Set<string>()
  const imgMatches = html.matchAll(/<img[^>]+(?:src|data-src|data-lazy-src)=["']([^"']+)["']/gi)
  for (const m of imgMatches) {
    const src = m[1]
    if (src.match(/\.(jpe?g|png|webp|gif)(\?|$)/i) && !src.match(/(icon|logo|avatar|favicon|sprite|placeholder)/i)) {
      try {
        imgUrls.add(new URL(src, url).toString())
      } catch {
        // ignore invalid URLs
      }
    }
  }

  // Tìm các pattern giá VN: 19.900.000đ, 19,900,000 VND, 19.900.000₫
  const pricePatterns = [
    /([\d.,]+)\s*(?:đ|₫|VND)/gi,
  ]
  const prices: number[] = []
  for (const re of pricePatterns) {
    for (const m of html.matchAll(re)) {
      const p = parseVnPrice(m[1])
      if (p) prices.push(p)
    }
  }
  prices.sort((a, b) => a - b)

  return {
    sourceUrl: url,
    name: og('title') || titleMatch?.[1]?.trim().split('|')[0]?.trim(),
    price: prices[0],
    originalPrice: prices.length > 1 ? prices[prices.length - 1] : undefined,
    shortDescription: og('description'),
    rawDescription: undefined,
    imageUrls: [...imgUrls].slice(0, 12),
  }
}

export async function extractProduct(url: string): Promise<ExtractedProduct> {
  // Validate URL
  let parsed: URL
  try { parsed = new URL(url) } catch { throw new Error(`URL không hợp lệ: ${url}`) }
  if (!['http:', 'https:'].includes(parsed.protocol)) throw new Error('URL phải là http(s)')

  // 1. WooCommerce Store API
  const wc = await tryWooCommerce(url)
  if (wc && wc.name) return wc

  // 2. Fetch HTML
  const html = await fetchText(url)
  if (!html) throw new Error(`Không tải được URL: ${url}`)

  // 3. JSON-LD
  const ld = tryJsonLd(html, url)
  if (ld && ld.name) {
    // Có thể bổ sung ảnh + giá từ heuristic nếu LD thiếu
    const heur = tryHtmlHeuristic(html, url)
    return {
      ...heur,
      ...ld,
      imageUrls: (ld.imageUrls && ld.imageUrls.length > 0 ? ld.imageUrls : heur.imageUrls),
      price: ld.price || heur.price,
    }
  }

  // 4. Heuristic
  return tryHtmlHeuristic(html, url)
}
