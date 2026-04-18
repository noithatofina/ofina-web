#!/usr/bin/env node
/**
 * Seed Supabase với dữ liệu sản phẩm từ folder data/products_json
 *
 * Cách chạy:
 *   1. Đảm bảo có file .env.local với SUPABASE_SERVICE_ROLE_KEY
 *   2. Chạy SQL schema trước (database/schema.sql)
 *   3. node scripts/seed-products.mjs
 */

import { createClient } from '@supabase/supabase-js'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..', '..')
const DATA_DIR = path.join(ROOT, 'data')
const PRODUCTS_DIR = path.join(DATA_DIR, 'products_json')
const DESC_DIR = path.join(DATA_DIR, 'descriptions')
const SKU_MAP_FILE = path.join(DATA_DIR, 'sku_mapping.json')

// ============ CONFIG ============
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Cần set NEXT_PUBLIC_SUPABASE_URL và SUPABASE_SERVICE_ROLE_KEY trong .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false }
})

// ============ HELPERS ============
const BREADCRUMB_NOISE = new Set(['Trang chủ', 'Cửa hàng', 'Home', 'Shop'])
const ACCESSORY_URL = ['/phu-kien/', '/phu-kien-ban-nang-ha/', '/bang-mau/', '/ke-chan/']
const ACCESSORY_NAMES = ['phụ kiện', 'kê chân', 'bảng màu', 'miếng lót', 'nẹp bàn', 'dây cáp', 'ổ điện', 'móc treo']

function slugify(text) {
  return text
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd').replace(/Đ/g, 'D')
    .toLowerCase().trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-').replace(/-+/g, '-')
}

function calcOfinaPrice(govi) {
  if (!govi || govi <= 0) return { price: 0, discount: 0 }
  let d = 0
  if (govi < 1_000_000) d = 0
  else if (govi < 2_000_000) d = 0.03
  else if (govi < 3_000_000) d = 0.05
  else if (govi < 5_000_000) d = 0.06
  else if (govi < 10_000_000) d = 0.08
  else d = 0.10
  const raw = govi * (1 - d)
  return { price: Math.ceil(raw / 10_000) * 10_000, discount: d }
}

function isAccessory(p) {
  const url = (p.url || '').toLowerCase()
  if (ACCESSORY_URL.some(k => url.includes(k))) return true
  const name = (p.name || '').toLowerCase()
  if (ACCESSORY_NAMES.some(k => name.includes(k))) return true
  const catsText = [...(p.categories || []), ...(p.breadcrumb || [])].join(' ').toLowerCase()
  if (catsText.includes('phụ kiện')) return true
  return false
}

function cleanCats(breadcrumb) {
  if (!breadcrumb) return []
  const cats = breadcrumb.length > 1 ? breadcrumb.slice(0, -1) : breadcrumb
  const seen = new Set()
  const out = []
  for (const c of cats) {
    if (BREADCRUMB_NOISE.has(c) || seen.has(c)) continue
    seen.add(c); out.push(c)
  }
  return out
}

// ============ MAIN ============
async function main() {
  console.log('📂 Loading SKU mapping...')
  const skuMap = JSON.parse(fs.readFileSync(SKU_MAP_FILE, 'utf-8'))

  console.log('📂 Reading product JSON files...')
  const files = fs.readdirSync(PRODUCTS_DIR).filter(f => f.endsWith('.json'))
  console.log(`   Found ${files.length} files`)

  // ========== STEP 1: CATEGORIES ==========
  console.log('\n🗂️  Creating categories...')
  const categoryMap = new Map() // name → id
  const categorySet = new Set()

  for (const file of files) {
    try {
      const p = JSON.parse(fs.readFileSync(path.join(PRODUCTS_DIR, file), 'utf-8'))
      if (!p.name || isAccessory(p)) continue
      const cats = cleanCats(p.breadcrumb || [])
      if (cats.length) categorySet.add(cats[cats.length - 1])
    } catch {}
  }

  for (const name of categorySet) {
    const slug = slugify(name)
    const { data, error } = await supabase
      .from('categories')
      .upsert({ slug, name }, { onConflict: 'slug' })
      .select('id, slug, name')
      .single()
    if (error) { console.error(`  ❌ ${name}:`, error.message); continue }
    categoryMap.set(name, data.id)
  }
  console.log(`  ✅ ${categoryMap.size} categories`)

  // ========== STEP 2: PRODUCTS ==========
  console.log('\n📦 Importing products...')
  let success = 0, failed = 0
  const BATCH = 100
  const batch = []

  async function flushBatch() {
    if (!batch.length) return
    const { error } = await supabase.from('products').upsert(batch, { onConflict: 'ofina_sku' })
    if (error) {
      console.error(`  ❌ Batch error:`, error.message)
      failed += batch.length
    } else {
      success += batch.length
    }
    batch.length = 0
  }

  for (const file of files) {
    try {
      const p = JSON.parse(fs.readFileSync(path.join(PRODUCTS_DIR, file), 'utf-8'))
      if (!p.name || isAccessory(p) || !p.sku) continue

      const ofinaSku = skuMap[p.sku]
      if (!ofinaSku) continue

      // Enrich with rewritten description
      let descData = {}
      try {
        const descFile = path.join(DESC_DIR, file)
        if (fs.existsSync(descFile)) {
          descData = JSON.parse(fs.readFileSync(descFile, 'utf-8'))
        }
      } catch {}

      const govi = p.price || p.low_price
      const { price: ofinaPrice } = calcOfinaPrice(govi)
      const isVar = !!p.low_price
      const { price: lowP } = isVar ? calcOfinaPrice(p.low_price) : { price: null }
      const { price: highP } = isVar ? calcOfinaPrice(p.high_price) : { price: null }

      const cats = cleanCats(p.breadcrumb || [])
      const mainCat = cats[cats.length - 1]
      const categoryId = categoryMap.get(mainCat) || null

      const slug = slugify(p.name) + '-' + ofinaSku.toLowerCase()

      batch.push({
        ofina_sku: ofinaSku,
        govi_sku: p.sku,
        slug,
        name: p.name,
        short_description: descData.short_description || null,
        description: descData.description || p.description || null,
        brand: 'OFINA',
        price: ofinaPrice || 0,
        compare_price: govi || null,
        cost_price: null,
        is_price_hidden: !govi,
        low_price: lowP,
        high_price: highP,
        in_stock: (p.availability || '').includes('InStock'),
        category_id: categoryId,
        source_url: p.url,
        source_price: govi || null,
        imported_at: new Date().toISOString(),
        seo_title: descData.seo_title || null,
        seo_description: descData.seo_description || null,
        seo_keywords: descData.seo_keywords || null,
        status: 'active',
      })

      if (batch.length >= BATCH) await flushBatch()
    } catch (err) {
      failed++
    }
  }
  await flushBatch()
  console.log(`  ✅ ${success} products imported, ${failed} failed`)

  // ========== STEP 3: PRODUCT IMAGES ==========
  console.log('\n🖼️  Importing product images...')
  let imgCount = 0
  for (const file of files) {
    try {
      const p = JSON.parse(fs.readFileSync(path.join(PRODUCTS_DIR, file), 'utf-8'))
      if (!p.name || isAccessory(p) || !p.sku) continue
      const ofinaSku = skuMap[p.sku]
      if (!ofinaSku) continue

      const { data: product } = await supabase
        .from('products').select('id').eq('ofina_sku', ofinaSku).single()
      if (!product) continue

      const images = (p.images || []).slice(0, 10)
      if (!images.length) continue

      const imgRecords = images.map((url, idx) => ({
        product_id: product.id,
        url,
        alt_text: p.name,
        position: idx,
        is_primary: idx === 0,
      }))

      await supabase.from('product_images').insert(imgRecords)
      imgCount += images.length
    } catch {}
  }
  console.log(`  ✅ ${imgCount} images linked`)

  console.log('\n🎉 SEED HOÀN THÀNH!')
  console.log(`   Categories: ${categoryMap.size}`)
  console.log(`   Products:   ${success}`)
  console.log(`   Images:     ${imgCount}`)
}

main().catch(err => {
  console.error('❌ FATAL:', err)
  process.exit(1)
})
