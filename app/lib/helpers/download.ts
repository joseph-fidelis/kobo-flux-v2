export function sanitizeFilename(name: string) {
  return name.replace(/[^\w.-]+/g, '_').slice(0, 100) || 'form'
}

export function triggerBrowserDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.click()
  URL.revokeObjectURL(url)
}
 