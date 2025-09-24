"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search } from "lucide-react"

const categories = [
  { id: "all", name: "Tất cả" },
  { id: "coffee", name: "Cà phê" },
  { id: "tea", name: "Trà atisô" },
  { id: "wine", name: "Rượu vang" },
  { id: "fruits", name: "Trái cây" },
  { id: "preserves", name: "Mứt & Bánh kẹo" },
]

const sortOptions = [
  { id: "name", name: "Tên A-Z" },
  { id: "price-low", name: "Giá thấp đến cao" },
  { id: "price-high", name: "Giá cao đến thấp" },
  { id: "rating", name: "Đánh giá cao nhất" },
]

interface ProductFiltersProps {
  selectedCategory: string
  onCategoryChange: (category: string) => void
  sortBy: string
  onSortChange: (sort: string) => void
  searchQuery: string
  onSearchChange: (query: string) => void
}

export function ProductFilters({
  selectedCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
  searchQuery,
  onSearchChange,
}: ProductFiltersProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Tìm kiếm</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Tìm kiếm sản phẩm..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Danh mục</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {categories.map((category) => (
              <Label key={category.id} className="flex items-center space-x-2 cursor-pointer hover:text-primary">
                <input
                  type="radio"
                  name="category"
                  value={category.id}
                  checked={selectedCategory === category.id}
                  onChange={(e) => onCategoryChange(e.target.value)}
                  className="text-primary"
                />
                <span>{category.name}</span>
              </Label>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Sắp xếp</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={sortBy} onValueChange={onSortChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.id} value={option.id}>
                  {option.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>
    </div>
  )
}
