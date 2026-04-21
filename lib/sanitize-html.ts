/**
 * Sanitize HTML từ user input (paste ChatGPT, Word, Google Docs).
 * Xoá inline style, class, font tags, data attrs. Giữ nội dung.
 */
export function sanitizeHtml(raw: string): string {
  if (!raw) return raw
  return raw
    .replace(/\s*style\s*=\s*"[^"]*"/gi, '')
    .replace(/\s*style\s*=\s*'[^']*'/gi, '')
    .replace(/\s*class\s*=\s*"[^"]*"/gi, '')
    .replace(/\s*class\s*=\s*'[^']*'/gi, '')
    .replace(/<\/?font[^>]*>/gi, '')
    .replace(/<span[^>]*>/gi, '')
    .replace(/<\/span>/gi, '')
    .replace(/\s*id\s*=\s*"docs-internal-[^"]*"/gi, '')
    .replace(/\s*data-[\w-]+\s*=\s*"[^"]*"/gi, '')
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/&nbsp;/g, ' ')
    .replace(/\u00a0/g, ' ')
}
