'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, CheckCircle, Sparkles } from 'lucide-react'

const QUESTIONS = [
  {
    q: 'Bạn ngồi làm việc bao nhiêu giờ/ngày?',
    options: ['Dưới 4 tiếng', '4-8 tiếng', 'Trên 8 tiếng'],
  },
  {
    q: 'Ngân sách cho ghế của bạn?',
    options: ['Dưới 2 triệu', '2-5 triệu', '5-10 triệu', 'Trên 10 triệu'],
  },
  {
    q: 'Bạn quan trọng yếu tố nào nhất?',
    options: ['Công thái học - chống đau lưng', 'Thẩm mỹ sang trọng', 'Độ bền lâu dài', 'Giá tốt nhất'],
  },
  {
    q: 'Cân nặng của bạn?',
    options: ['Dưới 60kg', '60-80kg', '80-100kg', 'Trên 100kg'],
  },
]

const CATEGORY_MAP: Record<string, string> = {
  'congthaihoc': 'ghe-cong-thai-hoc',
  'luoi': 'ghe-xoay-luoi',
  'da': 'ghe-da-giam-doc',
  'xoay': 'ghe-xoay-van-phong',
}

export default function QuizPage() {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<string[]>([])

  function pick(option: string) {
    const newAnswers = [...answers, option]
    setAnswers(newAnswers)
    if (step < QUESTIONS.length - 1) setStep(step + 1)
    else setStep(QUESTIONS.length) // show result
  }

  function reset() {
    setStep(0)
    setAnswers([])
  }

  // Logic đơn giản để gợi ý danh mục
  function getRecommendation() {
    let cat = 'ghe-xoay-van-phong'
    let label = 'Ghế xoay văn phòng'

    // Q1: thời gian ngồi
    if (answers[0]?.includes('Trên 8')) {
      cat = 'ghe-cong-thai-hoc'
      label = 'Ghế công thái học'
    }

    // Q3: ưu tiên
    if (answers[2]?.includes('công thái học')) {
      cat = 'ghe-cong-thai-hoc'
      label = 'Ghế công thái học'
    } else if (answers[2]?.includes('sang trọng')) {
      cat = 'ghe-da-giam-doc'
      label = 'Ghế da giám đốc'
    }

    // Q2: budget ảnh hưởng phụ
    return { cat, label }
  }

  if (step >= QUESTIONS.length) {
    const { cat, label } = getRecommendation()
    return (
      <div className="container-custom py-20 text-center max-w-xl mx-auto">
        <CheckCircle className="w-20 h-20 mx-auto text-green-500 mb-6" />
        <h1 className="font-display text-4xl font-bold text-brand-950 mb-4">Đã tìm được rồi!</h1>
        <p className="text-gray-600 text-lg mb-8">
          Dựa trên trả lời của bạn, OFINA gợi ý bạn nên xem:
        </p>
        <div className="bg-brand-50 p-8 rounded-2xl mb-6">
          <div className="text-sm text-gray-500 uppercase tracking-wider mb-2">Gợi ý</div>
          <div className="text-3xl font-bold text-brand-900 mb-4">{label}</div>
          <Link href={`/danh-muc/${cat}`} className="btn-accent">
            Xem sản phẩm <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
        <button onClick={reset} className="text-brand-900 hover:underline">
          ← Làm lại quiz
        </button>
      </div>
    )
  }

  const current = QUESTIONS[step]
  const progress = ((step + 1) / QUESTIONS.length) * 100

  return (
    <div className="container-custom py-16 max-w-2xl">
      <div className="text-center mb-8">
        <Sparkles className="w-12 h-12 mx-auto text-accent-500 mb-3" />
        <h1 className="font-display text-3xl md:text-4xl font-bold text-brand-950">Tìm ghế hoàn hảo</h1>
        <p className="text-gray-600 mt-2">Trả lời 4 câu hỏi - 30 giây</p>
      </div>

      {/* Progress */}
      <div className="mb-8">
        <div className="flex justify-between text-sm mb-2">
          <span>Câu {step + 1} / {QUESTIONS.length}</span>
          <span className="font-semibold">{Math.round(progress)}%</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-brand-900 transition-all" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Question */}
      <div className="card p-8">
        <h2 className="font-bold text-2xl mb-6 text-center">{current.q}</h2>
        <div className="space-y-3">
          {current.options.map((opt) => (
            <button
              key={opt}
              onClick={() => pick(opt)}
              className="w-full p-4 text-left border-2 rounded-xl hover:border-brand-900 hover:bg-brand-50 transition-colors font-medium"
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
