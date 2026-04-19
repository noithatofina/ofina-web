import { Check } from 'lucide-react'

interface ParsedMeta {
  specs?: Record<string, string>
  highlights?: string[]
  faq?: { q: string; a: string }[]
}

export interface ParsedDescription {
  meta: ParsedMeta
  bodyHtml: string
  bodyMarkdown: string
}

const META_RE = /<!--META\s*([\s\S]*?)\s*-->/

export function parseDescription(raw: string | null | undefined): ParsedDescription {
  if (!raw) return { meta: {}, bodyHtml: '', bodyMarkdown: '' }
  const m = raw.match(META_RE)
  let meta: ParsedMeta = {}
  let body = raw
  if (m) {
    try {
      meta = JSON.parse(m[1]) as ParsedMeta
    } catch {
      meta = {}
    }
    body = raw.replace(META_RE, '').trim()
  }
  return { meta, bodyHtml: markdownToHtml(body), bodyMarkdown: body }
}

function markdownToHtml(md: string): string {
  let html = md
  html = html.replace(/^### (.+)$/gm, '<h3 class="font-bold text-xl mt-8 mb-3 text-gray-900">$1</h3>')
  html = html.replace(/^## (.+)$/gm, '<h2 class="font-display font-bold text-2xl md:text-3xl mt-10 mb-4 text-gray-900">$1</h2>')
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong class="font-bold text-gray-900">$1</strong>')
  html = html.replace(/^---$/gm, '<hr class="my-8 border-t border-gray-200" />')
  html = html.replace(/^> (.+)$/gm, '<blockquote class="border-l-4 border-gray-300 bg-gray-50 px-5 py-4 my-6 italic text-gray-800">$1</blockquote>')
  html = html.replace(/^- (.+)$/gm, '<li class="mb-2 text-gray-800">$1</li>')
  html = html.replace(/(<li class="mb-2 text-gray-800">[\s\S]*?<\/li>\s*)+/g, (m) => `<ul class="list-disc list-outside space-y-1 my-4 ml-6">${m}</ul>`)
  html = html.split('\n\n').map(p => {
    p = p.trim()
    if (!p) return ''
    if (p.startsWith('<h') || p.startsWith('<ul') || p.startsWith('<hr') || p.startsWith('<blockquote')) return p
    return `<p class="mb-4 leading-relaxed text-gray-800">${p.replace(/\n/g, '<br/>')}</p>`
  }).join('\n')
  return html
}

export function HighlightsList({ highlights }: { highlights?: string[] }) {
  if (!highlights || !highlights.length) return null
  return (
    <ul className="grid sm:grid-cols-2 gap-3">
      {highlights.map((h, i) => (
        <li key={i} className="flex items-start gap-2.5">
          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 text-green-700 flex items-center justify-center mt-0.5">
            <Check className="w-3.5 h-3.5" strokeWidth={3} />
          </span>
          <span className="text-gray-700 text-sm leading-relaxed">{h}</span>
        </li>
      ))}
    </ul>
  )
}

export function SpecsTable({ specs }: { specs?: Record<string, string> }) {
  if (!specs) return null
  const entries = Object.entries(specs)
  if (!entries.length) return null
  return (
    <div className="rounded-xl border overflow-hidden">
      <table className="w-full text-sm">
        <tbody>
          {entries.map(([k, v], idx) => (
            <tr key={k} className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
              <th scope="row" className="text-left font-semibold text-gray-900 px-4 py-3 align-top w-1/3 md:w-1/4">{k}</th>
              <td className="px-4 py-3 text-gray-700">{v}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function FaqAccordion({ faq }: { faq?: { q: string; a: string }[] }) {
  if (!faq || !faq.length) return null
  return (
    <div className="space-y-3">
      {faq.map((item, i) => (
        <details
          key={i}
          className="group rounded-xl border bg-white open:shadow-md transition-shadow"
          {...(i === 0 ? { open: true } : {})}
        >
          <summary className="cursor-pointer list-none px-5 py-4 flex items-center justify-between gap-4 font-semibold text-brand-950">
            <span>{item.q}</span>
            <svg className="w-5 h-5 text-gray-500 transition-transform group-open:rotate-180 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
            </svg>
          </summary>
          <div className="px-5 pb-5 -mt-1 text-gray-700 leading-relaxed">{item.a}</div>
        </details>
      ))}
    </div>
  )
}
