"use client"

import React, { createContext, useContext, useState, type ReactNode } from "react"
import { mockOrders as initialOrders, type Order } from "./orders-data"

interface OrdersContextType {
  orders: Order[]
  updateOrderStatus: (orderId: string, newStatus: Order["status"]) => void
  getDeliveredOrders: () => Order[]
  getTotalRevenue: () => number
  getRevenueByMonth: () => Array<{ month: string; revenue: number; orders: number }>
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined)

export function OrdersProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>(initialOrders)

  const updateOrderStatus = (orderId: string, newStatus: Order["status"]) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order)),
    )
  }

  const getDeliveredOrders = () => {
    return orders.filter((order) => order.status === "delivered")
  }

  const getTotalRevenue = () => {
    return getDeliveredOrders().reduce((sum, order) => sum + order.total, 0)
  }

  const getRevenueByMonth = () => {
    const revenueByMonth = orders
      .filter((order) => order.status === "delivered")
      .reduce((acc, order) => {
        const date = new Date(order.createdAt)
        const month = `T${date.getMonth() + 1}/${date.getFullYear()}`

        if (!acc[month]) {
          acc[month] = { month, revenue: 0, orders: 0 }
        }

        acc[month].revenue += order.total
        acc[month].orders += 1

        return acc
      }, {} as Record<string, { month: string; revenue: number; orders: number }>)

    return Object.values(revenueByMonth).sort((a, b) => {
      const [monthA, yearA] = a.month.replace("T", "").split("/").map(Number)
      const [monthB, yearB] = b.month.replace("T", "").split("/").map(Number)
      return yearA - yearB || monthA - monthB
    })
  }

  return (
    <OrdersContext.Provider
      value={{
        orders,
        updateOrderStatus,
        getDeliveredOrders,
        getTotalRevenue,
        getRevenueByMonth,
      }}
    >
      {children}
    </OrdersContext.Provider>
  )
}

export function useOrders() {
  const context = useContext(OrdersContext)
  if (context === undefined) {
    throw new Error("useOrders must be used within an OrdersProvider")
  }
  return context
}
