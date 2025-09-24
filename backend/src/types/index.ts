export interface User {
  id: number;
  email: string;
  password: string;
  name: string;
  phone?: string;
  address?: string;
  role: 'customer' | 'admin';
  created_at: Date;
  updated_at: Date;
}

export interface CreateUserRequest {
  email: string;
  password: string;
  name: string;
  phone?: string;
  address?: string;
}

export interface UpdateUserRequest {
  name?: string;
  phone?: string;
  address?: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  original_price?: number;
  image: string;
  images: string[];
  category: string;
  in_stock: boolean;
  stock_quantity: number;
  rating: number;
  review_count: number;
  tags: string[];
  origin: string;
  weight?: string;
  ingredients?: string[];
  created_at: Date;
  updated_at: Date;
}

export interface CreateProductRequest {
  name: string;
  description: string;
  price: number;
  original_price?: number;
  image: string;
  images?: string[];
  category: string;
  stock_quantity: number;
  tags?: string[];
  origin: string;
  weight?: string;
  ingredients?: string[];
}

export interface UpdateProductRequest {
  name?: string;
  description?: string;
  price?: number;
  original_price?: number;
  image?: string;
  images?: string[];
  category?: string;
  stock_quantity?: number;
  tags?: string[];
  origin?: string;
  weight?: string;
  ingredients?: string[];
}

export interface CartItem {
  id: number;
  user_id: number;
  product_id: number;
  quantity: number;
  created_at: Date;
  updated_at: Date;
  product?: Product;
}

export interface Order {
  id: number;
  user_id: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shipping_address: ShippingAddress;
  payment_method: 'cod' | 'bank_transfer';
  created_at: Date;
  updated_at: Date;
  items?: OrderItem[];
  user?: User;
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price: number;
  created_at: Date;
  product?: Product;
}

export interface ShippingAddress {
  name: string;
  phone: string;
  address: string;
  city: string;
  district: string;
  ward: string;
}

export interface CreateOrderRequest {
  items: Array<{
    product_id: number;
    quantity: number;
  }>;
  shipping_address: ShippingAddress;
  payment_method: 'cod' | 'bank_transfer';
}

export interface AuthResponse {
  user: Omit<User, 'password'>;
  token: string;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface ProductQuery extends PaginationQuery {
  category?: string;
  search?: string;
  min_price?: number;
  max_price?: number;
  in_stock?: boolean;
}

export interface OrderQuery extends PaginationQuery {
  status?: Order['status'];
  user_id?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}