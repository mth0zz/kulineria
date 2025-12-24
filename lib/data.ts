// Path: lib/data.ts

export const API_BASE_URL = "http://127.0.0.1:8000/api";
export const APP_BASE_URL = "http://127.0.0.1:8000";

/**
 * Meminta Cookie CSRF dari Laravel
 */
export async function getCsrfToken() {
  try {
    await fetch(`${APP_BASE_URL}/sanctum/csrf-cookie`, {
      method: "GET",
      credentials: "include",
    });
  } catch (error) {
    console.error("Gagal ambil CSRF:", error);
  }
}

/**
 * FIX: Fungsi GET API yang sekarang otomatis bawa Token (Authorization)
 */
export async function fetchFromApi<T>(endpoint: string): Promise<T | null> {
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;

    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": token ? `Bearer ${token}` : "", // Kirim token buat akses Admin/UMKM
      },
      // credentials: "include" // Penting untuk session cookie
    });

    if (!res.ok) {
      console.warn(`Fetch ${endpoint} Gagal: status ${res.status}`);
      return null;
    }

    const json = await res.json();
    return json.success ? json.data : null;
  } catch (error) {
    console.error(`API Fetch Error pada ${endpoint}:`, error);
    return null;
  }
}

/**
 * Fungsi POST API (Bawa CSRF & Token)
 */
export async function postToApi(endpoint: string, body: any) {
  try {
    await getCsrfToken();
    const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;

    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify(body),
      credentials: "include",
    });

    const json = await res.json();
    
    return {
      status: res.status,
      success: json.success || (res.status >= 200 && res.status < 300),
      message: json.message,
      data: json.data,
      token: json.token,
      role: json.role,
      user: json.user,
      errors: json.errors
    };
  } catch (error) {
    console.error(`API Post Error pada ${endpoint}:`, error);
    return { success: false, message: "Gagal terhubung ke server." };
  }
}

/**
 * Fungsi Master Load Homepage
 */
export async function loadAllFromDatabase() {
  try {
    const dbCulinaries = await fetchFromApi<any[]>("/culinaries");
    
    const [resProv, resKat] = await Promise.all([
      fetch("/mock/home/provinsi_kota.json").then(r => r.json()).catch(() => ({})),
      fetch("/mock/home/kategori.json").then(r => r.json()).catch(() => [])
    ]);

    const sanitized = (dbCulinaries || []).map((item: any) => ({
      ...item,
      id: item.id.toString(),
      title: item.nama,
      rating: parseFloat(item.rating) || 0,
      images: Array.isArray(item.images) ? item.images : ["/placeholder.svg"]
    }));

    return {
      provKota: resProv,
      kategori: resKat,
      kuliner: sanitized,
      popular: sanitized.map((c: any) => c.id),
      baru: sanitized,
    };
  } catch (error) {
    console.error("Load All Gagal:", error);
    return { provKota: {}, kategori: [], kuliner: [], popular: [], baru: [] };
  }
}

export async function loadJSON<T>(path: string): Promise<T> {
  const res = await fetch(path);
  return res.json();
}