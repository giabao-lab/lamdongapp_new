"use client"

import { useState } from "react"
import { products } from "@/lib/mock-data"
import type { Product } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Plus, Search, Edit, Trash2 } from "lucide-react"
import Image from "next/image"

export default function AdminProducts() {
  const [searchTerm, setSearchTerm] = useState("")
  const [productList, setProductList] = useState<Product[]>(products)

  const filteredProducts = productList.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleDeleteProduct = (id: string) => {
    setProductList((prev) => prev.filter((p) => p.id !== id))
  }

  return (
    <ProtectedRoute adminOnly>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-primary mb-2">Product Management</h1>
            <p className="text-muted-foreground">Manage your Lâm Đồng specialties</p>
          </div>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden">
              <div className="relative h-48">
                <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
              </div>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{product.name}</CardTitle>
                  <Badge variant="secondary">{product.category}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{product.description}</p>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-bold text-primary">{product.price.toLocaleString("vi-VN")}₫</span>
                  <Badge variant={product.inStock ? "default" : "destructive"}>
                    {product.inStock ? "In Stock" : "Out of Stock"}
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDeleteProduct(product.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No products found</p>
          </div>
        )}
      </div>
    </ProtectedRoute>
  )
}
