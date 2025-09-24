"use client"

import { useAuth } from "@/lib/auth-context"
import { products } from "@/lib/mock-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Package, ShoppingCart, Users, TrendingUp } from "lucide-react"

const mockOrders = [
  {
    id: "ORD-001",
    customerInfo: {
      name: "Nguyễn Văn An",
      email: "an.nguyen@email.com",
      phone: "0901234567",
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
    items: [{ name: "Dâu tây tươi Đà Lạt", quantity: 2, price: 150000 }],
    total: 300000,
    status: "pending",
    createdAt: "2024-01-17T09:15:00Z",
  },
]

export default function AdminDashboard() {
  const { state } = useAuth()

  const stats = {
    totalProducts: products.length,
    totalOrders: mockOrders.length,
    totalUsers: 156, // Mock data
    totalRevenue: mockOrders.reduce((sum, order) => sum + order.total, 0),
  }

  const recentOrders = mockOrders.slice(-5).reverse()

  return (
    <ProtectedRoute adminOnly>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Bảng điều khiển quản trị</h1>
          <p className="text-muted-foreground">Chào mừng trở lại, {state.user?.name}</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tổng sản phẩm</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalProducts}</div>
              <p className="text-xs text-muted-foreground">Sản phẩm đang bán</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tổng đơn hàng</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalOrders}</div>
              <p className="text-xs text-muted-foreground">Tất cả đơn hàng</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tổng người dùng</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">Người dùng đã đăng ký</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tổng doanh thu</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalRevenue.toLocaleString("vi-VN")}₫</div>
              <p className="text-xs text-muted-foreground">Tổng doanh thu</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle>Đơn hàng gần đây</CardTitle>
          </CardHeader>
          <CardContent>
            {recentOrders.length === 0 ? (
              <p className="text-muted-foreground">Chưa có đơn hàng nào</p>
            ) : (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Đơn hàng #{order.id}</p>
                      <p className="text-sm text-muted-foreground">
                        {order.items.length} sản phẩm • {order.customerInfo.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{order.total.toLocaleString("vi-VN")}₫</p>
                      <Badge variant="secondary">
                        {order.status === "pending" && "Chờ xử lý"}
                        {order.status === "processing" && "Đang xử lý"}
                        {order.status === "shipped" && "Đã gửi"}
                        {order.status === "delivered" && "Đã giao"}
                        {order.status === "cancelled" && "Đã hủy"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  )
}
