"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { MainLayout } from "@/components/layout/main-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Package, Clock, Truck } from "lucide-react"

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get("orderId")

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
                Mã đơn hàng: <span className="font-mono font-medium">{orderId}</span>
              </p>
            )}
          </div>

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
