import type { Metadata } from 'next'

/** Trang báo giá B2B là Client Component nên metadata đặt ở layout riêng. */
export const metadata: Metadata = {
  title: { absolute: 'Báo giá nội thất văn phòng cho doanh nghiệp | OFINA' },
  description:
    'Nhận báo giá nội thất văn phòng theo số lượng cho doanh nghiệp: bàn ghế nhân viên, phòng họp, phòng giám đốc. OFINA khảo sát, thiết kế và lắp đặt trọn gói.',
  alternates: { canonical: '/bao-gia-b2b' },
}

export default function BaoGiaB2BLayout({ children }: { children: React.ReactNode }) {
  return children
}
