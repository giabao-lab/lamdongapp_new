"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Search, Eye } from "lucide-react"

const mockOrders = [
  {
    id: "ORD-001",
    customerInfo: {
      name: "Nguyễn Văn An",
      email: "an.nguyen@email.com",
      phone: "0901234567",
    },
    shippingAddress: {
      address: "123 Đường Nguyễn Thị Minh Khai",
      city: "Đà Lạt",
      province: "Lâm Đồng",
    },
    items: [
      { name: "Cà phê Arabica Đà Lạt", quantity: 2, price: 250000 },
      { name: "Trà Atiso Đà Lạt", quantity: 1, price: 180000 },
    ],
    total: 680000,
    status: "delivered",
    createdAt: "2024-01-15T10:30:00Z",
  },
  {
    id: "ORD-002",
    customerInfo: {
      name: "Trần Thị Bình",
      email: "binh.tran@email.com",
      phone: "0912345678",
    },
    shippingAddress: {
      address: "456 Đường Trần Hưng Đạo",
      city: "TP. Hồ Chí Minh",
      province: "TP. Hồ Chí Minh",
    },
    items: [
      { name: "Rượu vang Đà Lạt", quantity: 1, price: 450000 },
      { name: "Mứt dâu tây", quantity: 3, price: 120000 },
    ],
    total: 810000,
    status: "processing",
    createdAt: "2024-01-16T14:20:00Z",
  },
  {
    id: "ORD-003",
    customerInfo: {
      name: "Lê Minh Cường",
      email: "cuong.le@email.com",
      phone: "0923456789",
    },
    shippingAddress: {
      address: "789 Đường Lê Lợi",
      city: "Hà Nội",
      province: "Hà Nội",
    },
    items: [{ name: "Dâu tây tươi Đà Lạt", quantity: 2, price: 150000 }],
    total: 300000,
    status: "pending",
    createdAt: "2024-01-17T09:15:00Z",
  },
  {
    id: "ORD-004",
    customerInfo: {
      name: "Phạm Thị Dung",
      email: "dung.pham@email.com",
      phone: "0934567890",
    },
    shippingAddress: {
      address: "321 Đường Hai Bà Trưng",
      city: "Đà Nẵng",
      province: "Đà Nẵng",
    },
    items: [
      { name: "Cà phê Arabica Đà Lạt", quantity: 1, price: 250000 },
      { name: "Trà Atiso Đà Lạt", quantity: 2, price: 180000 },
      { name: "Mứt dâu tây", quantity: 1, price: 120000 },
    ],
    total: 730000,
    status: "shipped",
    createdAt: "2024-01-18T16:45:00Z",
  },
]

export default function AdminOrders() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [orders, setOrders] = useState(mockOrders)

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerInfo.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order)),
    )
  }

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
        return "Đã gửi"
      case "delivered":
        return "Đã giao"
      case "cancelled":
        return "Đã hủy"
      default:
        return status
    }
  }

  return (
    <ProtectedRoute adminOnly>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Quản lý đơn hàng</h1>
          <p className="text-muted-foreground">Theo dõi và quản lý đơn hàng khách hàng</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Tìm kiếm đơn hàng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Lọc theo trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả trạng thái</SelectItem>
              <SelectItem value="pending">Chờ xử lý</SelectItem>
              <SelectItem value="processing">Đang xử lý</SelectItem>
              <SelectItem value="shipped">Đã gửi</SelectItem>
              <SelectItem value="delivered">Đã giao</SelectItem>
              <SelectItem value="cancelled">Đã hủy</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <p className="text-muted-foreground">Không tìm thấy đơn hàng nào</p>
              </CardContent>
            </Card>
          ) : (
            filteredOrders.map((order) => (
              <Card key={order.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">Đơn hàng #{order.id}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString("vi-VN", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    <Badge variant={getStatusColor(order.status)}>{getStatusText(order.status)}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <h4 className="font-medium mb-2">Thông tin khách hàng</h4>
                      <p className="text-sm">{order.customerInfo.name}</p>
                      <p className="text-sm text-muted-foreground">{order.customerInfo.email}</p>
                      <p className="text-sm text-muted-foreground">{order.customerInfo.phone}</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Địa chỉ giao hàng</h4>
                      <p className="text-sm">{order.shippingAddress.address}</p>
                      <p className="text-sm text-muted-foreground">
                        {order.shippingAddress.city}, {order.shippingAddress.province}
                      </p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Sản phẩm đặt hàng ({order.items.length})</h4>
                    <div className="space-y-2">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between items-center text-sm">
                          <span>
                            {item.name} x {item.quantity}
                          </span>
                          <span>{(item.price * item.quantity).toLocaleString("vi-VN")}₫</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="text-lg font-bold">Tổng cộng: {order.total.toLocaleString("vi-VN")}₫</div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        Xem chi tiết
                      </Button>
                      <Select value={order.status} onValueChange={(value) => updateOrderStatus(order.id, value)}>
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Chờ xử lý</SelectItem>
                          <SelectItem value="processing">Đang xử lý</SelectItem>
                          <SelectItem value="shipped">Đã gửi</SelectItem>
                          <SelectItem value="delivered">Đã giao</SelectItem>
                          <SelectItem value="cancelled">Đã hủy</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}
