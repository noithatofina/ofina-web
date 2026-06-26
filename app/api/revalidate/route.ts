import { revalidateTag, revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

/**
 * Trigger ISR + tag-based cache invalidation.
 *
 * Usage:
 *   GET /api/revalidate?key=CRON_SECRET&tag=site-settings
 *   GET /api/revalidate?key=CRON_SECRET&path=/
 *
 * Bảo vệ bằng CRON_SECRET (cùng env với Content Bot cron).
 */
export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get('key')
  if (!process.env.CRON_SECRET || key !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }
  const tag = req.nextUrl.searchParams.get('tag')
  const path = req.nextUrl.searchParams.get('path')
  const result: { tag?: string; path?: string; ok: boolean } = { ok: true }
  if (tag) { revalidateTag(tag); result.tag = tag }
  if (path) { revalidatePath(path); result.path = path }
  return NextResponse.json(result)
}
