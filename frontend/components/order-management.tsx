"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Search, Eye, Package, TrendingUp, Clock, CheckCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { useApi } from "@/contexts/api-context"
import axios from "@/utils/axios"

export interface Product {
  _id?: string
  name: string
  brand: string
  description: string
  price: number
  stock: number
  images: string[]
  category: string
  seller?: string
  rating: number
  reviews: any[]
  offer?: any
}

interface Order {
  _id: string
  customer: string
  email: string
  total: number
  status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled",
  date: string
  items: number
  paymentStatus?: string
  fragrances?: string[]
}

export function OrderManagement() {
  const { getOrders, updateOrderStatusByAdmin, getRevenue } = useApi()
  const [orders, setOrders] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [paymentFilter, setPaymentFilter] = useState("all")
  const [totalRevenue, setTotalRevenue] = useState(0)
  const [totalDeliveredOrders, setTotalDeliveredOrders] = useState(0);
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [loading, setLoading] = useState(false);
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const data = await getOrders()

      // Sort by date descending (newest first)
      const sortedOrders = data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

      setOrders(sortedOrders)
      
    } catch (err) {
      console.error("Failed to fetch orders", err)
    }
  }


  const fetchRevenue = async () => {
    try {
      const data = await getRevenue(); // ✅ API call
      setTotalRevenue(data.totalRevenue ?? 0);
      setTotalDeliveredOrders(data.totalOrders ?? 0);
     
    } catch (err) {
      console.error("Failed to fetch revenue", err);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchRevenue();
  }, []);


  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      await updateOrderStatusByAdmin(orderId, newStatus)
      toast({
        title: "Order Updated",
        description: `Order ${orderId} status updated to ${newStatus}.`,
        variant: "success",
      })
      fetchOrders()
    } catch (err) {
      console.error("Failed to update order status", err)
    }
  }


  const handleViewOrder = (order: any) => {
    setSelectedOrder(order)
    setIsDialogOpen(true)
  }

  const filteredOrders = orders.filter((order) => {
    const search = searchTerm.toLowerCase();

    const matchesSearch =
      (order._id?.toLowerCase() || "").includes(search) ||
      (order.customer?.toLowerCase() || "").includes(search) ||
      (order.email?.toLowerCase() || "").includes(search);

    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    const matchesPayment = paymentFilter === "all" || (order.paymentStatus || "").toLowerCase() === paymentFilter.toLowerCase();

    return matchesSearch && matchesStatus && matchesPayment;
  });


  const totalOrders = orders.length
  const pendingOrders = orders.filter((order) => order.status === "pending").length
  const processingOrders = orders.filter((order) => order.status === "processing").length

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "confirmed":
        return "bg-green-100 text-green-800 border-green-200";
      case "processing":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "shipped":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };


  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800 border-green-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "failed":
        return "bg-red-100 text-red-800 border-red-200"
      case "refunded":
        return "bg-purple-100 text-purple-800 border-purple-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }
  const deleteOrderHandler = async (id: string) => {
    try {
      await axios.delete(`/orders/${id}`);
      toast({ title: "Order deleted" });
      // reload or update state
    } catch (err) {
      toast({ title: "Failed to delete order", variant: "destructive" });
    }
  };
  interface Props {
    order: {
      itemsTotal: number;
      taxAmount?: number;
      deliveryFee: number;
      finalTotal: number;
      couponCode?: string;
    };
  }





  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
        {/* Statistics */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Package className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Orders</p>
                  <p className="text-2xl font-bold">{totalOrders}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-yellow-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold">{pendingOrders}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Processing</p>
                  <p className="text-2xl font-bold">{processingOrders}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Revenue</p>
                  <p className="text-2xl font-bold">
                    {new Intl.NumberFormat("en-IN", {
                      style: "currency",
                      currency: "INR",
                    }).format(totalRevenue)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    ({totalDeliveredOrders} Paid orders)
                  </p>

                </div>

              </div>
            </CardContent>
          </Card>
        </div>

        {/* Orders Table */}
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <CardTitle>Orders ({filteredOrders.length})</CardTitle>
                <p className="text-sm text-muted-foreground">Manage customer orders and track shipments</p>
              </div>
              <div className="flex flex-col md:flex-row gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search orders..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={paymentFilter} onValueChange={setPaymentFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="All Payments" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Payments</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                    <SelectItem value="refunded">Refunded</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="py-3 px-4 text-left">Order ID</th>
                    <th className="py-3 px-4 text-left">Customer</th>
                    <th className="py-3 px-4 text-left">Product</th>
                    <th className="py-3 px-4 text-left">Date</th>
                    <th className="py-3 px-4 text-left">Total</th>
                    <th className="py-3 px-4 text-left">Status</th>
                    <th className="py-3 px-4 text-left">Payment</th>
                    <th className="py-3 px-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr key={order._id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium text-purple-600"> ORD-{order._id.slice(-6).toUpperCase()} </td>
                      <td className="py-3 px-4">
                        <p className="font-medium">{order.customer}</p>
                        <p className="text-sm text-gray-600">{order.email}</p>
                      </td>
                      <td className="py-3 px-4 text-sm">
                        {order.products.map((p: any) => p.name).join(", ")}
                      </td>
                      <td className="py-3 px-4 text-sm">{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td className="py-3 px-4 font-medium">₹{order.finalTotal}</td>
                      <td className="py-3 px-4">
                        <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={getPaymentStatusColor(order.paymentStatus)}>{order.paymentStatus}</Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleViewOrder(order)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Select
                            defaultValue={order.status}
                            onValueChange={(newStatus) => handleStatusUpdate(order._id, newStatus)}
                          >
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="confirmed">Confirmed</SelectItem>
                              <SelectItem value="processing">Processing</SelectItem>
                              <SelectItem value="shipped">Shipped</SelectItem>
                              <SelectItem value="delivered">Delivered</SelectItem>
                              <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                          <button
                            className="bg-red-500 text-white px-3 py-1 rounded"
                            onClick={() => deleteOrderHandler(order._id)}
                            disabled={loading}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredOrders.length === 0 && (
                <div className="text-center py-8">
                  <Package className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No orders found</h3>
                  <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Order Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span className="text-purple-600">
                {selectedOrder
                  ? `Order Details -ORD-${selectedOrder._id.slice(-6).toUpperCase()}`
                  : "Order Details"}
              </span>

              <Button variant="ghost" size="sm" onClick={() => setIsDialogOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-6">

              {/* Order Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {/* Order Status */}
                <Card className=" border border-lime-500/30 shadow-md rounded-2xl flex flex-col justify-center items-center p-4">
                  <p className="text-sm text-gray-400 mb-2">Order Status</p>
                  <Badge className={getStatusColor(selectedOrder.status)}>
                    {selectedOrder.status}
                  </Badge>
                </Card>

                {/* Payment Status */}
                <Card className=" border border-lime-500/30 shadow-md rounded-2xl flex flex-col justify-center items-center p-4">
                  <p className="text-sm text-gray-400 mb-2">Payment Status</p>
                  <Badge className={getPaymentStatusColor(selectedOrder.paymentStatus)}>
                    {selectedOrder.paymentStatus}
                  </Badge>
                </Card>

                {/* Payment Method */}
                <Card className=" border border-lime-500/30 shadow-md rounded-2xl flex flex-col justify-center items-center p-4">
                  <p className="text-sm text-gray-400 mb-2">Payment Method</p>
                  <p className="font-medium">{selectedOrder.paymentMethod || "N/A"}</p>
                </Card>

                {/* Order Date */}
                <Card className="border border-lime-500/30 shadow-md rounded-2xl flex flex-col justify-center items-center p-4">
                  <p className="text-sm text-gray-400 mb-2">Order Date</p>
                  <p className="font-medium">{new Date(selectedOrder.createdAt).toLocaleString()}</p>
                </Card>
              </div>


              {/* Customer Info */}
              <Card>
                <CardHeader><CardTitle>Customer Information</CardTitle></CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Name</p>
                      <p className="font-medium">{selectedOrder.customer}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{selectedOrder.email}</p>
                    </div>
                    {selectedOrder.shippingAddress && (
                      <div className="md:col-span-2">
                        <p className="text-sm text-muted-foreground">Shipping Address</p>
                        <p className="font-medium">
                          {selectedOrder.shippingAddress.address}, {selectedOrder.shippingAddress.city},{" "}
                          {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zipCode}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Phone: {selectedOrder.shippingAddress.phone}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Order Items */}
              <Card className="bg-white shadow-lg rounded-2xl border border-gray-200">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-800">
                    Order Items ({selectedOrder.products?.length || 0})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedOrder.products?.map((item: any, idx: number) => (
                    <div
                      key={idx}
                      className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-4 border rounded-lg hover:shadow-md transition"
                    >
                      {/* Product Image */}
                      <div className="w-20 h-20 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden flex items-center justify-center">
                        {item.image ? (
                          <img
                            src={
                              item.image.startsWith("http")
                                ? item.image
                                : `${process.env.NEXT_PUBLIC_API_URL}${item.image}`
                            }
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Package className="w-8 h-8 text-gray-400" />
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <h4 className="font-medium text-gray-800">{item.name}</h4>
                          <p className="text-sm text-gray-500">Brand: {item.brand}</p>
                          <p className="text-sm text-gray-500">Size: {item.selectedSize || "Default"}</p>
                          <p className="text-sm text-gray-500">Color: {item.selectedColor || "Default"}</p>
                          <p className="text-sm text-gray-500">Variant: {item.selectedVariant || "Default"}</p>
                          <p className="text-sm text-gray-400">Product ID: {item.product}</p>
                        </div>

                        {/* Pricing & Offer */}
                        <div className="text-right space-y-1">
                          {item.offer?.isActive && (
                            <p className="text-sm text-green-600 font-medium">
                              Offer Applied: {item.offer.value}
                              {item.offer.type?.toLowerCase() === "percentage" ? "%" : "₹"}
                            </p>
                          )}
                          <p className="text-sm text-gray-400 line-through">
                            Original: ₹{item.originalPrice?.toFixed(2) || item.price.toFixed(2)}
                          </p>
                          <p className="text-sm text-gray-800 font-semibold">
                            Final: ₹{item.finalPrice?.toFixed(2) || item.price.toFixed(2)}
                          </p>
                          <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                          <p className="text-md font-medium">
                            Total: ₹{((item.finalPrice ?? item.price) * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>


              {/* Order Summary */}
              {/* Order Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {/* Original Price */}
                  <div className="flex justify-between text-gray-500">
                    <span>Original Price</span>
                    <span>
                      ₹
                      {selectedOrder.products
                        ?.reduce((sum: number, p: any) => sum + (p.originalPrice * p.quantity), 0)
                        .toFixed(2)}
                    </span>
                  </div>

                  {/* Subtotal after Offer */}
                  <div className="flex justify-between font-semibold">
                    <span>Subtotal</span>
                    <span>
                      ₹
                      {selectedOrder.products
                        ?.reduce((sum: number, p: any) => sum + (p.price * p.quantity), 0)
                        .toFixed(2)}
                    </span>
                  </div>

                  {/* Offer Discount */}
                  {selectedOrder.products?.some(p => p.offer?.discountApplied > 0) && (
                    <div className="flex justify-between text-green-600">
                      <span>Offer Applied</span>
                      <span>
                        -₹
                        {selectedOrder.products
                          .reduce((sum: number, p: any) => sum + (p.offer?.discountApplied || 0), 0)
                          .toFixed(2)}
                      </span>
                    </div>
                  )}

                  {/* Coupon Discount */}
                  {selectedOrder.couponCode && (selectedOrder.couponDiscount || 0) > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Coupon ({selectedOrder.couponCode})</span>
                      <span>-₹{selectedOrder.couponDiscount.toFixed(2)}</span>
                    </div>
                  )}

                  {/* Tax */}
                  <div className="flex justify-between">
                    <span>Tax (10%)</span>
                    <span>
                      ₹
                      {(
                        selectedOrder.taxAmount ||
                        (selectedOrder.products.reduce((sum: number, p: any) => sum + (p.price * p.quantity - (p.offer?.discountApplied || 0)), 0) * 0.1)
                      ).toFixed(2)}
                    </span>
                  </div>

                  {/* Delivery Fee */}
                  {selectedOrder.deliveryFee && (
                    <div className="flex justify-between">
                      <span>Delivery Fee</span>
                      <span>₹{selectedOrder.deliveryFee.toFixed(2)}</span>
                    </div>
                  )}

                  <Separator />

                  {/* Final Total */}
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>₹{selectedOrder.finalTotal.toFixed(2)}</span>
                  </div>
                </CardContent>
              </Card>


            </div>
          )}
        </DialogContent>
      </Dialog>

    </div>
  )
}
