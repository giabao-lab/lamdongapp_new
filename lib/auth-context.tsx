"use client"

import { createContext, useContext, useReducer, useEffect, type ReactNode } from "react"
import type { User, AuthState } from "./types"

interface AuthAction {
  type: "LOGIN" | "LOGOUT" | "SET_LOADING" | "SET_USER"
  payload?: any
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
}

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload }
    case "LOGIN":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
      }
    case "LOGOUT":
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
      }
    case "SET_USER":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
        isLoading: false,
      }
    default:
      return state
  }
}

const AuthContext = createContext<{
  state: AuthState
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>
  updateProfile: (userData: { name?: string; phone?: string; address?: string }) => Promise<{ success: boolean; error?: string }>
  logout: () => void
} | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState)

  useEffect(() => {
    // Check for existing session on mount
    const checkAuth = async () => {
      const token = localStorage.getItem("auth_token")
      const userData = localStorage.getItem("user_data")

      if (token && userData) {
        try {
          const user = JSON.parse(userData)
          console.log('Restoring user session:', user)
          dispatch({ type: "SET_USER", payload: user })
        } catch (error) {
          console.error('Error restoring session:', error)
          localStorage.removeItem("auth_token")
          localStorage.removeItem("user_data")
          dispatch({ type: "SET_LOADING", payload: false })
        }
      } else {
        dispatch({ type: "SET_LOADING", payload: false })
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    dispatch({ type: "SET_LOADING", payload: true })

    try {
      // Call real API
      const response = await fetch('http://localhost:5000/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        const { user, token } = data.data
        localStorage.setItem("auth_token", token)
        localStorage.setItem("user_data", JSON.stringify(user))
        dispatch({ type: "LOGIN", payload: user })
        return { success: true }
      } else {
        dispatch({ type: "SET_LOADING", payload: false })
        return { success: false, error: data.message || "Đăng nhập thất bại" }
      }
    } catch (error) {
      dispatch({ type: "SET_LOADING", payload: false })
      return { success: false, error: "Lỗi kết nối đến server" }
    }
  }

  const register = async (email: string, password: string, name: string) => {
    dispatch({ type: "SET_LOADING", payload: true })

    try {
      // Call real API
      const response = await fetch('http://localhost:5000/api/v1/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        const { user, token } = data.data
        localStorage.setItem("auth_token", token)
        localStorage.setItem("user_data", JSON.stringify(user))
        dispatch({ type: "LOGIN", payload: user })
        return { success: true }
      } else {
        dispatch({ type: "SET_LOADING", payload: false })
        return { success: false, error: data.message || "Đăng ký thất bại" }
      }
    } catch (error) {
      dispatch({ type: "SET_LOADING", payload: false })
      return { success: false, error: "Lỗi kết nối đến server" }
    }
  }

  const logout = () => {
    localStorage.removeItem("auth_token")
    localStorage.removeItem("user_data")
    dispatch({ type: "LOGOUT" })
  }

  const updateProfile = async (userData: { name?: string; phone?: string; address?: string }) => {
    try {
      const token = localStorage.getItem("auth_token")
      if (!token) {
        return { success: false, error: "Chưa đăng nhập" }
      }

      const response = await fetch('http://localhost:5000/api/v1/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        const updatedUser = data.data
        localStorage.setItem("user_data", JSON.stringify(updatedUser))
        dispatch({ type: "SET_USER", payload: updatedUser })
        return { success: true }
      } else {
        return { success: false, error: data.message || "Cập nhật thất bại" }
      }
    } catch (error) {
      return { success: false, error: "Lỗi kết nối đến server" }
    }
  }

  return <AuthContext.Provider value={{ state, login, register, logout, updateProfile }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
