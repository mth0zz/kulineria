"use client"

import { useState, useEffect } from "react"
import { Bookmark } from "lucide-react"

interface BookmarkButtonProps {
  kulinerId: string
}

export default function BookmarkButton({ kulinerId }: BookmarkButtonProps) {
  const [isFavorite, setIsFavorite] = useState(false)

  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem("kulinerFavorites") || "[]")
    setIsFavorite(favorites.includes(kulinerId))
  }, [kulinerId])

  const toggleFavorite = () => {
    let favorites = JSON.parse(localStorage.getItem("kulinerFavorites") || "[]")
    if (favorites.includes(kulinerId)) {
      favorites = favorites.filter((id: string) => id !== kulinerId)
      setIsFavorite(false)
    } else {
      favorites.push(kulinerId)
      setIsFavorite(true)
    }
    localStorage.setItem("kulinerFavorites", JSON.stringify(favorites))
  }

  return (
    <button
      onClick={toggleFavorite}
      className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium cursor-pointer border transition-all ${
        isFavorite ? "bg-[#A64029] text-white border-[#A64029]" : "bg-transparent border-[#ccc] hover:bg-[#eee]"
      }`}
    >
      <Bookmark className="w-6 h-6" fill={isFavorite ? "currentColor" : "none"} />
      <span>{isFavorite ? "Tersimpan" : "Simpan Favorit"}</span>
    </button>
  )
}
