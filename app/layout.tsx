import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/lib/auth-context"
import { CartProvider } from "@/lib/cart-context"

// Optimize font loading with minimal weights and preload
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
  weight: ["400", "500", "600"], // Only load necessary weights
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  preload: false, // Secondary font, don't preload
  weight: ["400", "600"], // Reduce font weights
})

export const metadata: Metadata = {
  title: "Đặc Sản Lâm Đồng - Vietnamese Highland Specialties",
  description:
    "Discover authentic Vietnamese specialties from Lâm Đồng province including premium coffee, artichoke tea, wine, strawberries, and traditional preserves.",
  generator: 'v0.app',
  robots: "index, follow",
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi" className={`${inter.variable} ${playfair.variable} antialiased`}>
      <body className="min-h-screen bg-background font-sans text-foreground">
        <AuthProvider>
          <CartProvider>{children}</CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
