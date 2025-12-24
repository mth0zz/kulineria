"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Utensils, Mail, Lock, ArrowRight, AlertCircle } from "lucide-react"
import { postToApi } from "@/lib/data"

export default function VisitorLoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errorMsg, setErrorMsg] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMsg("")

    const result = await postToApi("/login", { email, password });

    if (result.success) {
      // CEK: Jika ternyata dia admin, dilarang login di sini
      if (result.role === "admin") {
        setErrorMsg("Portal ini khusus Pengguna Umum. Gunakan Portal Admin.");
        setIsLoading(false);
        return;
      }

      localStorage.setItem("auth_token", result.token);
      localStorage.setItem("user_role", result.role);
      localStorage.setItem("user_info", JSON.stringify(result.user));
      localStorage.setItem("user_logged_in", "true");

      if (result.role === "umkm") {
        localStorage.setItem("umkm_logged_in", "true");
        router.push("/umkm");
      } else {
        router.push("/");
      }
    } else {
      setErrorMsg(result.message || "Gagal masuk. Cek email dan sandi.");
      setIsLoading(false);
    }
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#f4e8d1] flex items-center justify-center p-6 py-12 font-sans">
        <Card className="w-full max-w-md p-8 bg-white rounded-[40px] shadow-xl border-none">
          <div className="text-center mb-8">
            <div className="bg-[#a64029]/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Utensils className="text-[#a64029] w-8 h-8" />
            </div>
            <h1 className="font-serif text-3xl text-[#3b2f2f] font-bold">Portal Member</h1>
            <p className="text-[#6e5849] mt-2 text-sm">Masuk untuk memberi ulasan hidangan.</p>
          </div>

          {errorMsg && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-sm flex gap-3 items-center font-bold">
              <AlertCircle size={18} className="flex-shrink-0" /> {errorMsg}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-bold text-[#3b2f2f] ml-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 w-5 h-5 text-[#6e5849]" />
                <Input type="email" placeholder="email@member.com" className="pl-12 py-7 border-[#ddd] rounded-2xl" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-[#3b2f2f] ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 w-5 h-5 text-[#6e5849]" />
                <Input type="password" placeholder="••••••••" className="pl-12 py-7 border-[#ddd] rounded-2xl" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
            </div>

            <Button type="submit" disabled={isLoading} className="w-full py-8 bg-[#a64029] hover:bg-[#85311e] text-white font-bold rounded-2xl text-lg flex gap-2">
              {isLoading ? <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" /> : "Masuk Sekarang"}
            </Button>
          </form>

          <div className="mt-10 pt-6 border-t border-gray-100 text-center">
            <p className="text-[#6e5849] text-sm">Belum punya akun? <Link href="/register" className="text-[#a64029] font-bold hover:underline">Daftar Member</Link></p>
          </div>
        </Card>
      </main>
      <Footer />
    </>
  )
}