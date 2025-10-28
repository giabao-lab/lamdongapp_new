import { apiClient } from './api-client';
import { Order, OrderItem } from './types';

export interface CreateOrderRequest {
  user_id: string;
  items: {
    product_id: string;
    quantity: number;
    price: number;
  }[];
  shipping_address: {
    fullName: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    district: string;
    ward: string;
  };
  payment_method: 'cod' | 'bank_transfer';
  notes?: string;
}

export interface OrderQuery {
  page?: number;
  limit?: number;
  status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
}

export interface OrdersResponse {
  orders: Order[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

class OrdersService {
  // Create new order
  async createOrder(orderData: CreateOrderRequest): Promise<Order> {
    try {
      const response = await apiClient.post<Order>('/orders', orderData);
      if (!response.data) {
        throw new Error('Failed to create order');
      }
      return response.data;
    } catch (error) {
      console.error('Failed to create order:', error);
      throw error;
    }
  }

  // Get orders for current user
  async getUserOrders(userId: string, query: OrderQuery = {}): Promise<OrdersResponse> {
    const searchParams = new URLSearchParams();
    
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, value.toString());
      }
    });

    const queryString = searchParams.toString();
    const endpoint = queryString 
      ? `/orders/user/${userId}?${queryString}` 
      : `/orders/user/${userId}`;
    
    try {
      const response = await apiClient.get<Order[]>(endpoint);
      return {
        orders: response.data || [],
        pagination: response.pagination || {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0
        }
      };
    } catch (error) {
      console.error('Failed to fetch user orders:', error);
      throw error;
    }
  }

  // Get single order by ID
  async getOrderById(orderId: string): Promise<Order> {
    try {
      const response = await apiClient.get<Order>(`/orders/${orderId}`);
      if (!response.data) {
        throw new Error('Order not found');
      }
      return response.data;
    } catch (error) {
      console.error('Failed to fetch order:', error);
      throw error;
    }
  }

  // Get all orders (Admin only)
  async getAllOrders(query: OrderQuery = {}): Promise<OrdersResponse> {
    const searchParams = new URLSearchParams();
    
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, value.toString());
      }
    });

    const queryString = searchParams.toString();
    const endpoint = queryString ? `/orders?${queryString}` : '/orders';
    
    try {
      const response = await apiClient.get<Order[]>(endpoint);
      return {
        orders: response.data || [],
        pagination: response.pagination || {
          page: 1,
          limit: 20,
          total: 0,
          totalPages: 0
        }
      };
    } catch (error) {
      console.error('Failed to fetch all orders:', error);
      throw error;
    }
  }

  // Update order status (Admin only)
  async updateOrderStatus(orderId: string, status: string): Promise<Order> {
    try {
      const response = await apiClient.put<Order>(`/orders/${orderId}/status`, { status });
      if (!response.data) {
        throw new Error('Failed to update order status');
      }
      return response.data;
    } catch (error) {
      console.error('Failed to update order status:', error);
      throw error;
    }
  }

  // Cancel order (User can cancel their own pending orders)
  async cancelOrder(orderId: string): Promise<Order> {
    try {
      const response = await apiClient.put<Order>(`/orders/${orderId}/cancel`, {});
      if (!response.data) {
        throw new Error('Failed to cancel order');
      }
      return response.data;
    } catch (error) {
      console.error('Failed to cancel order:', error);
      throw error;
    }
  }

  // Helper method to get order status display text
  getOrderStatusText(status: string): string {
    switch (status) {
      case 'pending':
        return 'Chờ xử lý';
      case 'processing':
        return 'Đang xử lý';
      case 'shipped':
        return 'Đã giao vận';
      case 'delivered':
        return 'Đã giao hàng';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return 'Không xác định';
    }
  }

  // Helper method to get order status color
  getOrderStatusColor(status: string): string {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  // Helper method to format order total
  formatOrderTotal(total: number): string {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(total);
  }
}

export const ordersService = new OrdersService();