"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bookmark, Star } from "lucide-react"

interface KulinerCardProps {
  id: string
  title: string
  kategori: string
  provinsi: string
  kota: string
  hargaMin?: number
  hargaMax?: number
  rating: number
  images: string[]
}

export function KulinerCard({
  id,
  title,
  kategori,
  provinsi,
  kota,
  hargaMin,
  hargaMax,
  rating,
  images,
}: KulinerCardProps) {
  const [isSaved, setIsSaved] = useState(false)

  // Fungsi memformat angka ke Rupiah
  const formatPrice = (price?: number) => {
    if (!price && price !== 0) return ""
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price)
  }

  // FIX: Logika untuk menampilkan Range Harga Asli dari UMKM
  const displayPrice = () => {
    if (hargaMin && hargaMax) {
      if (hargaMin === hargaMax) return formatPrice(hargaMin)
      return `${formatPrice(hargaMin)} - ${formatPrice(hargaMax)}`
    } else if (hargaMin) {
      return formatPrice(hargaMin)
    } else if (hargaMax) {
      return formatPrice(hargaMax)
    }
    return "Harga Hubungi Mitra"
  }

  return (
    <div className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-[#ddd] flex flex-col h-full font-sans">
      {/* Visual Area */}
      <div className="relative w-full h-52 overflow-hidden bg-gray-100">
        <Image
          src={images && images.length > 0 ? images[0] : "/placeholder.svg"}
          alt={title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
        />
        <div className="absolute top-4 left-4">
          <Badge className="bg-[#dfaf2b] text-[#3b2f2f] border-none font-black px-3 py-1 shadow-sm uppercase text-[10px] tracking-widest">
            {kategori}
          </Badge>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-bold text-[#3b2f2f] text-xl line-clamp-1 tracking-tight">{title}</h3>
          <div className="flex items-center gap-1.5 bg-[#dfaf2b]/10 px-2 py-1 rounded-lg">
            <Star className="w-3.5 h-3.5 fill-[#dfaf2b] text-[#dfaf2b]" />
            <span className="text-xs font-black text-[#3b2f2f]">{rating > 0 ? rating.toFixed(1) : "0.0"}</span>
          </div>
        </div>

        <p className="text-xs text-[#6e5849] mb-5 flex items-center gap-1.5 font-medium italic">
          <span className="opacity-70">📍</span> {kota}, {provinsi}
        </p>

        <div className="mt-auto">
          {/* PERBAIKAN: Menampilkan Harga Rupiah Numerik */}
          <div className="mb-5 p-3 bg-[#f4e8d1]/30 rounded-2xl border border-[#a64029]/5">
            <p className="text-[14px] font-black text-[#a64029] tracking-tighter">
              {displayPrice()}
            </p>
          </div>

          <div className="flex gap-2">
            <Link href={`/kuliner/${id}`} className="flex-1">
              <Button
                variant="outline"
                className="w-full border-[#a64029] text-[#a64029] hover:bg-[#a64029] hover:text-white transition-all font-bold rounded-2xl py-6"
              >
                Lihat Detail
              </Button>
            </Link>
            
            <button
              onClick={() => setIsSaved(!isSaved)}
              className={`p-4 rounded-2xl border transition-all ${
                isSaved 
                ? "bg-[#a64029] text-white border-[#a64029] shadow-lg shadow-[#a64029]/20" 
                : "border-[#ddd] text-[#6e5849] hover:bg-[#f4e8d1]"
              }`}
            >
              <Bookmark className={`w-5 h-5 ${isSaved ? "fill-current" : ""}`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}