"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Package, User, MapPin, Phone, Calendar } from "lucide-react"
import { ordersService } from "@/lib/orders-service"
import { Order } from "@/lib/types"
import { toast } from "sonner"

const statusTranslations: Record<string, string> = {
  pending: "Chờ xử lý",
  processing: "Đang xử lý",
  shipped: "Đang giao",
  delivered: "Đã giao",
  cancelled: "Đã hủy",
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  processing: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  shipped: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  delivered: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  cancelled: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
}

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    fetchOrder()
  }, [params.id])

  const fetchOrder = async () => {
    try {
      setLoading(true)
      const data = await ordersService.getOrderById(params.id)
      setOrder(data)
    } catch (error) {
      console.error("Error fetching order:", error)
      toast.error("Không thể tải thông tin đơn hàng")
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (newStatus: string) => {
    if (!order) return

    try {
      setUpdating(true)
      await ordersService.updateOrderStatus(order.id, newStatus)
      setOrder({ ...order, status: newStatus as Order['status'] })
      toast.success("Cập nhật trạng thái thành công")
    } catch (error) {
      console.error("Error updating status:", error)
      toast.error("Không thể cập nhật trạng thái")
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Đang tải...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Không tìm thấy đơn hàng</p>
          <Button onClick={() => router.push("/admin/orders")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.push("/admin/orders")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Đơn hàng #{order.id}</h1>
            <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
              <Calendar className="h-4 w-4" />
              {new Date(order.created_at).toLocaleString("vi-VN")}
            </p>
          </div>
        </div>
        <Badge className={statusColors[order.status]}>
          {statusTranslations[order.status]}
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Thông tin khách hàng */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Thông tin khách hàng
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Họ tên</p>
                <p className="font-medium">{order.shipping_address?.full_name || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1 flex items-center gap-1">
                  <Phone className="h-4 w-4" />
                  Số điện thoại
                </p>
                <p className="font-medium">{order.shipping_address?.phone || "N/A"}</p>
              </div>
            </div>

            <Separator />

            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                Địa chỉ giao hàng
              </p>
              <p className="font-medium">
                {order.shipping_address?.address_line1}
                {order.shipping_address?.address_line2 && `, ${order.shipping_address.address_line2}`}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {order.shipping_address?.ward && `${order.shipping_address.ward}, `}
                {order.shipping_address?.district && `${order.shipping_address.district}, `}
                {order.shipping_address?.city}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Trạng thái đơn hàng */}
        <Card>
          <CardHeader>
            <CardTitle>Cập nhật trạng thái</CardTitle>
            <CardDescription>Thay đổi trạng thái đơn hàng</CardDescription>
          </CardHeader>
          <CardContent>
            <Select
              value={order.status}
              onValueChange={handleStatusChange}
              disabled={updating}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Chờ xử lý</SelectItem>
                <SelectItem value="processing">Đang xử lý</SelectItem>
                <SelectItem value="shipped">Đang giao</SelectItem>
                <SelectItem value="delivered">Đã giao</SelectItem>
                <SelectItem value="cancelled">Đã hủy</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </div>

      {/* Sản phẩm đặt hàng */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Sản phẩm đặt hàng ({order.items?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {order.items && order.items.length > 0 ? (
              order.items.map((item, index) => (
                <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
                  {item.product?.images && item.product.images.length > 0 && (
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-20 h-20 object-cover rounded"
                    />
                  )}
                  <div className="flex-1">
                    <h4 className="font-semibold">{item.product?.name || "Sản phẩm"}</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Số lượng: {item.quantity}
                    </p>
                    <p className="text-sm font-medium mt-1">
                      {Number(item.price).toLocaleString("vi-VN")}₫ × {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">
                      {(Number(item.price) * item.quantity).toLocaleString("vi-VN")}₫
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-8">
                Không có sản phẩm
              </p>
            )}

            <Separator />

            {/* Tổng tiền */}
            <div className="flex justify-between items-center pt-4">
              <span className="text-xl font-bold">Tổng cộng:</span>
              <span className="text-2xl font-bold text-primary">
                {typeof order.total === 'string' 
                  ? Number(order.total).toLocaleString("vi-VN")
                  : order.total.toLocaleString("vi-VN")
                }₫
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
