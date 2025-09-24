"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { MainLayout } from "@/components/layout/main-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useCart } from "@/lib/cart-context"
import { useAuth } from "@/lib/auth-context"
import { Loader2 } from "lucide-react"

export default function CheckoutPage() {
  const { state: cartState, clearCart } = useCart()
  const { state: authState } = useAuth()
  const router = useRouter()

  const [formData, setFormData] = useState({
    name: authState.user?.name || "",
    email: authState.user?.email || "",
    phone: authState.user?.phone || "",
    address: authState.user?.address || "",
    city: "",
    district: "",
    ward: "",
    paymentMethod: "cod",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)

    // Validate required fields
    const requiredFields = ["name", "email", "phone", "address", "city", "district", "ward"]
    const missingFields = requiredFields.filter((field) => !formData[field as keyof typeof formData])

    if (missingFields.length > 0) {
      setError("Vui lòng điền đầy đủ thông tin giao hàng")
      setIsSubmitting(false)
      return
    }

    // Simulate order processing
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Create mock order
    const order = {
      id: `ORDER_${Date.now()}`,
      userId: authState.user?.id || "guest",
      items: cartState.items,
      total: cartState.total,
      status: "pending" as const,
      shippingAddress: {
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        district: formData.district,
        ward: formData.ward,
      },
      paymentMethod: formData.paymentMethod as "cod" | "bank_transfer",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    // Save order to localStorage (in real app, this would be sent to API)
    const existingOrders = JSON.parse(localStorage.getItem("user_orders") || "[]")
    existingOrders.push(order)
    localStorage.setItem("user_orders", JSON.stringify(existingOrders))

    // Clear cart
    clearCart()

    // Redirect to success page
    router.push(`/checkout/success?orderId=${order.id}`)
  }

  if (cartState.items.length === 0) {
    router.push("/cart")
    return null
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold mb-2">Thanh toán</h1>
          <p className="text-muted-foreground">Hoàn tất đơn hàng của bạn</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Thông tin giao hàng</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Họ và tên *</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Nguyễn Văn A"
                        disabled={isSubmitting}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Số điện thoại *</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="0123456789"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="your@email.com"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Địa chỉ *</Label>
                    <Input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="123 Đường ABC"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="grid sm:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">Tỉnh/Thành phố *</Label>
                      <Input
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="TP. Hồ Chí Minh"
                        disabled={isSubmitting}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="district">Quận/Huyện *</Label>
                      <Input
                        id="district"
                        name="district"
                        value={formData.district}
                        onChange={handleInputChange}
                        placeholder="Quận 1"
                        disabled={isSubmitting}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ward">Phường/Xã *</Label>
                      <Input
                        id="ward"
                        name="ward"
                        value={formData.ward}
                        onChange={handleInputChange}
                        placeholder="Phường Bến Nghé"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Phương thức thanh toán</CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={formData.paymentMethod}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, paymentMethod: value }))}
                    disabled={isSubmitting}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="cod" id="cod" />
                      <Label htmlFor="cod">Thanh toán khi nhận hàng (COD)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="bank_transfer" id="bank_transfer" />
                      <Label htmlFor="bank_transfer">Chuyển khoản ngân hàng</Label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Đơn hàng của bạn</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {cartState.items.map((item) => (
                      <div key={item.productId} className="flex justify-between items-center">
                        <div className="flex-1">
                          <h4 className="font-medium line-clamp-1">{item.product.name}</h4>
                          <p className="text-sm text-muted-foreground">Số lượng: {item.quantity}</p>
                        </div>
                        <div className="font-medium">
                          {(item.product.price * item.quantity).toLocaleString("vi-VN")}đ
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Tạm tính:</span>
                      <span>{cartState.total.toLocaleString("vi-VN")}đ</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Phí vận chuyển:</span>
                      <span className="text-green-600">Miễn phí</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold text-lg">
                      <span>Tổng cộng:</span>
                      <span className="text-primary">{cartState.total.toLocaleString("vi-VN")}đ</span>
                    </div>
                  </div>

                  <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Đang xử lý...
                      </>
                    ) : (
                      "Đặt hàng"
                    )}
                  </Button>

                  <div className="text-center text-sm text-muted-foreground">
                    <p>Bằng cách đặt hàng, bạn đồng ý với điều khoản sử dụng của chúng tôi.</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </MainLayout>
  )
}
