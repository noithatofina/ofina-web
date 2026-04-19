import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { ProductCard } from '@/components/product/ProductCard'

interface TabSpec {
  id: string
  label: string
  badge?: string
  cta: { label: string; href: string }
  products: any[]
  emptyText?: string
}

interface Props {
  tabs: TabSpec[]
}

/**
 * CSS-only tabs using radio inputs + :checked selector.
 * Renders entirely on the server, no JavaScript needed.
 */
export function ProductTabs({ tabs }: Props) {
  if (!tabs.length) return null
  const groupName = 'product-tabs-' + Math.random().toString(36).slice(2, 8)

  return (
    <div className="product-tabs">
      {/* Hidden radios — only first one defaults checked */}
      {tabs.map((t, i) => (
        <input
          key={t.id}
          type="radio"
          name={groupName}
          id={`${groupName}-${t.id}`}
          defaultChecked={i === 0}
          className="sr-only peer/tab"
          aria-label={t.label}
        />
      ))}

      {/* Tab labels (clickable headers) */}
      <div className="flex flex-wrap gap-1 md:gap-2 border-b mb-6 overflow-x-auto">
        {tabs.map((t) => (
          <label
            key={t.id}
            htmlFor={`${groupName}-${t.id}`}
            className={`tab-label-${t.id} cursor-pointer px-4 md:px-5 py-3 font-semibold text-gray-500 border-b-2 border-transparent hover:text-brand-900 transition-colors text-sm md:text-base whitespace-nowrap flex items-center gap-2`}
          >
            <span>{t.label}</span>
            {t.badge && (
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded-full bg-accent-500 text-white">
                {t.badge}
              </span>
            )}
          </label>
        ))}
      </div>

      {/* Tab panels */}
      {tabs.map((t) => (
        <div key={t.id} className={`tab-panel-${t.id}`} style={{ display: 'none' }}>
          {t.products.length === 0 ? (
            <p className="text-gray-500 italic text-center py-12">{t.emptyText || 'Chưa có sản phẩm'}</p>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {t.products.slice(0, 8).map((p: any) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
              <div className="text-center mt-8">
                <Link
                  href={t.cta.href}
                  className="inline-flex items-center gap-2 text-brand-900 hover:text-accent-600 font-semibold"
                >
                  {t.cta.label} <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </>
          )}
        </div>
      ))}

      <style>{`
        ${tabs
          .map(
            (t) => `
          #${groupName}-${t.id}:checked ~ div .tab-label-${t.id} {
            color: #1e3a8a;
            border-color: #f59e0b;
          }
          #${groupName}-${t.id}:checked ~ .tab-panel-${t.id} {
            display: block !important;
          }
        `
          )
          .join('\n')}
      `}</style>
    </div>
  )
}
