import type { Metadata } from 'next'

/** Trang tư vấn là Client Component nên metadata đặt ở layout riêng. */
export const metadata: Metadata = {
  title: { absolute: 'Tư vấn chọn nội thất văn phòng miễn phí | OFINA' },
  description:
    'Để lại nhu cầu, OFINA tư vấn chọn bàn ghế văn phòng phù hợp diện tích, ngân sách và số lượng nhân sự. Hỗ trợ cả khách lẻ và doanh nghiệp.',
  alternates: { canonical: '/tu-van' },
}

export default function TuVanLayout({ children }: { children: React.ReactNode }) {
  return children
}
