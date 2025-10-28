"use client"

import { useState, useEffect } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { ProductCard } from "@/components/products/product-card"
import { ProductFilters } from "@/components/products/product-filters"
import { useSearchParams } from "next/navigation"
import { productsService, ProductQuery } from "@/lib/products-service"
import { Product } from "@/lib/types"
import { Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function ProductsPage() {
  const searchParams = useSearchParams()
  const categoryParam = searchParams.get("category")

  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const [selectedCategory, setSelectedCategory] = useState(categoryParam || "all")
  const [sortBy, setSortBy] = useState("name")
  const [searchQuery, setSearchQuery] = useState("")
  
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0
  })

  // Fetch products from API
  const fetchProducts = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const query: ProductQuery = {
        page: pagination.page,
        limit: pagination.limit,
        search: searchQuery || undefined,
        category: selectedCategory !== "all" ? selectedCategory : undefined,
        sort: getSortField(sortBy),
        order: getSortOrder(sortBy)
      }
      
      const response = await productsService.getProducts(query)
      setProducts(response.products)
      setPagination(response.pagination)
    } catch (err) {
      console.error('Failed to fetch products:', err)
      setError(err instanceof Error ? err.message : 'Failed to load products')
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  // Helper functions for sorting
  const getSortField = (sortBy: string): ProductQuery['sort'] => {
    switch (sortBy) {
      case "price-low":
      case "price-high":
        return "price"
      case "rating":
        return "created_at" // Use created_at as proxy for popularity
      case "name":
      default:
        return "name"
    }
  }

  const getSortOrder = (sortBy: string): ProductQuery['order'] => {
    switch (sortBy) {
      case "price-high":
      case "rating":
        return "desc"
      case "price-low":
      case "name":
      default:
        return "asc"
    }
  }

  // Fetch products when filters change
  useEffect(() => {
    fetchProducts()
  }, [selectedCategory, sortBy, searchQuery, pagination.page])

  // Initial load
  useEffect(() => {
    fetchProducts()
  }, [])

  // Handle filter changes
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    setPagination(prev => ({ ...prev, page: 1 })) // Reset to first page
  }

  const handleSortChange = (sort: string) => {
    setSortBy(sort)
    setPagination(prev => ({ ...prev, page: 1 })) // Reset to first page
  }

  const handleSearchChange = (search: string) => {
    setSearchQuery(search)
    setPagination(prev => ({ ...prev, page: 1 })) // Reset to first page
  }

  // Handle pagination
  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, page }))
    window.scrollTo(0, 0) // Scroll to top
  }

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
              onCategoryChange={handleCategoryChange}
              sortBy={sortBy}
              onSortChange={handleSortChange}
              searchQuery={searchQuery}
              onSearchChange={handleSearchChange}
            />
          </div>

          <div className="lg:col-span-3">
            {/* Loading State */}
            {loading && (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="ml-2">Đang tải sản phẩm...</span>
              </div>
            )}

            {/* Error State */}
            {error && (
              <Alert className="mb-6">
                <AlertDescription>
                  {error}. Hãy thử lại hoặc kiểm tra kết nối mạng.
                </AlertDescription>
              </Alert>
            )}

            {/* Products Grid */}
            {!loading && !error && (
              <>
                <div className="mb-6 flex items-center justify-between">
                  <p className="text-muted-foreground">Hiển thị {products.length} / {pagination.total} sản phẩm</p>
                </div>

                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="flex justify-center mt-8">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handlePageChange(pagination.page - 1)}
                        disabled={pagination.page <= 1}
                        className="px-4 py-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                      >
                        Trước
                      </button>
                      
                      {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                        let page;
                        if (pagination.totalPages <= 5) {
                          page = i + 1;
                        } else if (pagination.page <= 3) {
                          page = i + 1;
                        } else if (pagination.page >= pagination.totalPages - 2) {
                          page = pagination.totalPages - 4 + i;
                        } else {
                          page = pagination.page - 2 + i;
                        }
                        
                        return (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`px-4 py-2 border rounded-md ${
                              page === pagination.page 
                                ? 'bg-primary text-primary-foreground' 
                                : 'hover:bg-gray-50'
                            }`}
                          >
                            {page}
                          </button>
                        );
                      })}
                      
                      <button
                        onClick={() => handlePageChange(pagination.page + 1)}
                        disabled={pagination.page >= pagination.totalPages}
                        className="px-4 py-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                      >
                        Sau
                      </button>
                    </div>
                  </div>
                )}

                {products.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">Không tìm thấy sản phẩm nào phù hợp.</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
