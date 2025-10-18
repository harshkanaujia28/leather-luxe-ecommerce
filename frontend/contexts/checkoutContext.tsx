"use client";
import { createContext, useContext, useState, ReactNode } from "react";

// type define karo
interface DeliveryInfo {
  deliveryFee: number;
  deliveryTime: string;
  zoneType?: string;
}

interface CheckoutContextType {
  delivery: DeliveryInfo | null;
  setDelivery: (info: DeliveryInfo | null) => void;
}

// default context (safe fallback)
const CheckoutContext = createContext<CheckoutContextType | undefined>(undefined);

export function CheckoutProvider({ children }: { children: ReactNode }) {
  const [delivery, setDelivery] = useState<DeliveryInfo | null>(null);

  return (
    <CheckoutContext.Provider value={{ delivery, setDelivery }}>
      {children}
    </CheckoutContext.Provider>
  );
}

// custom hook
export const useCheckout = () => {
  const context = useContext(CheckoutContext);
  if (!context) {
    throw new Error("useCheckout must be used inside CheckoutProvider");
  }
  return context;
};
