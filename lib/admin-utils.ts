/**
 * Admin utilities for Kuliner Nusantara dashboard
 */

// Types
export interface Review {
  id: string
  kuliner: string
  user: string
  rating: number
  excerpt: string
  createdAt: string
  status: "pending" | "approved" | "rejected"
}

export interface Kuliner {
  id: string
  title: string
  kategori: string
  provinsi: string
  kota: string
  status: "Published" | "Draft"
  slug: string
}

// localStorage helpers
export function lsGet<T>(key: string, fallback: T): T {
  try {
    if (typeof window === "undefined") return fallback
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : fallback
  } catch {
    return fallback
  }
}

export function lsSet<T>(key: string, val: T): void {
  try {
    if (typeof window !== "undefined") {
      localStorage.setItem(key, JSON.stringify(val))
    }
  } catch {
    // ignored
  }
}

// JSON fetch helpers
export async function loadJSON<T>(path: string): Promise<T> {
  const res = await fetch(path)
  if (!res.ok) throw new Error(`Failed to load ${path}`)
  return res.json()
}

// Date formatter
export function formatDate(dateStr: string, fmt: string): string {
  const d = new Date(dateStr)
  const pad = (n: number) => String(n).padStart(2, "0")

  if (fmt === "YYYY-MM-DD") {
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
  }

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  return `${pad(d.getDate())} ${months[d.getMonth()]} ${d.getFullYear()}`
}

// Theme management
export function getTheme(): "light" | "dark" {
  return lsGet("theme", "light") as "light" | "dark"
}

export function setTheme(theme: "light" | "dark"): void {
  lsSet("theme", theme)
  if (typeof document !== "undefined") {
    if (theme === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }
}

// Moderation helpers
export function getModeration(): Record<string, "approved" | "rejected"> {
  return lsGet("reviewModeration", {})
}

export function setModeration(mods: Record<string, "approved" | "rejected">): void {
  lsSet("reviewModeration", mods)
}

export function updateReviewStatus(reviewId: string, status: "approved" | "rejected"): void {
  const mods = getModeration()
  mods[reviewId] = status
  setModeration(mods)
}

// Apply moderation to reviews
export function applyModeration(reviews: Review[]): Review[] {
  const mods = getModeration()
  return reviews.map((r) => ({
    ...r,
    status: (mods[r.id] as Review["status"]) || r.status,
  }))
}

// Preferences
export function getPageSize(): number {
  return lsGet("pageSize", 10)
}

export function setPageSize(size: number): void {
  lsSet("pageSize", size)
}

export function getDateFormat(): string {
  return lsGet("dateFmt", "DD MMM YYYY")
}

export function setDateFormat(fmt: string): void {
  lsSet("dateFmt", fmt)
}

// Toast
let toastTimeout: NodeJS.Timeout | null = null

export function showToast(message: string, type: "success" | "error" | "info" = "info", duration = 3000): void {
  if (typeof document === "undefined") return

  if (toastTimeout) clearTimeout(toastTimeout)

  let existing = document.getElementById("toast-container")
  if (!existing) {
    existing = document.createElement("div")
    existing.id = "toast-container"
    existing.style.position = "fixed"
    existing.style.bottom = "1rem"
    existing.style.right = "1rem"
    existing.style.zIndex = "50"
    document.body.appendChild(existing)
  }

  const toast = document.createElement("div")
  toast.className = `toast ${type}`
  toast.textContent = message
  existing.appendChild(toast)

  toastTimeout = setTimeout(() => {
    toast.remove()
  }, duration)
}
