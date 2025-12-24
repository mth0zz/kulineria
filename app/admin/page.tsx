"use client"

import { useEffect, useState } from "react"
import { TrendingUp, Users, Utensils, ShieldAlert, CheckCircle, Database } from "lucide-react"
import { Card } from "@/components/ui/card"
import { fetchFromApi } from "@/lib/data"

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadStats() {
      // Sekarang sudah membawa Token lewat fetchFromApi yang baru
      const res = await fetchFromApi<any>("/admin/stats")
      if (res) {
        setStats(res)
      } else {
        console.error("Gagal memuat statistik. Cek Token Admin di LocalStorage.")
      }
      setLoading(false)
    }
    loadStats()
  }, [])

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-red-600 border-t-transparent mx-auto"></div>
          <p className="font-bold text-gray-500 uppercase tracking-widest text-xs">Mengkalkulasi Data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 font-sans animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-black text-gray-800 mb-2 italic">DASHBOARD ANALYTICS</h1>
        <p className="text-gray-500 text-sm font-medium">Realtime monitoring data Kuliner Nusantara dari Database MySQL.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Kuliner */}
        <Card className="p-6 bg-white border-none shadow-sm rounded-3xl group hover:shadow-md transition-all">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Total Kuliner</p>
              <h3 className="text-4xl font-black text-gray-800 mt-1">{stats?.total_kuliner || 0}</h3>
            </div>
            <div className="p-4 bg-gray-50 rounded-2xl text-gray-400 group-hover:bg-[#a64029]/10 group-hover:text-[#a64029] transition-colors">
              <Utensils size={28} />
            </div>
          </div>
        </Card>

        {/* Total Mitra UMKM */}
        <Card className="p-6 bg-white border-none shadow-sm rounded-3xl group hover:shadow-md transition-all">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Total Mitra</p>
              <h3 className="text-4xl font-black text-gray-800 mt-1">{stats?.total_umkm || 0}</h3>
            </div>
            <div className="p-4 bg-gray-50 rounded-2xl text-gray-400 group-hover:bg-[#4e5b31]/10 group-hover:text-[#4e5b31] transition-colors">
              <CheckCircle size={28} />
            </div>
          </div>
        </Card>

        {/* Total Visitor */}
        <Card className="p-6 bg-white border-none shadow-sm rounded-3xl group hover:shadow-md transition-all">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Visitor/Member</p>
              <h3 className="text-4xl font-black text-gray-800 mt-1">{stats?.total_visitor || 0}</h3>
            </div>
            <div className="p-4 bg-gray-50 rounded-2xl text-gray-400 group-hover:bg-[#dfaf2b]/10 group-hover:text-[#dfaf2b] transition-colors">
              <Users size={28} />
            </div>
          </div>
        </Card>

        {/* Pending Verification */}
        <Card className="p-6 bg-red-600 border-none shadow-xl shadow-red-600/20 rounded-3xl group">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-black text-white/60 uppercase tracking-[0.2em]">Verifikasi UMKM</p>
              <h3 className="text-4xl font-black text-white mt-1">{stats?.pending_verifikasi || 0}</h3>
            </div>
            <div className="p-4 bg-white/10 rounded-2xl text-white group-hover:bg-white/20 transition-colors">
              <ShieldAlert size={28} />
            </div>
          </div>
        </Card>
      </div>

      <div className="bg-[#1a1a1a] p-10 rounded-[48px] text-white flex flex-col md:flex-row justify-between items-center gap-8 border border-white/5">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-green-500 font-black text-[10px] uppercase tracking-widest">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            Database Connected
          </div>
          <h2 className="text-3xl font-serif font-bold italic">Kesehatan Jaringan API</h2>
          <p className="text-gray-400 text-sm max-w-md">Data sinkron dengan MySQL MAMP. Seluruh pendaftaran UMKM & ulasan visitor terekam di sistem pusat.</p>
        </div>
        <div className="flex items-center gap-4">
           <div className="bg-white/5 p-4 rounded-2xl border border-white/10 flex items-center gap-3">
              <Database className="text-gray-400" />
              <span className="font-bold text-sm">Port 8000</span>
           </div>
           <div className="bg-red-600 text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-tighter shadow-lg shadow-red-600/30">
              Sistem Optimal
           </div>
        </div>
      </div>
    </div>
  )
}