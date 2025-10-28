"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { MainLayout } from "@/components/layout/main-layout"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Star, ShoppingCart, Heart, Share2, Minus, Plus, Loader2 } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { productsService } from "@/lib/products-service"
import { Product } from "@/lib/types"

export default function ProductDetailPage() {
  const params = useParams()
  const productId = params.id as string
  
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const { addItem } = useCart()

  // Fetch product from API
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const fetchedProduct = await productsService.getProductById(productId)
        setProduct(fetchedProduct)
      } catch (err) {
        console.error('Failed to fetch product:', err)
        setError(err instanceof Error ? err.message : 'Failed to load product')
        setProduct(null)
      } finally {
        setLoading(false)
      }
    }

    if (productId) {
      fetchProduct()
    }
  }, [productId])

  const handleAddToCart = () => {
    if (product) {
      addItem(product, quantity)
      setQuantity(1) // Reset quantity after adding
    }
  }

  // Loading state
  if (loading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Đang tải sản phẩm...</span>
          </div>
        </div>
      </MainLayout>
    )
  }

  // Error state
  if (error || !product) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            {error && (
              <Alert className="mb-6 max-w-md mx-auto">
                <AlertDescription>
                  {error}. Vui lòng thử lại sau.
                </AlertDescription>
              </Alert>
            )}
            <h1 className="text-2xl font-bold mb-4">Không tìm thấy sản phẩm</h1>
            <p className="text-muted-foreground">Sản phẩm bạn đang tìm kiếm không tồn tại.</p>
          </div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square rounded-lg overflow-hidden bg-muted">
              <img
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {/* Note: API currently returns single image, but keeping multi-image structure for future enhancement */}
            <div className="grid grid-cols-4 gap-2">
              <button
                onClick={() => setSelectedImage(0)}
                className="aspect-square rounded-lg overflow-hidden border-2 border-primary transition-colors"
              >
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </button>
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary">
                  {product.category}
                </Badge>
                {product.is_featured && (
                  <Badge variant="default">
                    Nổi bật
                  </Badge>
                )}
                {product.stock_quantity && product.stock_quantity > 0 && (
                  <Badge variant="outline">
                    Còn hàng
                  </Badge>
                )}
              </div>
              <h1 className="text-3xl font-serif font-bold mb-4">{product.name}</h1>

              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">4.5</span>
                  <span className="text-muted-foreground">(25 đánh giá)</span>
                </div>
                <Separator orientation="vertical" className="h-4" />
                <span className="text-muted-foreground">Xuất xứ: Lâm Đồng</span>
              </div>

              <div className="flex items-baseline gap-4 mb-6">
                <div className="text-3xl font-bold text-primary">
                  {Number(product.price).toLocaleString("vi-VN")}đ
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Mô tả sản phẩm</h3>
              <p className="text-muted-foreground leading-relaxed">{product.description}</p>
            </div>

            {product.stock_quantity && (
              <div>
                <h3 className="font-semibold mb-2">Số lượng trong kho</h3>
                <p className="text-muted-foreground">{product.stock_quantity} sản phẩm</p>
              </div>
            )}

            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Số lượng:</span>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-12 text-center font-medium">{quantity}</span>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={() => setQuantity(quantity + 1)}
                        disabled={product.stock_quantity ? quantity >= product.stock_quantity : false}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button 
                      className="flex-1" 
                      size="lg" 
                      disabled={!product.stock_quantity || product.stock_quantity <= 0} 
                      onClick={handleAddToCart}
                    >
                      <ShoppingCart className="mr-2 h-5 w-5" />
                      {product.stock_quantity && product.stock_quantity > 0 ? "Thêm vào giỏ hàng" : "Hết hàng"}
                    </Button>
                    <Button variant="outline" size="lg">
                      <Heart className="h-5 w-5" />
                    </Button>
                    <Button variant="outline" size="lg">
                      <Share2 className="h-5 w-5" />
                    </Button>
                  </div>

                  {(!product.stock_quantity || product.stock_quantity <= 0) && (
                    <p className="text-sm text-muted-foreground text-center">
                      Sản phẩm tạm thời hết hàng. Vui lòng quay lại sau.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
