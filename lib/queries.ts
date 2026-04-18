/**
 * Database queries wrapper.
 *
 * Hiện tại dùng MOCK DATA để dev nhanh.
 * Khi Supabase được setup (env NEXT_PUBLIC_SUPABASE_URL có giá trị), tự động
 * chuyển sang query Supabase thật.
 */

import type { Product, Category } from './supabase'

const USE_SUPABASE = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL)

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
    avg_rating: 4.8, review_count: 123, is_bestseller: true,
  },
  {
    id: 'p2', slug: 'ghe-da-giam-doc-ofn-gdgd-0001', ofina_sku: 'OFN-GDGD-0001',
    name: 'Ghế da giám đốc cao cấp B520',
    price: 6900000, compare_price: 7500000,
    primary_image: 'https://images.unsplash.com/photo-1541558869434-2840d308329a?w=500&q=80',
    avg_rating: 4.9, review_count: 87, is_new: true,
  },
  {
    id: 'p3', slug: 'ban-lam-viec-chan-sat-ofn-blvs-0001', ofina_sku: 'OFN-BLVS-0001',
    name: 'Bàn làm việc chân sắt mặt gỗ 1m4',
    price: 1890000, compare_price: 2100000,
    primary_image: 'https://images.unsplash.com/photo-1518051870910-a46e30d9db16?w=500&q=80',
    avg_rating: 4.7, review_count: 56, is_bestseller: true,
  },
  {
    id: 'p4', slug: 'ban-nang-ha-2-motor-ofn-bnh2-0001', ofina_sku: 'OFN-BNH2-0001',
    name: 'Bàn nâng hạ điện 2 motor cao cấp',
    price: 8900000, compare_price: 9900000,
    primary_image: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=500&q=80',
    avg_rating: 4.9, review_count: 42, is_new: true,
  },
  {
    id: 'p5', slug: 'ghe-xoay-luoi-ofn-gxl-0001', ofina_sku: 'OFN-GXL-0001',
    name: 'Ghế xoay lưới lưng cao GV8801',
    price: 1690000, compare_price: 1990000,
    primary_image: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=500&q=80',
    avg_rating: 4.6, review_count: 98, is_bestseller: true,
  },
  {
    id: 'p6', slug: 'tu-ho-so-cao-ofn-thsc-0001', ofina_sku: 'OFN-THSC-0001',
    name: 'Tủ hồ sơ cao 3 tầng có khóa',
    price: 2390000, compare_price: 2800000,
    primary_image: 'https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=500&q=80',
    avg_rating: 4.5, review_count: 34,
  },
  {
    id: 'p7', slug: 'sofa-van-phong-ofn-sfv-0001', ofina_sku: 'OFN-SFV-0001',
    name: 'Sofa văn phòng 3 chỗ ngồi bọc da PU',
    price: 5890000, compare_price: 6500000,
    primary_image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&q=80',
    avg_rating: 4.8, review_count: 67, is_new: true,
  },
  {
    id: 'p8', slug: 'ban-hop-ofn-bhvs-0001', ofina_sku: 'OFN-BHVS-0001',
    name: 'Bàn họp văn phòng 2m4 chân sắt',
    price: 4290000, compare_price: 4800000,
    primary_image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=500&q=80',
    avg_rating: 4.7, review_count: 45, is_bestseller: true,
  },
]

// ============ QUERIES ============

const PRODUCT_SELECT = `
  *,
  product_images(url, position, is_primary)
`

function mapProduct(p: any) {
  if (!p) return p
  const imgs = (p.product_images || []).sort((a: any, b: any) => a.position - b.position)
  return {
    ...p,
    images: imgs.map((i: any) => i.url),
    primary_image: imgs.find((i: any) => i.is_primary)?.url || imgs[0]?.url || null,
  }
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

  const { createServerSupabase } = await import('./supabase')
  const supabase = await createServerSupabase()

  // Lấy categories có SP (query products_count qua group by đơn giản)
  const [categoriesRes, featuredRes, newestRes] = await Promise.all([
    supabase.from('categories').select('*').limit(12),
    // Random 8 SP có giá > 0 (thay cho bestseller nếu chưa có flag)
    supabase.from('products').select(PRODUCT_SELECT).eq('status', 'active').gt('price', 0).order('created_at', { ascending: false }).limit(8),
    supabase.from('products').select(PRODUCT_SELECT).eq('status', 'active').gt('price', 0).order('price', { ascending: false }).limit(8),
  ])

  const featured = (featuredRes.data || []).map(mapProduct)
  const newest = (newestRes.data || []).map(mapProduct)

  // Thêm mock image cho categories nếu chưa có
  const categoryImageFallback: Record<string, string> = {
    'ghe-van-phong': 'https://images.unsplash.com/photo-1567016376408-0226e4d0c1ea?w=600&q=80',
    'ban-lam-viec': 'https://images.unsplash.com/photo-1518051870910-a46e30d9db16?w=600&q=80',
    'sofa-van-phong': 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80',
  }
  const categoriesWithImage = (categoriesRes.data || []).map((c: any) => ({
    ...c,
    image: c.image || categoryImageFallback[c.slug] || 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80',
    product_count: 0,  // TODO: count qua separate query
  }))

  return {
    categories: categoriesWithImage.length ? categoriesWithImage : MOCK_CATEGORIES,
    bestsellers: featured,
    newest,
    featured: featured.slice(0, 4),
  }
}

export async function getProductBySlug(slug: string) {
  if (!USE_SUPABASE) {
    return SAMPLE_PRODUCTS.find(p => p.slug === slug) || null
  }
  const { createServerSupabase } = await import('./supabase')
  const supabase = await createServerSupabase()
  const { data } = await supabase.from('products').select(PRODUCT_SELECT).eq('slug', slug).maybeSingle()
  return mapProduct(data)
}

export async function getCategoryInfo(slug: string) {
  if (!USE_SUPABASE) {
    return MOCK_CATEGORIES.find(c => c.slug === slug) || null
  }
  const { createServerSupabase } = await import('./supabase')
  const supabase = await createServerSupabase()
  const { data } = await supabase.from('categories').select('*').eq('slug', slug).maybeSingle()
  return data
}

export async function getProductsByCategory(
  categorySlug: string,
  opts: { limit?: number; offset?: number; sort?: string } = {}
) {
  const { limit = 24, offset = 0, sort = 'newest' } = opts

  if (!USE_SUPABASE) {
    return { products: SAMPLE_PRODUCTS, total: SAMPLE_PRODUCTS.length }
  }
  const { createServerSupabase } = await import('./supabase')
  const supabase = await createServerSupabase()

  const { data: category } = await supabase.from('categories').select('id').eq('slug', categorySlug).maybeSingle()
  if (!category) return { products: [], total: 0 }

  let q = supabase
    .from('products')
    .select(PRODUCT_SELECT, { count: 'exact' })
    .eq('category_id', category.id)
    .eq('status', 'active')

  // Sort
  if (sort === 'price-asc') q = q.order('price', { ascending: true }).gt('price', 0)
  else if (sort === 'price-desc') q = q.order('price', { ascending: false })
  else if (sort === 'name') q = q.order('name', { ascending: true })
  else q = q.order('created_at', { ascending: false })

  q = q.range(offset, offset + limit - 1)

  const { data, count } = await q
  return { products: (data || []).map(mapProduct), total: count || 0 }
}
