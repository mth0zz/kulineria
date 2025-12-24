"use client"

import { useState, useEffect } from "react"
import { Save, Moon, Sun, Palette, Grid3x3, Calendar, FileText } from "lucide-react"

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    theme: "light",
    paginationSize: 10,
    dateFormat: "DD/MM/YYYY",
    timeFormat: "24h",
    language: "id",
    sidebarCollapsed: false,
    notifications: true,
  })

  const [saved, setSaved] = useState(false)
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    // Load settings from localStorage
    const saved = localStorage.getItem("admin-settings")
    if (saved) {
      setSettings(JSON.parse(saved))
    }
  }, [])

  const handleSave = () => {
    localStorage.setItem("admin-settings", JSON.stringify(settings))
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const applyTheme = (theme: string) => {
    setSettings({ ...settings, theme })
    if (theme === "dark") {
      document.documentElement.classList.add("dark")
      setIsDark(true)
    } else {
      document.documentElement.classList.remove("dark")
      setIsDark(false)
    }
  }

  return (
    <div className="max-w-4xl space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Pengaturan</h1>
        <p className="text-muted-foreground">Atur preferensi dan konfigurasi admin panel Anda</p>
      </div>

      {/* Save Notification */}
      {saved && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Pengaturan berhasil disimpan
        </div>
      )}

      {/* Theme Settings */}
      <section className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <Palette className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-semibold text-foreground">Tampilan</h2>
        </div>

        <div className="space-y-6">
          {/* Theme Selection */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-4">Pilih Tema</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { value: "light", label: "Light", icon: Sun },
                { value: "dark", label: "Dark", icon: Moon },
                { value: "auto", label: "Auto", icon: Palette },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => applyTheme(option.value)}
                  className={`p-4 rounded-lg border-2 transition-all flex items-center gap-3 ${
                    settings.theme === option.value
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary"
                  }`}
                >
                  <option.icon className="w-6 h-6" />
                  <div className="text-left">
                    <p className="font-medium text-foreground">{option.label}</p>
                    <p className="text-xs text-muted-foreground">
                      {option.value === "light"
                        ? "Cahaya terang"
                        : option.value === "dark"
                          ? "Cahaya gelap"
                          : "Sesuai sistem"}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Color Palette */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">Palet Warna Tema</label>
            <p className="text-sm text-muted-foreground mb-4">
              Tema saat ini menggunakan Kuliner Nusantara dengan kombinasi warna hangat (merah rempah, kunyit, daun
              hijau)
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-700 rounded-lg border-2 border-red-800" title="Rempah Merah"></div>
              <div
                className="w-10 h-10 bg-yellow-600 rounded-lg border-2 border-yellow-700"
                title="Kunyit Hangat"
              ></div>
              <div className="w-10 h-10 bg-green-800 rounded-lg border-2 border-green-900" title="Daun Hijau"></div>
              <div className="w-10 h-10 bg-yellow-100 rounded-lg border-2 border-yellow-200" title="Krem Santan"></div>
              <div className="w-10 h-10 bg-amber-900 rounded-lg border-2 border-amber-950" title="Kopi Cokelat"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Pagination Settings */}
      <section className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <Grid3x3 className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-semibold text-foreground">Pagination</h2>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-3">Jumlah Item per Halaman</label>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {[5, 10, 15, 25, 50].map((size) => (
              <button
                key={size}
                onClick={() => setSettings({ ...settings, paginationSize: size })}
                className={`p-3 rounded-lg border-2 font-medium transition-all ${
                  settings.paginationSize === size
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border text-foreground hover:border-primary"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            Pengaturan ini akan diterapkan pada semua halaman dengan list yang panjang
          </p>
        </div>
      </section>

      {/* Date & Time Settings */}
      <section className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <Calendar className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-semibold text-foreground">Tanggal & Waktu</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Date Format */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">Format Tanggal</label>
            <select
              value={settings.dateFormat}
              onChange={(e) => setSettings({ ...settings, dateFormat: e.target.value })}
              className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="DD/MM/YYYY">DD/MM/YYYY (04/11/2024)</option>
              <option value="MM/DD/YYYY">MM/DD/YYYY (11/04/2024)</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD (2024-11-04)</option>
              <option value="DD-MM-YYYY">DD-MM-YYYY (04-11-2024)</option>
            </select>
            <p className="text-xs text-muted-foreground mt-2">Contoh: {getDateExample(settings.dateFormat)}</p>
          </div>

          {/* Time Format */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">Format Waktu</label>
            <select
              value={settings.timeFormat}
              onChange={(e) => setSettings({ ...settings, timeFormat: e.target.value })}
              className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="24h">24 Jam (14:30)</option>
              <option value="12h">12 Jam (2:30 PM)</option>
            </select>
            <p className="text-xs text-muted-foreground mt-2">
              Contoh: {settings.timeFormat === "24h" ? "14:30:45" : "2:30:45 PM"}
            </p>
          </div>
        </div>
      </section>

      {/* Language Settings */}
      <section className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <FileText className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-semibold text-foreground">Bahasa</h2>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-3">Pilih Bahasa</label>
          <select
            value={settings.language}
            onChange={(e) => setSettings({ ...settings, language: e.target.value })}
            className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="id">Bahasa Indonesia</option>
            <option value="en">English</option>
            <option value="jv">Basa Jawa</option>
          </select>
          <p className="text-xs text-muted-foreground mt-2">
            Pilihan bahasa akan mempengaruhi tampilan interface dan pesan sistem
          </p>
        </div>
      </section>

      {/* Other Settings */}
      <section className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-xl font-semibold text-foreground mb-6">Lainnya</h2>

        <div className="space-y-4">
          {/* Sidebar Collapse */}
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Sidebar Tertutup Saat Masuk</p>
              <p className="text-sm text-muted-foreground">
                Sidebar akan tersimpan dalam keadaan tertutup saat Anda login
              </p>
            </div>
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.sidebarCollapsed}
                onChange={(e) => setSettings({ ...settings, sidebarCollapsed: e.target.checked })}
                className="w-4 h-4 rounded border-border"
              />
            </label>
          </div>

          {/* Notifications */}
          <div className="border-t border-border pt-4 flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Notifikasi Sistem</p>
              <p className="text-sm text-muted-foreground">Tampilkan notifikasi untuk aktivitas penting</p>
            </div>
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notifications}
                onChange={(e) => setSettings({ ...settings, notifications: e.target.checked })}
                className="w-4 h-4 rounded border-border"
              />
            </label>
          </div>
        </div>
      </section>

      {/* Action Buttons */}
      <div className="flex gap-4 pt-4">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
        >
          <Save size={20} />
          Simpan Pengaturan
        </button>
        <button
          onClick={() => {
            localStorage.removeItem("admin-settings")
            setSettings({
              theme: "light",
              paginationSize: 10,
              dateFormat: "DD/MM/YYYY",
              timeFormat: "24h",
              language: "id",
              sidebarCollapsed: false,
              notifications: true,
            })
            setSaved(false)
          }}
          className="px-6 py-3 bg-background border border-border text-foreground rounded-lg hover:bg-muted transition-colors font-medium"
        >
          Reset ke Default
        </button>
      </div>
    </div>
  )
}

function getDateExample(format: string): string {
  switch (format) {
    case "DD/MM/YYYY":
      return "04/11/2024"
    case "MM/DD/YYYY":
      return "11/04/2024"
    case "YYYY-MM-DD":
      return "2024-11-04"
    case "DD-MM-YYYY":
      return "04-11-2024"
    default:
      return ""
  }
}
