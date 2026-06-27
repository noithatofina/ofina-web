'use client'

import { deleteProductAction } from './actions'

interface Props {
  id: string
  name: string
}

export function DeleteProductButton({ id, name }: Props) {
  return (
    <form action={deleteProductAction} className="inline">
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className="px-2 py-1 text-xs bg-red-50 text-red-700 hover:bg-red-100 rounded"
        onClick={(e) => {
          if (!window.confirm(`Xoá hẳn "${name}"?\n\nSẽ xoá cả ảnh trong Storage. Không khôi phục được.`)) {
            e.preventDefault()
          }
        }}
      >
        Xoá
      </button>
    </form>
  )
}
