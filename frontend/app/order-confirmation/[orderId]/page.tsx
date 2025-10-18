"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import {
  CheckCircle,
  Download,
  Truck,
  MapPin,
  CreditCard,
  Phone,
  Mail,
  Calendar,
  Package,
  ArrowRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Header } from "@/components/header"
import Footer from "@/components/footer"

interface OrderItem {
  id: number
  name: string
  vendor: string
  price: number
  image: string
  color: string
  size: string
  quantity: number
}

interface Order {
  id: string
  items: OrderItem[]
  shippingInfo: any
  paymentInfo: any
  subtotal: number
  discount: number
  shippingCost: number
  gst: number
  total: number
  status: string
  date: string
  estimatedDelivery: string
}

export default function OrderConfirmationPage() {
  const params = useParams()
  const orderId = params.orderId as string
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadOrder = () => {
      try {
        const savedOrders = localStorage.getItem("orders")
        if (savedOrders) {
          const orders = JSON.parse(savedOrders)
          const foundOrder = orders.find((o: Order) => o.id === orderId)
          setOrder(foundOrder || null)
        }
      } catch (error) {
        console.error("Error loading order:", error)
      } finally {
        setLoading(false)
      }
    }

    loadOrder()
  }, [orderId])

  const downloadInvoice = () => {
    // In a real app, this would generate and download a PDF invoice
    alert("Invoice download feature will be implemented soon!")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading order details...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Order not found</h1>
          <p className="text-gray-600 mb-8">The order you're looking for doesn't exist or has been removed.</p>
          <Link href="/orders">
            <Button>View All Orders</Button>
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  const orderStatusSteps = [
    { status: "Confirmed", icon: CheckCircle, completed: true },
    { status: "Processing", icon: Package, completed: false },
    { status: "Shipped", icon: Truck, completed: false },
    { status: "Delivered", icon: CheckCircle, completed: false },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
            <p className="text-gray-600 mb-4">
              Thank you for your purchase. Your order has been confirmed and is being processed.
            </p>
            <div className="flex items-center justify-center gap-4 text-sm">
              <span className="font-medium">Order ID: {order.id}</span>
              <span>•</span>
              <span>Placed on {new Date(order.date).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Order Status Timeline */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Order Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                {orderStatusSteps.map((step, index) => (
                  <div key={step.status} className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                        step.completed ? "bg-green-600 border-green-600 text-white" : "border-gray-300 text-gray-400"
                      }`}
                    >
                      <step.icon className="h-5 w-5" />
                    </div>
                    <span className={`text-xs mt-2 ${step.completed ? "text-green-600 font-medium" : "text-gray-400"}`}>
                      {step.status}
                    </span>
                    {index < orderStatusSteps.length - 1 && (
                      <div
                        className={`absolute h-0.5 w-24 mt-5 ${step.completed ? "bg-green-600" : "bg-gray-300"}`}
                        style={{ left: `${(index + 1) * 25}%`, transform: "translateX(-50%)" }}
                      />
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2 text-blue-800">
                  <Calendar className="h-4 w-4" />
                  <span className="font-medium">
                    Estimated Delivery: {new Date(order.estimatedDelivery).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-blue-600 mt-1">Your order will be delivered within 15-20 business days</p>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Order Details */}
            <div className="space-y-6">
              {/* Shipping Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Shipping Address
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="font-medium">
                      {order.shippingInfo.firstName} {order.shippingInfo.lastName}
                    </p>
                    <p>{order.shippingInfo.address}</p>
                    <p>
                      {order.shippingInfo.city}, {order.shippingInfo.state} - {order.shippingInfo.pincode}
                    </p>
                    <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Phone className="h-4 w-4" />
                        {order.shippingInfo.phone}
                      </div>
                      <div className="flex items-center gap-1">
                        <Mail className="h-4 w-4" />
                        {order.shippingInfo.email}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Payment Method
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="font-medium">
                      {order.paymentInfo.method === "card" && "Credit/Debit Card"}
                      {order.paymentInfo.method === "upi" && "UPI"}
                      {order.paymentInfo.method === "netbanking" && "Net Banking"}
                      {order.paymentInfo.method === "wallet" && "Digital Wallet"}
                      {order.paymentInfo.method === "cod" && "Cash on Delivery"}
                    </p>
                    {order.paymentInfo.method === "card" && order.paymentInfo.cardNumber && (
                      <p className="text-sm text-gray-600">**** **** **** {order.paymentInfo.cardNumber.slice(-4)}</p>
                    )}
                    {order.paymentInfo.method === "upi" && order.paymentInfo.upiId && (
                      <p className="text-sm text-gray-600">{order.paymentInfo.upiId}</p>
                    )}
                    <Badge className="bg-green-100 text-green-800">Payment Confirmed</Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start bg-transparent" onClick={downloadInvoice}>
                    <Download className="h-4 w-4 mr-2" />
                    Download Invoice
                  </Button>
                  <Link href="/orders" className="block">
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <Package className="h-4 w-4 mr-2" />
                      View All Orders
                    </Button>
                  </Link>
                  <Link href="/products" className="block">
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <ArrowRight className="h-4 w-4 mr-2" />
                      Continue Shopping
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Order Items */}
                  <div className="space-y-4">
                    {order.items.map((item) => (
                      <div key={`${item.id}-${item.color}-${item.size}`} className="flex items-center gap-4">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          width={60}
                          height={60}
                          className="rounded-lg object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm">{item.name}</h4>
                          <p className="text-xs text-gray-600">{item.vendor}</p>
                          <div className="flex items-center gap-3 mt-1 text-xs text-gray-600">
                            <span>Color: {item.color}</span>
                            <span>Size: {item.size}</span>
                            <span>Qty: {item.quantity}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-sm">₹{(item.price * item.quantity).toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  {/* Price Breakdown */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal ({order.items.length} items)</span>
                      <span>₹{order.subtotal.toLocaleString()}</span>
                    </div>
                    {order.discount > 0 && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Discount</span>
                        <span>-₹{order.discount.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span>Shipping</span>
                      <span>{order.shippingCost === 0 ? "Free" : `₹${order.shippingCost.toLocaleString()}`}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>GST (18%)</span>
                      <span>₹{order.gst.toLocaleString()}</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total Paid</span>
                    <span>₹{order.total.toLocaleString()}</span>
                  </div>

                  {/* Order Info */}
                  <div className="p-4 bg-gray-50 rounded-lg space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Order ID:</span>
                      <span className="font-medium">{order.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Order Date:</span>
                      <span className="font-medium">{new Date(order.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <Badge className="bg-green-100 text-green-800">{order.status}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Support Section */}
          <Card className="mt-8">
            <CardContent className="p-6">
              <div className="text-center">
                <h3 className="font-semibold mb-2">Need Help?</h3>
                <p className="text-gray-600 mb-4">
                  If you have any questions about your order, feel free to contact our customer support team.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/contact">
                    <Button variant="outline">Contact Support</Button>
                  </Link>
                  <Link href="/orders">
                    <Button variant="outline">Track Your Order</Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  )
}
