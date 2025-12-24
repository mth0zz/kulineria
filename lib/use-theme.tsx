"use client"

import { useEffect, useState } from "react"
import { getTheme, setTheme } from "./storage"

export function useTheme() {
  const [theme, setThemeState] = useState<"light" | "dark">("light")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const savedTheme = getTheme()
    setThemeState(savedTheme)
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark")
    }
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light"
    setTheme(newTheme)
    setThemeState(newTheme)
  }

  return { theme, toggleTheme, mounted }
}
