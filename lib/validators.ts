export const validateKuliner = (data: any) => {
  const errors: Record<string, string> = {}

  // Nama
  if (!data.nama || data.nama.trim().length < 3) {
    errors.nama = "Nama kuliner minimal 3 karakter"
  }
  if (data.nama && data.nama.length > 60) {
    errors.nama = "Nama kuliner maksimal 60 karakter"
  }

  // Kategori
  if (!data.kategori) {
    errors.kategori = "Kategori wajib dipilih"
  }

  // Deskripsi
  if (!data.deskripsi || data.deskripsi.trim().length < 160) {
    errors.deskripsi = "Deskripsi minimal 160 karakter"
  }
  if (data.deskripsi && data.deskripsi.length > 600) {
    errors.deskripsi = "Deskripsi maksimal 600 karakter"
  }

  // Lokasi
  if (!data.provinsi) {
    errors.provinsi = "Provinsi wajib dipilih"
  }
  if (!data.kota) {
    errors.kota = "Kota wajib dipilih"
  }

  // Bahan
  if (!data.bahan || data.bahan.length === 0 || !data.bahan.some((b: string) => b.trim())) {
    errors.bahan = "Minimal 1 bahan diperlukan"
  }

  // Langkah
  if (!data.langkah || data.langkah.length === 0 || !data.langkah.some((l: string) => l.trim())) {
    errors.langkah = "Minimal 1 langkah diperlukan"
  }

  // Harga
  if (data.hargaMin !== "" && (isNaN(Number(data.hargaMin)) || Number(data.hargaMin) < 0)) {
    errors.hargaMin = "Harga minimal harus angka ≥ 0"
  }
  if (data.hargaMax !== "" && (isNaN(Number(data.hargaMax)) || Number(data.hargaMax) < 0)) {
    errors.hargaMax = "Harga maksimal harus angka ≥ 0"
  }
  if (data.hargaMin !== "" && data.hargaMax !== "") {
    if (Number(data.hargaMax) < Number(data.hargaMin)) {
      errors.hargaMax = "Harga maksimal tidak boleh kurang dari minimal"
    }
  }

  return errors
}
