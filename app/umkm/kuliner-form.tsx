"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { 
  Check, 
  Plus, 
  Trash2, 
  ChevronLeft, 
  UtensilsCrossed, 
  MapPin, 
  Image as ImageIcon,
  AlertCircle,
  Upload,
  X
} from "lucide-react"
import { postToApi, fetchFromApi } from "@/lib/data"
import Image from "next/image"

interface KulinerFormProps {
  editId?: string
}

export function KulinerForm({ editId }: KulinerFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState("") // State untuk input URL sementara
  const [msg, setMsg] = useState({ type: "", text: "" })

  const [formData, setFormData] = useState({
    nama: "",
    kategori: "Makanan",
    deskripsi_ringkas: "",
    deskripsi_lengkap: "",
    provinsi: "",
    kota: "",
    harga_min: "",
    harga_max: "",
    bahan: [""], 
    langkah: [""], 
    images: [] as string[], // Sekarang beneran nampung array URL/Base64
    status: "published"
  })

  useEffect(() => {
    if (editId) {
      const loadExistingData = async () => {
        setLoading(true)
        const res = await fetchFromApi<any>(`/culinaries/${editId}`)
        if (res) {
          setFormData({
            nama: res.nama || "",
            kategori: res.kategori || "Makanan",
            deskripsi_ringkas: res.deskripsi_ringkas || "",
            deskripsi_lengkap: res.deskripsi_lengkap || "",
            provinsi: res.provinsi || "",
            kota: res.kota || "",
            harga_min: res.harga_min?.toString() || "",
            harga_max: res.harga_max?.toString() || "",
            bahan: res.bahan || [""],
            langkah: res.langkah || [""],
            images: res.images || [],
            status: res.status || "published"
          })
        }
        setLoading(false)
      }
      loadExistingData()
    }
  }, [editId])

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  // --- LOGIC FOTO ---
  const addImageUrl = () => {
    if (imageUrl.trim() !== "") {
      setFormData(prev => ({ ...prev, images: [...prev.images, imageUrl] }))
      setImageUrl("") // Reset input URL
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result as string
        setFormData(prev => ({ ...prev, images: [...prev.images, base64String] }))
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  // --- LOGIC BAHAN & LANGKAH ---
  const handleArrayChange = (index: number, value: string, type: 'bahan' | 'langkah') => {
    const newArray = [...formData[type]]
    newArray[index] = value
    setFormData(prev => ({ ...prev, [type]: newArray }))
  }

  const addArrayItem = (type: 'bahan' | 'langkah') => {
    setFormData(prev => ({ ...prev, [type]: [...prev[type], ""] }))
  }

  const removeArrayItem = (index: number, type: 'bahan' | 'langkah') => {
    if (formData[type].length > 1) {
      const newArray = formData[type].filter((_, i) => i !== index)
      setFormData(prev => ({ ...prev, [type]: newArray }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMsg({ type: "", text: "" })

    if (formData.images.length === 0) {
      setMsg({ type: "error", text: "Minimal unggah 1 foto hidangan!" })
      setLoading(false)
      return
    }

    const payload = {
      ...formData,
      bahan: formData.bahan.filter(b => b.trim() !== ""),
      langkah: formData.langkah.filter(l => l.trim() !== "")
    }

    const endpoint = editId ? `/culinaries/${editId}` : "/culinaries"
    const res = await postToApi(endpoint, payload)

    if (res.success) {
      alert(editId ? "Berhasil diperbarui!" : "Berhasil dipublikasikan!")
      router.push("/umkm")
    } else {
      setMsg({ type: "error", text: res.message || "Gagal menyimpan ke database." })
      setLoading(false)
    }
  }

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto font-sans bg-[#f4e8d1] min-h-screen">
      <div className="mb-8 flex items-center justify-between">
        <Link href="/umkm" className="flex items-center gap-2 text-[#6e5849] hover:text-[#a64029] font-bold transition-colors">
          <ChevronLeft size={20} /> Kembali ke Dashboard
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 pb-24">
        {/* SECTION 1: Identitas Hidangan */}
        <Card className="p-6 md:p-10 bg-white rounded-[32px] border-none shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
            <UtensilsCrossed className="text-[#a64029]" size={28} />
            <h2 className="text-2xl font-serif font-bold text-[#3b2f2f]">
              {editId ? "Edit Menu" : "Data Hidangan Baru"}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-[#3b2f2f]">Nama Hidangan</label>
              <Input placeholder="Contoh: Sate Maranggi Cianjur" value={formData.nama} onChange={(e) => handleChange('nama', e.target.value)} className="py-6 rounded-xl border-[#ddd]" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-[#3b2f2f]">Kategori</label>
              <select className="w-full h-[52px] px-4 rounded-xl border border-[#ddd] bg-white text-sm" value={formData.kategori} onChange={(e) => handleChange('kategori', e.target.value)}>
                <option value="Makanan">Makanan</option>
                <option value="Minuman">Minuman</option>
                <option value="Jajanan">Jajanan</option>
                <option value="Kue Tradisional">Kue Tradisional</option>
              </select>
            </div>
          </div>

          <Input placeholder="Deskripsi Ringkas / Slogan" value={formData.deskripsi_ringkas} onChange={(e) => handleChange('deskripsi_ringkas', e.target.value)} className="py-6 rounded-xl border-[#ddd]" required />
          <Textarea placeholder="Cerita Lengkap & Keunikan Hidangan..." value={formData.deskripsi_lengkap} onChange={(e) => handleChange('deskripsi_lengkap', e.target.value)} rows={5} className="rounded-2xl border-[#ddd] p-4" required />
        </Card>

        {/* SECTION 2: Lokasi & Harga */}
        <Card className="p-6 md:p-10 bg-white rounded-[32px] border-none shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
            <MapPin className="text-[#4e5b31]" size={28} />
            <h2 className="text-2xl font-serif font-bold text-[#3b2f2f]">Lokasi & Estimasi Harga</h2>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <Input placeholder="Provinsi" value={formData.provinsi} onChange={(e) => handleChange('provinsi', e.target.value)} className="py-6 rounded-xl border-[#ddd]" required />
            <Input placeholder="Kota/Kabupaten" value={formData.kota} onChange={(e) => handleChange('kota', e.target.value)} className="py-6 rounded-xl border-[#ddd]" required />
          </div>
          <div className="grid grid-cols-2 gap-6">
            <Input type="number" placeholder="Harga Terendah (Rp)" value={formData.harga_min} onChange={(e) => handleChange('harga_min', e.target.value)} className="py-6 rounded-xl border-[#ddd]" required />
            <Input type="number" placeholder="Harga Tertinggi (Rp)" value={formData.harga_max} onChange={(e) => handleChange('harga_max', e.target.value)} className="py-6 rounded-xl border-[#ddd]" required />
          </div>
        </Card>

        {/* SECTION 3: Resep */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="p-6 bg-white rounded-[32px] border-none shadow-sm space-y-4">
            <h3 className="font-bold text-[#3b2f2f] flex justify-between items-center">Bahan-bahan <button type="button" onClick={() => addArrayItem('bahan')} className="p-1 bg-[#4e5b31] text-white rounded-full"><Plus size={16}/></button></h3>
            {formData.bahan.map((item, index) => (
              <div key={index} className="flex gap-2">
                <Input placeholder="Bahan..." value={item} onChange={(e) => handleArrayChange(index, e.target.value, 'bahan')} className="rounded-lg border-[#eee]" />
                <button type="button" onClick={() => removeArrayItem(index, 'bahan')} className="text-red-400"><Trash2 size={18}/></button>
              </div>
            ))}
          </Card>

          <Card className="p-6 bg-white rounded-[32px] border-none shadow-sm space-y-4">
            <h3 className="font-bold text-[#3b2f2f] flex justify-between items-center">Langkah Masak <button type="button" onClick={() => addArrayItem('langkah')} className="p-1 bg-[#4e5b31] text-white rounded-full"><Plus size={16}/></button></h3>
            {formData.langkah.map((item, index) => (
              <div key={index} className="flex gap-2">
                <Textarea placeholder="Langkah..." value={item} onChange={(e) => handleArrayChange(index, e.target.value, 'langkah')} className="rounded-lg border-[#eee] min-h-[40px]" />
                <button type="button" onClick={() => removeArrayItem(index, 'langkah')} className="text-red-400"><Trash2 size={18}/></button>
              </div>
            ))}
          </Card>
        </div>

        {/* SECTION 4: FIX FOTO HIDANGAN (ASLI) */}
        <Card className="p-6 md:p-10 bg-white rounded-[32px] border-none shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
            <ImageIcon className="text-[#dfaf2b]" size={28} />
            <h2 className="text-2xl font-serif font-bold text-[#3b2f2f]">Foto Hidangan</h2>
          </div>

          <div className="space-y-6">
             {/* Input URL Gambar */}
             <div className="flex gap-2">
                <Input 
                  placeholder="Tempel URL Gambar di sini (Contoh: https://.../gambar.jpg)" 
                  value={imageUrl} 
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="py-6 rounded-xl border-[#ddd]"
                />
                <Button type="button" onClick={addImageUrl} className="bg-[#dfaf2b] text-[#3b2f2f] font-bold px-6 rounded-xl">Tambah URL</Button>
             </div>

             <div className="relative">
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-[#ddd] border-dashed rounded-2xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-2 text-gray-400" />
                      <p className="text-sm text-gray-500 font-bold">Atau Klik untuk Unggah Foto dari Perangkat</p>
                    </div>
                    <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                  </label>
                </div>
             </div>

             {/* Pratinjau Foto yang akan di-upload */}
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                {formData.images.map((img, index) => (
                  <div key={index} className="relative group aspect-square rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
                    <img src={img} alt="Preview" className="w-full h-full object-cover" />
                    <button 
                      type="button" 
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
             </div>
          </div>
        </Card>

        {/* Submit Button */}
        <div className="pt-4 pb-20">
          {msg.text && msg.type === 'error' && (
             <div className="p-4 bg-red-50 text-red-600 rounded-2xl mb-6 flex items-center justify-center gap-2 border border-red-100">
               <AlertCircle size={18} /> <span className="font-bold text-sm">{msg.text}</span>
             </div>
          )}
          <Button disabled={loading} className="w-full py-10 bg-[#a64029] hover:bg-[#85311e] text-white font-bold rounded-[32px] text-xl shadow-xl shadow-[#a64029]/20 transition-all flex gap-3 items-center justify-center">
            {loading ? <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent"></div> : <><Check size={24} /> Publikasikan Menu Nusantara</>}
          </Button>
        </div>
      </form>
    </div>
  )
}