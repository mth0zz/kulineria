"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { 
  LayoutDashboard, 
  MessageSquare, 
  Utensils, 
  ShieldCheck, 
  LogOut,
  ChevronLeft,
  ChevronRight
} from "lucide-react"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [isSidebarOpen, setSidebarOpen] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // PROTEKSI SAKRAL: Cek apakah yang login beneran Admin
    const token = localStorage.getItem("auth_token")
    const role = localStorage.getItem("user_role")

    // Jika mencoba akses /admin tapi gak punya token admin atau bukan role admin
    if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
      if (!token || role !== "admin") {
        router.replace("/admin/login") // Tendang paksa ke login admin
      }
    }
  }, [pathname, router])

  const menuItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Moderasi Ulasan", href: "/admin/reviews", icon: MessageSquare },
    { name: "Daftar Kuliner", href: "/admin/kuliner", icon: Utensils },
    { name: "Verifikasi UMKM", href: "/admin/umkm-verification", icon: ShieldCheck },
  ]

  const handleLogout = () => {
    localStorage.clear()
    router.push("/admin/login")
  }

  // Jangan render konten admin sebelum pengecekan mounted selesai
  if (!mounted) return null

  // Jika di halaman login admin, jangan tampilkan sidebar
  if (pathname === "/admin/login") {
    return <>{children}</>
  }

  return (
    <div className="flex h-screen bg-[#f8f9fa] text-[#3b2f2f] font-sans">
      {/* Sidebar Internal Admin */}
      <aside className={`${isSidebarOpen ? "w-64" : "w-20"} bg-[#1a1a1a] transition-all duration-300 flex flex-col shadow-2xl z-50`}>
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          {isSidebarOpen && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-red-600/20">A</div>
              <span className="font-bold text-white tracking-widest text-sm">ADMIN SYSTEM</span>
            </div>
          )}
          <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="text-white/40 hover:text-white mx-auto">
            {isSidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </button>
        </div>

        <nav className="flex-1 px-4 py-8 space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link key={item.href} href={item.href}
                className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${
                  isActive ? "bg-red-600 text-white shadow-lg shadow-red-600/20" : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <item.icon size={20} />
                {isSidebarOpen && <span className="text-sm font-bold">{item.name}</span>}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-white/5">
          <button onClick={handleLogout} className="w-full flex items-center gap-4 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-all font-bold">
            <LogOut size={20} />
            {isSidebarOpen && <span className="text-sm">Keluar Sistem</span>}
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden bg-[#f0f2f5]">
        <header className="h-16 bg-white border-b border-gray-200 px-8 flex items-center justify-between">
          <h1 className="text-sm font-black text-gray-400 uppercase tracking-widest">
            Control Panel / <span className="text-gray-800">{menuItems.find(i => i.href === pathname)?.name || "Dashboard"}</span>
          </h1>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs font-bold text-red-600 uppercase tracking-tighter">Root Access</p>
              <p className="text-xs font-bold text-gray-400">Authenticated</p>
            </div>
            <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center font-bold text-white shadow-md">AD</div>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-8">{children}</div>
      </main>
    </div>
  )
}