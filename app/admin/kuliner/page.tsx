"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { 
  Utensils, 
  Search, 
  Trash2, 
  ExternalLink, 
  MapPin, 
  Store 
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { fetchFromApi, API_BASE_URL } from "@/lib/data"

export default function AdminKulinerListPage() {
  const [kuliner, setKuliner] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    loadAllCulinaries()
  }, [])

  const loadAllCulinaries = async () => {
    setLoading(true)
    // Memanggil API Admin khusus untuk melihat semua kuliner
    const res = await fetchFromApi<any[]>("/admin/culinaries")
    setKuliner(res || [])
    setLoading(false)
  }

  const handleDelete = async (id: number) => {
    if (confirm("Hapus kuliner ini secara permanen dari sistem?")) {
      const token = localStorage.getItem("auth_token")
      const res = await fetch(`${API_BASE_URL}/culinaries/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      })
      if (res.ok) {
        alert("Berhasil dihapus")
        loadAllCulinaries()
      }
    }
  }

  const filtered = kuliner.filter(item => 
    item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.user?.nama_usaha?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) return <div className="p-10 text-center font-serif text-[#a64029]">Sinkronisasi Data Kuliner Nusantara...</div>

  return (
    <div className="space-y-6 font-sans">
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Manajemen Konten Kuliner</h2>
          <p className="text-gray-500 text-sm">Total {kuliner.length} hidangan terdaftar dari seluruh mitra UMKM.</p>
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
          <input 
            type="text" 
            placeholder="Cari makanan atau mitra..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#a64029]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-400 text-xs uppercase tracking-widest font-bold">
              <th className="px-6 py-4">Hidangan & Mitra</th>
              <th className="px-6 py-4">Lokasi</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {filtered.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden relative flex-shrink-0">
                      <img src={item.images?.[0] || "/placeholder.svg"} alt="" className="object-cover w-full h-full" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-800">{item.nama}</p>
                      <p className="text-[#4e5b31] text-xs flex items-center gap-1 font-semibold">
                        <Store size={12} /> {item.user?.nama_usaha || "Mitra Anonim"}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5 text-gray-500">
                  <div className="flex items-center gap-1"><MapPin size={14}/> {item.kota}, {item.provinsi}</div>
                </td>
                <td className="px-6 py-5">
                  <Badge className="bg-green-50 text-green-700 border-green-100 font-bold uppercase text-[10px]">
                    {item.status}
                  </Badge>
                </td>
                <td className="px-6 py-5 text-right">
                  <div className="flex justify-end gap-2">
                    <Link href={`/kuliner/${item.id}`} target="_blank">
                      <Button variant="ghost" size="sm" className="text-gray-400 hover:text-[#a64029]"><ExternalLink size={18} /></Button>
                    </Link>
                    <button onClick={() => handleDelete(item.id)} className="p-2 text-red-300 hover:text-red-600 transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="py-20 text-center text-gray-400 font-serif">Belum ada data kuliner yang masuk.</div>
        )}
      </div>
    </div>
  )
}