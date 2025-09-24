import type React from "react"
import type { Metadata } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/lib/auth-context"
import { CartProvider } from "@/lib/cart-context"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  weight: ["400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "Đặc Sản Lâm Đồng - Vietnamese Highland Specialties",
  description:
    "Discover authentic Vietnamese specialties from Lâm Đồng province including premium coffee, artichoke tea, wine, strawberries, and traditional preserves.",
    generator: 'v0.app'
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
