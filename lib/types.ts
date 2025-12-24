export interface Kuliner {
  id: string
  nama: string
  kategori: string
  deskripsi: string
  provinsi: string
  kota: string
  hargaMin?: number
  hargaMax?: number
  bahan: string[]
  langkah: string[]
  foto: string[]
  lat?: number
  lng?: number
  status: "draft" | "published"
  createdAt: string
  updatedAt: string
}

export interface KulinerDraft {
  data: Partial<Kuliner>
  timestamp: string
}

export interface KulinerFormData {
  nama: string
  kategori: string
  deskripsi: string
  provinsi: string
  kota: string
  hargaMin: string
  hargaMax: string
  bahan: string[]
  langkah: string[]
  foto: string[]
  lat: string
  lng: string
  status: "draft" | "published"
}
