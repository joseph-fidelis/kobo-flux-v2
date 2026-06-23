/**
 * Format date to readable string
 */
export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return '—'
  const d = new Date(date)
  if (isNaN(d.getTime())) return '—'
  return d.toLocaleDateString('en-GB', {
    year:  'numeric',
    month: 'long',
    day:   'numeric',
  })
}

export function formatDateTime(date: Date | string | null | undefined): string {
  if (!date) return '—'
  const d = new Date(date)
  if (isNaN(d.getTime())) return '—'
  return d.toLocaleString('en-GB', {
    year:   'numeric',
    month:  'short',
    day:    'numeric',
    hour:   '2-digit',
    minute: '2-digit',
    hour12: true,
  })
}

export function formatTimeAgo(date: Date | string | null | undefined): string {
  if (!date) return '—'
  const d = new Date(date)
  if (isNaN(d.getTime())) return '—'
  const seconds = Math.floor((Date.now() - d.getTime()) / 1000)
  if (seconds < 60)                        return 'just now'
  if (seconds < 3600)                      return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400)                     return `${Math.floor(seconds / 3600)}h ago`
  if (seconds < 604800)                    return `${Math.floor(seconds / 86400)}d ago`
  return formatDateTime(date)
}
