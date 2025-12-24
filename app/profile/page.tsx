"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { UmkmShell } from "@/components/umkm-shell"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { 
  User, 
  Store, 
  Mail, 
  Lock, 
  BadgeCheck, 
  FileText, 
  CheckCircle2, 
  AlertCircle,
  Settings
} from "lucide-react"
import { postToApi } from "@/lib/data"

export default function UmkmProfilePage() {
  const [isLoading, setIsLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [msg, setMsg] = useState({ type: "", text: "" })
  const [user, setUser] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: "",
    nama_usaha: "",
    password: "",
    confirm_password: ""
  })
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
    
    // 1. Sinkronisasi dengan Logic Dashboard Utama
    const umkmSession = localStorage.getItem("umkm_logged_in")
    const info = localStorage.getItem("user_info")

    // Jika tidak ada tanda login UMKM, tendang balik
    if (umkmSession !== "true" || !info) {
      router.replace("/umkm/auth")
      return
    }

    try {
      const parsed = JSON.parse(info)
      setUser(parsed)
      setFormData(prev => ({ 
        ...prev, 
        name: parsed.name || "", 
        nama_usaha: parsed.nama_usaha || "" 
      }))
    } catch (e) {
      console.error("Session data corrupt")
      router.replace("/umkm/auth")
    }
  }, [router])

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMsg({ type: "", text: "" })

    if (formData.password && formData.password !== formData.confirm_password) {
      setMsg({ type: "error", text: "Konfirmasi sandi tidak cocok!" })
      setIsLoading(false)
      return
    }

    const res = await postToApi("/user/update", formData)

    if (res.success) {
      setMsg({ type: "success", text: "Profil usaha berhasil diperbarui!" })
      
      // Sinkronisasi data baru ke LocalStorage
      const updatedUser = { 
        ...user, 
        name: formData.name, 
        nama_usaha: formData.nama_usaha 
      }
      localStorage.setItem("user_info", JSON.stringify(updatedUser))
      setUser(updatedUser)
      setFormData(prev => ({ ...prev, password: "", confirm_password: "" }))
    } else {
      setMsg({ type: "error", text: res.message || "Gagal memperbarui profil." })
    }
    setIsLoading(false)
  }

  // Mencegah flickering
  if (!mounted || !user) return null

  return (
    <UmkmShell title="Profil Usaha">
      <div className="max-w-4xl mx-auto space-y-8 font-sans">
        
        {/* Header Profile Info */}
        <div className="bg-[#4e5b31] p-10 rounded-[40px] text-white flex items-center justify-between shadow-2xl shadow-[#4e5b31]/20">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-green-300 font-black text-[10px] uppercase tracking-[0.3em]">
              <BadgeCheck size={14} /> Account Verified
            </div>
            <h2 className="text-3xl font-serif font-bold italic">{user.nama_usaha || "Toko Anda"}</h2>
            <p className="text-white/60 text-sm font-medium italic">Mitra Kulineria Nusantara</p>
          </div>
          <div className="hidden md:flex w-20 h-20 bg-white/10 rounded-3xl items-center justify-center border border-white/20 backdrop-blur-md">
            <Store size={40} className="text-white" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Read Only Stats */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="p-8 bg-white rounded-[40px] border-none shadow-sm space-y-6">
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50 pb-3">Legalitas Mitra</h3>
              <div className="space-y-5">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase ml-1 mb-1">NIK Pemilik</p>
                  <div className="flex items-center gap-2 text-[#3b2f2f] font-mono text-sm font-bold bg-gray-50 p-4 rounded-2xl border border-gray-100">
                    <BadgeCheck size={16} className="text-blue-500" /> {user.nik_ktp || "-"}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase ml-1 mb-1">NPWP Usaha</p>
                  <div className="flex items-center gap-2 text-[#3b2f2f] font-mono text-sm font-bold bg-gray-50 p-4 rounded-2xl border border-gray-100">
                    <FileText size={16} className="text-gray-400" /> {user.npwp || "Tidak Ada"}
                  </div>
                </div>
                <div className="p-4 bg-blue-50 rounded-2xl text-[9px] text-blue-600 font-bold uppercase leading-relaxed">
                   Ingin mengubah data legalitas? Hubungi Admin Sistem.
                </div>
              </div>
            </Card>
          </div>

          {/* Form Edit */}
          <div className="lg:col-span-2">
            <Card className="p-8 md:p-10 bg-white rounded-[40px] border-none shadow-sm">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-[#a64029]/10 rounded-2xl text-[#a64029]"><Settings size={24} /></div>
                <h3 className="text-xl font-bold text-[#3b2f2f]">Identitas & Keamanan</h3>
              </div>

              {msg.text && (
                <div className={`mb-6 p-5 rounded-3xl flex items-center gap-3 border animate-in slide-in-from-top-2 ${msg.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
                  {msg.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                  <p className="font-bold text-sm">{msg.text}</p>
                </div>
              )}

              <form onSubmit={handleUpdate} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nama Pemilik</label>
                    <div className="relative">
                      <User className="absolute left-4 top-4 w-5 h-5 text-gray-300" />
                      <Input className="pl-12 py-8 border-gray-100 rounded-2xl bg-gray-50/50 focus:bg-white transition-all text-sm font-bold" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nama Usaha</label>
                    <div className="relative">
                      <Store className="absolute left-4 top-4 w-5 h-5 text-gray-300" />
                      <Input className="pl-12 py-8 border-gray-100 rounded-2xl bg-gray-50/50 focus:bg-white transition-all text-sm font-bold" value={formData.nama_usaha} onChange={(e) => setFormData({...formData, nama_usaha: e.target.value})} required />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Terdaftar</label>
                  <Input className="py-8 border-none bg-gray-100 rounded-2xl text-sm font-bold text-gray-300 cursor-not-allowed" value={user.email} disabled />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-50">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Password Baru</label>
                    <Input type="password" placeholder="••••••••" className="py-8 border-gray-100 rounded-2xl bg-gray-50/50 focus:bg-white" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Konfirmasi Password</label>
                    <Input type="password" placeholder="••••••••" className="py-8 border-gray-100 rounded-2xl bg-gray-50/50 focus:bg-white" value={formData.confirm_password} onChange={(e) => setFormData({...formData, confirm_password: e.target.value})} />
                  </div>
                </div>

                <Button disabled={isLoading} type="submit" className="w-full py-10 bg-[#4e5b31] hover:bg-[#3a4323] text-white font-black rounded-[32px] text-sm uppercase tracking-[0.2em] shadow-xl shadow-[#4e5b31]/30 transition-all flex items-center justify-center gap-3">
                  {isLoading ? <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent"></div> : "Simpan Perubahan"}
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </UmkmShell>
  )
}