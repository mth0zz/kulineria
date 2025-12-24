import type { Kuliner, KulinerDraft } from "./types"
import { seedKulinerItems } from "./mock-data"

const STORAGE_KEY = "umkmItems"
const DRAFT_KEY = "umkmDraft"
const THEME_KEY = "theme"

export const getStorageItems = (): Kuliner[] => {
  if (typeof window === "undefined") return []

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (e) {
    console.error("Error reading from localStorage:", e)
  }

  // Return seed data if no stored items
  return seedKulinerItems
}

export const saveStorageItems = (items: Kuliner[]): void => {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch (e) {
    console.error("Error writing to localStorage:", e)
  }
}

export const getDraft = (): KulinerDraft | null => {
  if (typeof window === "undefined") return null

  try {
    const stored = localStorage.getItem(DRAFT_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (e) {
    console.error("Error reading draft from localStorage:", e)
  }

  return null
}

export const saveDraft = (data: Partial<Kuliner>): void => {
  if (typeof window === "undefined") return

  try {
    const draft: KulinerDraft = {
      data,
      timestamp: new Date().toISOString(),
    }
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft))
  } catch (e) {
    console.error("Error writing draft to localStorage:", e)
  }
}

export const clearDraft = (): void => {
  if (typeof window === "undefined") return

  try {
    localStorage.removeItem(DRAFT_KEY)
  } catch (e) {
    console.error("Error clearing draft:", e)
  }
}

export const getTheme = (): "light" | "dark" => {
  if (typeof window === "undefined") return "light"

  try {
    const stored = localStorage.getItem(THEME_KEY)
    if (stored === "dark") return "dark"
  } catch (e) {
    console.error("Error reading theme from localStorage:", e)
  }

  return "light"
}

export const setTheme = (theme: "light" | "dark"): void => {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem(THEME_KEY, theme)
    if (theme === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  } catch (e) {
    console.error("Error writing theme to localStorage:", e)
  }
}
