"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ShieldAlert, Lock, User, ArrowRight, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { postToApi } from "@/lib/data"

export default function AdminLoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errorMsg, setErrorMsg] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMsg("")

    const res = await postToApi("/login", { email, password })

    if (res.success && res.role === "admin") {
      localStorage.setItem("auth_token", res.token)
      localStorage.setItem("user_role", res.role)
      localStorage.setItem("user_logged_in", "true")
      router.push("/admin") // Masuk ke area sakral
    } else {
      setErrorMsg(res.role !== "admin" && res.success 
        ? "Akses Ditolak: Anda bukan Administrator." 
        : (res.message || "Kredensial Admin Salah."))
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#0f0f0f] flex items-center justify-center p-6 font-sans">
      <Card className="w-full max-w-md p-10 bg-[#1a1a1a] border border-white/5 rounded-[40px] shadow-[0_30px_60px_-12px_rgba(0,0,0,0.5)]">
        <div className="text-center mb-10">
          <div className="bg-red-600/10 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-red-600/20">
            <ShieldAlert className="text-red-600 w-10 h-10" />
          </div>
          <h1 className="text-white text-3xl font-black tracking-tight uppercase">Admin Login</h1>
          <p className="text-gray-500 mt-2 text-xs font-bold tracking-[0.2em] uppercase">Security Gateway</p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 bg-red-600/10 border border-red-600/20 text-red-500 rounded-2xl text-xs font-bold flex gap-3 items-center">
            <AlertCircle size={16} /> {errorMsg}
          </div>
        )}

        <form onSubmit={handleAdminLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Admin Email</label>
            <div className="relative">
              <User className="absolute left-4 top-3.5 w-5 h-5 text-gray-600" />
              <Input 
                type="email" 
                placeholder="admin@nusantara.id" 
                className="pl-12 py-7 bg-white/5 border-none text-white focus:ring-red-600 rounded-2xl"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Master Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 w-5 h-5 text-gray-600" />
              <Input 
                type="password" 
                placeholder="••••••••••••" 
                className="pl-12 py-7 bg-white/5 border-none text-white focus:ring-red-600 rounded-2xl"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <Button type="submit" disabled={isLoading} className="w-full py-8 bg-red-600 hover:bg-red-700 text-white font-black rounded-2xl text-base uppercase tracking-widest transition-all">
            {isLoading ? <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" /> : "Authorize Access"}
          </Button>
        </form>

        <div className="mt-10 text-center">
          <Link href="/" className="text-gray-600 text-xs font-bold hover:text-white transition-colors uppercase tracking-widest">
            ← Exit to Main Site
          </Link>
        </div>
      </Card>
    </main>
  )
}