"use client"

import { useState, useMemo } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { ProductCard } from "@/components/products/product-card"
import { ProductFilters } from "@/components/products/product-filters"
import { mockProducts } from "@/lib/mock-data"
import { useSearchParams } from "next/navigation"

export default function ProductsPage() {
  const searchParams = useSearchParams()
  const categoryParam = searchParams.get("category")

  const [selectedCategory, setSelectedCategory] = useState(categoryParam || "all")
  const [sortBy, setSortBy] = useState("name")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredProducts = useMemo(() => {
    let filtered = mockProducts

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter((product) => product.category === selectedCategory)
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price
        case "price-high":
          return b.price - a.price
        case "rating":
          return b.rating - a.rating
        case "name":
        default:
          return a.name.localeCompare(b.name)
      }
    })

    return filtered
  }, [selectedCategory, sortBy, searchQuery])

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-serif font-bold mb-4">Sản phẩm đặc sản Lâm Đồng</h1>
          <p className="text-lg text-muted-foreground">
            Khám phá bộ sưu tập đầy đủ các sản phẩm đặc sản chất lượng cao từ cao nguyên Lâm Đồng
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <ProductFilters
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              sortBy={sortBy}
              onSortChange={setSortBy}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
          </div>

          <div className="lg:col-span-3">
            <div className="mb-6 flex items-center justify-between">
              <p className="text-muted-foreground">Hiển thị {filteredProducts.length} sản phẩm</p>
            </div>

            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Không tìm thấy sản phẩm nào phù hợp.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
