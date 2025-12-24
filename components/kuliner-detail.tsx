"use client"

import { useState } from "react"
import Gallery from "./gallery"
import BookmarkButton from "./bookmark-button"
import RatingStars from "./rating-stars"
import { AccordionItem } from "./accordion"
import { Copy } from "lucide-react"
import kulinerData from "@/data/kuliner-data.json"

export default function KulinerDetail() {
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false)
  const [copied, setCopied] = useState(false)

  const data = kulinerData as any

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 3000)
  }

  return (
    <article className="container mx-auto px-5 max-w-6xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
        {/* Kolom Kiri: Gallery */}
        <div className="flex-1">
          <Gallery images={data.gallery} />
        </div>

        {/* Kolom Kanan: Info */}
        <div className="flex-1 lg:flex-[1.2]">
          {/* Header */}
          <header className="mb-10">
            <h1 className="font-serif text-5xl m-0 text-[#A64029]">{data.nama}</h1>
            <div className="text-[#6E5849] font-medium my-2.5">
              {data.daerah} | {data.kategori}
            </div>
            <div className="flex items-center gap-4 my-5">
              <RatingStars rating={Math.round(data.rating_rata_rata)} />
              <span className="bg-[#E2903A] text-white px-4 py-1.5 rounded-full font-medium text-sm">{data.harga}</span>
            </div>
            <BookmarkButton kulinerId={data.id} />
          </header>

          {/* Deskripsi */}
          <section className="mb-10">
            <h2 className="font-serif text-xl mb-2">Ringkasan</h2>
            <p className="text-[#6E5849] leading-relaxed">{data.deskripsi.ringkas}</p>
            {isDescriptionExpanded && (
              <p className="text-[#6E5849] leading-relaxed mt-4 whitespace-pre-wrap">{data.deskripsi.lengkap}</p>
            )}
            <button
              onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
              className="bg-none border-none text-[#A64029] font-bold cursor-pointer p-0 mt-2"
            >
              {isDescriptionExpanded ? "Tampilkan Lebih Sedikit" : "Baca Selengkapnya"}
            </button>
          </section>

          {/* Resep */}
          <section className="mb-10">
            <h2 className="font-serif text-xl mb-4">Resep</h2>
            <div className="space-y-2">
              <AccordionItem title="Bahan-bahan">
                <ul className="list-disc list-inside space-y-2 text-[#6E5849]">
                  {data.resep.bahan.map((item: string, idx: number) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </AccordionItem>
              <AccordionItem title="Langkah Memasak">
                <ol className="list-decimal list-inside space-y-2 text-[#6E5849]">
                  {data.resep.langkah.map((item: string, idx: number) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ol>
              </AccordionItem>
            </div>
          </section>

          {/* Bagikan */}
          <section className="mb-10">
            <h2 className="font-serif text-xl mb-4">Bagikan</h2>
            <button
              onClick={copyLink}
              className="flex items-center gap-2 px-5 py-2.5 bg-transparent border border-[#ccc] rounded-lg font-medium cursor-pointer hover:bg-[#eee] transition-colors"
            >
              <Copy className="w-5 h-5" />
              {copied ? "Link Disalin!" : "Salin Link"}
            </button>
          </section>
        </div>
      </div>
    </article>
  )
}
