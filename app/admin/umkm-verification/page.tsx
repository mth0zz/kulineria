"use client"

import { useState, useEffect } from "react"
import { Check, X, FileText, BadgeCheck, Search, Clock, ShieldCheck } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { fetchFromApi, postToApi } from "@/lib/data"

export default function UmkmVerificationPage() {
  const [applicants, setApplicants] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadApplicants()
  }, [])

  const loadApplicants = async () => {
    setLoading(true)
    const res = await fetchFromApi<any[]>("/admin/pending-umkm")
    setApplicants(res || [])
    setLoading(false)
  }

  const handleAction = async (id: number, status: string) => {
    const res = await postToApi(`/admin/verify-umkm/${id}`, { status })
    if (res.success) {
      alert("Status Mitra Berhasil Diperbarui!")
      loadApplicants() 
    } else {
      alert("Gagal memverifikasi: " + res.message)
    }
  }

  if (loading) return <div className="p-20 text-center font-black text-gray-400 tracking-widest uppercase animate-pulse text-xs">Menarik Data Legalitas...</div>

  return (
    <div className="space-y-8 font-sans">
      <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h2 className="text-3xl font-black text-gray-800 italic uppercase">Verifikasi Mitra</h2>
          <p className="text-gray-500 text-sm font-medium mt-1">Otorisasi KTP & NPWP calon mitra sebelum membuka akses dashboard.</p>
        </div>
        <div className="bg-[#dfaf2b] text-[#3b2f2f] px-6 py-3 rounded-2xl font-black flex items-center gap-3 text-sm shadow-lg shadow-[#dfaf2b]/20">
          <Clock size={20} /> {applicants.length} WAITING
        </div>
      </div>

      <div className="bg-white rounded-[48px] border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50/50 border-b border-gray-100">
            <tr className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
              <th className="px-8 py-6">Profil Bisnis</th>
              <th className="px-8 py-6">Dokumen Legalitas</th>
              <th className="px-8 py-6 text-right">Otorisasi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {applicants.map((app) => (
              <tr key={app.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#a64029]/10 rounded-2xl flex items-center justify-center font-bold text-[#a64029]">{app.nama_usaha?.[0]}</div>
                    <div>
                       <p className="font-black text-gray-800 text-lg uppercase tracking-tighter">{app.nama_usaha}</p>
                       <p className="text-gray-400 text-xs font-bold">{app.name} • {app.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-gray-600 font-mono text-xs font-bold">
                      <BadgeCheck size={14} className="text-blue-500" /> NIK: {app.nik_ktp}
                    </div>
                    {app.npwp && (
                      <div className="flex items-center gap-2 text-gray-600 font-mono text-xs font-bold">
                        <FileText size={14} className="text-gray-400" /> NPWP: {app.npwp}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex justify-end gap-3">
                    <button 
                      onClick={() => handleAction(app.id, 'approve')} 
                      className="p-3 bg-[#4e5b31] text-white rounded-2xl hover:bg-[#3a4323] transition-all shadow-md shadow-[#4e5b31]/20"
                      title="Setujui Mitra"
                    >
                      <Check size={20} />
                    </button>
                    <button 
                      onClick={() => handleAction(app.id, 'reject')} 
                      className="p-3 bg-red-600 text-white rounded-2xl hover:bg-red-700 transition-all shadow-md shadow-red-600/20"
                      title="Tolak Mitra"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {applicants.length === 0 && (
          <div className="py-24 text-center">
            <ShieldCheck className="text-gray-100 w-24 h-24 mx-auto mb-4" />
            <p className="text-gray-400 font-black text-xs uppercase tracking-widest">Seluruh pendaftar telah terverifikasi.</p>
          </div>
        )}
      </div>
    </div>
  )
}