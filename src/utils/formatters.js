export function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

export function extractPeriodScore(periodStr) {
  if (!periodStr) return '0-0'
  const match = periodStr.match(/\((\d+-\d+)\)/) || periodStr.match(/^(\d+-\d+)/)
  return match ? match[1] : '0-0'
}