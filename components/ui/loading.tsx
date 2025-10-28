import React from 'react'

interface LoadingProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function Loading({ className = '', size = 'md' }: LoadingProps) {
  const sizeClasses = {
    sm: 'h-32',
    md: 'h-64', 
    lg: 'h-96'
  }

  return (
    <div className={`${sizeClasses[size]} bg-gradient-to-r from-gray-100 to-gray-200 animate-pulse rounded-lg ${className}`}>
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600"></div>
      </div>
    </div>
  )
}

// Optimized skeleton components for specific use cases
export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-4 animate-pulse">
      <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
      <div className="bg-gray-200 h-4 rounded mb-2"></div>
      <div className="bg-gray-200 h-4 rounded w-3/4 mb-2"></div>
      <div className="bg-gray-200 h-6 rounded w-1/2"></div>
    </div>
  )
}

export function HeroSkeleton() {
  return (
    <div className="bg-gradient-to-r from-gray-100 to-gray-200 h-96 animate-pulse rounded-lg flex items-center justify-center">
      <div className="text-center">
        <div className="bg-gray-300 h-8 w-64 rounded mb-4 mx-auto"></div>
        <div className="bg-gray-300 h-4 w-48 rounded mx-auto"></div>
      </div>
    </div>
  )
}