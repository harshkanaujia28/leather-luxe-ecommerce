"use client"

import { createContext, useContext, useState, ReactNode } from "react"
import type { Product } from "@/types"

type WishlistItem = Product

interface WishlistContextType {
  items: WishlistItem[]
  addItem: (item: WishlistItem) => void
  removeItem: (id: string) => void
  isInWishlist: (id: string) => boolean
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<WishlistItem[]>([])

  const addItem = (item: WishlistItem) => {
    if (!items.find((i) => i.id === item.id)) {
      setItems([...items, item])
    }
  }

  const removeItem = (id: string) => {
    setItems(items.filter((i) => i.id !== id))
  }

  const isInWishlist = (productId: string) => {
    return items.some((item) => item.id === productId)
  }

  return (
    <WishlistContext.Provider value={{ items, addItem, removeItem, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  )
}

export const useWishlist = () => {
  const context = useContext(WishlistContext)
  if (!context) throw new Error("useWishlist must be used within WishlistProvider")
  return context
}
