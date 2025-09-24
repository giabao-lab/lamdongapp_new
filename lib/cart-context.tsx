"use client"

import { createContext, useContext, useReducer, useEffect, type ReactNode } from "react"
import type { CartItem, Product } from "./types"

interface CartState {
  items: CartItem[]
  total: number
  itemCount: number
}

interface CartAction {
  type: "ADD_ITEM" | "REMOVE_ITEM" | "UPDATE_QUANTITY" | "CLEAR_CART" | "LOAD_CART"
  payload?: any
}

const initialState: CartState = {
  items: [],
  total: 0,
  itemCount: 0,
}

function calculateTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
}

function calculateItemCount(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity, 0)
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "LOAD_CART": {
      const items = action.payload || []
      return {
        items,
        total: calculateTotal(items),
        itemCount: calculateItemCount(items),
      }
    }
    case "ADD_ITEM": {
      const { product, quantity = 1 } = action.payload
      const existingItemIndex = state.items.findIndex((item) => item.productId === product.id)

      let newItems: CartItem[]
      if (existingItemIndex >= 0) {
        newItems = state.items.map((item, index) =>
          index === existingItemIndex ? { ...item, quantity: item.quantity + quantity } : item,
        )
      } else {
        newItems = [...state.items, { productId: product.id, quantity, product }]
      }

      return {
        items: newItems,
        total: calculateTotal(newItems),
        itemCount: calculateItemCount(newItems),
      }
    }
    case "REMOVE_ITEM": {
      const productId = action.payload
      const newItems = state.items.filter((item) => item.productId !== productId)
      return {
        items: newItems,
        total: calculateTotal(newItems),
        itemCount: calculateItemCount(newItems),
      }
    }
    case "UPDATE_QUANTITY": {
      const { productId, quantity } = action.payload
      if (quantity <= 0) {
        const newItems = state.items.filter((item) => item.productId !== productId)
        return {
          items: newItems,
          total: calculateTotal(newItems),
          itemCount: calculateItemCount(newItems),
        }
      }

      const newItems = state.items.map((item) => (item.productId === productId ? { ...item, quantity } : item))
      return {
        items: newItems,
        total: calculateTotal(newItems),
        itemCount: calculateItemCount(newItems),
      }
    }
    case "CLEAR_CART": {
      return initialState
    }
    default:
      return state
  }
}

const CartContext = createContext<{
  state: CartState
  addItem: (product: Product, quantity?: number) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
} | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState)

  useEffect(() => {
    // Load cart from localStorage on mount
    const savedCart = localStorage.getItem("cart_items")
    if (savedCart) {
      try {
        const items = JSON.parse(savedCart)
        dispatch({ type: "LOAD_CART", payload: items })
      } catch (error) {
        console.error("Error loading cart from localStorage:", error)
      }
    }
  }, [])

  useEffect(() => {
    // Save cart to localStorage whenever it changes
    localStorage.setItem("cart_items", JSON.stringify(state.items))
  }, [state.items])

  const addItem = (product: Product, quantity = 1) => {
    dispatch({ type: "ADD_ITEM", payload: { product, quantity } })
  }

  const removeItem = (productId: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: productId })
  }

  const updateQuantity = (productId: string, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { productId, quantity } })
  }

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" })
  }

  return (
    <CartContext.Provider value={{ state, addItem, removeItem, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
