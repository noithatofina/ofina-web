/**
 * Database queries wrapper.
 *
 * Hiện tại dùng MOCK DATA để dev nhanh.
 * Khi Supabase được setup (env NEXT_PUBLIC_SUPABASE_URL có giá trị), tự động
 * chuyển sang query Supabase thật.
 *
 * Public reads dùng `createPublicSupabase()` — KHÔNG đọc cookies → cho phép
 * Next.js static-cache page (TTFB từ ~4s xuống ~0.3s).
 */

import type { Product, Category } from './supabase'
import { unstable_cache } from 'next/cache'
import { createPublicSupabase } from './supabase-public'
import { publicImageUrl } from './image-url'
import type { CollectionFilter } from './collections'

const USE_SUPABASE = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL)

/**
 * Điều kiện "sản phẩm bán được".
 *
 * Trước đây mọi nơi dùng `.gt('price', 0)` làm phép lọc rác — nhưng từ khi có hạng mục
 * báo giá theo đơn (cabin cách âm nhập khẩu, vách ngăn…) thì price = 0 là HỢP LỆ, đi
 * kèm is_price_hidden = true. Lọc theo giá làm 103 sản phẩm loại này biến mất khỏi
 * trang chủ, trang hàng mới và khối sản phẩm liên quan.
 *
 * Dùng `.or(BAN_DUOC)` thay cho `.gt('price', 0)` ở những chỗ ý định là "sản phẩm thật",
 * và GIỮ `.gt('price', 0)` ở chỗ ý định đúng là "phải có giá" — sắp theo giá, trang
 * khuyến mãi.
 */
const BAN_DUOC = 'price.gt.0,is_price_hidden.eq.true'

// ============ MOCK DATA ============
const MOCK_CATEGORIES: Category[] = [
  { id: '1', slug: 'ghe-van-phong', name: 'Ghế văn phòng', parent_id: null, description: null, image: 'https://images.unsplash.com/photo-1567016376408-0226e4d0c1ea?w=600&q=80', product_count: 450 },
  { id: '2', slug: 'ban-lam-viec', name: 'Bàn làm việc', parent_id: null, description: null, image: 'https://images.unsplash.com/photo-1518051870910-a46e30d9db16?w=600&q=80', product_count: 340 },
  { id: '3', slug: 'tu-ho-so', name: 'Tủ hồ sơ', parent_id: null, description: null, image: 'https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=600&q=80', product_count: 280 },
  { id: '4', slug: 'sofa-van-phong', name: 'Sofa văn phòng', parent_id: null, description: null, image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80', product_count: 166 },
  { id: '5', slug: 'ban-hop', name: 'Bàn họp', parent_id: null, description: null, image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=600&q=80', product_count: 180 },
  { id: '6', slug: 'ghe-cong-thai-hoc', name: 'Ghế công thái học', parent_id: null, description: null, image: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=600&q=80', product_count: 29 },
  { id: '7', slug: 'ban-nang-ha', name: 'Bàn nâng hạ', parent_id: null, description: null, image: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600&q=80', product_count: 22 },
  { id: '8', slug: 'ke-trang-tri', name: 'Kệ trang trí', parent_id: null, description: null, image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&q=80', product_count: 33 },
]

const SAMPLE_PRODUCTS: Partial<Product>[] = [
  {
    id: 'p1', slug: 'ghe-xoay-van-phong-ofn-gxv-0001', ofina_sku: 'OFN-GXV-0001',
    name: 'Ghế xoay văn phòng công thái học GL117',
    price: 2800000, compare_price: 3500000,
    primary_image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=500&q=80',
    avg_rating: 0, review_count: 0, is_bestseller: true,
  },
  {
    id: 'p2', slug: 'ghe-da-giam-doc-ofn-gdgd-0001', ofina_sku: 'OFN-GDGD-0001',
    name: 'Ghế da giám đốc cao cấp B520',
    price: 6900000, compare_price: 7500000,
    primary_image: 'https://images.unsplash.com/photo-1541558869434-2840d308329a?w=500&q=80',
    avg_rating: 0, review_count: 0, is_new: true,
  },
  {
    id: 'p3', slug: 'ban-lam-viec-chan-sat-ofn-blvs-0001', ofina_sku: 'OFN-BLVS-0001',
    name: 'Bàn làm việc chân sắt mặt gỗ 1m4',
    price: 1890000, compare_price: 2100000,
    primary_image: 'https://images.unsplash.com/photo-1518051870910-a46e30d9db16?w=500&q=80',
    avg_rating: 0, review_count: 0, is_bestseller: true,
  },
  {
    id: 'p4', slug: 'ban-nang-ha-2-motor-ofn-bnh2-0001', ofina_sku: 'OFN-BNH2-0001',
    name: 'Bàn nâng hạ điện 2 motor cao cấp',
    price: 8900000, compare_price: 9900000,
    primary_image: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=500&q=80',
    avg_rating: 0, review_count: 0, is_new: true,
  },
  {
    id: 'p5', slug: 'ghe-xoay-luoi-ofn-gxl-0001', ofina_sku: 'OFN-GXL-0001',
    name: 'Ghế xoay lưới lưng cao GV8801',
    price: 1690000, compare_price: 1990000,
    primary_image: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=500&q=80',
    avg_rating: 0, review_count: 0, is_bestseller: true,
  },
  {
    id: 'p6', slug: 'tu-ho-so-cao-ofn-thsc-0001', ofina_sku: 'OFN-THSC-0001',
    name: 'Tủ hồ sơ cao 3 tầng có khóa',
    price: 2390000, compare_price: 2800000,
    primary_image: 'https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=500&q=80',
    avg_rating: 0, review_count: 0,
  },
  {
    id: 'p7', slug: 'sofa-van-phong-ofn-sfv-0001', ofina_sku: 'OFN-SFV-0001',
    name: 'Sofa văn phòng 3 chỗ ngồi bọc da PU',
    price: 5890000, compare_price: 6500000,
    primary_image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&q=80',
    avg_rating: 0, review_count: 0, is_new: true,
  },
  {
    id: 'p8', slug: 'ban-hop-ofn-bhvs-0001', ofina_sku: 'OFN-BHVS-0001',
    name: 'Bàn họp văn phòng 2m4 chân sắt',
    price: 4290000, compare_price: 4800000,
    primary_image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=500&q=80',
    avg_rating: 0, review_count: 0, is_bestseller: true,
  },
]

// ============ QUERIES ============

/**
 * Liệt kê TƯỜNG MINH cột gửi ra trang công khai. Trước đây dùng `*` nên mọi cột
 * nội bộ đều lọt vào payload RSC và ai xem mã trang cũng đọc được — đo 12/10/2026
 * thấy govi_sku, cost_price, source_price, source_url, imported_at, search_vector
 * đều hiện trên từng trang sản phẩm.
 *
 * ⛔ TUYỆT ĐỐI không thêm lại vào đây:
 *   cost_price, source_price, source_url  → giá vốn và nguồn nhập, đối thủ đọc được
 *   govi_sku, imported_at                 → lộ nguồn dữ liệu
 *   search_vector                         → không dùng tới, chỉ làm nặng trang
 */
const PRODUCT_SELECT = `
  id, ofina_sku, slug, name, brand,
  short_description, description,
  price, compare_price, low_price, high_price, is_price_hidden,
  in_stock, stock_quantity, category_id,
  is_featured, is_bestseller, is_new, is_sale, status,
  seo_title, seo_description, seo_keywords,
  avg_rating, review_count, view_count, sale_count,
  created_at, updated_at,
  product_images(url, position, is_primary, alt_text)
`

function mapProduct(p: any) {
  if (!p) return p
  const imgs = (p.product_images || []).sort((a: any, b: any) => a.position - b.position)
  const primary = imgs.find((i: any) => i.is_primary)?.url || imgs[0]?.url || null
  // bỏ product_images thô: URL Supabase gốc không dùng tới nhưng vẫn bị đẩy
  // nguyên vào payload RSC, vừa nặng trang vừa lộ URL bị chặn index
  const { product_images: _raw, ...rest } = p
  return {
    ...rest,
    // qua proxy /img để Google Images không bị Supabase chặn bằng x-robots-tag
    images: imgs.map((i: any) => publicImageUrl(i.url)),
    // mô tả riêng từng ảnh, viết tay theo nội dung tấm ảnh. Thiếu thì để rỗng
    // và để thư viện ảnh tự sinh nhãn mặc định.
    image_alts: imgs.map((i: any) => i.alt_text || ''),
    primary_image: primary ? publicImageUrl(primary) : null,
  }
}


/**
 * Bản rút gọn cho DANH SÁCH sản phẩm (thẻ sản phẩm, dải trang chủ, sản phẩm liên quan).
 *
 * Thẻ sản phẩm chỉ dùng: name, slug, ofina_sku, price, compare_price, is_price_hidden,
 * primary_image, images, is_new, is_bestseller. Nhưng `mapProduct` trả về NGUYÊN bản ghi,
 * nên toàn bộ `description` của từng sản phẩm bị Next đẩy vào payload RSC của trang
 * danh sách. Đo 14/10/2026 trên /danh-muc/cabin-cach-am-di-dong: 61.442 ký tự mô tả
 * trong một trang 297.813 ký tự — khoảng 20% trang, không hiển thị gì.
 *
 * Giữ `short_description` vì một số dải có hiển thị; bỏ `description` và nhóm seo_*.
 */
function mapCard(p: any) {
  const m = mapProduct(p)
  if (!m) return m
  const { description: _d, seo_title: _t, seo_description: _sd, seo_keywords: _k,
    image_alts: _a, ...nhe } = m
  return nhe
}


export async function getHomepageData() {
  if (!USE_SUPABASE) {
    return {
      categories: MOCK_CATEGORIES,
      bestsellers: SAMPLE_PRODUCTS.filter(p => p.is_bestseller),
      featured: SAMPLE_PRODUCTS.slice(0, 4),
      newest: SAMPLE_PRODUCTS.filter(p => p.is_new),
    }
  }

  const supabase = createPublicSupabase()

  const FEATURED_SLUGS = [
    'ghe-xoay-van-phong',
    'ghe-da-giam-doc',
    'ghe-cong-thai-hoc',
    'ban-lam-viec-chan-sat',
    'ban-hop-van-phong-chan-sat',
    'ban-nang-ha-thong-minh',
    'tu-ho-so-cao',
    'sofa-van-phong',
  ]

  // ⚠️ Hai biến này TỪNG bị đặt tên ngược nhau: thứ trả về dưới tên `newest` lại là
  // truy vấn sắp theo GIÁ giảm dần, nên tab "Mới 2026" ngoài trang chủ thực chất đang
  // hiện 8 sản phẩm đắt nhất. Sáu cabin nhập mới nhất (giá 0, báo giá theo đơn) vì thế
  // không bao giờ lọt vào. Đã đặt lại tên theo đúng cái nó sắp xếp.
  const [categoriesRes, moiNhatRes, datNhatRes] = await Promise.all([
    supabase.from('categories').select('*').in('slug', FEATURED_SLUGS),
    supabase.from('products').select(PRODUCT_SELECT).eq('status', 'active').or(BAN_DUOC).order('created_at', { ascending: false }).limit(8),
    supabase.from('products').select(PRODUCT_SELECT).eq('status', 'active').gt('price', 0).order('price', { ascending: false }).limit(8),
  ])

  const moiNhat = (moiNhatRes.data || []).map(mapCard)
  const datNhat = (datNhatRes.data || []).map(mapCard)

  const categoryImageFallback: Record<string, string> = {
    'ghe-xoay-van-phong': 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=600&q=80',
    'ghe-da-giam-doc': 'https://images.unsplash.com/photo-1541558869434-2840d308329a?w=600&q=80',
    'ghe-cong-thai-hoc': 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=600&q=80',
    'ban-lam-viec-chan-sat': 'https://images.unsplash.com/photo-1518051870910-a46e30d9db16?w=600&q=80',
    'ban-hop-van-phong-chan-sat': 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=600&q=80',
    'ban-nang-ha-thong-minh': 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600&q=80',
    'tu-ho-so-cao': 'https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=600&q=80',
    'sofa-van-phong': 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80',
  }

  // Fix N+1: gộp 8 count queries thành 1 query rồi count trong JS.
  // 8 categories × ~hàng nghìn rows = vài chục KB transfer, cache 1h ở page level.
  const categoryIds = (categoriesRes.data || []).map((c: any) => c.id)
  const counts: Record<string, number> = {}
  if (categoryIds.length > 0) {
    const { data: countRows } = await supabase
      .from('products')
      .select('category_id')
      .in('category_id', categoryIds)
      .eq('status', 'active')
    for (const row of countRows || []) {
      counts[row.category_id] = (counts[row.category_id] || 0) + 1
    }
  }

  const categoriesWithImage = FEATURED_SLUGS
    .map(slug => {
      const c = (categoriesRes.data || []).find((c: any) => c.slug === slug)
      if (!c) return null
      return {
        ...c,
        image: publicImageUrl(c.image) || categoryImageFallback[c.slug] || 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80',
        product_count: counts[c.id] || 0,
      }
    })
    .filter(Boolean)

  return {
    categories: categoriesWithImage.length ? categoriesWithImage : MOCK_CATEGORIES,
    bestsellers: datNhat,
    newest: moiNhat,
    featured: datNhat.slice(0, 4),
  }
}

/**
 * Lấy sản phẩm cho một Bộ sưu tập (programmatic SEO landing page).
 * Gom sản phẩm active từ nhiều danh mục + lọc giá, có phân trang.
 */
export async function getCollectionProducts(
  filter: CollectionFilter,
  opts: { limit?: number; offset?: number; sort?: string } = {}
) {
  const { limit = 24, offset = 0, sort = 'newest' } = opts

  if (!USE_SUPABASE) {
    return { products: SAMPLE_PRODUCTS, total: SAMPLE_PRODUCTS.length }
  }
  const supabase = createPublicSupabase()

  let q = supabase
    .from('products')
    .select(PRODUCT_SELECT, { count: 'exact' })
    .eq('status', 'active')
    .or(BAN_DUOC)

  if (filter.productSlugs?.length) {
    // Bộ sưu tập chốt đích danh sản phẩm (xem CollectionFilter.productSlugs)
    q = q.in('slug', filter.productSlugs)
  } else {
    const { data: cats } = await supabase
      .from('categories')
      .select('id')
      .in('slug', filter.categorySlugs)
    const ids = (cats || []).map((c: any) => c.id)
    if (ids.length === 0) return { products: [], total: 0 }
    q = q.in('category_id', ids)
  }

  if (filter.priceMin && filter.priceMin > 0) q = q.gte('price', filter.priceMin)
  if (filter.priceMax && filter.priceMax > 0) q = q.lte('price', filter.priceMax)
  if (filter.isBestseller) q = q.eq('is_bestseller', true)

  if (sort === 'price-asc') q = q.order('price', { ascending: true })
  else if (sort === 'price-desc') q = q.order('price', { ascending: false })
  else if (sort === 'name') q = q.order('name', { ascending: true })
  else q = q.order('created_at', { ascending: false })

  q = q.range(offset, offset + limit - 1)

  const { data, count } = await q
  return { products: (data || []).map(mapCard), total: count || 0 }
}

/**
 * Trang sản phẩm chi tiết là 2.664 URL — nếu mỗi lượt Googlebot cào đều
 * truy vấn DB thì trang trả no-store, CDN luôn MISS và ngân sách cào bị
 * bào mòn. Bọc unstable_cache (cách đã dùng cho site-settings) để route
 * được prerender + ISR. Sửa sản phẩm trong /admin có gọi /api/revalidate
 * nên vẫn hiện ngay.
 */
const PRODUCT_CACHE_TTL = 3600

async function fetchProductBySlug(slug: string) {
  const supabase = createPublicSupabase()
  const { data } = await supabase.from('products').select(PRODUCT_SELECT).eq('slug', slug).eq('status', 'active').maybeSingle()
  return mapProduct(data)
}

export async function getProductBySlug(slug: string) {
  if (!USE_SUPABASE) {
    return SAMPLE_PRODUCTS.find(p => p.slug === slug) || null
  }
  return unstable_cache(
    () => fetchProductBySlug(slug),
    ['product-by-slug', slug],
    { revalidate: PRODUCT_CACHE_TTL, tags: ['products'] },
  )()
}

export async function getRelatedProducts(opts: { productId: string; categoryId?: string | null; limit?: number }) {
  const { productId, categoryId, limit = 8 } = opts
  if (!USE_SUPABASE) return SAMPLE_PRODUCTS.slice(0, limit)
  return unstable_cache(
    () => fetchRelatedProducts(productId, categoryId, limit),
    ['related-products', productId, String(categoryId), String(limit)],
    { revalidate: PRODUCT_CACHE_TTL, tags: ['products'] },
  )()
}

async function fetchRelatedProducts(productId: string, categoryId: string | null | undefined, limit: number) {
  const supabase = createPublicSupabase()

  let q = supabase
    .from('products')
    .select(PRODUCT_SELECT)
    .eq('status', 'active')
    .or(BAN_DUOC)
    .neq('id', productId)
    .limit(limit)

  if (categoryId) q = q.eq('category_id', categoryId)

  const { data } = await q
  return (data || []).map(mapCard)
}

export async function getCategoryById(id: string) {
  if (!USE_SUPABASE) return null
  return unstable_cache(
    async () => {
      const supabase = createPublicSupabase()
      const { data } = await supabase.from('categories').select('id, slug, name').eq('id', id).maybeSingle()
      return data
    },
    ['category-by-id', id],
    { revalidate: PRODUCT_CACHE_TTL, tags: ['categories'] },
  )()
}

export async function getNewProductsByCategory(categorySlugs: string[], limit = 8) {
  if (!USE_SUPABASE) return SAMPLE_PRODUCTS.slice(0, limit)
  if (categorySlugs.length === 0) return []
  const supabase = createPublicSupabase()

  const { data: cats } = await supabase
    .from('categories')
    .select('id')
    .in('slug', categorySlugs)
  if (!cats || cats.length === 0) return []

  const catIds = cats.map((c: any) => c.id)
  const { data } = await supabase
    .from('products')
    .select(PRODUCT_SELECT)
    .eq('status', 'active')
    .or(BAN_DUOC)
    .in('category_id', catIds)
    .order('created_at', { ascending: false })
    .limit(limit)

  return (data || []).map(mapCard)
}

/** Public: query 1 product by slug — dùng riêng cho hero featured ở homepage. */
export async function getProductBySlugPublic(slug: string) {
  if (!USE_SUPABASE) return SAMPLE_PRODUCTS.find(p => p.slug === slug) || null
  const supabase = createPublicSupabase()
  const { data } = await supabase
    .from('products')
    .select(PRODUCT_SELECT)
    .eq('slug', slug)
    .eq('status', 'active')
    .maybeSingle()
  return mapProduct(data)
}

export async function getNewProducts(opts: { limit?: number; offset?: number } = {}) {
  const { limit = 24, offset = 0 } = opts
  if (!USE_SUPABASE) return { products: SAMPLE_PRODUCTS, total: SAMPLE_PRODUCTS.length }
  const supabase = createPublicSupabase()

  const { data, count } = await supabase
    .from('products')
    .select(PRODUCT_SELECT, { count: 'exact' })
    .eq('status', 'active')
    .or(BAN_DUOC)
    .eq('in_stock', true)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  return { products: (data || []).map(mapCard), total: count || 0 }
}

export async function getAllProducts(opts: { limit?: number; offset?: number } = {}) {
  const { limit = 24, offset = 0 } = opts
  if (!USE_SUPABASE) return { products: SAMPLE_PRODUCTS, total: SAMPLE_PRODUCTS.length }
  const supabase = createPublicSupabase()
  const { data, count } = await supabase
    .from('products')
    .select(PRODUCT_SELECT, { count: 'exact' })
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)
  return { products: (data || []).map(mapCard), total: count || 0 }
}

export async function searchProducts(
  query: string,
  opts: { limit?: number; offset?: number } = {}
) {
  const { limit = 24, offset = 0 } = opts
  if (!USE_SUPABASE || !query) {
    return { products: [], total: 0 }
  }
  const supabase = createPublicSupabase()

  const { data, count } = await supabase
    .from('products')
    .select(PRODUCT_SELECT, { count: 'exact' })
    .eq('status', 'active')
    .or(`name.ilike.%${query}%,ofina_sku.ilike.%${query}%,govi_sku.ilike.%${query}%`)
    .range(offset, offset + limit - 1)

  return { products: (data || []).map(mapCard), total: count || 0 }
}

export async function getCategoryInfo(slug: string) {
  if (!USE_SUPABASE) {
    return MOCK_CATEGORIES.find(c => c.slug === slug) || null
  }
  const supabase = createPublicSupabase()
  const { data } = await supabase.from('categories').select('*').eq('slug', slug).maybeSingle()
  if (data) return { ...data, image: publicImageUrl((data as any).image) || (data as any).image }
  return data
}

export async function getProductsBySubcategories(
  categorySlugs: string[],
  opts: { limit?: number; offset?: number; sort?: string; minPrice?: number; maxPrice?: number } = {}
) {
  const { limit = 24, offset = 0, sort = 'newest', minPrice, maxPrice } = opts

  if (!USE_SUPABASE || categorySlugs.length === 0) {
    return { products: SAMPLE_PRODUCTS, total: SAMPLE_PRODUCTS.length }
  }
  const supabase = createPublicSupabase()

  const { data: cats } = await supabase.from('categories').select('id').in('slug', categorySlugs)
  if (!cats || cats.length === 0) return { products: [], total: 0 }
  const catIds = cats.map((c: any) => c.id)

  let q = supabase
    .from('products')
    .select(PRODUCT_SELECT, { count: 'exact' })
    .in('category_id', catIds)
    .eq('status', 'active')

  if (minPrice !== undefined && minPrice > 0) q = q.gte('price', minPrice)
  if (maxPrice !== undefined && maxPrice > 0) q = q.lte('price', maxPrice)

  if (sort === 'price-asc') q = q.order('price', { ascending: true }).gt('price', 0)
  else if (sort === 'price-desc') q = q.order('price', { ascending: false })
  else if (sort === 'name') q = q.order('name', { ascending: true })
  else q = q.order('created_at', { ascending: false })

  q = q.range(offset, offset + limit - 1)

  const { data, count } = await q
  return { products: (data || []).map(mapCard), total: count || 0 }
}

export async function getProductsByCategory(
  categorySlug: string,
  opts: { limit?: number; offset?: number; sort?: string; minPrice?: number; maxPrice?: number } = {}
) {
  const { limit = 24, offset = 0, sort = 'newest', minPrice, maxPrice } = opts

  if (!USE_SUPABASE) {
    return { products: SAMPLE_PRODUCTS, total: SAMPLE_PRODUCTS.length }
  }
  const supabase = createPublicSupabase()

  const { data: category } = await supabase.from('categories').select('id').eq('slug', categorySlug).maybeSingle()
  if (!category) return { products: [], total: 0 }

  let q = supabase
    .from('products')
    .select(PRODUCT_SELECT, { count: 'exact' })
    .eq('category_id', category.id)
    .eq('status', 'active')

  if (minPrice !== undefined && minPrice > 0) q = q.gte('price', minPrice)
  if (maxPrice !== undefined && maxPrice > 0) q = q.lte('price', maxPrice)

  if (sort === 'price-asc') q = q.order('price', { ascending: true }).gt('price', 0)
  else if (sort === 'price-desc') q = q.order('price', { ascending: false })
  else if (sort === 'name') q = q.order('name', { ascending: true })
  else q = q.order('created_at', { ascending: false })

  q = q.range(offset, offset + limit - 1)

  const { data, count } = await q
  return { products: (data || []).map(mapCard), total: count || 0 }
}
