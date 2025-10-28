"use client"

import { useAuth } from "@/lib/auth-context"
import { ordersService } from "@/lib/orders-service"
import { Order } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Package, Search, Filter, Calendar, MapPin, CreditCard, Loader2 } from "lucide-react"
import { useState, useEffect } from "react"

export default function OrdersPage() {
  const { state: authState } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [cancellingOrderId, setCancellingOrderId] = useState<string | null>(null)

  useEffect(() => {
    const fetchOrders = async () => {
      if (!authState.user?.id) return

      try {
        setLoading(true)
        setError(null)
        const response = await ordersService.getUserOrders(authState.user.id)
        setOrders(response.orders)
      } catch (err) {
        console.error("Failed to fetch orders:", err)
        setError(err instanceof Error ? err.message : "Không thể tải danh sách đơn hàng")
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [authState.user?.id])

  const handleCancelOrder = async (orderId: string) => {
    if (!confirm("Bạn có chắc chắn muốn hủy đơn hàng này không?")) {
      return
    }

    try {
      setCancellingOrderId(orderId)
      await ordersService.cancelOrder(orderId)
      
      // Update the orders list
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId 
            ? { ...order, status: 'cancelled' }
            : order
        )
      )
      
      alert("Đơn hàng đã được hủy thành công!")
    } catch (err) {
      console.error("Failed to cancel order:", err)
      alert(err instanceof Error ? err.message : "Không thể hủy đơn hàng")
    } finally {
      setCancellingOrderId(null)
    }
  }

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = 
      order.id.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.items && order.items.some((item: any) => 
        item.product?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      ))
    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "default"
      case "processing":
        return "secondary"
      case "shipped":
        return "outline"
      case "delivered":
        return "default"
      case "cancelled":
        return "destructive"
      default:
        return "default"
    }
  }

  const getStatusText = (status: string) => {
    return ordersService.getOrderStatusText(status)
  }

  const statusOptions = [
    { value: "all", label: "Tất cả" },
    { value: "pending", label: "Chờ xử lý" },
    { value: "processing", label: "Đang xử lý" },
    { value: "shipped", label: "Đã gửi hàng" },
    { value: "delivered", label: "Đã giao hàng" },
    { value: "cancelled", label: "Đã hủy" },
  ]

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Đơn hàng của tôi</h1>
          <p className="text-muted-foreground">Theo dõi và quản lý tất cả đơn hàng của bạn</p>
        </div>

        {/* Search and Filter */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Tìm kiếm theo mã đơn hàng hoặc tên sản phẩm..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border rounded-md bg-background"
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Đang tải đơn hàng...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <Alert className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Orders List */}
        {!loading && !error && filteredOrders.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {searchTerm || statusFilter !== "all" ? "Không tìm thấy đơn hàng" : "Chưa có đơn hàng nào"}
              </h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || statusFilter !== "all"
                  ? "Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc"
                  : "Bắt đầu mua sắm để xem đơn hàng tại đây"}
              </p>
              <Button asChild>
                <a href="/products">Khám phá sản phẩm</a>
              </Button>
            </CardContent>
          </Card>
        ) : (
          !loading && !error && (
            <div className="space-y-6">
              {filteredOrders.map((order) => {
                const shippingAddress = order.shipping_address ? 
                  (typeof order.shipping_address === 'string' ? 
                    JSON.parse(order.shipping_address) : 
                    order.shipping_address) : null

                return (
                  <Card key={order.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <CardTitle className="text-lg">Đơn hàng #{order.id}</CardTitle>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {new Date(order.created_at || '').toLocaleDateString("vi-VN", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </div>
                          </div>
                        </div>
                        <Badge variant={getStatusColor(order.status)}>{getStatusText(order.status)}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Order Items */}
                      {order.items && order.items.length > 0 && (
                        <div className="space-y-3">
                          {order.items.map((item: any, index: number) => (
                            <div key={index} className="flex items-center gap-4 p-3 bg-muted/30 rounded-lg">
                              <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden">
                                <img
                                  src={item.product?.image || "/placeholder.svg"}
                                  alt={item.product?.name || "Sản phẩm"}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-medium">{item.product?.name || "Sản phẩm"}</h4>
                                <p className="text-sm text-muted-foreground">
                                  Số lượng: {item.quantity} | Đơn giá: {Number(item.price).toLocaleString("vi-VN")}₫
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-medium">{(Number(item.price) * item.quantity).toLocaleString("vi-VN")}₫</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Order Info */}
                      <div className="grid md:grid-cols-2 gap-4 pt-4 border-t">
                        <div className="space-y-2">
                          <h4 className="font-medium flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            Địa chỉ giao hàng
                          </h4>
                          {shippingAddress && (
                            <div className="text-sm text-muted-foreground">
                              <p>{shippingAddress.fullName}</p>
                              <p>{shippingAddress.phone}</p>
                              <p>{shippingAddress.address}</p>
                              <p>{shippingAddress.ward}, {shippingAddress.district}, {shippingAddress.city}</p>
                            </div>
                          )}
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-medium flex items-center gap-2">
                            <CreditCard className="w-4 h-4" />
                            Thông tin thanh toán
                          </h4>
                          <div className="text-sm text-muted-foreground">
                            <p>
                              Phương thức: {order.payment_method === "cod" ? "Thanh toán khi nhận hàng" : "Chuyển khoản"}
                            </p>
                            <p className="font-medium text-foreground">
                              Tổng cộng: {Number(order.total).toLocaleString("vi-VN")}₫
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex justify-between items-center pt-4 border-t">
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            Chi tiết đơn hàng
                          </Button>
                          {order.status === "delivered" && (
                            <Button variant="outline" size="sm">
                              Đánh giá sản phẩm
                            </Button>
                          )}
                        </div>
                        <div className="flex gap-2">
                          {order.status === "pending" && (
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => handleCancelOrder(order.id)}
                              disabled={cancellingOrderId === order.id}
                            >
                              {cancellingOrderId === order.id ? (
                                <>
                                  <Loader2 className="h-4 w-4 animate-spin mr-1" />
                                  Đang hủy...
                                </>
                              ) : (
                                "Hủy đơn hàng"
                              )}
                            </Button>
                          )}
                          {(order.status === "shipped" || order.status === "delivered") && (
                            <Button size="sm">Mua lại</Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )
        )}
      </div>
    </ProtectedRoute>
  )
}
