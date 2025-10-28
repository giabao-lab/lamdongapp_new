import { apiClient } from "./api-client"

export interface AdminStats {
  totalUsers: number
  newUsersThisWeek: number
  newUsersThisMonth: number
}

export interface UserData {
  id: number
  email: string
  name: string
  phone: string | null
  address: string | null
  role: string
  created_at: string
  updated_at: string
  total_orders: number
}

export interface UsersResponse {
  users: UserData[]
  total: number
  stats: AdminStats
}

class AdminService {
  async getUsers(): Promise<UsersResponse> {
    const response = await apiClient.get<UsersResponse>("/auth/users")
    if (!response.data) {
      throw new Error("No data returned from API")
    }
    return response.data
  }

  async getUserStats(): Promise<AdminStats> {
    const response = await apiClient.get<UsersResponse>("/auth/users")
    if (!response.data) {
      throw new Error("No data returned from API")
    }
    return response.data.stats
  }

  async deleteUser(userId: number): Promise<void> {
    await apiClient.delete(`/auth/users/${userId}`)
  }
}

export const adminService = new AdminService()
