"use client"

import type React from "react"

import { createContext, useContext, useReducer, type ReactNode } from "react"

interface Product {
  id: number
  name: string
  price: number
  originalPrice?: number
  image: string
  category: string
  rating: number
  reviews: number
  sizes: string[]
  description: string
  features: string[]
  gender: "masculino" | "feminino" | "unissex"
  isBestSeller?: boolean
}

interface CartItem extends Product {
  selectedSize: string
  quantity: number
}

interface CartState {
  items: CartItem[]
  favorites: number[]
}

type CartAction =
  | { type: "ADD_TO_CART"; payload: { product: Product; size: string } }
  | { type: "REMOVE_FROM_CART"; payload: number }
  | { type: "UPDATE_QUANTITY"; payload: { id: number; size: string; quantity: number } }
  | { type: "TOGGLE_FAVORITE"; payload: number }
  | { type: "CLEAR_CART" }

const CartContext = createContext<{
  state: CartState
  dispatch: React.Dispatch<CartAction>
} | null>(null)

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_TO_CART":
      const existingItemIndex = state.items.findIndex(
        (item) => item.id === action.payload.product.id && item.selectedSize === action.payload.size,
      )

      if (existingItemIndex > -1) {
        const updatedItems = [...state.items]
        updatedItems[existingItemIndex].quantity += 1
        return { ...state, items: updatedItems }
      }

      return {
        ...state,
        items: [
          ...state.items,
          {
            ...action.payload.product,
            selectedSize: action.payload.size,
            quantity: 1,
          },
        ],
      }

    case "REMOVE_FROM_CART":
      return {
        ...state,
        items: state.items.filter((item) => !(item.id === action.payload)),
      }

    case "UPDATE_QUANTITY":
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.id && item.selectedSize === action.payload.size
            ? { ...item, quantity: action.payload.quantity }
            : item,
        ),
      }

    case "TOGGLE_FAVORITE":
      const isFavorite = state.favorites.includes(action.payload)
      return {
        ...state,
        favorites: isFavorite
          ? state.favorites.filter((id) => id !== action.payload)
          : [...state.favorites, action.payload],
      }

    case "CLEAR_CART":
      return { ...state, items: [] }

    default:
      return state
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    favorites: [],
  })

  return <CartContext.Provider value={{ state, dispatch }}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}

export type { Product, CartItem }
