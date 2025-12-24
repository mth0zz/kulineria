"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface CarouselBaruProps {
  baru: any[]
}

export function CarouselBaru({ baru }: CarouselBaruProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 320
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
      setCurrentIndex((prev) => (direction === "left" ? Math.max(0, prev - 1) : Math.min(baru.length - 1, prev + 1)))
    }
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") scroll("left")
      if (e.key === "ArrowRight") scroll("right")
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-foreground">Baru Ditambahkan</h2>
        <p className="text-muted-foreground mt-1">Kuliner terbaru yang baru saja bergabung</p>
      </div>

      <div className="relative">
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2 scrollbar-hide"
          role="region"
          aria-roledescription="carousel"
          aria-label="Baru ditambahkan"
        >
          {baru.map((item, idx) => (
            <div key={idx} className="flex-shrink-0 w-80 snap-start" role="group" aria-roledescription="slide">
              <div className="bg-card rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-lg transition-all h-full flex flex-col">
                <div className="relative w-full h-48 overflow-hidden bg-muted/10">
                  <Image
                    src={item.images[0] || "/placeholder.svg?height=300&width=400&query=kuliner"}
                    alt={item.title}
                    fill
                    className="object-cover hover:scale-105 transition-transform"
                    loading="lazy"
                  />
                </div>

                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="font-bold text-foreground line-clamp-2 mb-2">{item.title}</h3>
                  <p className="text-xs text-muted-foreground mb-3">
                    {item.kota}, {item.provinsi}
                  </p>
                  <div className="mt-auto">
                    <p className="text-sm font-semibold text-primary mb-3">
                      Rp {item.hargaMin?.toLocaleString("id-ID")} - Rp {item.hargaMax?.toLocaleString("id-ID")}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full border-primary/50 text-primary bg-transparent"
                    >
                      Lihat Detail
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Button
          variant="outline"
          size="icon"
          className="absolute left-0 top-1/3 -translate-y-1/2 -translate-x-6 border-border hover:bg-card z-10 bg-transparent"
          onClick={() => scroll("left")}
          disabled={currentIndex === 0}
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="absolute right-0 top-1/3 -translate-y-1/2 translate-x-6 border-border hover:bg-card z-10 bg-transparent"
          onClick={() => scroll("right")}
          disabled={currentIndex === baru.length - 1}
          aria-label="Next slide"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>

        <div className="flex justify-center gap-2 mt-6">
          {baru.map((_, idx) => (
            <button
              key={idx}
              className={`w-2 h-2 rounded-full transition-all ${
                idx === currentIndex ? "bg-accent w-6" : "bg-accent/40"
              }`}
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
