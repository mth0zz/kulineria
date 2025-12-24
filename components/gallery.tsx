"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface GalleryProps {
  images: string[]
}

export default function Gallery({ images }: GalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const prevImage = () => {
    setCurrentIndex((current) => (current - 1 + images.length) % images.length)
  }

  const nextImage = () => {
    setCurrentIndex((current) => (current + 1) % images.length)
  }

  return (
    <section>
      <div className="relative">
        <img
          src={images[currentIndex] || "/placeholder.svg"}
          alt="Gambar utama kuliner"
          className="w-full aspect-square object-cover rounded-xl"
        />
        <button
          onClick={prevImage}
          aria-label="Gambar Sebelumnya"
          className="absolute top-1/2 -translate-y-1/2 left-3 bg-[rgba(0,0,0,0.4)] border-none rounded-full text-white w-10 h-10 cursor-pointer text-xl transition-colors hover:bg-[rgba(0,0,0,0.7)]"
        >
          <ChevronLeft className="w-5 h-5 mx-auto" />
        </button>
        <button
          onClick={nextImage}
          aria-label="Gambar Selanjutnya"
          className="absolute top-1/2 -translate-y-1/2 right-3 bg-[rgba(0,0,0,0.4)] border-none rounded-full text-white w-10 h-10 cursor-pointer text-xl transition-colors hover:bg-[rgba(0,0,0,0.7)]"
        >
          <ChevronRight className="w-5 h-5 mx-auto" />
        </button>
      </div>

      <div className="flex justify-center gap-2.5 mt-4">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2.5 h-2.5 rounded-full cursor-pointer transition-colors ${
              index === currentIndex ? "bg-[#6E5849]" : "bg-[#c7bca5]"
            }`}
            aria-label={`Go to image ${index + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
