'use client'

import { Phone, MessageCircle } from 'lucide-react'
import { CONTACT } from '@/lib/utils'

interface Props {
  product: {
    id: string
    slug: string
    name: string
    ofina_sku?: string
    price: number
    compare_price?: number | null
    is_price_hidden?: boolean
    primary_image?: string | null
  }
}

/**
 * CTA tư vấn-only (theo chuẩn M8ARC): khách xem sản phẩm rồi liên hệ tư vấn/báo giá.
 * OFINA dùng 1 hotline chung → 2 nút thẳng, không cần chọn khu vực.
 */
export function ProductActions(_props: Props) {
  const hotline = CONTACT.hotline
  const zalo = CONTACT.zaloUrl

  return (
    <div className="mb-6">
      <p className="text-xs text-gray-500 leading-relaxed mb-4">
        Liên hệ OFINA để được tư vấn cấu hình, chất liệu, kích thước và báo giá tốt nhất cho văn phòng / dự án của bạn.
      </p>

      <div className="flex flex-col gap-2.5">
        <a
          href={zalo}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full h-12 rounded-xl bg-[#2F6FE0] text-white font-semibold flex items-center justify-center gap-2 hover:bg-[#2862c9] transition-colors"
        >
          <MessageCircle className="w-5 h-5" /> Tư vấn qua Zalo
        </a>
        <a
          href={`tel:${hotline}`}
          className="w-full h-12 rounded-xl border border-brand-900 text-brand-900 font-semibold flex items-center justify-center gap-2 hover:bg-brand-900 hover:text-white transition-colors"
        >
          <Phone className="w-5 h-5" /> Gọi trực tiếp {hotline}
        </a>
      </div>
    </div>
  )
}
