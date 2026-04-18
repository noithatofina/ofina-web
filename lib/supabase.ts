import { createBrowserClient, createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

type CookieToSet = { name: string; value: string; options?: CookieOptions }

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

export async function createServerSupabase() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet: CookieToSet[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Server Component: ignore
          }
        },
      },
    }
  )
}

export type Product = {
  id: string
  ofina_sku: string
  govi_sku: string
  slug: string
  name: string
  short_description: string | null
  description: string | null
  price: number
  compare_price: number | null
  low_price: number | null
  high_price: number | null
  is_price_hidden: boolean
  in_stock: boolean
  category_id: string | null
  category_name: string | null
  category_slug: string | null
  is_featured: boolean
  is_bestseller: boolean
  is_new: boolean
  is_sale: boolean
  images: string[]
  primary_image: string | null
  specs: Record<string, string>
  avg_rating: number
  review_count: number
  view_count: number
  seo_title: string | null
  seo_description: string | null
}

export type Category = {
  id: string
  slug: string
  name: string
  parent_id: string | null
  description: string | null
  image: string | null
  product_count: number
}
