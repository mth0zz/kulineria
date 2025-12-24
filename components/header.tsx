"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Utensils, LogOut, User as UserIcon, Settings, UserCircle } from "lucide-react"

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [role, setRole] = useState("")
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
    const token = localStorage.getItem("auth_token")
    const userRole = localStorage.getItem("user_role")
    if (token) {
      setIsLoggedIn(true)
      setRole(userRole || "")
    }
  }, [])

  const handleLogout = () => {
    localStorage.clear()
    setIsLoggedIn(false)
    router.push("/")
    window.location.reload()
  }

  // Mencegah Hydration Error
  if (!mounted) return <header className="h-[73px] bg-[#f4e8d1] border-b border-[#3b2f2f]/10"></header>

  return (
    <header className="sticky top-0 z-50 bg-[#f4e8d1]/95 backdrop-blur-md border-b border-[#3b2f2f]/10 py-4 font-sans">
      <nav className="container mx-auto px-5 flex justify-between items-center max-w-7xl">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-serif font-bold text-2xl text-[#A64029] hover:opacity-80 transition-all no-underline">
          <Utensils className="w-8 h-8" />
          <span>Kulineria</span>
        </Link>

        {/* Navigation */}
        <ul className="hidden md:flex list-none m-0 p-0 gap-6 items-center">
          <li>
            <Link href="/" className="text-[#3b2f2f] font-bold hover:text-[#A64029] transition-colors no-underline text-sm uppercase tracking-wider">
              Beranda
            </Link>
          </li>
          
          {!isLoggedIn ? (
            <>
              <li>
                <Link href="/umkm/auth" className="text-[#3b2f2f] font-bold hover:text-[#A64029] transition-colors no-underline text-sm uppercase tracking-wider">
                  Portal UMKM
                </Link>
              </li>
              <li>
                <Link 
                  href="/login" 
                  className="bg-[#A64029] text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#85311e] transition-all shadow-lg shadow-[#a64029]/20 no-underline"
                >
                  Masuk
                </Link>
              </li>
            </>
          ) : (
            <>
              {/* Menu Khusus Role */}
              {role === "umkm" && (
                <li><Link href="/umkm" className="text-[#4e5b31] font-black text-xs uppercase tracking-widest no-underline border-b-2 border-[#4e5b31]">Dashboard Mitra</Link></li>
              )}
              {role === "admin" && (
                <li><Link href="/admin" className="text-red-600 font-black text-xs uppercase tracking-widest no-underline border-b-2 border-red-600">Admin System</Link></li>
              )}
              
              {/* Menu Akun & Profil (Sesuai Permintaan: Untuk Visitor/Member) */}
              <li className="flex items-center gap-2 border-l border-gray-300 pl-6 ml-2">
                <div className="flex items-center gap-3">
                  <Link href="/profile" className="flex items-center gap-2 text-[#3b2f2f] font-bold no-underline hover:text-[#a64029] transition-all">
                    <div className="w-9 h-9 bg-[#dfaf2b] rounded-xl flex items-center justify-center text-[#3b2f2f] shadow-sm">
                      <UserIcon size={18} />
                    </div>
                    <div className="hidden lg:block text-left">
                      <p className="text-[10px] text-gray-400 font-black uppercase leading-none mb-1">Akses Member</p>
                      <p className="text-xs font-bold leading-none">Profil Saya</p>
                    </div>
                  </Link>
                </div>
                
                <button 
                  onClick={handleLogout}
                  className="ml-4 text-red-500 hover:bg-red-50 p-2.5 rounded-xl transition-all border border-transparent hover:border-red-100"
                  title="Keluar"
                >
                  <LogOut size={20} />
                </button>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  )
}