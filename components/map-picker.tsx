"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MapPin, X } from "lucide-react"

interface MapPickerProps {
  lat: string
  lng: string
  onLocationChange: (lat: string, lng: string) => void
}

declare global {
  interface Window {
    L?: any
  }
}

export function MapPicker({ lat, lng, onLocationChange }: MapPickerProps) {
  const [showMap, setShowMap] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<any>(null)
  const markerRef = useRef<any>(null)

  useEffect(() => {
    if (!showMap || !mapContainerRef.current || mapRef.current) return

    setIsLoading(true)
    const loadMap = async () => {
      try {
        // Load Leaflet CSS
        const link = document.createElement("link")
        link.rel = "stylesheet"
        link.href = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css"
        document.head.appendChild(link)

        // Load Leaflet JS
        const script = document.createElement("script")
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js"
        script.onload = () => {
          initializeMap()
        }
        document.head.appendChild(script)
      } catch (error) {
        console.error("Error loading map:", error)
        setIsLoading(false)
      }
    }

    const initializeMap = () => {
      const L = window.L
      if (!L || !mapContainerRef.current) return

      // Default center (Indonesia center - Yogyakarta area)
      const defaultLat = lat ? Number(lat) : -7.8
      const defaultLng = lng ? Number(lng) : 110.4

      mapRef.current = L.map(mapContainerRef.current).setView([defaultLat, defaultLng], 6)

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(mapRef.current)

      // Add existing marker if coordinates exist
      if (lat && lng) {
        markerRef.current = L.marker([defaultLat, defaultLng]).addTo(mapRef.current)
      }

      // Handle map clicks
      mapRef.current.on("click", (e: any) => {
        const { lat: clickLat, lng: clickLng } = e.latlng

        if (markerRef.current) {
          mapRef.current.removeLayer(markerRef.current)
        }

        markerRef.current = L.marker([clickLat, clickLng]).addTo(mapRef.current)
        onLocationChange(clickLat.toFixed(6), clickLng.toFixed(6))
      })

      setIsLoading(false)
    }

    loadMap()
  }, [showMap])

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Input
          type="text"
          value={lat}
          placeholder="Latitude"
          readOnly
          className="bg-input text-foreground placeholder:text-muted-foreground"
        />
        <Input
          type="text"
          value={lng}
          placeholder="Longitude"
          readOnly
          className="bg-input text-foreground placeholder:text-muted-foreground"
        />
      </div>

      {!showMap && (
        <Button onClick={() => setShowMap(true)} variant="outline" className="w-full gap-2">
          <MapPin size={18} />
          Buka Map Picker
        </Button>
      )}

      {showMap && (
        <div className="space-y-3">
          <div className="relative bg-muted rounded-lg overflow-hidden" style={{ height: "300px" }}>
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-muted/50 z-10">
                <p className="text-sm text-muted-foreground">Loading map...</p>
              </div>
            )}
            <div ref={mapContainerRef} className="w-full h-full" />
          </div>

          <div className="text-xs text-muted-foreground text-center">Klik pada map untuk memilih lokasi</div>

          <Button
            onClick={() => {
              setShowMap(false)
              if (mapRef.current) {
                mapRef.current.remove()
                mapRef.current = null
              }
            }}
            variant="outline"
            className="w-full gap-2"
          >
            <X size={18} />
            Tutup Map
          </Button>
        </div>
      )}
    </div>
  )
}
