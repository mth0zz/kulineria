"use client"

import { useState, useEffect, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, Search } from "lucide-react"
import Link from "next/link"
import { StatusBadge } from "@/components/status-badge"
import Image from "next/image"
import { useMedia } from "@/lib/use-media"
import { fetchFromApi, API_BASE_URL } from "@/lib/data"

interface UmkmDashboardProps {
  initialItems?: any[]
  onItemsChange?: (items: any[]) => void
}

export function UmkmDashboard({ initialItems = [], onItemsChange }: UmkmDashboardProps) {
  const [items, setItems] = useState<any[]>([])
  const [search, setSearch] = useState("")
  const [filterKategori, setFilterKategori] = useState<string>("")
  const [filterStatus, setFilterStatus] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const isMobile = useMedia("(max-width: 768px)")

  // 1. Fetch data asli dari Laravel UMKM
  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    const res = await fetchFromApi<any[]>("/my-culinaries")
    if (res) {
      setItems(res)
      if (onItemsChange) onItemsChange(res)
    }
    setLoading(false)
  }

  const filtered = useMemo(() => {
    return items.filter((item) => {
      // Mapping field: Database menggunakan 'nama', original lo pake 'nama'
      const matchesSearch = item.nama?.toLowerCase().includes(search.toLowerCase())
      const matchesKategori = !filterKategori || item.kategori === filterKategori
      const matchesStatus = !filterStatus || item.status === filterStatus
      return matchesSearch && matchesKategori && matchesStatus
    })
  }, [items, search, filterKategori, filterStatus])

  const handleDelete = async (id: string) => {
    if (confirm("Hapus kuliner ini dari database?")) {
      try {
        const token = localStorage.getItem("auth_token")
        const res = await fetch(`${API_BASE_URL}/culinaries/${id}`, {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Accept": "application/json"
          }
        })
        if (res.ok) {
          alert("Berhasil dihapus")
          loadData() // Refresh list
        }
      } catch (error) {
        console.error("Gagal hapus:", error)
      }
    }
  }

  if (loading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#a64029] border-t-transparent mx-auto mb-4"></div>
          <p className="text-[#6e5849] font-medium">Memuat Menu Anda...</p>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-6 bg-white rounded-[32px] border-2 border-dashed border-gray-100">
        <div className="w-32 h-32 opacity-20 mb-6 flex items-center justify-center bg-gray-200 rounded-full">
           <Image src="/Logo-Kuliner-Nusantara.png" alt="Logo" width={80} height={80} />
        </div>
        <h2 className="text-xl font-semibold text-[#3b2f2f] mb-2">Belum ada kuliner</h2>
        <p className="text-[#6e5849] mb-6 text-center">
          Daftar menu Anda kosong. Mulai tambahkan kuliner pertama Anda sekarang.
        </p>
        <Link href="/umkm/tambah">
          <Button className="bg-[#a64029] hover:bg-[#85311e] text-white px-8 py-6 rounded-2xl font-bold">Tambah Kuliner Pertama</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6 font-sans">
      {/* Filters Section */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Cari kuliner..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-white border-gray-200 pl-10 rounded-xl"
            />
          </div>
          <select
            value={filterKategori}
            onChange={(e) => setFilterKategori(e.target.value)}
            className="px-3 py-2 rounded-xl bg-white border border-gray-200 text-sm text-[#3b2f2f] outline-none focus:ring-2 focus:ring-[#a64029]"
          >
            <option value="">Semua Kategori</option>
            <option value="Makanan">Makanan</option>
            <option value="Minuman">Minuman</option>
            <option value="Jajanan">Jajanan</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 rounded-xl bg-white border border-gray-200 text-sm text-[#3b2f2f] outline-none focus:ring-2 focus:ring-[#a64029]"
          >
            <option value="">Semua Status</option>
            <option value="published">Dipublikasikan</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>

      {/* Results Section */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-400 italic bg-white rounded-3xl border border-gray-100">
           Tidak ada kuliner yang sesuai dengan filter.
        </div>
      ) : isMobile ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {filtered.map((item) => (
            <Card key={item.id} className="rounded-[24px] p-4 bg-white border-none shadow-sm hover:shadow-md transition-shadow overflow-hidden">
              {item.images && item.images[0] && (
                <div className="relative h-40 -mx-4 -mt-4 mb-3 overflow-hidden">
                  <Image src={item.images[0]} alt={item.nama} fill className="object-cover" />
                </div>
              )}

              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-[#3b2f2f] text-base line-clamp-1">{item.nama}</h3>
                  <StatusBadge status={item.status} />
                </div>

                <p className="text-xs text-[#6e5849] line-clamp-2 italic">"{item.deskripsi_ringkas}"</p>

                <div className="text-xs text-[#3b2f2f] font-semibold space-y-1 pt-2 border-t border-gray-50">
                  <p className="flex items-center gap-1">📍 {item.kota}</p>
                  <p className="text-[#a64029]">💰 Rp{item.harga_min?.toLocaleString()}</p>
                </div>

                <div className="flex gap-2 pt-3">
                  <Link href={`/umkm/${item.id}/edit`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full text-xs rounded-xl border-gray-200 font-bold">
                      <Edit size={14} className="mr-1" /> Edit
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(item.id)}
                    className="w-12 border-red-50 text-red-500 hover:bg-red-50 rounded-xl"
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="rounded-[24px] border border-gray-100 bg-white overflow-hidden shadow-sm">
          <table className="w-full border-collapse">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="text-left px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Nama Hidangan</th>
                <th className="text-left px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Kategori</th>
                <th className="text-left px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Lokasi</th>
                <th className="text-left px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Harga</th>
                <th className="text-left px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                <th className="text-right px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 relative rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                         <Image src={item.images?.[0] || "/placeholder.svg"} alt={item.nama} fill className="object-cover" />
                      </div>
                      <span className="text-sm font-bold text-[#3b2f2f]">{item.nama}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#6e5849]">{item.kategori}</td>
                  <td className="px-6 py-4 text-sm text-[#6e5849]">{item.kota}</td>
                  <td className="px-6 py-4 text-sm font-bold text-[#a64029]">
                    Rp{item.harga_min?.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={item.status} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/umkm/${item.id}/edit`}>
                        <Button variant="ghost" size="sm" className="text-[#4e5b31] hover:bg-[#4e5b31]/10 rounded-lg">
                          <Edit size={16} />
                        </Button>
                      </Link>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-2 text-red-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}