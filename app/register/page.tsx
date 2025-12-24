"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { User, Mail, Lock, ArrowRight, AlertCircle, CheckCircle2 } from "lucide-react"
import { postToApi } from "@/lib/data"

export default function VisitorRegisterPage() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "", confirmPassword: "" })
  const [isLoading, setIsLoading] = useState(false)
  const [msg, setMsg] = useState({ type: "", text: "" })
  const [fieldErrors, setFieldErrors] = useState<any>({})
  const router = useRouter()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMsg({ type: "", text: "" })
    setFieldErrors({})

    if (formData.password !== formData.confirmPassword) {
      setMsg({ type: "error", text: "Konfirmasi kata sandi tidak cocok." })
      setIsLoading(false)
      return
    }

    // Hit API Register khusus Visitor (Member)
    const res = await postToApi("/register/visitor", {
      name: formData.name,
      email: formData.email,
      password: formData.password
    })

    if (res.success) {
      setMsg({ type: "success", text: "Registrasi Berhasil! Mengalihkan ke Login..." })
      setTimeout(() => router.push("/login"), 2000)
    } else {
      if (res.errors) {
        setFieldErrors(res.errors)
        setMsg({ type: "error", text: "Terdapat kesalahan pada data Anda." })
      } else {
        setMsg({ type: "error", text: res.message || "Gagal mendaftar." })
      }
      setIsLoading(false)
    }
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#f4e8d1] flex items-center justify-center p-6 py-20 font-sans">
        <Card className="w-full max-w-md p-8 bg-white rounded-[40px] shadow-xl border-none">
          <div className="text-center mb-8">
            <h1 className="font-serif text-3xl text-[#3b2f2f] font-bold">Daftar Member</h1>
            <p className="text-[#6e5849] mt-2 text-sm">Buat akun untuk mulai membagikan ulasan rasa.</p>
          </div>

          {msg.text && (
            <div className={`mb-6 p-4 rounded-2xl flex items-center gap-3 border ${msg.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
              {msg.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
              <p className="font-bold text-xs">{msg.text}</p>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#3b2f2f] ml-1 uppercase">Nama Lengkap</label>
              <div className="relative">
                <User className="absolute left-4 top-3.5 w-5 h-5 text-[#6e5849]" />
                <Input placeholder="Nama Anda" className="pl-12 py-7 rounded-2xl border-[#ddd]" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
              </div>
              {fieldErrors.name && <p className="text-[10px] text-red-500 font-bold ml-1">{fieldErrors.name[0]}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#3b2f2f] ml-1 uppercase">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 w-5 h-5 text-[#6e5849]" />
                <Input type="email" placeholder="email@nusantara.com" className="pl-12 py-7 rounded-2xl border-[#ddd]" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
              </div>
              {fieldErrors.email && <p className="text-[10px] text-red-500 font-bold ml-1">{fieldErrors.email[0]}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#3b2f2f] ml-1 uppercase">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 w-5 h-5 text-[#6e5849]" />
                <Input type="password" placeholder="Minimal 8 karakter" className="pl-12 py-7 rounded-2xl border-[#ddd]" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} required />
              </div>
              {fieldErrors.password && <p className="text-[10px] text-red-500 font-bold ml-1">{fieldErrors.password[0]}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#3b2f2f] ml-1 uppercase">Konfirmasi Password</label>
              <div className="relative">
                <CheckCircle2 className="absolute left-4 top-3.5 w-5 h-5 text-[#6e5849]" />
                <Input type="password" placeholder="Ulangi password" className="pl-12 py-7 rounded-2xl border-[#ddd]" value={formData.confirmPassword} onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} required />
              </div>
            </div>

            <Button disabled={isLoading} type="submit" className="w-full py-8 bg-[#a64029] hover:bg-[#85311e] text-white font-bold rounded-2xl text-lg flex gap-2">
              {isLoading ? <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" /> : <>Daftar Akun <ArrowRight size={20} /></>}
            </Button>
          </form>

          <p className="text-center text-[#6e5849] text-sm mt-8">
            Sudah punya akun? <Link href="/login" className="text-[#a64029] font-bold hover:underline">Masuk</Link>
          </p>
        </Card>
      </main>
      <Footer />
    </>
  )
}