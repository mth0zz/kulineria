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
    const info = localStorage.getItem("user_info")
    if (!info) {
      router.push("/umkm/auth")
    } else {
      try {
        const parsed = JSON.parse(info)
        setUser(parsed)
        setFormData(prev => ({ 
          ...prev, 
          name: parsed.name || "", 
          nama_usaha: parsed.nama_usaha || "" 
        }))
      } catch (e) {
        console.error("Gagal memuat data user")
        router.push("/umkm/auth")
      }
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

    // Hit API Laravel (Fungsi updateProfile akan kita sesuaikan di Batch 2)
    const res = await postToApi("/user/update", formData)

    if (res.success) {
      setMsg({ type: "success", text: "Data profil usaha berhasil diperbarui!" })
      
      // Sinkronisasi ulang LocalStorage
      const updatedUser = { 
        ...user, 
        name: formData.name, 
        nama_usaha: formData.nama_usaha 
      }
      localStorage.setItem("user_info", JSON.stringify(updatedUser))
      setUser(updatedUser)
      setFormData(prev => ({ ...prev, password: "", confirm_password: "" }))
    } else {
      setMsg({ type: "error", text: res.message || "Gagal memperbarui profil usaha." })
    }
    setIsLoading(false)
  }

  if (!user) return null

  return (
    <UmkmShell title="Pengaturan Profil Usaha">
      <div className="max-w-4xl mx-auto space-y-8 font-sans">
        
        {/* INFO CARD: Status Verifikasi */}
        <div className="bg-[#4e5b31] p-8 rounded-[32px] text-white flex items-center justify-between shadow-lg shadow-[#4e5b31]/20">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-green-300 font-black text-[10px] uppercase tracking-[0.2em]">
              <BadgeCheck size={14} /> Account Verified
            </div>
            <h2 className="text-2xl font-serif font-bold italic">{user.nama_usaha}</h2>
            <p className="text-white/70 text-sm font-medium">Terdaftar sejak {new Date(user.created_at).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}</p>
          </div>
          <div className="hidden md:block">
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20">
              <Store size={32} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* DATA LEGALITAS (READ ONLY) */}
          <div className="lg:col-span-1">
            <Card className="p-6 bg-white rounded-[32px] border-none shadow-sm space-y-6">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest border-b border-gray-50 pb-3">Data Legalitas</h3>
              
              <div className="space-y-4">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-gray-400 uppercase">NIK Pemilik</p>
                  <div className="flex items-center gap-2 text-[#3b2f2f] font-mono text-sm font-bold bg-gray-50 p-2 rounded-lg">
                    <BadgeCheck size={14} className="text-blue-500" />
                    {user.nik_ktp || "327xxxxxxxxxxxxx"}
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-gray-400 uppercase">NPWP Usaha</p>
                  <div className="flex items-center gap-2 text-[#3b2f2f] font-mono text-sm font-bold bg-gray-50 p-2 rounded-lg">
                    <FileText size={14} className="text-gray-400" />
                    {user.npwp || "Belum diatur"}
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-50">
                   <p className="text-[10px] text-gray-400 leading-relaxed italic">
                     *Data legalitas tidak dapat diubah secara mandiri. Hubungi Admin untuk perubahan data NIK/NPWP.
                   </p>
                </div>
              </div>
            </Card>
          </div>

          {/* EDITABLE FORM */}
          <div className="lg:col-span-2">
            <Card className="p-8 bg-white rounded-[32px] border-none shadow-sm">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2.5 bg-[#a64029]/10 rounded-xl text-[#a64029]">
                  <Settings size={20} />
                </div>
                <h3 className="text-lg font-bold text-[#3b2f2f]">Identitas & Keamanan</h3>
              </div>

              {msg.text && (
                <div className={`mb-6 p-4 rounded-2xl flex items-center gap-3 border ${msg.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
                  {msg.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                  <p className="font-bold text-xs">{msg.text}</p>
                </div>
              )}

              <form onSubmit={handleUpdate} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nama Pemilik</label>
                    <div className="relative">
                      <User className="absolute left-4 top-3.5 w-4 h-4 text-gray-300" />
                      <Input 
                        className="pl-10 py-6 border-gray-100 rounded-xl bg-gray-50/50 focus:bg-white transition-all text-sm font-bold" 
                        value={formData.name} 
                        onChange={(e) => setFormData({...formData, name: e.target.value})} 
                        required 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nama Usaha</label>
                    <div className="relative">
                      <Store className="absolute left-4 top-3.5 w-4 h-4 text-gray-300" />
                      <Input 
                        className="pl-10 py-6 border-gray-100 rounded-xl bg-gray-50/50 focus:bg-white transition-all text-sm font-bold" 
                        value={formData.nama_usaha} 
                        onChange={(e) => setFormData({...formData, nama_usaha: e.target.value})} 
                        required 
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Bisnis</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-3.5 w-4 h-4 text-gray-300" />
                    <Input 
                      className="pl-10 py-6 border-none bg-gray-100 rounded-xl text-sm font-medium text-gray-400" 
                      value={user.email} 
                      disabled 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-50">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Ganti Password</label>
                    <Input 
                      type="password"
                      placeholder="••••••••"
                      className="py-6 border-gray-100 rounded-xl bg-gray-50/50 focus:bg-white transition-all" 
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Konfirmasi Password</label>
                    <Input 
                      type="password"
                      placeholder="••••••••"
                      className="py-6 border-gray-100 rounded-xl bg-gray-50/50 focus:bg-white transition-all" 
                      value={formData.confirm_password}
                      onChange={(e) => setFormData({...formData, confirm_password: e.target.value})}
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <Button 
                    disabled={isLoading} 
                    type="submit" 
                    className="w-full py-8 bg-[#4e5b31] hover:bg-[#3a4323] text-white font-black rounded-2xl text-xs uppercase tracking-[0.2em] shadow-lg shadow-[#4e5b31]/20 transition-all flex items-center justify-center gap-3"
                  >
                    {isLoading ? (
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    ) : (
                      "Simpan Perubahan"
                    )}
                  </Button>
                </div>
              </form>
            </Card>
          </div>

        </div>
      </div>
    </UmkmShell>
  )
}