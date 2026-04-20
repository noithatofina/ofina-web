'use client'

import { useState, useTransition } from 'react'
import { uploadImageAction, deleteImageAction, setPrimaryImageAction, reorderImagesAction } from './actions'

type Img = { id: string; url: string; position: number; is_primary: boolean; alt_text?: string | null }

export function ImageManager({
  productId,
  govi_sku,
  initialImages,
}: {
  productId: string
  govi_sku: string
  initialImages: Img[]
}) {
  const [images, setImages] = useState(initialImages)
  const [isPending, startTransition] = useTransition()
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files || files.length === 0) return
    setUploading(true)
    setError(null)
    try {
      for (const file of Array.from(files)) {
        const fd = new FormData()
        fd.append('file', file)
        await uploadImageAction(productId, govi_sku, fd)
      }
      // Refresh page to show new images
      window.location.reload()
    } catch (err: any) {
      setError(err.message || 'Lỗi upload')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  function handleDelete(imgId: string) {
    if (!confirm('Xoá ảnh này?')) return
    startTransition(async () => {
      try {
        await deleteImageAction(productId, imgId)
        setImages(prev => prev.filter(i => i.id !== imgId))
      } catch (err: any) {
        setError(err.message)
      }
    })
  }

  function handleSetPrimary(imgId: string) {
    startTransition(async () => {
      try {
        await setPrimaryImageAction(productId, imgId)
        setImages(prev => prev.map(i => ({ ...i, is_primary: i.id === imgId })))
      } catch (err: any) {
        setError(err.message)
      }
    })
  }

  function move(index: number, direction: -1 | 1) {
    const target = index + direction
    if (target < 0 || target >= images.length) return
    const next = [...images]
    ;[next[index], next[target]] = [next[target], next[index]]
    setImages(next)
    startTransition(async () => {
      try {
        await reorderImagesAction(productId, next.map(i => i.id))
      } catch (err: any) {
        setError(err.message)
      }
    })
  }

  return (
    <div>
      <label className="block mb-4">
        <div className="border-2 border-dashed border-neutral-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition">
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleUpload}
            disabled={uploading}
            className="hidden"
          />
          <div className="text-sm text-neutral-600">
            {uploading ? 'Đang upload...' : 'Click để chọn ảnh (hoặc chọn nhiều ảnh cùng lúc)'}
          </div>
          <div className="text-xs text-neutral-400 mt-1">JPG, PNG, WebP — tối đa 5MB/ảnh</div>
        </div>
      </label>

      {error && (
        <div className="mb-3 p-2 bg-red-50 border border-red-200 text-red-700 rounded text-xs">
          {error}
        </div>
      )}

      {images.length === 0 ? (
        <div className="text-center text-neutral-400 text-sm py-6">Chưa có ảnh nào</div>
      ) : (
        <div className="space-y-2">
          {images.map((img, i) => (
            <div
              key={img.id}
              className={`flex items-center gap-3 p-2 border rounded-lg ${
                img.is_primary ? 'border-blue-500 bg-blue-50' : 'border-neutral-200'
              }`}
            >
              <img src={img.url} alt="" className="w-16 h-16 object-cover rounded" />
              <div className="flex-1 min-w-0">
                <div className="text-xs text-neutral-500 truncate">
                  {img.url.split('/').slice(-2).join('/')}
                </div>
                {img.is_primary && (
                  <span className="inline-block mt-1 px-2 py-0.5 bg-blue-600 text-white text-xs rounded">
                    Ảnh chính
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => move(i, -1)}
                  disabled={i === 0 || isPending}
                  className="text-xs px-2 py-0.5 border rounded hover:bg-neutral-100 disabled:opacity-30"
                  title="Đưa lên"
                >
                  ↑
                </button>
                <button
                  onClick={() => move(i, 1)}
                  disabled={i === images.length - 1 || isPending}
                  className="text-xs px-2 py-0.5 border rounded hover:bg-neutral-100 disabled:opacity-30"
                  title="Đưa xuống"
                >
                  ↓
                </button>
              </div>
              <div className="flex flex-col gap-1">
                {!img.is_primary && (
                  <button
                    onClick={() => handleSetPrimary(img.id)}
                    disabled={isPending}
                    className="text-xs px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded"
                    title="Đặt làm ảnh chính"
                  >
                    Chính
                  </button>
                )}
                <button
                  onClick={() => handleDelete(img.id)}
                  disabled={isPending}
                  className="text-xs px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded"
                >
                  Xoá
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
