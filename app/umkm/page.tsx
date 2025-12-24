"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { UmkmShell } from "@/components/umkm-shell"
import { getStorageItems } from "@/lib/storage"
import type { Kuliner } from "@/lib/types"
import { UmkmDashboard } from "./dashboard"

export default function UmkmPage() {
  const [items, setItems] = useState<Kuliner[]>([])
  const [mounted, setMounted] = useState(false)
  const [authorized, setAuthorized] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // 1. Cek status login UMKM di LocalStorage
    // (Nanti saat integrasi Laravel, ini akan mengecek Token Valid dari API)
    const umkmSession = localStorage.getItem("umkm_logged_in")

    if (umkmSession !== "true") {
      // Jika tidak ada session, lempar ke halaman login/registrasi mitra
      router.push("/umkm/auth")
    } else {
      // Jika ada session, izinkan akses dashboard
      setAuthorized(true)
      const stored = getStorageItems()
      setItems(stored)
      setMounted(true)
    }
  }, [router])

  // Cegah "flicker" konten sebelum pengecekan selesai
  if (!authorized) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#f4e8d1]">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-[#4e5b31] border-t-transparent mx-auto"></div>
          <p className="text-[#3b2f2f] font-medium">Memeriksa Akses Mitra...</p>
        </div>
      </div>
    )
  }

  return (
    <UmkmShell title="Dashboard UMKM" showAddButton>
      <UmkmDashboard initialItems={items} onItemsChange={setItems} />
    </UmkmShell>
  )
}