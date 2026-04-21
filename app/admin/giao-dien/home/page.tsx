import Link from 'next/link'
import { requireStaff } from '@/lib/auth-guard'
import { getSetting } from '@/lib/site-settings'
import {
  updateHomeTopbarAction,
  updateHomeHeroAction,
  updateHomeStatsAction,
  updateHomeFaqAction,
  updateHomeBrandStoryAction,
  updateHomeTrustBarAction,
  updateHomeCollectionsAction,
  updateHomeWhyUsAction,
} from '../actions'

export const dynamic = 'force-dynamic'

export default async function HomeEditorPage() {
  await requireStaff()

  const topbar = await getSetting<{ messages: string[] }>('home.topbar', { messages: [] })
  const hero = await getSetting<any>('home.hero', {
    headline: '',
    subheadline: '',
    tagline: '',
    cta_label: '',
    cta_href: '',
    stats: [],
    featured_product_slug: '',
  })
  const stats = await getSetting<{ items: Array<{ label: string; value: string; suffix?: string }> }>(
    'home.stats',
    { items: [] },
  )
  const faq = await getSetting<{ items: Array<{ q: string; a: string }> }>('home.faq', { items: [] })
  const brandStory = await getSetting<{ title: string; content: string }>('home.brand_story', {
    title: '',
    content: '',
  })
  const trustBar = await getSetting<{ items: Array<{ title: string; desc: string }> }>(
    'home.trust_bar',
    { items: [] },
  )
  const collections = await getSetting<{ items: Array<{ title: string; subtitle: string; image: string; href: string }> }>(
    'home.collections',
    { items: [] },
  )
  const whyUs = await getSetting<any>('home.why_us', {
    heading_subtitle: '',
    heading_title: '',
    heading_desc: '',
    items: [],
  })

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-4">
        <Link href="/admin/giao-dien" className="text-sm text-neutral-600 hover:text-blue-600">
          ← Quản lý giao diện
        </Link>
      </div>
      <h1 className="text-2xl font-bold mb-2">Chỉnh sửa Trang chủ</h1>
      <p className="text-sm text-neutral-600 mb-6">
        Mỗi section có nút Lưu riêng. Thay đổi hiển thị trên site sau ~1 phút.
      </p>

      {/* ===== Banner Top ===== */}
      <Section title="Banner thông báo (đầu trang)" desc="Các dòng chữ chạy luân phiên trên cùng, phân cách bởi dấu ·">
        <form action={updateHomeTopbarAction} className="space-y-3">
          {[0, 1, 2, 3, 4].map((i) => (
            <input
              key={i}
              name="messages"
              defaultValue={topbar.messages[i] || ''}
              placeholder={`Dòng ${i + 1} (để trống nếu không dùng)`}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg"
            />
          ))}
          <SubmitBtn label="Lưu Banner" />
        </form>
      </Section>

      {/* ===== Hero ===== */}
      <Section title="Hero (Section đầu trang)" desc="Tiêu đề lớn, tagline, nút CTA, các số liệu">
        <form action={updateHomeHeroAction} className="space-y-3">
          <Field label="Headline (tiêu đề lớn)" name="headline" defaultValue={hero.headline} />
          <Field label="Subheadline (phụ đề)" name="subheadline" defaultValue={hero.subheadline} />
          <TextareaField
            label="Tagline (đoạn mô tả dưới headline)"
            name="tagline"
            defaultValue={hero.tagline}
            rows={3}
          />
          <div className="grid grid-cols-2 gap-3">
            <Field label="Nhãn nút CTA" name="cta_label" defaultValue={hero.cta_label} />
            <Field label="URL nút CTA" name="cta_href" defaultValue={hero.cta_href} placeholder="/san-pham" />
          </div>
          <Field
            label="Slug sản phẩm nổi bật (hiển thị bên phải hero)"
            name="featured_product_slug"
            defaultValue={hero.featured_product_slug || ''}
            placeholder="để trống = SP featured trong DB hoặc SP mới nhất"
          />

          <div>
            <label className="block text-sm font-medium mb-2">Số liệu hiển thị trong Hero (tối đa 5)</label>
            <div className="space-y-2">
              {[0, 1, 2, 3, 4].map((i) => (
                <div key={i} className="grid grid-cols-2 gap-2">
                  <input
                    name={`stat_value_${i}`}
                    defaultValue={hero.stats?.[i]?.value || ''}
                    placeholder="Giá trị (vd: 1,234+)"
                    className="px-3 py-2 border border-neutral-300 rounded-lg"
                  />
                  <input
                    name={`stat_label_${i}`}
                    defaultValue={hero.stats?.[i]?.label || ''}
                    placeholder="Nhãn (vd: khách hài lòng)"
                    className="px-3 py-2 border border-neutral-300 rounded-lg"
                  />
                </div>
              ))}
            </div>
          </div>

          <SubmitBtn label="Lưu Hero" />
        </form>
      </Section>

      {/* ===== Stats Counter ===== */}
      <Section
        title="Stats Counter"
        desc="Thanh số liệu hiển thị giữa trang (2,400+ sản phẩm, 15K+ khách...)"
      >
        <form action={updateHomeStatsAction} className="space-y-3">
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div key={i} className="grid grid-cols-[1fr_1fr_120px] gap-2">
              <input
                name={`value_${i}`}
                defaultValue={stats.items[i]?.value || ''}
                placeholder="Giá trị (2400)"
                className="px-3 py-2 border border-neutral-300 rounded-lg"
              />
              <input
                name={`label_${i}`}
                defaultValue={stats.items[i]?.label || ''}
                placeholder="Nhãn (Sản phẩm)"
                className="px-3 py-2 border border-neutral-300 rounded-lg"
              />
              <input
                name={`suffix_${i}`}
                defaultValue={stats.items[i]?.suffix || ''}
                placeholder="Suffix (+)"
                className="px-3 py-2 border border-neutral-300 rounded-lg"
              />
            </div>
          ))}
          <SubmitBtn label="Lưu Stats" />
        </form>
      </Section>

      {/* ===== FAQ ===== */}
      <Section title="FAQ (Câu hỏi thường gặp)" desc="Hiển thị cuối trang chủ, tối đa 20 câu hỏi">
        <form action={updateHomeFaqAction} className="space-y-4">
          {Array.from({ length: 20 }).map((_, i) => {
            const item = faq.items[i] || { q: '', a: '' }
            if (i > 5 && !item.q) return null // chỉ hiển thị thêm ô khi có dữ liệu
            return (
              <div key={i} className="border border-neutral-200 rounded-lg p-3 space-y-2 bg-neutral-50">
                <input
                  name={`q_${i}`}
                  defaultValue={item.q}
                  placeholder={`Câu hỏi ${i + 1}`}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg bg-white"
                />
                <textarea
                  name={`a_${i}`}
                  defaultValue={item.a}
                  placeholder="Câu trả lời..."
                  rows={2}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg bg-white"
                />
              </div>
            )
          })}
          {/* Extra slots for new questions — 14 more */}
          {Array.from({ length: 14 }).map((_, i) => {
            const idx = 6 + i
            if (faq.items[idx]) return null
            return (
              <div key={idx} className="border border-dashed border-neutral-300 rounded-lg p-3 space-y-2">
                <input
                  name={`q_${idx}`}
                  placeholder={`Câu hỏi ${idx + 1} (để trống nếu không dùng)`}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg"
                />
                <textarea
                  name={`a_${idx}`}
                  placeholder="Câu trả lời..."
                  rows={2}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg"
                />
              </div>
            )
          })}
          <SubmitBtn label="Lưu FAQ" />
        </form>
      </Section>

      {/* ===== Trust Bar ===== */}
      <Section title="Trust Bar (6 cam kết)" desc="Thanh icon 6 cam kết hiển thị ngay sau Hero">
        <form action={updateHomeTrustBarAction} className="space-y-3">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="grid grid-cols-[1fr_2fr] gap-2">
              <input
                name={`title_${i}`}
                defaultValue={trustBar.items[i]?.title || ''}
                placeholder={`Tiêu đề ${i + 1}`}
                className="px-3 py-2 border border-neutral-300 rounded-lg"
              />
              <input
                name={`desc_${i}`}
                defaultValue={trustBar.items[i]?.desc || ''}
                placeholder="Mô tả"
                className="px-3 py-2 border border-neutral-300 rounded-lg"
              />
            </div>
          ))}
          <SubmitBtn label="Lưu Trust Bar" />
        </form>
      </Section>

      {/* ===== Featured Collections ===== */}
      <Section title="Bộ sưu tập nổi bật (3 card)" desc="3 card lớn dẫn đến danh mục">
        <form action={updateHomeCollectionsAction} className="space-y-4">
          {[0, 1, 2, 3, 4, 5].map((i) => {
            const c = collections.items[i] || { title: '', subtitle: '', image: '', href: '' }
            if (i > 2 && !c.title) return null
            return (
              <div key={i} className="border border-neutral-200 rounded-lg p-3 space-y-2 bg-neutral-50">
                <input
                  name={`title_${i}`}
                  defaultValue={c.title}
                  placeholder={`Card ${i + 1} — tiêu đề`}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg bg-white"
                />
                <input
                  name={`subtitle_${i}`}
                  defaultValue={c.subtitle}
                  placeholder="Mô tả ngắn"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg bg-white"
                />
                <input
                  name={`image_${i}`}
                  type="url"
                  defaultValue={c.image}
                  placeholder="URL ảnh (khuyến nghị 800×600)"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg bg-white"
                />
                <input
                  name={`href_${i}`}
                  defaultValue={c.href}
                  placeholder="Link (vd: /danh-muc/ghe-xoay-van-phong)"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg bg-white font-mono text-sm"
                />
              </div>
            )
          })}
          <SubmitBtn label="Lưu Collections" />
        </form>
      </Section>

      {/* ===== Why Choose Us ===== */}
      <Section title="Vì sao chọn OFINA (6 lý do)" desc="Section cam kết, 6 card">
        <form action={updateHomeWhyUsAction} className="space-y-3">
          <Field label="Label nhỏ phía trên" name="heading_subtitle" defaultValue={whyUs.heading_subtitle || ''} />
          <Field label="Tiêu đề chính" name="heading_title" defaultValue={whyUs.heading_title || ''} />
          <Field label="Mô tả dưới tiêu đề" name="heading_desc" defaultValue={whyUs.heading_desc || ''} />

          <div className="mt-4 pt-4 border-t">
            <div className="text-sm font-medium mb-2">6 lý do:</div>
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="grid grid-cols-[1fr_2fr] gap-2 mb-2">
                <input
                  name={`title_${i}`}
                  defaultValue={whyUs.items?.[i]?.title || ''}
                  placeholder={`Lý do ${i + 1}`}
                  className="px-3 py-2 border border-neutral-300 rounded-lg"
                />
                <input
                  name={`desc_${i}`}
                  defaultValue={whyUs.items?.[i]?.desc || ''}
                  placeholder="Mô tả"
                  className="px-3 py-2 border border-neutral-300 rounded-lg"
                />
              </div>
            ))}
          </div>
          <SubmitBtn label="Lưu Vì sao OFINA" />
        </form>
      </Section>

      {/* ===== Brand Story ===== */}
      <Section title="Giới thiệu thương hiệu" desc="Đoạn SEO content cuối trang chủ">
        <form action={updateHomeBrandStoryAction} className="space-y-3">
          <Field label="Tiêu đề" name="title" defaultValue={brandStory.title} />
          <TextareaField
            label="Nội dung (HTML)"
            name="content"
            defaultValue={brandStory.content}
            rows={8}
            mono
          />
          <SubmitBtn label="Lưu Brand Story" />
        </form>
      </Section>
    </div>
  )
}

function Section({
  title,
  desc,
  children,
}: {
  title: string
  desc?: string
  children: React.ReactNode
}) {
  return (
    <details open className="bg-white rounded-lg shadow mb-6 overflow-hidden">
      <summary className="cursor-pointer p-4 border-b border-neutral-200 bg-neutral-50 hover:bg-neutral-100 font-medium">
        {title}
        {desc && <div className="text-xs text-neutral-500 font-normal mt-0.5">{desc}</div>}
      </summary>
      <div className="p-4">{children}</div>
    </details>
  )
}

function Field({
  label,
  name,
  defaultValue,
  placeholder,
}: {
  label: string
  name: string
  defaultValue?: string
  placeholder?: string
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input
        name={name}
        defaultValue={defaultValue || ''}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-neutral-300 rounded-lg"
      />
    </div>
  )
}

function TextareaField({
  label,
  name,
  defaultValue,
  rows = 3,
  mono,
}: {
  label: string
  name: string
  defaultValue?: string
  rows?: number
  mono?: boolean
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <textarea
        name={name}
        defaultValue={defaultValue || ''}
        rows={rows}
        className={`w-full px-3 py-2 border border-neutral-300 rounded-lg ${mono ? 'font-mono text-sm' : ''}`}
      />
    </div>
  )
}

function SubmitBtn({ label }: { label: string }) {
  return (
    <button
      type="submit"
      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium"
    >
      {label}
    </button>
  )
}
