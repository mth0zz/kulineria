"use client"

import { useState, useEffect, useCallback } from "react"
import Header from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { FilterBar } from "@/components/filter-bar"
import { KulinerGrid } from "@/components/kuliner-grid"
import { CarouselBaru } from "@/components/carousel-baru"
import { FAQSection } from "@/components/faq-section"
import Footer from "@/components/footer"
import { loadAllFromDatabase } from "@/lib/data"

export default function Home() {
  const [data, setData] = useState<any>(null)
  const [filters, setFilters] = useState({ kategori: [], sort: "populer", maxPrice: undefined })
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await loadAllFromDatabase()
        console.log("CHECKPOINT - Sync Data Berhasil:", res.kuliner);
        setData(res)
      } catch (err) {
        console.error("Koneksi Gagal:", err)
      }
    }
    fetchData()
  }, [])

  const handleFilterChange = useCallback((newFilters: any) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }, [])

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query.toLowerCase())
  }, [])

  if (!data) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#f4e8d1]">
        <div className="text-center">
          <div className="mb-4 h-16 w-16 animate-spin rounded-full border-4 border-[#a64029] border-t-transparent mx-auto"></div>
          <p className="font-serif text-[#a64029] text-xl animate-pulse tracking-widest">MENYAJIKAN DATA NUSANTARA...</p>
        </div>
      </div>
    )
  }

  // FIX: Mapping & Filtering Data agar Harga Muncul
  const displayItems = data.kuliner.filter((item: any) => 
    item.nama?.toLowerCase().includes(searchQuery) || 
    item.kota?.toLowerCase().includes(searchQuery)
  ).map((item: any) => ({
    ...item,
    title: item.nama, // Mapping 'nama' -> 'title'
    hargaMin: item.harga_min, // FIX: Sinkronisasi snake_case ke camelCase
    hargaMax: item.harga_max  // FIX: Sinkronisasi snake_case ke camelCase
  }))

  return (
    <>
      <Header />
      <main className="bg-[#f4e8d1] min-h-screen pb-20 font-sans">
        <HeroSection 
          kategori={data.kategori} 
          kota={Object.values(data.provKota).flat() as string[]} 
          onSearch={handleSearch} 
        />
        
        <div className="sticky top-[80px] z-40 bg-[#f4e8d1]/95 backdrop-blur-md py-2 border-b border-[#3b2f2f]/10">
          <FilterBar 
            kategori={data.kategori} 
            onFilterChange={handleFilterChange} 
          />
        </div>

        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8 px-4">
             <h2 className="text-2xl md:text-4xl font-serif font-bold text-[#3b2f2f]">Kuliner Populer Nusantara</h2>
             <span className="text-xs font-bold text-gray-400 uppercase tracking-widest bg-white px-4 py-2 rounded-full border border-gray-100 shadow-sm">
                {displayItems.length} Item Ditemukan
             </span>
          </div>

          {displayItems.length > 0 ? (
            <section className="py-2">
               <KulinerGrid 
                kuliner={displayItems} 
                popular={data.popular} 
                area={null} 
                filters={filters as any}
              />
            </section>
          ) : (
            <div className="text-center py-32 bg-white/40 rounded-[60px] border-2 border-dashed border-[#a64029]/20 my-10">
              <p className="text-[#a64029] font-serif text-2xl italic">Maaf, hidangan belum tersedia di area ini.</p>
            </div>
          )}
        </div>

        {displayItems.length > 0 && (
          <div className="bg-white/30 py-20 border-y border-white/50">
            <CarouselBaru baru={displayItems} />
          </div>
        )}
        
        <FAQSection />
      </main>
      <Footer />
    </>
  )
}