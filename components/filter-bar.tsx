"use client"

import { useState, useEffect, useRef } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface FilterBarProps {
  kategori: string[]
  onFilterChange: (filters: {
    kategori: string[]
    maxPrice?: number
    sort: "populer" | "terbaru"
  }) => void
}

export function FilterBar({ kategori, onFilterChange }: FilterBarProps) {
  const [selectedKategori, setSelectedKategori] = useState<string[]>([])
  const [priceFilter, setPriceFilter] = useState(false)
  const [sortBy, setSortBy] = useState<"populer" | "terbaru">("populer")
  
  // Ref untuk menandai apakah komponen baru pertama kali dimuat
  const isFirstRender = useRef(true)

  // 1. Load filter dari localStorage saat pertama kali mount
  useEffect(() => {
    const saved = localStorage.getItem("discoveryFilters")
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setSelectedKategori(parsed.kategori || [])
        setPriceFilter(parsed.friendlyPrice || false)
        setSortBy(parsed.sort || "populer")
      } catch (e) {
        console.error("Error parsing local storage filters")
      }
    }
  }, [])

  // 2. Kirim update ke parent HANYA jika ada perubahan state internal
  useEffect(() => {
    // Skip jalankan onFilterChange di render pertama agar tidak bentrok dengan proses sinkronisasi state
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    const filters = {
      kategori: selectedKategori,
      friendlyPrice: priceFilter,
      sort: sortBy,
    }
    
    localStorage.setItem("discoveryFilters", JSON.stringify(filters))
    
    // Kirim data ke parent (app/page.tsx)
    onFilterChange({
      kategori: selectedKategori,
      maxPrice: priceFilter ? 20000 : undefined,
      sort: sortBy,
    })
  }, [selectedKategori, priceFilter, sortBy]) // Hilangkan onFilterChange dari dependency untuk stop loop

  const toggleKategori = (kat: string) => {
    setSelectedKategori((prev) => 
      prev.includes(kat) ? prev.filter((k) => k !== kat) : [...prev, kat]
    )
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
        {/* Tombol Kategori */}
        <div className="flex flex-wrap gap-2">
          {kategori.map((kat) => (
            <button
              key={kat}
              onClick={() => toggleKategori(kat)}
              className={`px-4 py-2 rounded-full font-medium transition-all focus:ring-2 focus:ring-[#a64029] focus:outline-none ${
                selectedKategori.includes(kat)
                  ? "bg-[#a64029] text-white border-2 border-[#a64029]"
                  : "bg-white text-[#6E5849] border border-[#ddd] hover:bg-[#f9f9f9]"
              }`}
            >
              {kat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 md:ml-auto">
          {/* Checkbox Harga Ramah */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="checkbox"
              checked={priceFilter}
              onChange={(e) => setPriceFilter(e.target.checked)}
              className="w-5 h-5 accent-[#a64029]"
            />
            <span className="text-sm font-medium text-[#3b2f2f]">Harga Ramah</span>
          </label>

          {/* Dropdown Sortir */}
          <Select value={sortBy} onValueChange={(val) => setSortBy(val as any)}>
            <SelectTrigger className="w-40 border-[#ddd] bg-white">
              <SelectValue placeholder="Urutkan" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="populer">Terpopuler</SelectItem>
              <SelectItem value="terbaru">Terbaru</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </section>
  )
}