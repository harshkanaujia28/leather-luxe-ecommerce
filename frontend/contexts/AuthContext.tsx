"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import api from "@/utils/axios";
import Cookies from "js-cookie";

interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  pincode?: string;
  role: "admin" | "user";
  isVerified?: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ user: User; token: string }>;
  signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<string>; // returns userId
  verifyOtp: (userId: string, otp: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
  signOut: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    if (storedUser && storedToken) {
      try {
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
        api.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
      } catch {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    }
    setLoading(false);
  }, []);

  // Sign in
const signIn = async (email: string, password: string) => {
  try {
    const res = await api.post("/auth/login", { email, password });
    const { user: u, token } = res.data;

    // ✅ Save to both localStorage & cookies
    localStorage.setItem("user", JSON.stringify(u));
    localStorage.setItem("token", token);
    Cookies.set("token", token, { expires: 7 });
    Cookies.set("role", u.role, { expires: 7 });

    // ✅ Set default header for axios instance
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    setUser(u);
    return { user: u, token };
  } catch (err: any) {
    if (err.response)
      throw new Error(err.response.data?.message || "Login failed");
    if (err.request)
      throw new Error("No response from server. Please try again.");
    throw new Error(err.message);
  }
};

  // Sign up (returns userId for OTP verification)
  const signUp = async (email: string, password: string, firstName: string, lastName: string) => {
    try {
      const res = await api.post("/auth/register", {
        name: `${firstName} ${lastName}`,
        email,
        password,
      });
      return res.data.userId; // frontend will use this to verify OTP
    } catch (err: any) {
      if (err.response) throw new Error(err.response.data?.message || "Sign up failed");
      if (err.request) throw new Error("No response from server. Please try again.");
      throw new Error(err.message);
    }
  };

  // Verify OTP
  const verifyOtp = async (userId: string, otp: string) => {
     console.log("verifyOtp called with:", userId, otp);
    try {
      await api.post("/auth/verify-otp", { userId, otp });
    } catch (err: any) {
      if (err.response) throw new Error(err.response.data?.message || "OTP verification failed");
      if (err.request) throw new Error("No response from server. Please try again.");
      throw new Error(err.message);
    }
  };

  // Forgot Password
  const forgotPassword = async (email: string) => {
    try {
      await api.post("/auth/forgot-password", { email });
    } catch (err: any) {
      if (err.response) throw new Error(err.response.data?.message || "Forgot password failed");
      if (err.request) throw new Error("No response from server. Please try again.");
      throw new Error(err.message);
    }
  };

  // Reset Password
  const resetPassword = async (token: string, newPassword: string) => {
    try {
      await api.post(`/auth/reset-password/${token}`, { password: newPassword });
    } catch (err: any) {
      if (err.response) throw new Error(err.response.data?.message || "Reset password failed");
      if (err.request) throw new Error("No response from server. Please try again.");
      throw new Error(err.message);
    }
  };

  // Sign out
  const signOut = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    delete api.defaults.headers.common["Authorization"];
  };

  // Update user in context & localStorage
  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    try {
      localStorage.setItem("user", JSON.stringify(updatedUser));
    } catch {
      // ignore
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        verifyOtp,
        forgotPassword,
        resetPassword,
        signOut,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
