"use client"

import { useState, useEffect } from "react"
import { KulinerCard } from "./kuliner-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface KulinerGridProps {
  kuliner: any[]
  area: { provinsi: string; kota: string } | null
  popular: string[]
  filters: {
    kategori: string[]
    maxPrice?: number
    sort: "populer" | "terbaru"
  }
}

export function KulinerGrid({ kuliner, area, popular, filters }: KulinerGridProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8
  const [filteredKuliner, setFilteredKuliner] = useState<any[]>([])

  useEffect(() => {
    let result = [...kuliner]

    // Filter by area
    if (area) {
      result = result.filter((item) => item.kota === area.kota)
    } else {
      // Show popular items if no area selected
      result = result.filter((item) => popular.includes(item.id)).slice(0, 16)
      if (result.length === 0) {
        result = kuliner.sort((a, b) => b.rating - a.rating).slice(0, 16)
      }
    }

    // Filter by kategori
    if (filters.kategori.length > 0) {
      result = result.filter((item) => filters.kategori.includes(item.kategori))
    }

    // Filter by price
    if (filters.maxPrice) {
      result = result.filter((item) => !item.hargaMin || item.hargaMin <= filters.maxPrice)
    }

    // Sort
    if (filters.sort === "populer") {
      result.sort((a, b) => b.rating - a.rating)
    } else if (filters.sort === "terbaru") {
      result.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    }

    setFilteredKuliner(result)
    setCurrentPage(1)
  }, [kuliner, area, popular, filters])

  const totalPages = Math.ceil(filteredKuliner.length / itemsPerPage)
  const paginatedItems = filteredKuliner.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Kuliner Populer di Area Anda</h2>
            {area && (
              <Badge className="bg-muted/30 text-muted border-muted/50">
                {area.kota}, {area.provinsi}
              </Badge>
            )}
          </div>
          <div className="text-sm text-muted-foreground">{filteredKuliner.length} item ditemukan</div>
        </div>
      </div>

      {paginatedItems.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
            {paginatedItems.map((item) => (
              <KulinerCard
                key={item.id}
                id={item.id}
                title={item.title}
                kategori={item.kategori}
                provinsi={item.provinsi}
                kota={item.kota}
                hargaMin={item.hargaMin}
                hargaMax={item.hargaMax}
                rating={item.rating}
                images={item.images}
              />
            ))}
          </div>

          <div className="flex items-center justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="border-border"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>

            <div className="flex items-center gap-1">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-8 h-8 rounded-lg font-medium transition-all ${
                    currentPage === i + 1
                      ? "bg-primary text-primary-foreground"
                      : "bg-card border border-border text-foreground hover:bg-muted/20"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="border-border"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="text-center">
            <p className="text-lg text-muted-foreground mb-2">Tidak ada kuliner yang sesuai</p>
            <p className="text-sm text-muted-foreground">Coba ubah filter atau pilih area lain</p>
          </div>
        </div>
      )}
    </section>
  )
}
