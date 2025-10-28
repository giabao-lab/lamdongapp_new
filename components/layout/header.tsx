"use client"

import Link from "next/link"
import { Search, ShoppingCart, User, Menu, X, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState, useEffect, useRef } from "react"
import { useAuth } from "@/lib/auth-context"
import { useCart } from "@/lib/cart-context"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const { state, logout } = useAuth()
  const { state: cartState } = useCart()
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false)
      }
    }

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }
  }, [isMenuOpen])

  const navigation = [
    { name: "Trang chủ", href: "/" },
    { name: "Sản phẩm", href: "/products" },
    { name: "Về chúng tôi", href: "/about" },
    { name: "Liên hệ", href: "/contact" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 shrink-0">
            <div className="h-8 w-8 rounded-full bg-primary"></div>
            <span className="font-serif text-xl sm:text-2xl font-semibold text-primary whitespace-nowrap tracking-tight">
              Đặc Sản Lâm Đồng
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Search Bar */}
          <div className="hidden lg:flex items-center space-x-4 flex-1 max-w-md mx-4 xl:mx-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Tìm kiếm sản phẩm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2 sm:space-x-4 shrink-0">
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {cartState.itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-xs text-primary-foreground flex items-center justify-center">
                    {cartState.itemCount}
                  </span>
                )}
              </Button>
            </Link>

            {state.isAuthenticated ? (
              <div className="user-dropdown" ref={dropdownRef}>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="relative"
                >
                  <User className="h-5 w-5" />
                </Button>
                
                {/* Simple dropdown menu */}
                {isMenuOpen && (
                  <div className="dropdown-content">
                    <div className="dropdown-item">
                      <strong>{state.user?.name || "Tài khoản"}</strong><br />
                      <small className="text-gray-500">{state.user?.email}</small>
                    </div>
                    
                    <Link 
                      href="/profile" 
                      className="dropdown-item"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Hồ sơ cá nhân
                    </Link>
                    <Link 
                      href="/orders" 
                      className="dropdown-item"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Đơn hàng của tôi
                    </Link>
                    {state.user?.role === "admin" && (
                      <Link 
                        href="/admin" 
                        className="dropdown-item"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Quản trị
                      </Link>
                    )}
                    <button 
                      onClick={() => {
                        logout()
                        setIsMenuOpen(false)
                      }}
                      className="dropdown-item logout w-full text-left"
                    >
                      <LogOut className="mr-2 h-4 w-4 inline" />
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/auth/login">
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            )}

            {/* Mobile menu button */}
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t py-4">
            <div className="flex flex-col space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Tìm kiếm sản phẩm..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              {!state.isAuthenticated && (
                <div className="flex flex-col space-y-2 pt-4 border-t">
                  <Link
                    href="/auth/login"
                    className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Đăng nhập
                  </Link>
                  <Link
                    href="/auth/register"
                    className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Đăng ký
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
