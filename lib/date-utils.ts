/**
 * Date formatting utilities
 */

export type DateFormat = "DD/MM/YYYY" | "MM/DD/YYYY" | "YYYY-MM-DD" | "DD-MM-YYYY"
export type TimeFormat = "24h" | "12h"

/**
 * Format a date based on the specified format
 */
export function formatDate(date: Date | string, format: DateFormat = "DD/MM/YYYY"): string {
  const d = typeof date === "string" ? new Date(date) : date
  const day = String(d.getDate()).padStart(2, "0")
  const month = String(d.getMonth() + 1).padStart(2, "0")
  const year = d.getFullYear()

  switch (format) {
    case "DD/MM/YYYY":
      return `${day}/${month}/${year}`
    case "MM/DD/YYYY":
      return `${month}/${day}/${year}`
    case "YYYY-MM-DD":
      return `${year}-${month}-${day}`
    case "DD-MM-YYYY":
      return `${day}-${month}-${year}`
    default:
      return d.toLocaleDateString()
  }
}

/**
 * Format a time based on the specified format
 */
export function formatTime(date: Date | string, format: TimeFormat = "24h"): string {
  const d = typeof date === "string" ? new Date(date) : date
  const hours = String(d.getHours()).padStart(2, "0")
  const minutes = String(d.getMinutes()).padStart(2, "0")
  const seconds = String(d.getSeconds()).padStart(2, "0")

  if (format === "24h") {
    return `${hours}:${minutes}:${seconds}`
  }

  const date12 = d.toLocaleString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  })
  return date12
}

/**
 * Format date and time together
 */
export function formatDateTime(
  date: Date | string,
  dateFormat: DateFormat = "DD/MM/YYYY",
  timeFormat: TimeFormat = "24h",
): string {
  return `${formatDate(date, dateFormat)} ${formatTime(date, timeFormat)}`
}

/**
 * Get relative time (e.g., "2 hours ago")
 */
export function getRelativeTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffSecs = Math.floor(diffMs / 1000)
  const diffMins = Math.floor(diffSecs / 60)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffSecs < 60) return "Baru saja"
  if (diffMins < 60) return `${diffMins} menit yang lalu`
  if (diffHours < 24) return `${diffHours} jam yang lalu`
  if (diffDays === 1) return "Kemarin"
  if (diffDays < 7) return `${diffDays} hari yang lalu`

  return formatDate(d)
}
