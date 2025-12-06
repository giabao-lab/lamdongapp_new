"use client"

import { useAuth } from "@/lib/auth-context"
import { products } from "@/lib/mock-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Package, ShoppingCart, Users, TrendingUp, Settings, FileText, BarChart3 } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { adminService } from "@/lib/admin-service"
import { ordersService } from "@/lib/orders-service"
import { RevenueChart } from "@/components/admin/revenue-chart"
import { Order } from "@/lib/types"

export default function AdminDashboard() {
  const { state } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [totalUsers, setTotalUsers] = useState(0)
  const [loading, setLoading] = useState(true)
  const [showRevenueChart, setShowRevenueChart] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user stats
        const stats = await adminService.getUserStats()
        setTotalUsers(stats.totalUsers)
        
        // Fetch orders
        const ordersResponse = await ordersService.getAllOrders()
        setOrders(ordersResponse.orders)
      } catch (error) {
        console.error("Failed to fetch data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Tính doanh thu từ các đơn hàng đã giao
  const deliveredOrders = orders.filter((order) => order.status === "delivered")
  const totalRevenue = deliveredOrders.reduce((sum, order) => {
    // Chuyển order.total thành number để tránh ghép chuỗi
    const orderTotal = typeof order.total === 'string' ? parseFloat(order.total) : Number(order.total)
    return sum + orderTotal
  }, 0)

  // Tính doanh thu theo tháng
  const revenueByMonth = deliveredOrders.reduce((acc, order) => {
    const date = new Date(order.created_at)
    const month = `T${date.getMonth() + 1}/${date.getFullYear()}`

    if (!acc[month]) {
      acc[month] = { month, revenue: 0, orders: 0 }
    }

    // Chuyển order.total thành number
    const orderTotal = typeof order.total === 'string' ? parseFloat(order.total) : Number(order.total)
    acc[month].revenue += orderTotal
    acc[month].orders += 1

    return acc
  }, {} as Record<string, { month: string; revenue: number; orders: number }>)

  const revenueChartData = Object.values(revenueByMonth).sort((a, b) => {
    const [monthA, yearA] = a.month.replace("T", "").split("/").map(Number)
    const [monthB, yearB] = b.month.replace("T", "").split("/").map(Number)
    return yearA - yearB || monthA - monthB
  })

  // Debug: Log revenue data
  if (revenueChartData.length > 0) {
    console.log('Revenue Chart Data:', revenueChartData)
    console.log('Total Revenue:', totalRevenue)
    console.log('First order total type:', typeof deliveredOrders[0]?.total, deliveredOrders[0]?.total)
  }
  
  const stats = {
    totalProducts: products.length,
    totalOrders: orders.length,
    totalUsers: totalUsers,
    totalRevenue: totalRevenue,
    deliveredOrdersCount: deliveredOrders.length,
  }

  const recentOrders = orders.slice(-5).reverse()

  return (
    <ProtectedRoute requireAdmin>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Bảng điều khiển quản trị</h1>
          <p className="text-muted-foreground">Chào mừng trở lại, {state.user?.name}</p>
        </div>

        {/* Quick Actions / Navigation */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Link href="/admin/products">
            <Button variant="outline" className="w-full h-24 flex flex-col items-center justify-center gap-2">
              <Package className="h-6 w-6" />
              <span className="font-semibold">Quản lý sản phẩm</span>
            </Button>
          </Link>
          
          <Link href="/admin/orders">
            <Button variant="outline" className="w-full h-24 flex flex-col items-center justify-center gap-2">
              <ShoppingCart className="h-6 w-6" />
              <span className="font-semibold">Quản lý đơn hàng</span>
            </Button>
          </Link>
          
          <Link href="/admin/users">
            <Button variant="outline" className="w-full h-24 flex flex-col items-center justify-center gap-2">
              <Users className="h-6 w-6" />
              <span className="font-semibold">Quản lý người dùng</span>
            </Button>
          </Link>
          
          <Link href="/admin/system-status">
            <Button variant="outline" className="w-full h-24 flex flex-col items-center justify-center gap-2">
              <Settings className="h-6 w-6" />
              <span className="font-semibold">Trạng thái hệ thống</span>
            </Button>
          </Link>
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
              <div className="text-2xl font-bold">
                {loading ? "..." : stats.totalUsers}
              </div>
              <p className="text-xs text-muted-foreground">Người dùng đã đăng ký</p>
              <Link href="/admin/users" className="text-xs text-blue-600 hover:underline mt-1 block">
                Xem chi tiết →
              </Link>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setShowRevenueChart(!showRevenueChart)}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tổng doanh thu</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalRevenue.toLocaleString("vi-VN")}₫</div>
              <p className="text-xs text-muted-foreground">
                Từ {stats.deliveredOrdersCount} đơn hàng đã giao
              </p>
              <Button 
                variant="link" 
                className="text-xs text-blue-600 hover:underline mt-1 p-0 h-auto"
                onClick={(e) => {
                  e.stopPropagation()
                  setShowRevenueChart(!showRevenueChart)
                }}
              >
                <BarChart3 className="w-3 h-3 mr-1" />
                {showRevenueChart ? 'Ẩn biểu đồ' : 'Xem biểu đồ'}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Revenue Chart */}
        {showRevenueChart && (
          <div className="mb-8">
            <RevenueChart data={revenueChartData} />
          </div>
        )}

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
                      <p className="font-medium">Đơn hàng #{order.id.slice(0, 8)}</p>
                      <p className="text-sm text-muted-foreground">
                        {order.items?.length || 0} sản phẩm • {order.shipping_address?.fullName || 'N/A'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(order.created_at).toLocaleDateString("vi-VN")}
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
