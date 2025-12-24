"use client"

import { useEffect, useState } from "react"
import { Search, MapPin, MessageSquare, Eye } from "lucide-react"

interface Restaurant {
  id: number
  name: string
  category: string
  rating: number
  reviews: number
  city: string
  status: "active" | "inactive"
}

export default function RestaurantsPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState<"name" | "rating" | "reviews">("name")
  const [selectedCity, setSelectedCity] = useState("all")
  const [viewType, setViewType] = useState<"grid" | "list">("grid")

  useEffect(() => {
    const loadRestaurants = async () => {
      try {
        const response = await fetch("/mock-data.json")
        const json = await response.json()
        setRestaurants(json.restaurants)
      } catch (error) {
        console.error("Error loading restaurants:", error)
      } finally {
        setLoading(false)
      }
    }

    loadRestaurants()
  }, [])

  useEffect(() => {
    let result = restaurants

    // Filter by search term
    if (searchTerm) {
      result = result.filter(
        (restaurant) =>
          restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          restaurant.category.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filter by city
    if (selectedCity !== "all") {
      result = result.filter((restaurant) => restaurant.city === selectedCity)
    }

    // Sort
    result = result.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name)
        case "rating":
          return b.rating - a.rating
        case "reviews":
          return b.reviews - a.reviews
        default:
          return 0
      }
    })

    setFilteredRestaurants(result)
  }, [restaurants, searchTerm, sortBy, selectedCity])

  const cities = [...new Set(restaurants.map((r) => r.city))]

  const getRatingStars = (rating: number) => {
    return "★".repeat(Math.floor(rating)) + "☆".repeat(5 - Math.floor(rating))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-foreground">Memuat restoran...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Daftar Kuliner</h1>
        <p className="text-muted-foreground">Lihat dan kelola semua restoran di platform</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-muted-foreground text-sm font-medium">Total Restoran</p>
          <p className="text-3xl font-bold text-foreground">{restaurants.length}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-muted-foreground text-sm font-medium">Rata-rata Rating</p>
          <p className="text-3xl font-bold text-foreground">
            {(restaurants.reduce((sum, r) => sum + r.rating, 0) / restaurants.length).toFixed(1)}
          </p>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-foreground mb-2">Cari Restoran</label>
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Nama atau kategori..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* City Filter */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Kota</label>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">Semua Kota</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Urutkan</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="name">Nama</option>
              <option value="rating">Rating Tertinggi</option>
              <option value="reviews">Terbanyak Review</option>
            </select>
          </div>

          {/* View Toggle */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Tampilan</label>
            <div className="flex gap-2 bg-background border border-border rounded-lg p-1">
              <button
                onClick={() => setViewType("grid")}
                className={`flex-1 px-3 py-1 rounded transition-colors text-sm font-medium ${
                  viewType === "grid" ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"
                }`}
              >
                Grid
              </button>
              <button
                onClick={() => setViewType("list")}
                className={`flex-1 px-3 py-1 rounded transition-colors text-sm font-medium ${
                  viewType === "list" ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"
                }`}
              >
                List
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Restaurants Grid View */}
      {viewType === "grid" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRestaurants.length === 0 ? (
            <div className="col-span-full bg-card border border-border rounded-lg p-12 text-center">
              <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-foreground font-medium mb-2">Tidak ada restoran</p>
              <p className="text-muted-foreground">Coba ubah filter pencarian</p>
            </div>
          ) : (
            filteredRestaurants.map((restaurant) => (
              <div
                key={restaurant.id}
                className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow flex flex-col"
              >
                {/* Image Placeholder */}
                <div className="h-40 bg-gradient-to-br from-secondary/20 to-accent/20 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl mb-2">🍽️</div>
                    <p className="text-sm text-muted-foreground">{restaurant.category}</p>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-2">{restaurant.name}</h3>

                  <div className="space-y-3 text-sm flex-1">
                    {/* Location */}
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin size={16} />
                      <span>{restaurant.city}</span>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-2">
                      <span className="text-yellow-600 font-semibold">{getRatingStars(restaurant.rating)}</span>
                      <span className="text-foreground font-medium">{restaurant.rating.toFixed(1)}/5</span>
                    </div>

                    {/* Reviews */}
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MessageSquare size={16} />
                      <span>{restaurant.reviews} ulasan</span>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="mt-4 pt-4 border-t border-border">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        restaurant.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {restaurant.status === "active" ? "Aktif" : "Tidak Aktif"}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Restaurants List View */}
      {viewType === "list" && (
        <div className="space-y-3">
          {filteredRestaurants.length === 0 ? (
            <div className="bg-card border border-border rounded-lg p-12 text-center">
              <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-foreground font-medium mb-2">Tidak ada restoran</p>
              <p className="text-muted-foreground">Coba ubah filter pencarian</p>
            </div>
          ) : (
            filteredRestaurants.map((restaurant) => (
              <div
                key={restaurant.id}
                className="bg-card border border-border rounded-lg p-4 hover:shadow-lg transition-shadow flex items-center justify-between"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-4 mb-2">
                    <h3 className="text-lg font-semibold text-foreground truncate">{restaurant.name}</h3>
                    <span className="text-xs font-medium px-2 py-1 bg-primary/10 text-primary rounded whitespace-nowrap">
                      {restaurant.category}
                    </span>
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded whitespace-nowrap ${
                        restaurant.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {restaurant.status === "active" ? "Aktif" : "Tidak Aktif"}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin size={14} />
                      {restaurant.city}
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-600">{getRatingStars(restaurant.rating)}</span>
                      <span className="text-foreground font-medium">{restaurant.rating.toFixed(1)}/5</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageSquare size={14} />
                      {restaurant.reviews} ulasan
                    </div>
                  </div>
                </div>
                <button className="ml-4 p-2 rounded-lg hover:bg-background transition-colors text-foreground">
                  <Eye size={20} />
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {/* Result Info */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          Menampilkan {filteredRestaurants.length} dari {restaurants.length} restoran
        </span>
      </div>
    </div>
  )
}
