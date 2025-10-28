"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Star, ShoppingCart, Loader2 } from "lucide-react"
import { productsService } from "@/lib/products-service"
import { Product } from "@/lib/types"
import { useCart } from "@/lib/cart-context"

export function FeaturedProducts() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { addItem } = useCart()

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Get featured products (limit to 4 for home page)
        const response = await productsService.getProducts({
          limit: 4,
          sort: 'created_at',
          order: 'desc'
        })
        
        setFeaturedProducts(response.products)
      } catch (err) {
        console.error('Failed to fetch featured products:', err)
        setError(err instanceof Error ? err.message : 'Failed to load products')
        setFeaturedProducts([])
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedProducts()
  }, [])

  const handleAddToCart = (product: Product) => {
    addItem(product, 1)
  }

  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-serif font-bold mb-4">Sản phẩm nổi bật</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Những sản phẩm đặc sản được yêu thích nhất từ cao nguyên Lâm Đồng
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Đang tải sản phẩm...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <Alert className="mb-6 max-w-md mx-auto">
            <AlertDescription>
              {error}. Không thể tải sản phẩm nổi bật.
            </AlertDescription>
          </Alert>
        )}

        {/* Products Grid */}
        {!loading && !error && featuredProducts.length > 0 && (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {featuredProducts.map((product) => (
                <Card key={product.id} className="group hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    <Link href={`/products/${product.id}`}>
                      <div className="aspect-square relative overflow-hidden rounded-t-lg">
                        <img
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {product.is_featured && (
                          <Badge className="absolute top-3 left-3 bg-primary">
                            Nổi bật
                          </Badge>
                        )}
                      </div>
                    </Link>

                    <div className="p-4 space-y-3">
                      <div>
                        <Link href={`/products/${product.id}`}>
                          <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
                            {product.name}
                          </h3>
                        </Link>
                        <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
                      </div>

                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">4.5</span>
                        <span className="text-sm text-muted-foreground">(25)</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="font-bold text-lg text-primary">
                            {Number(product.price).toLocaleString("vi-VN")}đ
                          </div>
                        </div>
                        <Button 
                          size="sm" 
                          className="shrink-0"
                          onClick={() => handleAddToCart(product)}
                          disabled={!product.stock_quantity || product.stock_quantity <= 0}
                        >
                          <ShoppingCart className="h-4 w-4 mr-1" />
                          Thêm
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center">
              <Link href="/products">
                <Button variant="outline" size="lg">
                  Xem tất cả sản phẩm
                </Button>
              </Link>
            </div>
          </>
        )}

        {/* No Products State */}
        {!loading && !error && featuredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Không có sản phẩm nổi bật nào.</p>
          </div>
        )}
      </div>
    </section>
  )
}