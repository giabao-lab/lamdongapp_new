"use client"

import type React from "react"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, ShoppingCart } from "lucide-react"
import type { Product } from "@/lib/types"
import { useCart } from "@/lib/cart-context"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart()

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem(product, 1)
  }

  return (
    <Card className="group hover:shadow-lg transition-shadow">
      <CardContent className="p-0">
        <Link href={`/products/${product.id}`}>
          <div className="aspect-square relative overflow-hidden rounded-t-lg">
            <img
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {product.original_price && (
              <Badge className="absolute top-3 left-3 bg-destructive">
                Giảm {Math.round(((product.original_price - product.price) / product.original_price) * 100)}%
              </Badge>
            )}
            {!product.in_stock && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Badge variant="secondary">Hết hàng</Badge>
              </div>
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
            <span className="text-sm font-medium">{product.rating || 4.5}</span>
            <span className="text-sm text-muted-foreground">({product.review_count || 25})</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="font-bold text-lg text-primary">{Number(product.price).toLocaleString("vi-VN")}đ</div>
              {product.original_price && (
                <div className="text-sm text-muted-foreground line-through">
                  {Number(product.original_price).toLocaleString("vi-VN")}đ
                </div>
              )}
            </div>
            <Button size="sm" className="shrink-0" disabled={!product.in_stock} onClick={handleAddToCart}>
              <ShoppingCart className="h-4 w-4 mr-1" />
              {product.in_stock ? "Thêm" : "Hết hàng"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
