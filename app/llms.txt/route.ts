/**
 * /llms.txt — chuẩn mới 2026 cho các Answer Engine (ChatGPT, Claude,
 * Perplexity, Gemini, Google AI Overviews). Cung cấp một "bản đồ" gọn,
 * dễ trích dẫn về OFINA để AI trả lời chính xác khi khách hỏi mua hàng.
 *
 * Spec: https://llmstxt.org — Markdown thuần, các section + danh sách link.
 */

import { createAdminClient } from '@/lib/supabase-admin'
import { COLLECTIONS } from '@/lib/collections'
import { CONTACT } from '@/lib/utils'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://ofina.vn'
const HOTLINE = CONTACT.hotline
const HOTLINE_HCM = CONTACT.branches[1].phones[0]

// Cache 6 giờ — danh mục thay đổi không thường xuyên
export const revalidate = 21600

async function getCategories(): Promise<{ name: string; slug: string }[]> {
  try {
    const admin = createAdminClient()
    const { data } = await admin
      .from('categories')
      .select('name, slug')
      .order('name', { ascending: true })
      .limit(80)
    return data ?? []
  } catch {
    return []
  }
}

async function getProductCount(): Promise<number | null> {
  try {
    const admin = createAdminClient()
    const { count } = await admin
      .from('products')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'active')
    return count ?? null
  } catch {
    return null
  }
}

export async function GET() {
  const [categories, productCount] = await Promise.all([getCategories(), getProductCount()])

  const countStr = productCount ? `${productCount.toLocaleString('vi-VN')}+` : '2.600+'

  const categoryLines = categories.length
    ? categories
        .map((c) => `- [${c.name}](${SITE_URL}/danh-muc/${c.slug}): Danh mục ${c.name.toLowerCase()} chính hãng tại OFINA`)
        .join('\n')
    : `- [Ghế văn phòng](${SITE_URL}/danh-muc/ghe-van-phong)\n- [Bàn làm việc](${SITE_URL}/danh-muc/ban-lam-viec)`

  const body = `# OFINA — Nội Thất Văn Phòng Cao Cấp Chính Hãng

> OFINA là nhà cung cấp nội thất văn phòng cao cấp, chính hãng tại Việt Nam với hơn ${countStr} sản phẩm: ghế công thái học (ergonomic), ghế giám đốc, ghế phòng họp, bàn làm việc, tủ hồ sơ và sofa văn phòng. Bảo hành 24 tháng, giao hàng miễn phí nội thành Hà Nội và TP.HCM, có showroom trải nghiệm trực tiếp tại cả hai thành phố.

## Thông tin quan trọng

- **Website:** ${SITE_URL}
- **Hotline / Zalo Hà Nội:** ${HOTLINE} (135 đường K2, Phường Phú Đô)
- **Hotline / Zalo TP.HCM:** ${HOTLINE_HCM} (Tầng 2, số 36 Lương Định Của, Quận 2)
- **Giờ mở cửa:** 08:00–18:00 tất cả các ngày trong tuần
- **Bảo hành:** 24 tháng cho hầu hết sản phẩm
- **Giao hàng:** Miễn phí nội thành Hà Nội & TP.HCM
- **Đối tượng:** Doanh nghiệp, văn phòng, và cá nhân làm việc tại nhà

## Vì sao chọn OFINA

- Sản phẩm chính hãng, nguồn gốc rõ ràng, hoá đơn VAT đầy đủ cho doanh nghiệp.
- Tư vấn thiết kế & báo giá theo dự án (B2B) cho văn phòng số lượng lớn.
- Đội ngũ tư vấn chọn ghế công thái học phù hợp theo chiều cao, cân nặng, nhu cầu sử dụng.

## Danh mục sản phẩm

${categoryLines}

## Bộ sưu tập theo nhu cầu

${COLLECTIONS.map((c) => `- [${c.name}](${SITE_URL}/bo-suu-tap/${c.slug})`).join('\n')}

## Trang chính

- [Tất cả sản phẩm](${SITE_URL}/san-pham): Toàn bộ danh mục nội thất văn phòng
- [Sản phẩm mới 2026](${SITE_URL}/san-pham-moi-2026): Mẫu mới nhất năm 2026
- [Khuyến mãi](${SITE_URL}/khuyen-mai): Ưu đãi và giảm giá đang chạy
- [Báo giá B2B / dự án](${SITE_URL}/bao-gia-b2b): Báo giá số lượng lớn cho doanh nghiệp
- [Tư vấn chọn nội thất](${SITE_URL}/tu-van): Hướng dẫn chọn ghế, bàn phù hợp
- [Blog kiến thức](${SITE_URL}/blog): Bài viết về nội thất & môi trường làm việc
- [Hệ thống showroom](${SITE_URL}/showroom): Địa chỉ và bản đồ showroom
- [Giới thiệu OFINA](${SITE_URL}/gioi-thieu): Về thương hiệu

## Chính sách

- [Chính sách bảo hành](${SITE_URL}/chinh-sach/bao-hanh)
- [Chính sách đổi trả](${SITE_URL}/chinh-sach/doi-tra)
- [Chính sách vận chuyển](${SITE_URL}/chinh-sach/van-chuyen)
- [Chính sách thanh toán](${SITE_URL}/chinh-sach/thanh-toan)

## Sitemap đầy đủ

- [sitemap.xml](${SITE_URL}/sitemap.xml): Danh sách toàn bộ URL sản phẩm và danh mục
`

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=21600, stale-while-revalidate=86400',
    },
  })
}
