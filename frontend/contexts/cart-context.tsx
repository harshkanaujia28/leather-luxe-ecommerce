"use client";

import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  ReactNode,
} from "react";
import api from "@/utils/axios"; // <-- Global Axios with token

// Types
export interface CartItem {
  _id: string;
  product: {
    _id: string;
    name: string;
    brand: string;
    image: string;
    price: number;
    finalPrice: number; // offer ke baad ka price
    offer?: { isActive: boolean; type: string; value: number };
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
  addToCart: (productId: string, quantity?: number, selectedSize?: string) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

// Context Initialization
const CartContext = createContext<CartContextType | undefined>(undefined);

// Reducer
type CartAction = { type: "SET_CART"; payload: CartItem[] };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "SET_CART": {
      const items = action.payload;

      const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

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
      console.log("🛒 Cart Item:", res.data.items);

    } catch (err) {
      console.error("Failed to fetch cart:", err);
    }
  };
  const refreshCart = loadCart;

  const addToCart = async (
    productId: string,
    quantity: number = 1,
    selectedSize: string = "Default",
    selectedColor: string = "Default",
    selectedVariant: string = "Default Variant",
    productOffer?: { isActive: boolean; type: string; value: number },
    productPrice?: number
  ) => {
    if (!productId) return console.error("❌ Missing productId");

    // Calculate offer price safely
    let finalPrice = productPrice !== undefined ? productPrice : 0;
    if (productOffer?.isActive) {
      if (productOffer.type === "Percentage") finalPrice = finalPrice * (1 - productOffer.value / 100);
      else if (["Flat", "Fixed"].includes(productOffer.type)) finalPrice = Math.max(finalPrice - productOffer.value, 0);
    }

    try {
      const res = await api.post("/cart/add", {
        productId,
        quantity,
        selectedSize,
        selectedColor,
        selectedVariant,
        price: productPrice,
        finalPrice,
        offer: productOffer || null,
      });

      dispatch({ type: "SET_CART", payload: res.data.items });
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


  const updateQuantity = async (productId: string, quantity: number) => {
    try {
      const res = await api.post("/cart/update", { id: productId, quantity });
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
    <CartContext.Provider value={{ state, addToCart, removeFromCart, updateQuantity, clearCart, refreshCart, }}>
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
