import axios from "axios";
import { toast } from "@/hooks/use-toast";

// 1️⃣ Create Axios instance
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
  // headers: {
  //   "Content-Type": "application/json",
  // },
  
});

// 2️⃣ Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 3️⃣ Response interceptor (optional)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401, 403 errors globally
    if (error.response?.status === 401) {
      console.error("Unauthorized! Please login again.");
        
      // Optional: logout user
    }
    return Promise.reject(error);
  }
);

export default api;
