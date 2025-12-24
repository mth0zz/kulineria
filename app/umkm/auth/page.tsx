"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Store, BadgeCheck, FileText, ShieldCheck, ArrowRight, AlertCircle } from "lucide-react"
import { postToApi } from "@/lib/data"

export default function UMKMAuthPage() {
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState({ type: "", text: "" })
  const [fieldErrors, setFieldErrors] = useState<any>({})
  const router = useRouter()

  const [regData, setRegData] = useState({
    name: "", email: "", password: "",
    nama_usaha: "", nik_ktp: "", npwp: "", kategori_usaha: "Makanan Berat"
  })

  const [loginData, setLoginData] = useState({ email: "", password: "" })

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMsg({ type: "", text: "" })
    setFieldErrors({})

    const res = await postToApi("/register/umkm", regData)
    
    if (res.success) {
      setMsg({ type: "success", text: res.message })
      setRegData({ name: "", email: "", password: "", nama_usaha: "", nik_ktp: "", npwp: "", kategori_usaha: "Makanan Berat" })
    } else {
      if (res.errors) {
        setFieldErrors(res.errors)
        setMsg({ type: "error", text: "Perbaiki kesalahan pada form." })
      } else {
        setMsg({ type: "error", text: res.message || "Gagal mendaftar." })
      }
    }
    setLoading(false)
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMsg({ type: "", text: "" })
    
    const res = await postToApi("/login", loginData)
    
    if (res.success) {
      // FIX: SIMPAN SEMUA DATA YANG DIBUTUHKAN SISTEM
      localStorage.setItem("auth_token", res.token)
      localStorage.setItem("user_role", res.role)
      localStorage.setItem("user_info", JSON.stringify(res.user))
      localStorage.setItem("umkm_logged_in", "true")
      localStorage.setItem("user_logged_in", "true")

      // Redirect ke Dashboard UMKM
      router.push("/umkm")
    } else {
      setMsg({ type: "error", text: res.message || "Gagal masuk." })
    }
    setLoading(false)
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#f4e8d1] flex flex-col items-center justify-center p-6 py-20 font-sans">
        <div className="text-center mb-10 max-w-lg">
          <div className="bg-[#4e5b31]/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-sm">
            <Store className="text-[#4e5b31] w-10 h-10" />
          </div>
          <h1 className="font-serif text-4xl text-[#3b2f2f] font-bold">Portal Mitra UMKM</h1>
        </div>

        {msg.text && (
          <div className={`mb-6 p-4 rounded-2xl flex items-center gap-3 max-w-xl w-full border ${msg.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
            <AlertCircle size={20} />
            <p className="font-bold text-sm">{msg.text}</p>
          </div>
        )}

        <Tabs defaultValue="login" className="w-full max-w-xl">
          <TabsList className="grid w-full grid-cols-2 mb-8 bg-[#4e5b31]/10 h-14 p-1 rounded-2xl">
            <TabsTrigger value="login" className="rounded-xl font-bold">Masuk Mitra</TabsTrigger>
            <TabsTrigger value="register" className="rounded-xl font-bold">Daftar Mitra</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <Card className="p-8 bg-white rounded-[32px] border-none shadow-xl">
              <form onSubmit={handleLogin} className="space-y-5">
                <Input type="email" placeholder="Email Bisnis" className="py-7 border-[#ddd] rounded-2xl" value={loginData.email} onChange={(e) => setLoginData({...loginData, email: e.target.value})} required />
                <Input type="password" placeholder="Password" className="py-7 border-[#ddd] rounded-2xl" value={loginData.password} onChange={(e) => setLoginData({...loginData, password: e.target.value})} required />
                <Button disabled={loading} className="w-full py-8 bg-[#4e5b31] text-white font-bold rounded-2xl text-lg shadow-lg shadow-[#4e5b31]/20">
                  {loading ? "Otorisasi..." : "Buka Dashboard"}
                </Button>
              </form>
            </Card>
          </TabsContent>

          <TabsContent value="register">
            <Card className="p-8 bg-white rounded-[32px] border-none shadow-xl">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input placeholder="Nama Pemilik" className="rounded-xl" value={regData.name} onChange={(e) => setRegData({...regData, name: e.target.value})} required />
                  <Input placeholder="Nama Usaha" className="rounded-xl" value={regData.nama_usaha} onChange={(e) => setRegData({...regData, nama_usaha: e.target.value})} required />
                </div>
                <Input type="email" placeholder="Email Aktif" className="rounded-xl" value={regData.email} onChange={(e) => setRegData({...regData, email: e.target.value})} required />
                <div className="relative">
                  <BadgeCheck className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                  <Input placeholder="NIK KTP (16 Digit)" className="pl-10 rounded-xl" value={regData.nik_ktp} onChange={(e) => setRegData({...regData, nik_ktp: e.target.value})} required maxLength={16} />
                </div>
                <div className="relative">
                  <FileText className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                  <Input placeholder="NPWP Usaha" className="pl-10 rounded-xl" value={regData.npwp} onChange={(e) => setRegData({...regData, npwp: e.target.value})} />
                </div>
                <Input type="password" placeholder="Password (Min. 8 Karakter)" className="rounded-xl" value={regData.password} onChange={(e) => setRegData({...regData, password: e.target.value})} required />
                <Button disabled={loading} className="w-full py-7 bg-[#4e5b31] hover:bg-[#3a4323] text-white font-bold rounded-2xl text-lg flex gap-2 justify-center shadow-lg">
                  {loading ? "Mendaftar..." : <>Daftar Mitra <ArrowRight size={20} /></>}
                </Button>
              </form>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </>
  )
}