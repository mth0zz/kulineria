/**
 * Filtering and search utilities
 */

/**
 * Search items by multiple fields
 */
export function searchItems<T extends Record<string, any>>(
  items: T[],
  searchTerm: string,
  searchFields: (keyof T)[],
): T[] {
  if (!searchTerm) return items

  const term = searchTerm.toLowerCase()
  return items.filter((item) =>
    searchFields.some((field) => {
      const value = item[field]
      if (value === null || value === undefined) return false
      return String(value).toLowerCase().includes(term)
    }),
  )
}

/**
 * Filter items by status
 */
export function filterByStatus<T extends Record<string, any>, K extends keyof T>(
  items: T[],
  status: T[K] | "all",
  statusField: K,
): T[] {
  if (status === "all") return items
  return items.filter((item) => item[statusField] === status)
}

/**
 * Sort items
 */
export function sortItems<T extends Record<string, any>>(
  items: T[],
  sortBy: keyof T,
  direction: "asc" | "desc" = "asc",
): T[] {
  return [...items].sort((a, b) => {
    const aVal = a[sortBy]
    const bVal = b[sortBy]

    if (typeof aVal === "string") {
      return direction === "asc" ? aVal.localeCompare(bVal as string) : (bVal as string).localeCompare(aVal)
    }

    if (typeof aVal === "number") {
      return direction === "asc" ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number)
    }

    if (aVal instanceof Date && bVal instanceof Date) {
      return direction === "asc" ? aVal.getTime() - bVal.getTime() : bVal.getTime() - aVal.getTime()
    }

    return 0
  })
}

/**
 * Paginate items
 */
export function paginate<T>(
  items: T[],
  page: number,
  pageSize: number,
): {
  items: T[]
  total: number
  pages: number
  currentPage: number
} {
  const total = items.length
  const pages = Math.ceil(total / pageSize)
  const start = (page - 1) * pageSize
  const end = start + pageSize

  return {
    items: items.slice(start, end),
    total,
    pages,
    currentPage: page,
  }
}
