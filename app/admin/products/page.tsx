"use client"

import { useState, useEffect } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Plus, Pencil, Trash2, Loader2, Search, Package } from "lucide-react"
import { productsService } from "@/lib/products-service"
import { Product } from "@/lib/types"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { ImageUpload } from "@/components/ui/image-upload"

interface ProductFormData {
  name: string
  description: string
  price: number
  original_price?: number
  image: string
  images: string[]
  category: string
  stock_quantity: number
  origin: string
  weight: string
  tags: string[]
}

const CATEGORIES = [
  { value: "coffee", label: "Cà phê" },
  { value: "tea", label: "Trà Atisô" },
  { value: "wine", label: "Rượu Vang" },
  { value: "fruits", label: "Trái Cây" },
  { value: "preserves", label: "Mứt & Bánh Kẹo" },
]

export default function AdminProductsPage() {
  const { state: authState } = useAuth()
  const router = useRouter()
  
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  
  // Form state
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    description: "",
    price: 0,
    original_price: 0,
    image: "",
    images: [],
    category: "coffee",
    stock_quantity: 0,
    origin: "Đà Lạt, Lâm Đồng",
    weight: "",
    tags: []
  })
  const [formLoading, setFormLoading] = useState(false)
  const [formError, setFormError] = useState("")
  
  // Delete state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState<Product | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  
  // Success message
  const [successMessage, setSuccessMessage] = useState("")

  // Check if user is admin
  useEffect(() => {
    if (!authState.isLoading && (!authState.isAuthenticated || authState.user?.role !== "admin")) {
      router.push("/")
    }
  }, [authState, router])

  // Fetch products
  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await productsService.getProducts({
        page: 1,
        limit: 100,
        category: selectedCategory !== "all" ? selectedCategory : undefined,
        search: searchQuery || undefined
      })
      setProducts(response.products)
    } catch (error) {
      console.error("Failed to fetch products:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [selectedCategory, searchQuery])

  // Handle form
  const openAddForm = () => {
    setEditingProduct(null)
    setFormData({
      name: "",
      description: "",
      price: 0,
      original_price: 0,
      image: "",
      images: [],
      category: "coffee",
      stock_quantity: 0,
      origin: "Đà Lạt, Lâm Đồng",
      weight: "",
      tags: []
    })
    setFormError("")
    setIsFormOpen(true)
  }

  const openEditForm = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      original_price: product.original_price || 0,
      image: product.image,
      images: product.images || [],
      category: product.category,
      stock_quantity: product.stock_quantity,
      origin: product.origin || "Đà Lạt, Lâm Đồng",
      weight: product.weight || "",
      tags: product.tags || []
    })
    setFormError("")
    setIsFormOpen(true)
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError("")
    setFormLoading(true)

    try {
      // Validate
      if (!formData.name || !formData.description || formData.price <= 0) {
        setFormError("Vui lòng điền đầy đủ thông tin sản phẩm")
        setFormLoading(false)
        return
      }

      // Prepare data
      const productData = {
        ...formData,
        in_stock: formData.stock_quantity > 0,
        images: formData.images.length > 0 ? formData.images : [formData.image]
      }

      if (editingProduct) {
        // Update product
        await productsService.updateProduct(editingProduct.id, productData)
        setSuccessMessage("Cập nhật sản phẩm thành công!")
      } else {
        // Create product
        await productsService.createProduct(productData)
        setSuccessMessage("Thêm sản phẩm thành công!")
      }

      setIsFormOpen(false)
      fetchProducts()
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(""), 3000)
    } catch (error: any) {
      setFormError(error.message || "Có lỗi xảy ra")
    } finally {
      setFormLoading(false)
    }
  }

  // Handle delete
  const openDeleteDialog = (product: Product) => {
    setProductToDelete(product)
    setDeleteDialogOpen(true)
  }

  const handleDelete = async () => {
    if (!productToDelete) return

    setDeleteLoading(true)
    try {
      await productsService.deleteProduct(productToDelete.id)
      setSuccessMessage("Xóa sản phẩm thành công!")
      setDeleteDialogOpen(false)
      fetchProducts()
      
      setTimeout(() => setSuccessMessage(""), 3000)
    } catch (error: any) {
      alert(error.message || "Không thể xóa sản phẩm")
    } finally {
      setDeleteLoading(false)
    }
  }

  if (authState.isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-serif font-bold">Quản lý sản phẩm</h1>
            <p className="text-muted-foreground mt-2">Thêm, sửa, xóa sản phẩm đặc sản</p>
          </div>
          <Button onClick={openAddForm} size="lg">
            <Plus className="h-4 w-4 mr-2" />
            Thêm sản phẩm
          </Button>
        </div>

        {/* Success Message */}
        {successMessage && (
          <Alert className="mb-6 bg-green-50 border-green-200">
            <AlertDescription className="text-green-800">{successMessage}</AlertDescription>
          </Alert>
        )}

        {/* Filters */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm sản phẩm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Chọn danh mục" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả danh mục</SelectItem>
              {CATEGORIES.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Products Table */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : products.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Không có sản phẩm nào</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {products.map((product) => (
              <Card key={product.id}>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    {/* Product Image */}
                    <div className="w-24 h-24 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                      <img
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-lg">{product.name}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {product.description}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditForm(product)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openDeleteDialog(product)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Giá: </span>
                          <span className="font-semibold text-primary">
                            {product.price.toLocaleString("vi-VN")}đ
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Tồn kho: </span>
                          <span className="font-semibold">{product.stock_quantity}</span>
                        </div>
                        <Badge variant={product.stock_quantity > 0 ? "default" : "secondary"}>
                          {product.stock_quantity > 0 ? "Còn hàng" : "Hết hàng"}
                        </Badge>
                        <Badge variant="outline">
                          {CATEGORIES.find((c) => c.value === product.category)?.label || product.category}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Add/Edit Product Dialog */}
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingProduct ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
              </DialogTitle>
              <DialogDescription>
                Điền thông tin sản phẩm đặc sản Lâm Đồng
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              {formError && (
                <Alert variant="destructive">
                  <AlertDescription>{formError}</AlertDescription>
                </Alert>
              )}

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Tên sản phẩm *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="VD: Cà phê Arabica Đà Lạt"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Danh mục *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Mô tả *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Mô tả chi tiết về sản phẩm..."
                  rows={3}
                  required
                />
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Giá bán (đ) *</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    placeholder="250000"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="original_price">Giá gốc (đ)</Label>
                  <Input
                    id="original_price"
                    type="number"
                    value={formData.original_price}
                    onChange={(e) => setFormData({ ...formData, original_price: Number(e.target.value) })}
                    placeholder="300000"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stock_quantity">Tồn kho *</Label>
                  <Input
                    id="stock_quantity"
                    type="number"
                    value={formData.stock_quantity}
                    onChange={(e) => setFormData({ ...formData, stock_quantity: Number(e.target.value) })}
                    placeholder="100"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="origin">Xuất xứ</Label>
                  <Input
                    id="origin"
                    value={formData.origin}
                    onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                    placeholder="Đà Lạt, Lâm Đồng"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="weight">Khối lượng</Label>
                  <Input
                    id="weight"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    placeholder="500g"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Hình ảnh sản phẩm *</Label>
                <ImageUpload
                  value={formData.image}
                  onChange={(url) => setFormData({ ...formData, image: url })}
                  disabled={formLoading}
                />
                <p className="text-xs text-muted-foreground">
                  Kéo thả hoặc click để upload. Hỗ trợ: PNG, JPG, GIF (max 10MB)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags (phân cách bằng dấu phẩy)</Label>
                <Input
                  id="tags"
                  value={formData.tags.join(", ")}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value.split(",").map(t => t.trim()) })}
                  placeholder="organic, premium, arabica"
                />
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
                  Hủy
                </Button>
                <Button type="submit" disabled={formLoading}>
                  {formLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Đang lưu...
                    </>
                  ) : editingProduct ? (
                    "Cập nhật"
                  ) : (
                    "Thêm sản phẩm"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Xác nhận xóa sản phẩm</AlertDialogTitle>
              <AlertDialogDescription>
                Bạn có chắc chắn muốn xóa sản phẩm "{productToDelete?.name}"? 
                Hành động này không thể hoàn tác.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Hủy</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                disabled={deleteLoading}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {deleteLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang xóa...
                  </>
                ) : (
                  "Xóa"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </MainLayout>
  )
}
