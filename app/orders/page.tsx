"use client"

import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Package, Search, Filter, Calendar, MapPin, CreditCard } from "lucide-react"
import { useState } from "react"

// Mock orders data to replace undefined orders from cart context
const mockOrders = [
  {
    id: "ORD-001",
    status: "delivered",
    total: 850000,
    createdAt: "2024-01-15T10:30:00Z",
    customerInfo: {
      name: "Nguyễn Văn A",
      email: "customer@example.com",
      phone: "0901234567",
      address: "123 Đường ABC, Quận 1, TP.HCM",
    },
    paymentMethod: "cod",
    items: [
      {
        name: "Cà phê Arabica Đà Lạt",
        price: 350000,
        quantity: 2,
        image: "/vietnamese-arabica-coffee-beans-dalat.jpg",
      },
      {
        name: "Trà atiso Đà Lạt",
        price: 150000,
        quantity: 1,
        image: "/artichoke-tea-dalat-premium.jpg",
      },
    ],
  },
  {
    id: "ORD-002",
    status: "shipped",
    total: 1200000,
    createdAt: "2024-01-20T14:15:00Z",
    customerInfo: {
      name: "Admin User",
      email: "admin@example.com",
      phone: "0987654321",
      address: "456 Đường XYZ, Quận 3, TP.HCM",
    },
    paymentMethod: "bank_transfer",
    items: [
      {
        name: "Rượu vang Đà Lạt",
        price: 600000,
        quantity: 2,
        image: "/dalat-red-wine-bottle.jpg",
      },
    ],
  },
  {
    id: "ORD-003",
    status: "processing",
    total: 450000,
    createdAt: "2024-01-25T09:45:00Z",
    customerInfo: {
      name: "Nguyễn Văn A",
      email: "customer@example.com",
      phone: "0901234567",
      address: "123 Đường ABC, Quận 1, TP.HCM",
    },
    paymentMethod: "cod",
    items: [
      {
        name: "Dâu tây Đà Lạt",
        price: 150000,
        quantity: 3,
        image: "/fresh-dalat-strawberries.jpg",
      },
    ],
  },
]

export default function OrdersPage() {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const userOrders = (mockOrders || []).filter((order) => order.customerInfo.email === user?.email)

  const filteredOrders = userOrders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items.some((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
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
    switch (status) {
      case "pending":
        return "Chờ xử lý"
      case "processing":
        return "Đang xử lý"
      case "shipped":
        return "Đã gửi hàng"
      case "delivered":
        return "Đã giao hàng"
      case "cancelled":
        return "Đã hủy"
      default:
        return status
    }
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

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
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
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <Card key={order.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">Đơn hàng #{order.id}</CardTitle>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(order.createdAt).toLocaleDateString("vi-VN", {
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
                  <div className="space-y-3">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center gap-4 p-3 bg-muted/30 rounded-lg">
                        <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden">
                          <img
                            src={item.image || "/placeholder.svg?height=64&width=64"}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{item.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            Số lượng: {item.quantity} | Đơn giá: {item.price.toLocaleString("vi-VN")}₫
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{(item.price * item.quantity).toLocaleString("vi-VN")}₫</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Info */}
                  <div className="grid md:grid-cols-2 gap-4 pt-4 border-t">
                    <div className="space-y-2">
                      <h4 className="font-medium flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        Địa chỉ giao hàng
                      </h4>
                      <div className="text-sm text-muted-foreground">
                        <p>{order.customerInfo.name}</p>
                        <p>{order.customerInfo.phone}</p>
                        <p>{order.customerInfo.address}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium flex items-center gap-2">
                        <CreditCard className="w-4 h-4" />
                        Thông tin thanh toán
                      </h4>
                      <div className="text-sm text-muted-foreground">
                        <p>
                          Phương thức: {order.paymentMethod === "cod" ? "Thanh toán khi nhận hàng" : "Chuyển khoản"}
                        </p>
                        <p className="font-medium text-foreground">Tổng cộng: {order.total.toLocaleString("vi-VN")}₫</p>
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
                        <Button variant="destructive" size="sm">
                          Hủy đơn hàng
                        </Button>
                      )}
                      {(order.status === "shipped" || order.status === "delivered") && (
                        <Button size="sm">Mua lại</Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </ProtectedRoute>
  )
}
