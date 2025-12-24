"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { setTheme, getTheme } from "@/lib/admin-utils"

interface AdminLayoutProps {
  children: React.ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname()
  const [isDark, setIsDark] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const theme = getTheme()
    setIsDark(theme === "dark")
    setTheme(theme)
  }, [])

  const toggleTheme = () => {
    const newTheme = isDark ? "light" : "dark"
    setTheme(newTheme)
    setIsDark(!isDark)
  }

  const isActive = (path: string) => pathname === path

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: "📊" },
    { href: "/admin/reviews", label: "Moderasi Ulasan", icon: "✍️" },
    { href: "/admin/kuliner", label: "Daftar Kuliner", icon: "🍽️" },
    { href: "/admin/settings", label: "Pengaturan", icon: "⚙️" },
  ]

  if (!mounted) return null

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Sidebar */}
      <aside className="w-64 bg-sidebar border-r border-sidebar-border fixed h-screen overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-[#A64029] to-[#6E5849] rounded-lg flex items-center justify-center text-white font-bold text-lg">
              K
            </div>
            <div>
              <h1 className="font-bold text-sm leading-tight text-sidebar-foreground">Kuliner</h1>
              <p className="text-xs text-sidebar-accent-foreground/70">Nusantara</p>
            </div>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive(item.href)
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/10"
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="font-medium text-sm">{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 ml-64 flex flex-col">
        {/* Topbar */}
        <header className="h-16 bg-card border-b border-border flex items-center justify-between px-8 sticky top-0 z-40">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              {navItems.find((item) => isActive(item.href))?.label || "Dashboard"}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
              aria-label="Toggle theme"
              title={isDark ? "Light mode" : "Dark mode"}
            >
              {isDark ? "☀️" : "🌙"}
            </button>

            {/* Avatar */}
            <div className="w-10 h-10 bg-gradient-to-br from-[#DFAF2B] to-[#E2903A] rounded-full flex items-center justify-center text-white font-bold text-sm">
              AD
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto bg-background">
          <div className="p-8">{children}</div>
        </main>
      </div>
    </div>
  )
}
