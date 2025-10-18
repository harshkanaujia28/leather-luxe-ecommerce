"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import axios from "@/utils/axios";
import type { Product } from "@/contexts/api-context";

type WishlistItem = Product;

interface WishlistContextType {
  items: WishlistItem[];
  addItem: (item: WishlistItem) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  isInWishlist: (id: string) => boolean;
  refreshWishlist: () => Promise<void>;
  clearWishlist: () => void; // ✅ NEW
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<WishlistItem[]>([]);

  const fetchWishlist = async () => {
    try {
      const res = await axios.get("/wishlist");
      const products = res.data.items;

      if (!Array.isArray(products)) {
        console.error("Wishlist response invalid:", products);
        setItems([]);
        return;
      }

      setItems(products);
    } catch (err) {
      console.error("Failed to fetch wishlist:", err);
      setItems([]);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token"); // ✅ Optional: avoid fetch if not logged in
    if (token) {
      fetchWishlist();
    } else {
      setItems([]);
    }
  }, []);

  const addItem = async (item: WishlistItem) => {
    if (isInWishlist(item._id!)) return;
    try {
      await axios.post("/wishlist/add", { productId: item._id });
      setItems((prev) => [...prev, item]);
    } catch (err) {
      console.error("Failed to add to wishlist:", err);
    }
  };

const removeItem = async (id: string) => {
  try {
    await axios.post("/wishlist/remove", { productId: id });
    console.log("Removed from wishlist:", id);
    setItems((prev) => prev.filter((i) => i._id !== id));
  } catch (err) {
    console.error("Failed to remove from wishlist:", err);
  }
};

  const isInWishlist = (productId: string) => {
    return items.some((item) => item._id === productId);
  };

  const clearWishlist = () => {
    setItems([]); // ✅ NEW
  };

  return (
    <WishlistContext.Provider
      value={{ items, addItem, removeItem, isInWishlist, refreshWishlist: fetchWishlist, clearWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error("useWishlist must be used within WishlistProvider");
  return context;
};
