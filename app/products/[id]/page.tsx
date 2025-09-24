"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { MainLayout } from "@/components/layout/main-layout"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Star, ShoppingCart, Heart, Share2, Minus, Plus } from "lucide-react"
import { mockProducts } from "@/lib/mock-data"
import { useCart } from "@/lib/cart-context"

export default function ProductDetailPage() {
  const params = useParams()
  const productId = params.id as string
  const product = mockProducts.find((p) => p.id === productId)

  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const { addItem } = useCart()

  const handleAddToCart = () => {
    addItem(product, quantity)
    setQuantity(1) // Reset quantity after adding
  }

  if (!product) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
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
                src={product.images[selectedImage] || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImage === index ? "border-primary" : "border-transparent"
                  }`}
                >
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                {product.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
              <h1 className="text-3xl font-serif font-bold mb-4">{product.name}</h1>

              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{product.rating}</span>
                  <span className="text-muted-foreground">({product.reviewCount} đánh giá)</span>
                </div>
                <Separator orientation="vertical" className="h-4" />
                <span className="text-muted-foreground">Xuất xứ: {product.origin}</span>
              </div>

              <div className="flex items-baseline gap-4 mb-6">
                <div className="text-3xl font-bold text-primary">{product.price.toLocaleString("vi-VN")}đ</div>
                {product.originalPrice && (
                  <div className="text-xl text-muted-foreground line-through">
                    {product.originalPrice.toLocaleString("vi-VN")}đ
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Mô tả sản phẩm</h3>
              <p className="text-muted-foreground leading-relaxed">{product.description}</p>
            </div>

            {product.weight && (
              <div>
                <h3 className="font-semibold mb-2">Trọng lượng</h3>
                <p className="text-muted-foreground">{product.weight}</p>
              </div>
            )}

            {product.ingredients && (
              <div>
                <h3 className="font-semibold mb-2">Thành phần</h3>
                <ul className="text-muted-foreground space-y-1">
                  {product.ingredients.map((ingredient, index) => (
                    <li key={index}>• {ingredient}</li>
                  ))}
                </ul>
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
                      <Button variant="outline" size="icon" onClick={() => setQuantity(quantity + 1)}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button className="flex-1" size="lg" disabled={!product.inStock} onClick={handleAddToCart}>
                      <ShoppingCart className="mr-2 h-5 w-5" />
                      {product.inStock ? "Thêm vào giỏ hàng" : "Hết hàng"}
                    </Button>
                    <Button variant="outline" size="lg">
                      <Heart className="h-5 w-5" />
                    </Button>
                    <Button variant="outline" size="lg">
                      <Share2 className="h-5 w-5" />
                    </Button>
                  </div>

                  {!product.inStock && (
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
