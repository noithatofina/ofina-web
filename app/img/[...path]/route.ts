/**
 * Proxy ảnh Supabase Storage qua domain ofina.vn.
 *
 * Lý do: Supabase Storage trả `x-robots-tag: none` trên domain mặc định và
 * KHÔNG cho tắt (gói Free) → Google Images không index được ảnh của 2.673
 * sản phẩm. Route này phục vụ đúng byte ảnh đó nhưng không kèm header chặn,
 * và thêm cache dài (ảnh sản phẩm gần như không đổi).
 *
 * URL: /img/<bucket>/<đường-dẫn-trong-bucket>
 * Chỉ cho phép các bucket trong ALLOWED_BUCKETS để không thành proxy mở.
 */

import { NextRequest, NextResponse } from 'next/server'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ivxdwqsqveqsjcsdvewq.supabase.co'
const ALLOWED_BUCKETS = new Set(['products'])
const ALLOWED_EXT = /\.(webp|jpg|jpeg|png|avif|gif|svg)$/i

export const revalidate = 86400

export async function GET(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  const { path } = await ctx.params
  if (!path?.length) return new NextResponse('Not found', { status: 404 })

  const [bucket, ...rest] = path
  const objectPath = rest.join('/')
  if (!ALLOWED_BUCKETS.has(bucket) || !objectPath || !ALLOWED_EXT.test(objectPath)) {
    return new NextResponse('Not found', { status: 404 })
  }
  // chặn đi ngược thư mục
  if (objectPath.includes('..')) return new NextResponse('Not found', { status: 404 })

  const upstream = `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${objectPath
    .split('/')
    .map(encodeURIComponent)
    .join('/')}`

  let res: Response
  try {
    res = await fetch(upstream, { next: { revalidate: 86400 } })
  } catch {
    return new NextResponse('Upstream error', { status: 502 })
  }
  if (!res.ok) return new NextResponse('Not found', { status: res.status === 404 ? 404 : 502 })

  return new NextResponse(res.body, {
    status: 200,
    headers: {
      'Content-Type': res.headers.get('content-type') || 'image/webp',
      // ảnh sản phẩm bất biến theo URL → cache dài ở CDN lẫn trình duyệt
      'Cache-Control': 'public, max-age=31536000, immutable',
      // KHÔNG đặt x-robots-tag: đây chính là lý do tồn tại của route này
    },
  })
}
