/**
 * Hàng đợi chủ đề cho AI Content Bot.
 *
 * Bot lần lượt chọn chủ đề CHƯA viết (đối chiếu slug đã tồn tại trong
 * blog_posts) rồi sinh bài chuẩn SEO. Thêm chủ đề mới = thêm 1 dòng.
 *
 * Ưu tiên cụm từ khoá khách thật sự tìm: hướng dẫn chọn mua, so sánh,
 * mẹo bố trí — vừa hút traffic, vừa dẫn về sản phẩm/bộ sưu tập.
 */

export interface SeoTopic {
  /** Từ khoá/tiêu đề định hướng — bot sẽ tự tối ưu lại */
  keyword: string
  /** Danh mục blog hiển thị */
  category: string
  /** Gợi ý nội bộ: link tới bộ sưu tập / danh mục nào trong bài */
  internalLinks?: string[]
}

export const SEO_TOPICS: SeoTopic[] = [
  { keyword: 'Cách chọn ghế công thái học (ergonomic) phù hợp để chống đau lưng', category: 'Hướng dẫn chọn mua', internalLinks: ['/bo-suu-tap/ghe-cong-thai-hoc'] },
  { keyword: 'Ghế giám đốc loại nào tốt? Kinh nghiệm chọn ghế giám đốc 2026', category: 'Hướng dẫn chọn mua', internalLinks: ['/bo-suu-tap/ghe-giam-doc-cao-cap'] },
  { keyword: 'Bàn nâng hạ thông minh là gì? Có nên mua bàn đứng làm việc?', category: 'Kiến thức', internalLinks: ['/bo-suu-tap/goc-lam-viec-tai-nha'] },
  { keyword: 'Cách bố trí phòng làm việc giám đốc đẹp và hợp phong thủy', category: 'Bố trí văn phòng', internalLinks: ['/bo-suu-tap/noi-that-phong-giam-doc'] },
  { keyword: 'Kích thước bàn họp chuẩn cho phòng họp 6, 10, 20 người', category: 'Kiến thức', internalLinks: ['/bo-suu-tap/ban-hop-van-phong', '/bo-suu-tap/setup-phong-hop'] },
  { keyword: 'Ghế lưới và ghế da: nên chọn loại nào cho văn phòng?', category: 'So sánh', internalLinks: ['/bo-suu-tap/ghe-cong-thai-hoc', '/bo-suu-tap/ghe-giam-doc-cao-cap'] },
  { keyword: 'Cách setup góc làm việc tại nhà (home office) nhỏ gọn, hiệu quả', category: 'Bố trí văn phòng', internalLinks: ['/bo-suu-tap/goc-lam-viec-tai-nha'] },
  { keyword: 'Tư thế ngồi đúng khi làm việc văn phòng để tránh đau lưng, mỏi cổ', category: 'Sức khỏe văn phòng', internalLinks: ['/bo-suu-tap/ghe-cong-thai-hoc'] },
  { keyword: 'Nội thất văn phòng cần những gì? Checklist trang bị văn phòng mới', category: 'Hướng dẫn chọn mua', internalLinks: ['/bo-suu-tap', '/san-pham'] },
  { keyword: 'Cách chọn bàn làm việc theo diện tích và nhu cầu sử dụng', category: 'Hướng dẫn chọn mua', internalLinks: ['/bo-suu-tap/goc-lam-viec-tai-nha'] },
  { keyword: 'Mẹo sắp xếp bàn làm việc gọn gàng giúp tăng năng suất', category: 'Mẹo văn phòng', internalLinks: ['/bo-suu-tap/tu-ho-so-van-phong'] },
  { keyword: 'Cách bố trí văn phòng không gian mở (open office) khoa học', category: 'Bố trí văn phòng', internalLinks: ['/bo-suu-tap/cum-ban-lam-viec-nhan-vien'] },
  { keyword: 'Chất liệu nội thất văn phòng phổ biến: gỗ công nghiệp, veneer, melamine', category: 'Kiến thức', internalLinks: ['/san-pham'] },
  { keyword: 'Cách chọn tủ hồ sơ văn phòng phù hợp nhu cầu lưu trữ', category: 'Hướng dẫn chọn mua', internalLinks: ['/bo-suu-tap/tu-ho-so-van-phong'] },
  { keyword: 'Xu hướng thiết kế nội thất văn phòng 2026', category: 'Xu hướng', internalLinks: ['/bo-suu-tap', '/san-pham-moi-2026'] },
  { keyword: 'Cách chọn ghế phòng họp và ghế phòng chờ cho doanh nghiệp', category: 'Hướng dẫn chọn mua', internalLinks: ['/bo-suu-tap/setup-phong-hop', '/bo-suu-tap/ghe-phong-cho-le-tan'] },
  { keyword: 'Bảo quản và vệ sinh ghế da văn phòng đúng cách, bền lâu', category: 'Mẹo văn phòng', internalLinks: ['/bo-suu-tap/ghe-giam-doc-cao-cap'] },
  { keyword: 'Cách chọn nội thất văn phòng cho công ty startup tiết kiệm chi phí', category: 'Hướng dẫn chọn mua', internalLinks: ['/bo-suu-tap/ghe-van-phong-gia-re', '/bo-suu-tap/cum-ban-lam-viec-nhan-vien'] },
  { keyword: 'Phong thủy bàn làm việc: hướng kê bàn và vật phẩm nên có', category: 'Phong thủy', internalLinks: ['/bo-suu-tap/ban-giam-doc-cao-cap'] },
  { keyword: 'Lợi ích của ghế công thái học với dân văn phòng ngồi nhiều', category: 'Sức khỏe văn phòng', internalLinks: ['/bo-suu-tap/ghe-cong-thai-hoc'] },
]
