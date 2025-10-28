"use client"

import { useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import Link from "next/link"
import { MainLayout } from "@/components/layout/main-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, Package, Clock, Truck, Loader2 } from "lucide-react"
import { ordersService } from "@/lib/orders-service"
import { Order } from "@/lib/types"

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get("orderId")
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)
        const orderData = await ordersService.getOrderById(orderId)
        setOrder(orderData)
      } catch (err) {
        console.error("Failed to fetch order:", err)
        setError("Không thể tải thông tin đơn hàng")
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [orderId])

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>

          <div className="space-y-4">
            <h1 className="text-3xl font-serif font-bold text-green-600">Đặt hàng thành công!</h1>
            <p className="text-lg text-muted-foreground">
              Cảm ơn bạn đã đặt hàng. Chúng tôi sẽ xử lý đơn hàng của bạn trong thời gian sớm nhất.
            </p>
            {orderId && (
              <p className="text-sm text-muted-foreground">
                Mã đơn hàng: <span className="font-mono font-medium">#{orderId}</span>
              </p>
            )}
          </div>

          {loading && (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Đang tải thông tin đơn hàng...</span>
            </div>
          )}

          {error && (
            <Alert>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {!loading && !error && order && (
            <Card>
              <CardContent className="p-6 text-left">
                <h2 className="font-semibold mb-4 text-center">Chi tiết đơn hàng</h2>
                
                {/* Order Items */}
                {order.items && order.items.length > 0 && (
                  <div className="space-y-3 mb-6">
                    {order.items.map((item: any, index: number) => (
                      <div key={index} className="flex items-center gap-4 p-3 bg-muted/30 rounded-lg">
                        <div className="w-12 h-12 bg-muted rounded overflow-hidden">
                          <img
                            src={item.product?.image || "/placeholder.svg"}
                            alt={item.product?.name || "Sản phẩm"}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{item.product?.name || "Sản phẩm"}</h4>
                          <p className="text-xs text-muted-foreground">
                            Số lượng: {item.quantity}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-sm">{(Number(item.price) * item.quantity).toLocaleString("vi-VN")}₫</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Tổng cộng:</span>
                    <span className="font-bold text-lg text-primary">
                      {Number(order.total).toLocaleString("vi-VN")}₫
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardContent className="p-6">
              <h2 className="font-semibold mb-4">Quy trình xử lý đơn hàng</h2>
              <div className="grid sm:grid-cols-3 gap-4 text-sm">
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Package className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-center">
                    <div className="font-medium">Xác nhận đơn hàng</div>
                    <div className="text-muted-foreground">Trong 1-2 giờ</div>
                  </div>
                </div>
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-center">
                    <div className="font-medium">Chuẩn bị hàng</div>
                    <div className="text-muted-foreground">1-2 ngày</div>
                  </div>
                </div>
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Truck className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-center">
                    <div className="font-medium">Giao hàng</div>
                    <div className="text-muted-foreground">2-3 ngày</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products">
              <Button variant="outline" size="lg">
                Tiếp tục mua sắm
              </Button>
            </Link>
            <Link href="/orders">
              <Button size="lg">Xem đơn hàng</Button>
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
