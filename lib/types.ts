// Updated types to match backend API
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  original_price?: number; // Changed from originalPrice to match backend
  image: string; // Backend uses image not image_url
  images?: string[]; // Array of image URLs
  category: string;
  in_stock: boolean; // Changed from inStock to match backend  
  stock_quantity: number; // Changed from stockQuantity to match backend
  is_featured?: boolean; // Added backend field
  rating?: number; // Made optional as backend doesn't have this
  review_count?: number; // Made optional as backend doesn't have this
  tags?: string[];
  origin?: string;
  weight?: string;
  ingredients?: string[];
  created_at?: string; // Added backend fields
  updated_at?: string; // Added backend fields
}

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  address?: string;
  role: "customer" | "admin";
  created_at?: string; // Added backend fields
  updated_at?: string; // Added backend fields
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface CartItem {
  id?: string; // Added for backend compatibility
  user_id?: string; // Added for backend compatibility
  product_id: string; // Changed from productId to match backend
  quantity: number;
  product: Product;
  created_at?: string; // Added backend fields
  updated_at?: string; // Added backend fields
}

export interface Order {
  id: string;
  user_id: string; // Changed from userId to match backend
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  shipping_address: any; // Backend uses JSONB
  payment_method: "cod" | "bank_transfer"; // Changed from paymentMethod to match backend
  items: OrderItem[];
  created_at: string; // Changed from createdAt to match backend
  updated_at?: string; // Added backend fields
}

export interface OrderItem {
  id: string;
  order_id: string; // Changed from orderId to match backend
  product_id: string; // Changed from productId to match backend
  quantity: number;
  price: number; // Price at time of order
  product?: Product; // Optional populated product
  created_at?: string; // Added backend fields
}

// Keep existing interfaces for frontend compatibility
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
}

export interface Review {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  comment?: string;
  created_at: string;
  updated_at?: string;
  user?: User;
}
