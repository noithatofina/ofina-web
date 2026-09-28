import type { Metadata } from 'next'

/** Trang quiz là Client Component nên metadata đặt ở layout riêng. */
export const metadata: Metadata = {
  title: { absolute: 'Trắc nghiệm: chọn ghế văn phòng nào hợp với bạn? | OFINA' },
  description:
    'Trả lời vài câu hỏi ngắn về chiều cao, thời gian ngồi và ngân sách để OFINA gợi ý mẫu ghế công thái học hoặc ghế văn phòng phù hợp nhất.',
  alternates: { canonical: '/quiz' },
}

export default function QuizLayout({ children }: { children: React.ReactNode }) {
  return children
}
