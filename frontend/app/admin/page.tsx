"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LogOut, IndianRupeeIcon, ShoppingCart, Package, Users } from "lucide-react";
import { SalesChart } from "@/components/sales-chart";
import { useAuth } from "@/contexts/AuthContext";

interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
  recentOrders: {
    _id: string;
    totalPrice?: number; // ✅ made optional to avoid crash
    status: string;
    user: { name?: string; email?: string };
  }[];
  salesData: { month: string; total: number }[];
}

export default function AdminDashboard() {
  const router = useRouter();
  const { signOut } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch admin dashboard data
  const fetchDashboardData = async () => {
    try {
      const token = Cookies.get("token");
      if (!token) {
        console.warn("No token found → redirecting to login");
        router.push("/auth/login");
        return;
      }

      console.log("🟡 Fetching dashboard data...");
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/admin/dashboard`, {
        headers: {
          "Authorization": `Bearer ${token}`, // ✅ only ASCII
          "Content-Type": "application/json",
        },
      });


      console.log("✅ Dashboard Data:", res.data);
      setStats(res.data);
    } catch (err: any) {
      console.error("❌ Failed to load dashboard:", err?.response?.data || err.message);
      // ✅ Auto redirect if unauthorized
      if (err?.response?.status === 401) {
        Cookies.remove("token");
        Cookies.remove("role");
        router.push("/auth/login");
      }
    } finally {
      setLoading(false);
    }
  };

  // ✅ Run on first mount
  useEffect(() => {
    fetchDashboardData();
  }, []);

  // ✅ Secure Logout
  const handleLogout = () => {
    signOut?.();
    Cookies.remove("token");
    Cookies.remove("role");
    localStorage.clear();
    router.push("/auth/login");
  };

  // ✅ Loading state
  if (loading) return <p className="text-center py-10">Loading dashboard...</p>;

  // ✅ Error state
  if (!stats)
    return (
      <p className="text-center py-10 text-red-500">
        Failed to load dashboard data.
      </p>
    );

  // ✅ Safe helper function
  const safeValue = (val?: number) => (typeof val === "number" ? val.toFixed(2) : "0.00");

  return (
    <div className="space-y-6 p-4 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to your admin dashboard. Here’s your store overview.
          </p>
        </div>

        <Button
          onClick={handleLogout}
          className="bg-red-600 text-white hover:bg-red-700"
        >
          <LogOut className="w-4 h-4 mr-2" /> Logout
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <IndianRupeeIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{safeValue(stats.totalRevenue)}
            </div>
            <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
            <p className="text-xs text-muted-foreground">
              +180.1% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
            <p className="text-xs text-muted-foreground">+19% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCustomers}</div>
            <p className="text-xs text-muted-foreground">
              +201 since last hour
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Sales Chart */}
      <SalesChart data={stats.salesData || []} />


      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
          <CardDescription>Latest orders from your customers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.recentOrders.map((order) => (
              <div
                key={order._id}
                className="flex items-center justify-between border-b pb-2"
              >
                <div>
                  <p className="text-sm font-medium">{order.customer}</p>
                  <p className="text-xs text-muted-foreground">{order.email}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">₹{order.finalTotal.toFixed(2)}</p>
                  <Badge
                    variant={
                      order.status === "delivered"
                        ? "default"
                        : order.status === "shipped"
                          ? "secondary"
                          : order.status === "processing"
                            ? "outline"
                            : "destructive"
                    }
                  >
                    {order.status}
                  </Badge>
                </div>
              </div>
            ))}

          </div>
        </CardContent>
      </Card>
    </div>
  );
}
