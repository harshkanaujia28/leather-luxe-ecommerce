"use client";

import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  ReactNode,
} from "react";
import api from "@/utils/axios"; // Axios with token
import { trackMetaEvent } from "@/utils/metaPixel";


// Types
export interface Offer {
  isActive: boolean;
  type: "Percentage" | "Flat" | "Fixed";
  value: number;
}

export interface CartItem {
  _id: string;
  product: {
    _id: string;
    name: string;
    brand: string;
    images: string[];
    price: number;       // Original price
    finalPrice: number;  // After offer
    offer?: Offer;
    specifications?: any;
    variants?: any;
  };
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
  selectedVariant?: string;
}

interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
}

interface CartContextType {
  state: CartState;
  addToCart: (
    productId: string,
    quantity?: number,
    selectedSize?: string,
    selectedColor?: string,
    selectedVariant?: string,
    productOffer?: Offer,
    productPrice?: number
  ) => Promise<void>;
  removeFromCart: (cartItemId: string) => Promise<void>;
  updateQuantity: (cartItemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

// Context Initialization
const CartContext = createContext<CartContextType | undefined>(undefined);

// Reducer
type CartAction = { type: "SET_CART"; payload: CartItem[] };

// Reducer
function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "SET_CART": {
      const items = action.payload;

      // Safe reduce: ignore items without a product
      const total = items.reduce((sum, item) => {
        if (!item.product) return sum; // skip null products
        const price = item.product.finalPrice ?? item.product.price ?? 0;
        const quantity = item.quantity ?? 1;
        return sum + price * quantity;
      }, 0);

      const itemCount = items.reduce((sum, item) => sum + (item.quantity ?? 0), 0);

      return { ...state, items, total, itemCount };
    }
    default:
      return state;
  }
}


// Provider Component
export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    total: 0,
    itemCount: 0,
  });

  // Load Cart on Mount
  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      const res = await api.get("/cart");
      dispatch({ type: "SET_CART", payload: res.data.items });
      console.log("🛒 Cart loaded:", res.data.items);
    } catch (err) {
      console.error("Failed to fetch cart:", err);
    }
  };
  const refreshCart = loadCart;

  const addToCart = async (
    productId: string,
    quantity = 1,
    selectedSize = "Default",
    selectedColor = "Default",
    selectedVariant = "Default Variant",
    productOffer?: Offer,
    productPrice?: number
  ) => {
    if (!productId) return console.error("❌ Missing productId");

    // Calculate final price
    let finalPrice = productPrice ?? 0;
    if (productOffer?.isActive) {
      if (productOffer.type === "Percentage") {
        finalPrice = finalPrice * (1 - productOffer.value / 100);
      } else if (["Flat", "Fixed"].includes(productOffer.type)) {
        finalPrice = Math.max(finalPrice - productOffer.value, 0);
      }
    }

    try {
      const res = await api.post("/cart/add", {
        productId,
        quantity,
        selectedSize,
        selectedColor,
        selectedVariant,
        price: productPrice ?? 0,
        finalPrice,
        offer: productOffer ?? null,
      });

      dispatch({ type: "SET_CART", payload: res.data.items });

      // ✅ META PIXEL EVENT
      trackMetaEvent("AddToCart", {
        content_ids: [productId],
        content_type: "product",
        value: finalPrice * quantity,
        currency: "INR",
      });
    } catch (err) {
      console.error("❌ addToCart error:", err);
    }
  };

  const removeFromCart = async (cartItemId: string) => {
    try {
      const res = await api.post("/cart/remove", { id: cartItemId });
      dispatch({ type: "SET_CART", payload: res.data.items });
    } catch (err) {
      console.error("❌ removeFromCart error:", err);
    }
  };

  const updateQuantity = async (cartItemId: string, quantity: number) => {
    try {
      const res = await api.post("/cart/update", { id: cartItemId, quantity });
      dispatch({ type: "SET_CART", payload: res.data.items });
    } catch (err) {
      console.error("❌ updateQuantity error:", err);
    }
  };

  const clearCart = async () => {
    try {
      const res = await api.delete("/cart/clear");
      dispatch({ type: "SET_CART", payload: res.data.items });
    } catch (err) {
      console.error("❌ clearCart error:", err);
    }
  };

  return (
    <CartContext.Provider
      value={{
        state,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        refreshCart,

      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Custom Hook
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};
