"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { mockProducts, mockUsers } from "@/lib/mock-data"
import { DollarSign, Package, ShoppingCart, Users } from "lucide-react"
import { SalesChart } from "@/components/sales-chart"
import { Button } from "@/components/ui/button";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {

  LogOut,
} from "lucide-react";

export default function AdminDashboard() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const totalProducts = mockProducts.length
  const totalOrders = 45 // Mock data
  const totalCustomers = mockUsers.filter((u) => u.role === "customer").length
  const totalRevenue = mockProducts.reduce((sum, product) => sum + product.price, 0)

  const recentOrders = [
    {
      id: "order-1",
      user: { first_name: "John", last_name: "Doe", email: "john@example.com" },
      total: 89.99,
      status: "delivered",
    },
    {
      id: "order-2",
      user: { first_name: "Jane", last_name: "Smith", email: "jane@example.com" },
      total: 249.99,
      status: "shipped",
    },
    {
      id: "order-3",
      user: { first_name: "Bob", last_name: "Johnson", email: "bob@example.com" },
      total: 159.99,
      status: "processing",
    },
    {
      id: "order-4",
      user: { first_name: "Alice", last_name: "Brown", email: "alice@example.com" },
      total: 79.99,
      status: "pending",
    },
    {
      id: "order-5",
      user: { first_name: "Charlie", last_name: "Wilson", email: "charlie@example.com" },
      total: 199.99,
      status: "delivered",
    },
  ]
  const handleLogout = () => {
    // Clear authentication
    signOut();

    // Remove role cookie
    Cookies.remove("role");

    // Redirect to login page
    router.push("/auth/login");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to your admin dashboard. Here's an overview of your store.</p>
        </div>


        <Button onClick={handleLogout} className="bg-red-600 text-white hover:bg-red-700">
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
            <p className="text-xs text-muted-foreground">+180.1% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
            <p className="text-xs text-muted-foreground">+19% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCustomers}</div>
            <p className="text-xs text-muted-foreground">+201 since last hour</p>
          </CardContent>
        </Card>
      </div>
      <SalesChart />
      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
          <CardDescription>Latest orders from your customers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium">
                    {order.user.first_name} {order.user.last_name}
                  </p>
                  <p className="text-xs text-muted-foreground">{order.user.email}</p>
                </div>
                <div className="text-right space-y-1">
                  <p className="text-sm font-medium">${order.total.toFixed(2)}</p>
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
  )
}
