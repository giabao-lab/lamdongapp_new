export interface Product {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  image: string
  images: string[]
  category: string
  inStock: boolean
  rating: number
  reviewCount: number
  tags: string[]
  origin: string
  weight?: string
  ingredients?: string[]
}

export interface User {
  id: string
  email: string
  name: string
  phone?: string
  address?: string
  role: "customer" | "admin"
  createdAt: string
}

export interface CartItem {
  productId: string
  quantity: number
  product: Product
}

export interface Order {
  id: string
  userId: string
  items: CartItem[]
  total: number
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  shippingAddress: {
    name: string
    phone: string
    address: string
    city: string
    district: string
    ward: string
  }
  paymentMethod: "cod" | "bank_transfer"
  createdAt: string
  updatedAt: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}
