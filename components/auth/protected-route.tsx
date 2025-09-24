"use client"

import type React from "react"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Loader2 } from "lucide-react"

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAdmin?: boolean
}

export function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { state } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!state.isLoading) {
      if (!state.isAuthenticated) {
        router.push("/auth/login")
        return
      }

      if (requireAdmin && state.user?.role !== "admin") {
        router.push("/")
        return
      }
    }
  }, [state.isLoading, state.isAuthenticated, state.user, requireAdmin, router])

  if (state.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!state.isAuthenticated) {
    return null
  }

  if (requireAdmin && state.user?.role !== "admin") {
    return null
  }

  return <>{children}</>
}
