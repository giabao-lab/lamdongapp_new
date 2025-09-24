"use client"

import { createContext, useContext, useReducer, useEffect, type ReactNode } from "react"
import type { User, AuthState } from "./types"
import { mockUser, mockAdmin } from "./mock-data"

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
  logout: () => void
} | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState)

  useEffect(() => {
    // Check for existing session on mount
    const checkAuth = () => {
      const token = localStorage.getItem("auth_token")
      const userData = localStorage.getItem("user_data")

      if (token && userData) {
        try {
          const user = JSON.parse(userData)
          dispatch({ type: "SET_USER", payload: user })
        } catch (error) {
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

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock authentication logic
    let user: User | null = null

    if (email === "admin@dacsanlamdong.vn" && password === "admin123") {
      user = mockAdmin
    } else if (email === "user@example.com" && password === "user123") {
      user = mockUser
    }

    if (user) {
      const token = `mock_token_${user.id}_${Date.now()}`
      localStorage.setItem("auth_token", token)
      localStorage.setItem("user_data", JSON.stringify(user))
      dispatch({ type: "LOGIN", payload: user })
      return { success: true }
    } else {
      dispatch({ type: "SET_LOADING", payload: false })
      return { success: false, error: "Email hoặc mật khẩu không đúng" }
    }
  }

  const register = async (email: string, password: string, name: string) => {
    dispatch({ type: "SET_LOADING", payload: true })

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock registration logic
    const newUser: User = {
      id: `user_${Date.now()}`,
      email,
      name,
      role: "customer",
      createdAt: new Date().toISOString(),
    }

    const token = `mock_token_${newUser.id}_${Date.now()}`
    localStorage.setItem("auth_token", token)
    localStorage.setItem("user_data", JSON.stringify(newUser))
    dispatch({ type: "LOGIN", payload: newUser })

    return { success: true }
  }

  const logout = () => {
    localStorage.removeItem("auth_token")
    localStorage.removeItem("user_data")
    dispatch({ type: "LOGOUT" })
  }

  return <AuthContext.Provider value={{ state, login, register, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
