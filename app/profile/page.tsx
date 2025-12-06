"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { ordersService } from "@/lib/orders-service"
import type { Order } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Loading } from "@/components/ui/loading"
import { User, Package, MapPin, Phone, Mail, Edit } from "lucide-react"

export default function ProfilePage() {
  const { state, updateProfile } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [formData, setFormData] = useState({
    name: state.user?.name || "",
    email: state.user?.email || "",
    phone: state.user?.phone || "",
    address: state.user?.address || "",
  })
  
  // Orders state
  const [userOrders, setUserOrders] = useState<Order[]>([])
  const [ordersLoading, setOrdersLoading] = useState(true)
  const [ordersError, setOrdersError] = useState<string | null>(null)

  // Sync formData with user data when user changes
  useEffect(() => {
    if (state.user) {
      setFormData({
        name: state.user.name || "",
        email: state.user.email || "",
        phone: state.user.phone || "",
        address: state.user.address || "",
      })
    }
  }, [state.user])
  
  // Fetch user orders
  useEffect(() => {
    const fetchOrders = async () => {
      if (!state.user?.id) {
        console.log('No user ID found')
        setOrdersLoading(false)
        return
      }
      
      try {
        console.log('Fetching orders for user:', state.user.id)
        setOrdersLoading(true)
        setOrdersError(null)
        const response = await ordersService.getUserOrders(state.user.id)
        console.log('Orders response:', response)
        console.log('Orders data:', response.orders)
        console.log('Orders count:', response.orders?.length || 0)
        setUserOrders(response.orders || [])
      } catch (error) {
        console.error('Failed to fetch orders:', error)
        setOrdersError('Không thể tải lịch sử đơn hàng')
        setUserOrders([])
      } finally {
        setOrdersLoading(false)
      }
    }
    
    fetchOrders()
  }, [state.user?.id])

  const handleSave = async () => {
    setIsLoading(true)
    setMessage(null)
    
    try {
      const result = await updateProfile({
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
      })
      
      if (result.success) {
        setMessage({ type: 'success', text: 'Cập nhật thông tin thành công!' })
        setIsEditing(false)
      } else {
        setMessage({ type: 'error', text: result.error || 'Cập nhật thất bại' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Có lỗi xảy ra khi cập nhật' })
    } finally {
      setIsLoading(false)
    }
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
        return "Đã gửi hàng"
      case "delivered":
        return "Đã giao hàng"
      case "cancelled":
        return "Đã hủy"
      default:
        return status
    }
  }

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Hồ sơ cá nhân</h1>
          <p className="text-muted-foreground">Quản lý tài khoản và xem lịch sử đơn hàng</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="profile">Thông tin cá nhân</TabsTrigger>
            <TabsTrigger value="orders">Lịch sử đơn hàng</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Thông tin cá nhân
                  </CardTitle>
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
                    <Edit className="w-4 h-4 mr-2" />
                    {isEditing ? "Hủy" : "Chỉnh sửa"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {message && (
                  <div className={`p-3 rounded border ${
                    message.type === 'success' 
                      ? 'bg-green-50 border-green-200 text-green-800' 
                      : 'bg-red-50 border-red-200 text-red-800'
                  }`}>
                    {message.text}
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Họ và tên</Label>
                    {isEditing ? (
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    ) : (
                      <div className="flex items-center gap-2 p-2 border rounded">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <span>{state.user?.name}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Địa chỉ email</Label>
                    {isEditing ? (
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    ) : (
                      <div className="flex items-center gap-2 p-2 border rounded">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <span>{state.user?.email}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Số điện thoại</Label>
                    {isEditing ? (
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="Nhập số điện thoại"
                      />
                    ) : (
                      <div className="flex items-center gap-2 p-2 border rounded">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <span>{state.user?.phone || "Chưa cung cấp"}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Địa chỉ</Label>
                    {isEditing ? (
                      <Input
                        id="address"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        placeholder="Nhập địa chỉ"
                      />
                    ) : (
                      <div className="flex items-center gap-2 p-2 border rounded">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span>{state.user?.address || "Chưa cung cấp"}</span>
                      </div>
                    )}
                  </div>
                </div>

                {isEditing && (
                  <div className="flex gap-2 pt-4">
                    <Button onClick={handleSave} disabled={isLoading}>
                      {isLoading ? "Đang lưu..." : "Lưu thay đổi"}
                    </Button>
                    <Button variant="outline" onClick={() => setIsEditing(false)} disabled={isLoading}>
                      Hủy
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Lịch sử đơn hàng ({userOrders.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {ordersLoading ? (
                  <div className="flex justify-center py-8">
                    <Loading size="lg" />
                  </div>
                ) : ordersError ? (
                  <div className="text-center py-8">
                    <Package className="w-12 h-12 text-red-400 mx-auto mb-4" />
                    <p className="text-red-600 mb-2">{ordersError}</p>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setOrdersError(null)
                        if (state.user?.id) {
                          ordersService.getUserOrders(state.user.id)
                            .then(res => setUserOrders(res.orders))
                            .catch(() => setOrdersError('Không thể tải lịch sử đơn hàng'))
                        }
                      }}
                    >
                      Thử lại
                    </Button>
                  </div>
                ) : userOrders.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Chưa có đơn hàng nào</p>
                    <p className="text-sm text-muted-foreground">Bắt đầu mua sắm để xem đơn hàng tại đây</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userOrders.map((order) => (
                      <div key={order.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-medium">Đơn hàng #{order.id}</h4>
                            <p className="text-sm text-muted-foreground">
                              {new Date(order.created_at).toLocaleDateString("vi-VN", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </p>
                          </div>
                          <Badge variant={getStatusColor(order.status)}>{getStatusText(order.status)}</Badge>
                        </div>

                        <div className="space-y-2 mb-3">
                          {order.items && order.items.length > 0 ? (
                            order.items.map((item, index) => (
                              <div key={index} className="flex justify-between text-sm">
                                <span>
                                  {item.product?.name || 'Sản phẩm'} x {item.quantity}
                                </span>
                                <span>{(item.price * item.quantity).toLocaleString("vi-VN")}₫</span>
                              </div>
                            ))
                          ) : (
                            <p className="text-sm text-muted-foreground">Không có thông tin sản phẩm</p>
                          )}
                        </div>

                        <div className="flex justify-between items-center pt-3 border-t">
                          <span className="font-medium">Tổng cộng: {order.total.toLocaleString("vi-VN")}₫</span>
                          <Button variant="outline" size="sm">
                            Xem chi tiết
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedRoute>
  )
}
