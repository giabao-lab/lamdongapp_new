"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { User, Package, MapPin, Phone, Mail, Edit } from "lucide-react"

const mockOrders = [
  {
    id: "ORD-001",
    customerInfo: { email: "admin@example.com" },
    status: "delivered",
    createdAt: "2024-01-15T10:30:00Z",
    total: 450000,
    items: [
      { name: "Cà phê Arabica Đà Lạt", quantity: 2, price: 180000 },
      { name: "Trà atiso Đà Lạt", quantity: 1, price: 90000 },
    ],
  },
  {
    id: "ORD-002",
    customerInfo: { email: "admin@example.com" },
    status: "processing",
    createdAt: "2024-01-20T14:15:00Z",
    total: 320000,
    items: [{ name: "Rượu vang Đà Lạt", quantity: 1, price: 320000 }],
  },
  {
    id: "ORD-003",
    customerInfo: { email: "customer@example.com" },
    status: "shipped",
    createdAt: "2024-01-18T09:45:00Z",
    total: 280000,
    items: [{ name: "Dâu tây Đà Lạt", quantity: 2, price: 140000 }],
  },
]

export default function ProfilePage() {
  const { user, updateUser } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
  })

  const handleSave = () => {
    if (user) {
      updateUser({ ...user, ...formData })
      setIsEditing(false)
    }
  }

  const userOrders = mockOrders?.filter((order) => order.customerInfo.email === user?.email) || []

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
                        <span>{user?.name}</span>
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
                        <span>{user?.email}</span>
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
                        <span>{user?.phone || "Chưa cung cấp"}</span>
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
                        <span>{user?.address || "Chưa cung cấp"}</span>
                      </div>
                    )}
                  </div>
                </div>

                {isEditing && (
                  <div className="flex gap-2 pt-4">
                    <Button onClick={handleSave}>Lưu thay đổi</Button>
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
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
                {userOrders.length === 0 ? (
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
                              {new Date(order.createdAt).toLocaleDateString("vi-VN", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </p>
                          </div>
                          <Badge variant={getStatusColor(order.status)}>{getStatusText(order.status)}</Badge>
                        </div>

                        <div className="space-y-2 mb-3">
                          {order.items.map((item, index) => (
                            <div key={index} className="flex justify-between text-sm">
                              <span>
                                {item.name} x {item.quantity}
                              </span>
                              <span>{(item.price * item.quantity).toLocaleString("vi-VN")}₫</span>
                            </div>
                          ))}
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
