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

  // 1. Fetch Data dari Database Laravel
  useEffect(() => {
    async function fetchData() {
      // Mengambil data dari API Laravel: /api/culinaries/{id}
      const data = await fetchFromApi<any>(`/culinaries/${params.id}`)
      if (data) {
        setItem(data)
      }
      setLoading(false)
    }
    fetchData()
  }, [params.id])

  // 2. Real-time Geolocation User
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
        },
        (err) => {
          console.warn("Akses lokasi ditolak pengguna.", err)
        }
      )
    }
  }, [])

  // 3. Hitung Jarak Real-time jika koordinat tersedia
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

  // State Loading
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#f4e8d1]">
        <div className="text-center">
          <div className="mb-4 h-16 w-16 animate-spin rounded-full border-4 border-[#a64029] border-t-transparent mx-auto"></div>
          <p className="font-serif text-[#a64029] text-xl animate-pulse">Menyiapkan Hidangan dari Database...</p>
        </div>
      </div>
    )
  }

  // State Jika Data Tidak Ada
  if (!item) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-[#f4e8d1] gap-4">
        <p className="text-xl font-bold text-[#3b2f2f]">Kuliner tidak ditemukan di database.</p>
        <Link href="/" className="text-[#a64029] font-bold hover:underline">Kembali ke Beranda</Link>
      </div>
    )
  }

  return (
    <>
      <Header />
      <main className="bg-[#f4e8d1] min-h-screen pb-12 font-sans">
        {/* Breadcrumb */}
        <nav className="container mx-auto px-5 py-6 text-sm text-[#6e5849]">
          <Link href="/" className="hover:text-[#a64029] transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <span className="font-bold text-[#3b2f2f]">{item.nama}</span>
        </nav>

        <article className="container mx-auto px-5 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            
            {/* SISI KIRI: Visual & Info Jarak */}
            <div className="space-y-6">
              <Gallery images={item.images} />
              
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#3b2f2f]/10">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-[#a64029] font-bold">
                    <MapPin className="w-5 h-5" />
                    <span>Lokasi UMKM Terverifikasi</span>
                  </div>
                  {distance !== null ? (
                    <span className="bg-[#4e5b31]/10 text-[#4e5b31] px-4 py-1.5 rounded-full text-xs font-bold border border-[#4e5b31]/20">
                      {distance} km dari Anda
                    </span>
                  ) : (
                    <span className="text-xs text-[#6e5849] animate-pulse italic">Mencari lokasi Anda...</span>
                  )}
                </div>
                <p className="text-[#3b2f2f] font-bold text-lg">{item.kota}, {item.provinsi}</p>
                <a 
                  href={`https://www.google.com/maps?q=${item.lat},${item.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 w-full flex items-center justify-center gap-2 py-4 bg-[#4e5b31] text-white rounded-2xl hover:bg-[#3a4323] transition-all font-bold no-underline shadow-lg shadow-[#4e5b31]/20 text-center"
                >
                  <Navigation className="w-4 h-4" /> Buka Google Maps
                </a>
              </div>
            </div>

            {/* SISI KANAN: Konten & Interaksi */}
            <div className="space-y-8">
              <header>
                <Badge className="bg-[#dfaf2b] text-[#3b2f2f] hover:bg-[#dfaf2b] mb-4 border-none font-bold uppercase tracking-widest px-4 py-1">
                  {item.kategori}
                </Badge>
                <h1 className="font-serif text-5xl text-[#a64029] leading-tight mb-4 font-bold">{item.nama}</h1>
                <div className="flex items-center gap-6 bg-white/30 w-fit p-3 rounded-2xl border border-white">
                  <RatingStars rating={Math.round(item.rating)} />
                  <span className="text-2xl font-bold text-[#3b2f2f]">
                    {item.harga_min ? `Rp ${item.harga_min.toLocaleString('id-ID')}` : "Harga Bervariasi"}
                  </span>
                </div>
              </header>

              <div className="flex gap-4">
                <BookmarkButton kulinerId={item.id.toString()} />
                <button 
                  onClick={copyLink} 
                  className="flex items-center gap-2 px-8 py-3 bg-white border border-[#ddd] rounded-2xl font-bold text-[#6e5849] hover:bg-[#eee] transition-all"
                >
                  <Copy className="w-5 h-5" /> {copied ? "Link Disalin!" : "Bagikan"}
                </button>
              </div>

              {/* Section Tentang Kuliner */}
              <section className="bg-white/60 p-8 rounded-3xl border border-white shadow-inner">
                <h2 className="font-serif text-2xl text-[#3b2f2f] mb-4 flex items-center gap-3">
                  <Info className="w-6 h-6 text-[#a64029]" /> Tentang Hidangan
                </h2>
                <p className="text-[#6e5849] italic text-lg leading-relaxed mb-4">{item.deskripsi_ringkas}</p>
                <div className="h-px bg-white/50 w-full mb-4"></div>
                <p className="text-[#3b2f2f] leading-relaxed whitespace-pre-line">{item.deskripsi_lengkap}</p>
              </section>

              {/* Perantara Pemesanan (Delivery) */}
              <section>
                <h2 className="font-sans font-bold text-lg text-[#3b2f2f] mb-4 flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-[#a64029]" /> Pesan Delivery Sekarang:
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <a 
                    href={`https://gofood.link/p/search?query=${encodeURIComponent(item.nama)}`}
                    target="_blank"
                    className="flex items-center justify-center gap-2 p-4 bg-white border border-[#ddd] rounded-2xl hover:border-[#00aa13] hover:text-[#00aa13] transition-all font-bold no-underline text-[#3b2f2f]"
                  >
                    GoFood
                  </a>
                  <a 
                    href={`https://grab.com/food/search?query=${encodeURIComponent(item.nama)}`}
                    target="_blank"
                    className="flex items-center justify-center gap-2 p-4 bg-white border border-[#ddd] rounded-2xl hover:border-[#00b14f] hover:text-[#00b14f] transition-all font-bold no-underline text-[#3b2f2f]"
                  >
                    GrabFood
                  </a>
                  <a 
                    href={`https://shopee.co.id/search?keyword=${encodeURIComponent(item.nama)}`}
                    target="_blank"
                    className="flex items-center justify-center gap-2 p-4 bg-white border border-[#ddd] rounded-2xl hover:border-[#ee4d2d] hover:text-[#ee4d2d] transition-all font-bold no-underline text-[#3b2f2f]"
                  >
                    ShopeeFood
                  </a>
                </div>
              </section>

              {/* Section Resep (Data Dinamis JSON) */}
              <section>
                <h2 className="font-serif text-2xl text-[#3b2f2f] mb-4">Rahasia & Cara Pembuatan</h2>
                <div className="space-y-3">
                  <AccordionItem title="Daftar Bahan Utama">
                    <ul className="list-disc list-inside space-y-2 text-[#6e5849] p-2">
                      {item.bahan && item.bahan.map((b: string, i: number) => (
                        <li key={i}>{b}</li>
                      ))}
                    </ul>
                  </AccordionItem>
                  <AccordionItem title="Langkah-langkah Memasak">
                    <ol className="list-decimal list-inside space-y-3 text-[#3b2f2f] p-2">
                      {item.langkah && item.langkah.map((l: string, i: number) => (
                        <li key={i} className="leading-relaxed">{l}</li>
                      ))}
                    </ol>
                  </AccordionItem>
                </div>
              </section>
            </div>
          </div>

          {/* Section Review (Client-side Interaction) */}
          <div className="mt-24 border-t border-[#3b2f2f]/5 pt-12">
            <ReviewsSection />
          </div>
        </article>
      </main>
      <Footer />
    </>
  )
}