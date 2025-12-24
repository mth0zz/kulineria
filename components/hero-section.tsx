"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

interface HeroSectionProps {
  kategori: string[]
  kota: string[]
  onSearch: (query: string) => void
}

export function HeroSection({ kategori, kota, onSearch }: HeroSectionProps) {
  const [searchInput, setSearchInput] = useState("")
  const [suggestions, setSuggestions] = useState<string[]>([])

  useEffect(() => {
    const allSuggestions = [...kategori, ...kota.slice(0, 3)]
    setSuggestions(allSuggestions.slice(0, 6))
  }, [kategori, kota])

  const handleSearch = () => {
    onSearch(searchInput)
  }

  const handleSuggestionClick = (suggestion: string) => {
    setSearchInput(suggestion)
    onSearch(suggestion)
  }

  return (
    <section className="w-full bg-gradient-to-b from-background via-muted/10 to-background py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3 text-balance">
            Jelajahi Rasa Autentik Nusantara
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground text-balance max-w-2xl mx-auto">
            Temukan kuliner tradisional terbaik dari setiap penjuru Indonesia, dari Sabang sampai Merauke
          </p>
        </div>

        <div className="max-w-2xl mx-auto mb-6">
          <div className="relative flex items-center gap-2">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Cari kuliner, kota, atau provinsi..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                className="w-full px-5 py-3 rounded-xl border-2 border-primary/30 bg-card text-foreground placeholder:text-muted-foreground text-base focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
              />
              <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            </div>
            <Button
              onClick={handleSearch}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-xl font-semibold"
            >
              Cari
            </Button>
          </div>
        </div>

        <div className="max-w-2xl mx-auto mb-10">
          <div className="flex flex-wrap gap-2 justify-center">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => handleSuggestionClick(suggestion)}
                className="px-4 py-2 rounded-full bg-muted/20 text-muted hover:bg-muted/40 text-sm font-medium transition-colors border border-muted/30 focus:ring-2 focus:ring-ring focus:outline-none"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-center">
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-xl font-bold text-lg">
            Jelajah Kuliner
          </Button>
        </div>
      </div>
    </section>
  )
}
