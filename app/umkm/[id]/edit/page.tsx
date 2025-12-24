"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import Header from "@/components/header"
import Footer from "@/components/footer"
import Gallery from "@/components/gallery"
import RatingStars from "@/components/rating-stars"
import BookmarkButton from "@/components/bookmark-button"
import ReviewsSection from "@/components/reviews-section"
import { AccordionItem } from "@/components/accordion"
import { Badge } from "@/components/ui/badge" 
import { MapPin, Navigation, ShoppingBag, Copy, Info } from "lucide-react"
import { calculateDistance } from "@/lib/utils"
import { fetchFromApi } from "@/lib/data"

export default function DetailKulinerPage() {
  const params = useParams()
  const [item, setItem] = useState<any>(null)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [distance, setDistance] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    async function fetchData() {
      // Ambil data dari API Laravel
      const data = await fetchFromApi<any>(`/culinaries/${params.id}`)
      if (data) {
        setItem(data)
      }
      setLoading(false)
    }
    fetchData()
  }, [params.id])

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
        },
        (err) => console.warn("Akses lokasi ditolak")
      )
    }
  }, [])

  useEffect(() => {
    if (userLocation && item && item.lat && item.lng) {
      const d = calculateDistance(
        userLocation.lat,
        userLocation.lng,
        parseFloat(item.lat),
        parseFloat(item.lng)
      )
      setDistance(d)
    }
  }, [userLocation, item])

  const copyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 3000)
    }
  }

  // Proteksi Hydration Error
  if (!mounted) return null

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#f4e8d1]">
        <div className="text-center" suppressHydrationWarning>
          <div className="mb-4 h-16 w-16 animate-spin rounded-full border-4 border-[#a64029] border-t-transparent mx-auto"></div>
          <p className="font-serif text-[#a64029] text-xl animate-pulse italic">Menyiapkan Hidangan Nusantara...</p>
        </div>
      </div>
    )
  }

  if (!item) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-[#f4e8d1] gap-6 p-10 text-center">
        <h2 className="text-3xl font-serif font-bold text-[#3b2f2f]">Ouch! Menu Tidak Ditemukan</h2>
        <p className="text-[#6e5849] max-w-md">Kemungkinan data hidangan ini telah dihapus oleh Admin atau UMKM terkait.</p>
        <Link href="/" className="bg-[#a64029] text-white px-8 py-3 rounded-2xl no-underline font-bold shadow-lg">Kembali Jelajahi Kuliner</Link>
      </div>
    )
  }

  return (
    <>
      <Header />
      <main className="bg-[#f4e8d1] min-h-screen pb-20 font-sans" suppressHydrationWarning>
        <nav className="container mx-auto px-5 py-8 text-sm text-[#6e5849]">
          <Link href="/" className="hover:text-[#a64029] transition-colors">Beranda</Link>
          <span className="mx-2">/</span>
          <span className="font-bold text-[#3b2f2f]">{item.nama}</span>
        </nav>

        <article className="container mx-auto px-5 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            
            {/* Visual & Lokasi */}
            <div className="space-y-8">
              <Gallery images={item.images} />
              <div className="bg-white p-8 rounded-[32px] shadow-sm border border-[#3b2f2f]/5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-[#a64029] font-black uppercase text-sm tracking-widest">
                    <MapPin className="w-5 h-5" /> Lokasi Terverifikasi
                  </div>
                  {distance !== null && (
                    <span className="bg-[#4e5b31]/10 text-[#4e5b31] px-4 py-1.5 rounded-full text-xs font-black border border-[#4e5b31]/20">
                      {distance} km dari Anda
                    </span>
                  )}
                </div>
                <p className="text-[#3b2f2f] font-bold text-xl">{item.kota}, {item.provinsi}</p>
                <a 
                  href={`https://www.google.com/maps?q=${item.lat},${item.lng}`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="mt-6 w-full flex items-center justify-center gap-2 py-4 bg-[#4e5b31] text-white rounded-2xl font-bold no-underline shadow-lg hover:bg-[#3a4323] transition-all"
                >
                  <Navigation className="w-4 h-4" /> Buka di Google Maps
                </a>
              </div>
            </div>

            {/* Info Produk */}
            <div className="space-y-10">
              <header>
                <Badge className="bg-[#dfaf2b] text-[#3b2f2f] hover:bg-[#dfaf2b] mb-4 border-none font-black uppercase tracking-widest px-4 py-1.5 rounded-lg shadow-sm">
                  {item.kategori}
                </Badge>
                <h1 className="font-serif text-6xl text-[#a64029] leading-tight mb-6 font-bold">{item.nama}</h1>
                <div className="flex items-center gap-8 bg-white/40 w-fit p-4 rounded-3xl border border-white">
                  <RatingStars rating={Math.round(item.rating)} />
                  <span className="text-3xl font-black text-[#3b2f2f]">
                    {item.harga_min ? `Rp ${item.harga_min.toLocaleString('id-ID')}` : "Hubungi Mitra"}
                  </span>
                </div>
              </header>

              <div className="flex gap-4">
                <BookmarkButton kulinerId={item.id.toString()} />
                <button onClick={copyLink} className="flex items-center gap-2 px-8 py-3 bg-white border border-[#ddd] rounded-2xl font-bold text-[#6e5849] hover:bg-gray-50 transition-all shadow-sm">
                  <Copy className="w-5 h-5" /> {copied ? "Berhasil Disalin!" : "Bagikan"}
                </button>
              </div>

              <section className="bg-white/70 p-10 rounded-[40px] border border-white shadow-inner">
                <h2 className="font-serif text-2xl text-[#3b2f2f] mb-4 flex items-center gap-3 font-bold">
                  <Info className="w-6 h-6 text-[#a64029]" /> Tentang Hidangan
                </h2>
                <p className="text-[#6e5849] italic text-lg leading-relaxed mb-6 font-medium">"{item.deskripsi_ringkas}"</p>
                <div className="h-px bg-gray-200 w-full mb-6"></div>
                <p className="text-[#3b2f2f] leading-relaxed whitespace-pre-line text-base">{item.deskripsi_lengkap}</p>
              </section>

              <section>
                <h2 className="font-serif text-2xl text-[#3b2f2f] mb-6 font-bold">Resep & Cara Penyajian</h2>
                <div className="space-y-4">
                  <AccordionItem title="Daftar Bahan Utama">
                    <ul className="list-disc list-inside space-y-3 text-[#6e5849] p-4 bg-gray-50/50 rounded-2xl">
                      {item.bahan && item.bahan.map((b: string, i: number) => <li key={i} className="font-medium">{b}</li>)}
                    </ul>
                  </AccordionItem>
                  <AccordionItem title="Langkah-langkah Memasak">
                    <ol className="list-decimal list-inside space-y-4 text-[#3b2f2f] p-4 bg-gray-50/50 rounded-2xl">
                      {item.langkah && item.langkah.map((l: string, i: number) => <li key={i} className="leading-relaxed font-medium">{l}</li>)}
                    </ol>
                  </AccordionItem>
                </div>
              </section>
            </div>
          </div>

          <div className="mt-24 pt-16 border-t border-[#3b2f2f]/10">
            {/* FIX: Kirim ID ASLI dari Database (item.id), bukan dari URL */}
            <ReviewsSection culinaryId={item.id.toString()} />
          </div>
        </article>
      </main>
      <Footer />
    </>
  )
}