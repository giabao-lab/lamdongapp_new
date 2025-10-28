import { apiClient, ApiResponse } from './api-client';
import { User } from './types';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  phone?: string;
  address?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

class AuthService {
  // Login user
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
      
      if (response.data) {
        // Store token in localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('auth_token', response.data.token);
          localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
      }
      
      throw new Error('Login failed');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  // Register new user
  async register(userData: RegisterData): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/register', userData);
      
      if (response.data) {
        // Store token in localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('auth_token', response.data.token);
          localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
      }
      
      throw new Error('Registration failed');
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  // Get current user profile
  async getProfile(): Promise<User> {
    try {
      const response = await apiClient.get<User>('/auth/profile');
      if (!response.data) {
        throw new Error('Failed to get profile');
      }
      return response.data;
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  }

  // Update user profile
  async updateProfile(userData: Partial<User>): Promise<User> {
    try {
      const response = await apiClient.put<User>('/auth/profile', userData);
      if (!response.data) {
        throw new Error('Failed to update profile');
      }
      
      // Update stored user data
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      
      return response.data;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  }

  // Logout user
  async logout(): Promise<void> {
    try {
      // Call logout endpoint (if exists)
      await apiClient.post('/auth/logout');
    } catch (error) {
      // Even if logout endpoint fails, clear local storage
      console.error('Logout error:', error);
    } finally {
      // Clear localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
      }
    }
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    
    const token = localStorage.getItem('auth_token');
    return !!token;
  }

  // Get stored user data
  getCurrentUser(): User | null {
    if (typeof window === 'undefined') return null;
    
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }

  // Get stored auth token
  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('auth_token');
  }

  // Refresh token (if needed)
  async refreshToken(): Promise<string> {
    try {
      const response = await apiClient.post<{ token: string }>('/auth/refresh');
      if (response.data?.token) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('auth_token', response.data.token);
        }
        return response.data.token;
      }
      throw new Error('Failed to refresh token');
    } catch (error) {
      console.error('Refresh token error:', error);
      this.logout(); // If refresh fails, logout user
      throw error;
    }
  }
}

export const authService = new AuthService();