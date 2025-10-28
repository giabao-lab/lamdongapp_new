"use client"

import Link from "next/link"
import { MainLayout } from "@/components/layout/main-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react"
import { useCart } from "@/lib/cart-context"

export default function CartPage() {
  const { state, updateQuantity, removeItem, clearCart } = useCart()

  if (state.items.length === 0) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-md mx-auto text-center space-y-6">
            <div className="w-24 h-24 mx-auto bg-muted rounded-full flex items-center justify-center">
              <ShoppingBag className="h-12 w-12 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-serif font-bold">Giỏ hàng trống</h1>
              <p className="text-muted-foreground">Bạn chưa có sản phẩm nào trong giỏ hàng.</p>
            </div>
            <Link href="/products">
              <Button size="lg">Tiếp tục mua sắm</Button>
            </Link>
          </div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold mb-2">Giỏ hàng của bạn</h1>
          <p className="text-muted-foreground">Bạn có {state.itemCount} sản phẩm trong giỏ hàng</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {state.items.map((item) => (
              <Card key={item.product_id}>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <div className="w-24 h-24 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                      <img
                        src={item.product.image || "/placeholder.svg"}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <Link href={`/products/${item.product.id}`}>
                            <h3 className="font-semibold hover:text-primary transition-colors">{item.product.name}</h3>
                          </Link>
                          <p className="text-sm text-muted-foreground line-clamp-2">{item.product.description}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            removeItem(item.product_id);
                          }}
                          className="text-muted-foreground hover:text-destructive"
                          type="button"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              updateQuantity(item.product_id, item.quantity - 1);
                            }}
                            disabled={item.quantity <= 1}
                            className="h-8 w-8"
                            type="button"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center font-medium">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              updateQuantity(item.product_id, item.quantity + 1);
                            }}
                            className="h-8 w-8"
                            type="button"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>

                        <div className="text-right">
                          <div className="font-bold text-primary">
                            {(item.product.price * item.quantity).toLocaleString("vi-VN")}đ
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {item.product.price.toLocaleString("vi-VN")}đ x {item.quantity}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            <div className="flex justify-between items-center pt-4">
              <Link href="/products">
                <Button variant="outline">Tiếp tục mua sắm</Button>
              </Link>
              <Button variant="ghost" onClick={clearCart} className="text-muted-foreground">
                Xóa tất cả
              </Button>
            </div>
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Tóm tắt đơn hàng</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Tạm tính:</span>
                    <span>{state.total.toLocaleString("vi-VN")}đ</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Phí vận chuyển:</span>
                    <span className="text-green-600">Miễn phí</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Tổng cộng:</span>
                    <span className="text-primary">{state.total.toLocaleString("vi-VN")}đ</span>
                  </div>
                </div>

                <Link href="/checkout" className="block">
                  <Button size="lg" className="w-full">
                    Tiến hành thanh toán
                  </Button>
                </Link>

                <div className="text-center text-sm text-muted-foreground">
                  <p>Miễn phí vận chuyển cho đơn hàng từ 500.000đ</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
