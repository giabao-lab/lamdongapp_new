import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, ShoppingCart } from "lucide-react"
import { mockProducts } from "@/lib/mock-data"

export function FeaturedProducts() {
  const featuredProducts = mockProducts.slice(0, 4)

  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-serif font-bold mb-4">Sản phẩm nổi bật</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Những sản phẩm đặc sản được yêu thích nhất từ cao nguyên Lâm Đồng
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {featuredProducts.map((product) => (
            <Card key={product.id} className="group hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="aspect-square relative overflow-hidden rounded-t-lg">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {product.originalPrice && (
                    <Badge className="absolute top-3 left-3 bg-destructive">
                      Giảm {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                    </Badge>
                  )}
                </div>

                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
                  </div>

                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{product.rating}</span>
                    <span className="text-sm text-muted-foreground">({product.reviewCount})</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="font-bold text-lg text-primary">{product.price.toLocaleString("vi-VN")}đ</div>
                      {product.originalPrice && (
                        <div className="text-sm text-muted-foreground line-through">
                          {product.originalPrice.toLocaleString("vi-VN")}đ
                        </div>
                      )}
                    </div>
                    <Button size="sm" className="shrink-0">
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
      </div>
    </section>
  )
}
