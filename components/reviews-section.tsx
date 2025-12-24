"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { Star, MessageSquare, AlertCircle, LogIn, CheckCircle2, Clock, User as UserIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import RatingStars from "./rating-stars"
import { fetchFromApi, postToApi } from "@/lib/data"

export default function ReviewsSection({ culinaryId }: { culinaryId?: string }) {
  const [reviews, setReviews] = useState<any[]>([])
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState("")
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [statusMsg, setStatusMsg] = useState({ type: "", text: "" })

  useEffect(() => {
    // 1. Cek Login
    const token = localStorage.getItem("auth_token")
    if (token) setIsLoggedIn(true)
    
    // 2. Load ulasan jika ID ada
    if (culinaryId && culinaryId !== "undefined") {
      loadApprovedReviews()
    } else {
      setLoading(false)
    }
  }, [culinaryId])

  const loadApprovedReviews = async () => {
    setLoading(true)
    const res = await fetchFromApi<any[]>(`/reviews/${culinaryId}`)
    setReviews(res || [])
    setLoading(false)
  }

  // FIX: Reset error saat user mulai ngetik lagi atau ganti bintang
  const handleRatingChange = (newRating: number) => {
    setRating(newRating)
    if (statusMsg.type === "error") setStatusMsg({ type: "", text: "" })
  }

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value)
    if (statusMsg.type === "error") setStatusMsg({ type: "", text: "" })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (rating === 0) {
      setStatusMsg({ type: "error", text: "Silakan pilih rating bintang dahulu." })
      return
    }

    if (!culinaryId || culinaryId === "undefined") {
      setStatusMsg({ type: "error", text: "Sistem gagal mengenali menu ini. Coba refresh halaman." })
      return
    }

    setIsSubmitting(true)
    setStatusMsg({ type: "", text: "" })

    const payload = {
      culinary_id: parseInt(culinaryId),
      rating: rating,
      comment: comment
    }

    const res = await postToApi("/reviews", payload)

    if (res.success) {
      setStatusMsg({ type: "success", text: res.message })
      setRating(0)
      setComment("")
    } else {
      setStatusMsg({ type: "error", text: res.message || "Gagal mengirim ulasan." })
    }
    setIsSubmitting(false)
  }

  return (
    <section className="font-sans space-y-12" suppressHydrationWarning>
      <div className="flex items-center gap-4">
        <MessageSquare className="text-[#a64029] w-10 h-10" />
        <h2 className="font-serif text-4xl text-[#3b2f2f] font-bold">Ulasan Rasa</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-1">
          <Card className="p-8 bg-white rounded-[40px] border-none shadow-sm sticky top-24">
            <h3 className="font-bold text-[#3b2f2f] mb-6 text-xl tracking-tight">Berikan Penilaian</h3>
            
            {!isLoggedIn ? (
              <div className="bg-[#f4e8d1]/50 p-8 rounded-[32px] border border-dashed border-[#a64029]/20 text-center space-y-6">
                <LogIn className="w-12 h-12 text-[#a64029] mx-auto opacity-30" />
                <p className="text-sm text-[#6e5849] font-bold leading-relaxed">Login sebagai Member untuk membagikan ulasan Anda.</p>
                <Link href="/login" className="block w-full py-4 bg-[#a64029] text-white rounded-2xl font-black text-xs uppercase tracking-widest no-underline shadow-lg shadow-[#a64029]/20 hover:bg-[#85311e] transition-all">Masuk Sekarang</Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] block mb-3 ml-1">Rating</label>
                  <RatingStars rating={rating} isInput={true} onRatingChange={handleRatingChange} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] block ml-1">Ulasan Anda</label>
                  <Textarea 
                    placeholder="Ceritakan rasa hidangannya..." 
                    value={comment} 
                    onChange={handleCommentChange} 
                    className="min-h-[160px] rounded-2xl border-[#eee] bg-gray-50/50 p-4 focus:ring-[#a64029]" 
                    required 
                  />
                </div>

                {statusMsg.text && (
                  <div className={`p-4 rounded-2xl text-xs font-bold flex items-center gap-3 border ${statusMsg.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
                    {statusMsg.type === 'success' ? <CheckCircle2 size={18}/> : <AlertCircle size={18}/>}
                    <span className="leading-tight">{statusMsg.text}</span>
                  </div>
                )}

                <Button disabled={isSubmitting} className="w-full py-8 bg-[#a64029] hover:bg-[#85311e] text-white font-black rounded-3xl text-sm uppercase tracking-widest shadow-xl shadow-[#a64029]/20 transition-all">
                  {isSubmitting ? "Mengirim..." : "Publikasikan Ulasan"}
                </Button>
              </form>
            )}
          </Card>
        </div>

        <div className="lg:col-span-2">
          {loading ? (
            <div className="py-20 text-center animate-pulse">
               <div className="w-12 h-12 border-4 border-[#a64029] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
               <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Sinkronisasi Ulasan...</p>
            </div>
          ) : reviews.length === 0 ? (
            <div className="bg-white/30 p-24 rounded-[60px] text-center border border-dashed border-gray-300 shadow-inner">
               <MessageSquare className="w-20 h-20 text-gray-200 mx-auto mb-6" />
               <h4 className="font-serif text-3xl text-gray-400 font-bold italic">Belum Ada Ulasan</h4>
               <p className="text-gray-400 text-sm mt-3 font-medium">Jadilah member pertama yang memberikan nilai rasa!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {reviews.map((rev: any) => (
                <Card key={rev.id} className="p-8 bg-white border-none rounded-[40px] shadow-sm hover:shadow-md transition-all group">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-[#dfaf2b] rounded-2xl flex items-center justify-center text-[#3b2f2f] font-black text-xl shadow-sm uppercase group-hover:scale-110 transition-transform">{rev.user?.name?.[0]}</div>
                      <div>
                        <h4 className="font-black text-[#3b2f2f] text-xl tracking-tighter uppercase">{rev.user?.name || "Member Nusantara"}</h4>
                        <p className="text-[10px] text-gray-400 font-bold flex items-center gap-1 uppercase tracking-widest mt-1">
                          <Clock size={12} /> {new Date(rev.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                    <div className="bg-[#dfaf2b]/10 px-4 py-2 rounded-xl flex items-center gap-1 text-[#dfaf2b] font-black">
                       <Star size={18} fill="currentColor" />
                       <span className="text-[#3b2f2f]">{rev.rating}.0</span>
                    </div>
                  </div>
                  <div className="bg-gray-50/70 p-6 rounded-[24px] italic border border-gray-100 text-[#3b2f2f] leading-relaxed text-lg shadow-inner">
                    "{rev.comment}"
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}