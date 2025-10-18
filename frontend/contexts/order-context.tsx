"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import axios, { AxiosInstance } from "axios";

// ==========================
// Types
// ==========================
interface OrderItem {
  product: string;
  quantity: number;
  selectedSize?: string;
  [key: string]: any;
}

export interface Order {
  _id: string;
  user: string;
  customer: string;
  email: string;
  products: OrderItem[];
  shippingAddress: any;
  itemsTotal: number;
  deliveryFee: number;
  taxAmount: number;
  discount: number;
  finalTotal: number;
  status: string;
  paymentMethod: string;
  paymentStatus?: string;
  couponCode?: string;
  couponDiscount?: number;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
}

interface Revenue {
  totalRevenue: number;
  totalOrders: number;
  currency: string;
}

interface UseApiContextType {
  orders: Order[];
  loading: boolean;
  getOrders: () => Promise<void>;
  getOrdersByUser: () => Promise<void>;
  getOrderById: (id: string) => Promise<Order | null>;
  placeOrder: (orderData: any) => Promise<Order | null>;
  cancelOrder: (id: string) => Promise<void>;
  deleteOrder: (id: string) => Promise<void>;
  updateOrderStatus: (id: string, status: string) => Promise<void>;
  getRevenue: () => Promise<Revenue | null>;
}

const ApiContext = createContext<UseApiContextType | undefined>(undefined);

export const useApi = () => {
  const context = useContext(ApiContext);
  if (!context) throw new Error("useApi must be used within ApiProvider");
  return context;
};

// ==========================
// Provider
// ==========================
export const ApiProvider = ({ children }: { children: ReactNode }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  // Axios instance
  const API: AxiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/orders",
  });

  // Attach token automatically
  API.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token && config.headers) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  // ==========================
  // Functions
  // ==========================
  const getOrders = async () => {
    try {
      setLoading(true);
      const res = await API.get("/");
      setOrders(res.data.orders);
    } catch (err) {
      console.error("Failed to fetch orders", err);
    } finally {
      setLoading(false);
    }
  };

  const getOrdersByUser = async () => {
    try {
      setLoading(true);
      const res = await API.get("/my-orders");
      setOrders(res.data.orders);
    } catch (err) {
      console.error("Failed to fetch user orders", err);
    } finally {
      setLoading(false);
    }
  };

  const getOrderById = async (id: string) => {
    try {
      const res = await API.get(`/${id}`);
      return res.data as Order;
    } catch (err) {
      console.error("Failed to fetch order by ID", err);
      return null;
    }
  };

  const placeOrder = async (orderData: any) => {
    try {
      const res = await API.post("/", orderData);
      setOrders((prev) => [...prev, res.data]);
      return res.data as Order;
    } catch (err) {
      console.error("Failed to place order", err);
      return null;
    }
  };

  const cancelOrder = async (id: string) => {
    try {
      await API.patch(`/${id}/cancel`);
      setOrders((prev) =>
        prev.map((o) => (o._id === id ? { ...o, status: "cancelled" } : o))
      );
    } catch (err) {
      console.error("Failed to cancel order", err);
    }
  };

  const deleteOrder = async (id: string) => {
    try {
      await API.delete(`/${id}`);
      setOrders((prev) => prev.filter((o) => o._id !== id));
    } catch (err) {
      console.error("Failed to delete order", err);
    }
  };

  const updateOrderStatus = async (id: string, status: string) => {
    try {
      await API.patch(`/${id}`, { status });
      setOrders((prev) =>
        prev.map((o) => (o._id === id ? { ...o, status } : o))
      );
    } catch (err) {
      console.error("Failed to update order status", err);
    }
  };

  const getRevenue = async (): Promise<Revenue | null> => {
    try {
      const res = await API.get("/revenue");
      return res.data as Revenue;
    } catch (err) {
      console.error("Failed to fetch revenue", err);
      return null;
    }
  };

  return (
    <ApiContext.Provider
      value={{
        orders,
        loading,
        getOrders,
        getOrdersByUser,
        getOrderById,
        placeOrder,
        cancelOrder,
        deleteOrder,
        updateOrderStatus,
        getRevenue,
      }}
    >
      {children}
    </ApiContext.Provider>
  );
};
