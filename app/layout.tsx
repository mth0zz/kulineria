import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Lora, Poppins } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })
const _lora = Lora({ subsets: ["latin"], variable: "--font-serif" })
const _poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-sans" })

export const metadata: Metadata = {
  title: "Kuliner Nusantara | Kulineria",
  description: "Jelajahi kelezatan kuliner tradisional Indonesia",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${_lora.variable} ${_poppins.variable} font-sans antialiased`} suppressHydrationWarning>
        {children}
        <Analytics />
      </body>
    </html>
  )
}