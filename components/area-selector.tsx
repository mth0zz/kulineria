"use client"

import { useState, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface AreaSelectorProps {
  provinsiKota: Record<string, string[]>
  onAreaChange: (area: { provinsi: string; kota: string } | null) => void
}

export function AreaSelector({ provinsiKota, onAreaChange }: AreaSelectorProps) {
  const [selectedProvinsi, setSelectedProvinsi] = useState("")
  const [selectedKota, setSelectedKota] = useState("")
  const [savedArea, setSavedArea] = useState<{ provinsi: string; kota: string } | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem("userArea")
    if (saved) {
      const area = JSON.parse(saved)
      setSavedArea(area)
    }
  }, [])

  useEffect(() => {
    if (selectedProvinsi) {
      setSelectedKota("")
    }
  }, [selectedProvinsi])

  const handleApply = () => {
    if (selectedProvinsi && selectedKota) {
      const area = { provinsi: selectedProvinsi, kota: selectedKota }
      setSavedArea(area)
      localStorage.setItem("userArea", JSON.stringify(area))
      onAreaChange(area)
    }
  }

  const handleClear = () => {
    setSelectedProvinsi("")
    setSelectedKota("")
    setSavedArea(null)
    localStorage.removeItem("userArea")
    onAreaChange(null)
  }

  const provinsiList = Object.keys(provinsiKota).sort()
  const kotaList = selectedProvinsi ? provinsiKota[selectedProvinsi] : []

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="bg-card rounded-2xl p-6 md:p-8 shadow-sm border border-border">
        <h2 className="text-2xl font-bold text-foreground mb-6">Pilih Area Anda</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Provinsi</label>
            <Select value={selectedProvinsi} onValueChange={setSelectedProvinsi}>
              <SelectTrigger className="border-border">
                <SelectValue placeholder="Pilih provinsi..." />
              </SelectTrigger>
              <SelectContent>
                {provinsiList.map((prov) => (
                  <SelectItem key={prov} value={prov}>
                    {prov}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Kota</label>
            <Select value={selectedKota} onValueChange={setSelectedKota} disabled={!selectedProvinsi}>
              <SelectTrigger className="border-border">
                <SelectValue placeholder="Pilih kota..." />
              </SelectTrigger>
              <SelectContent>
                {kotaList.map((kota) => (
                  <SelectItem key={kota} value={kota}>
                    {kota}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-3 flex-wrap">
          <Button
            onClick={handleApply}
            disabled={!selectedProvinsi || !selectedKota}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            Terapkan
          </Button>
          <Button onClick={handleClear} variant="ghost" className="text-muted-foreground hover:text-foreground">
            Hapus
          </Button>
        </div>

        {savedArea && (
          <div className="mt-6 p-4 bg-accent/10 rounded-lg border border-accent/30">
            <p className="text-sm text-muted-foreground mb-2">Terdekat dari:</p>
            <div className="flex gap-2 items-center">
              <Badge variant="secondary" className="text-base py-2 px-3">
                {savedArea.kota}, {savedArea.provinsi}
              </Badge>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
