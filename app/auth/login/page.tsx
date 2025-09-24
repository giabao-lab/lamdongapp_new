"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { MainLayout } from "@/components/layout/main-layout"
import { useAuth } from "@/lib/auth-context"
import { Eye, EyeOff, Loader2 } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const { login, state } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email || !password) {
      setError("Vui lòng nhập đầy đủ thông tin")
      return
    }

    const result = await login(email, password)
    if (result.success) {
      router.push("/")
    } else {
      setError(result.error || "Đăng nhập thất bại")
    }
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-serif">Đăng nhập</CardTitle>
              <CardDescription>Đăng nhập vào tài khoản của bạn để tiếp tục mua sắm</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    disabled={state.isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Mật khẩu</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      disabled={state.isLoading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={state.isLoading}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={state.isLoading}>
                  {state.isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Đang đăng nhập...
                    </>
                  ) : (
                    "Đăng nhập"
                  )}
                </Button>

                <div className="text-center text-sm">
                  <span className="text-muted-foreground">Chưa có tài khoản? </span>
                  <Link href="/auth/register" className="text-primary hover:underline">
                    Đăng ký ngay
                  </Link>
                </div>
              </form>

              <div className="mt-6 p-4 bg-muted rounded-lg">
                <p className="text-sm font-medium mb-2">Tài khoản demo:</p>
                <div className="text-xs space-y-1">
                  <p>
                    <strong>Admin:</strong> admin@dacsanlamdong.vn / admin123
                  </p>
                  <p>
                    <strong>Khách hàng:</strong> user@example.com / user123
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  )
}
