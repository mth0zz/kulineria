"use client"

import type React from "react"

import { useRef } from "react"
import { Button } from "@/components/ui/button"
import { Upload, Trash2 } from "lucide-react"
import Image from "next/image"

interface ImageUploadGridProps {
  images: string[]
  onImagesChange: (images: string[]) => void
}

export function ImageUploadGrid({ images, onImagesChange }: ImageUploadGridProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])

    for (const file of files) {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader()
        reader.onload = (event) => {
          const dataUrl = event.target?.result as string
          onImagesChange([...images, dataUrl])
        }
        reader.readAsDataURL(file)
      }
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleRemove = (index: number) => {
    onImagesChange(images.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-4">
      <div
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:bg-muted/50 transition-colors"
      >
        <Upload className="mx-auto mb-3 text-muted-foreground" size={32} />
        <p className="font-medium text-foreground mb-1">Unggah Foto</p>
        <p className="text-sm text-muted-foreground">Klik atau drag foto ke sini</p>
      </div>

      <input ref={fileInputRef} type="file" multiple accept="image/*" onChange={handleFileSelect} className="hidden" />

      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative group">
              <div className="relative aspect-square rounded-lg overflow-hidden bg-muted">
                <Image
                  src={image || "/placeholder.svg"}
                  alt={`Upload preview ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
              <Button
                onClick={() => handleRemove(index)}
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2 bg-red-500/90 text-white hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 size={16} />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
