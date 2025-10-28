import { apiClient, ApiResponse } from './api-client';
import { Product } from './types';

export interface ProductQuery {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  min_price?: number;
  max_price?: number;
  in_stock?: boolean;
  sort?: 'name' | 'price' | 'rating' | 'created_at';
  order?: 'asc' | 'desc';
}

export interface ProductsResponse {
  products: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

class ProductsService {
  // Get all products with filtering and pagination
  async getProducts(query: ProductQuery = {}): Promise<ProductsResponse> {
    const searchParams = new URLSearchParams();
    
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, value.toString());
      }
    });

    const queryString = searchParams.toString();
    const endpoint = queryString ? `/products?${queryString}` : '/products';
    
    try {
      const response = await apiClient.get<Product[]>(endpoint);
      return {
        products: response.data || [],
        pagination: response.pagination || {
          page: 1,
          limit: 20,
          total: 0,
          totalPages: 0
        }
      };
    } catch (error) {
      console.error('Failed to fetch products:', error);
      throw error;
    }
  }

  // Get single product by ID
  async getProductById(id: string): Promise<Product> {
    try {
      const response = await apiClient.get<Product>(`/products/${id}`);
      if (!response.data) {
        throw new Error('Product not found');
      }
      return response.data;
    } catch (error) {
      console.error('Failed to fetch product:', error);
      throw error;
    }
  }

  // Get products by category
  async getProductsByCategory(category: string): Promise<Product[]> {
    try {
      const response = await apiClient.get<Product[]>(`/products/category/${category}`);
      return response.data || [];
    } catch (error) {
      console.error('Failed to fetch products by category:', error);
      throw error;
    }
  }

  // Get featured products
  async getFeaturedProducts(): Promise<Product[]> {
    try {
      const response = await apiClient.get<Product[]>('/products/featured');
      return response.data || [];
    } catch (error) {
      console.error('Failed to fetch featured products:', error);
      throw error;
    }
  }

  // Search products
  async searchProducts(searchTerm: string, filters: Partial<ProductQuery> = {}): Promise<ProductsResponse> {
    const query: ProductQuery = {
      search: searchTerm,
      ...filters
    };
    
    return this.getProducts(query);
  }

  // Create product (Admin only)
  async createProduct(productData: Partial<Product>): Promise<Product> {
    try {
      const response = await apiClient.post<Product>('/products', productData);
      if (!response.data) {
        throw new Error('Failed to create product');
      }
      return response.data;
    } catch (error) {
      console.error('Failed to create product:', error);
      throw error;
    }
  }

  // Update product (Admin only)
  async updateProduct(id: string, productData: Partial<Product>): Promise<Product> {
    try {
      const response = await apiClient.put<Product>(`/products/${id}`, productData);
      if (!response.data) {
        throw new Error('Failed to update product');
      }
      return response.data;
    } catch (error) {
      console.error('Failed to update product:', error);
      throw error;
    }
  }

  // Delete product (Admin only)
  async deleteProduct(id: string): Promise<void> {
    try {
      await apiClient.delete(`/products/${id}`);
    } catch (error) {
      console.error('Failed to delete product:', error);
      throw error;
    }
  }
}

export const productsService = new ProductsService();