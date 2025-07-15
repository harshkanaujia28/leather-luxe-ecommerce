"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Package,
  User,
  CreditCard,
  Truck,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Edit,
  MessageSquare,
  Printer,
} from "lucide-react"

interface OrderItem {
  id: string
  name: string
  variant?: string
  quantity: number
  price: number
  image?: string
}

interface ShippingAddress {
  name: string
  street: string
  city: string
  state: string
  zipCode: string
  country: string
}

interface OrderDetails {
  id: string
  customer: string
  email: string
  phone: string
  total: number
  subtotal: number
  tax: number
  shipping: number
  discount?: number
  status: string
  paymentStatus: string
  paymentMethod: string
  shippingMethod: string
  date: string
  estimatedDelivery?: string
  trackingNumber?: string
  items: OrderItem[]
  shippingAddress: ShippingAddress
  billingAddress: ShippingAddress
  notes?: string
}

interface OrderDetailDialogProps {
  orderId: string | null
  isOpen: boolean
  onClose: () => void
  onStatusUpdate?: (orderId: string, status: string) => void
}

// Mock order details - in real app, this would come from API
const getOrderDetails = (orderId: string): OrderDetails => {
  const mockDetails: Record<string, OrderDetails> = {
    "FR-3210": {
      id: "FR-3210",
      customer: "Sarah Johnson",
      email: "sarah@example.com",
      phone: "+1 (555) 123-4567",
      total: 188.6,
      subtotal: 165.0,
      tax: 13.2,
      shipping: 10.4,
      discount: 0,
      status: "processing",
      paymentStatus: "paid",
      paymentMethod: "Credit Card (**** 4242)",
      shippingMethod: "Standard Shipping",
      date: "2024-01-15",
      estimatedDelivery: "2024-01-22",
      trackingNumber: "1Z999AA1234567890",
      items: [
        {
          id: "1",
          name: "Chanel No. 5",
          variant: "100ml EDT",
          quantity: 1,
          price: 150.0,
          image: "/placeholder.svg?height=80&width=80",
        },
        {
          id: "2",
          name: "Sample Discovery Set",
          variant: "5 x 2ml",
          quantity: 1,
          price: 15.0,
          image: "/placeholder.svg?height=80&width=80",
        },
      ],
      shippingAddress: {
        name: "Sarah Johnson",
        street: "123 Main Street, Apt 4B",
        city: "New York",
        state: "NY",
        zipCode: "10001",
        country: "United States",
      },
      billingAddress: {
        name: "Sarah Johnson",
        street: "123 Main Street, Apt 4B",
        city: "New York",
        state: "NY",
        zipCode: "10001",
        country: "United States",
      },
      notes: "Please handle with care - fragile items",
    },
  }

  return mockDetails[orderId] || mockDetails["FR-3210"]
}

export function OrderDetailDialog({ orderId, isOpen, onClose, onStatusUpdate }: OrderDetailDialogProps) {
  const [currentStatus, setCurrentStatus] = useState("")
  const [notes, setNotes] = useState("")

  if (!orderId) return null

  const order = getOrderDetails(orderId)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "processing":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "shipped":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200"
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

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

  const handleStatusUpdate = () => {
    if (currentStatus && onStatusUpdate) {
      onStatusUpdate(order.id, currentStatus)
      setCurrentStatus("")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold">Order Details - #{order.id}</DialogTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="grid gap-6">
          {/* Order Status and Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Order Status & Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Status:</span>
                  <Badge className={getStatusColor(order.status)} variant="secondary">
                    {order.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Payment:</span>
                  <Badge className={getPaymentStatusColor(order.paymentStatus)} variant="secondary">
                    {order.paymentStatus}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 ml-auto">
                  <Select value={currentStatus} onValueChange={setCurrentStatus}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Update Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={handleStatusUpdate} disabled={!currentStatus}>
                    Update
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Customer Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Customer Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{order.customer}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{order.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{order.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Ordered on {order.date}</span>
                </div>
              </CardContent>
            </Card>

            {/* Payment Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">Payment Method:</span>
                  <span className="text-sm font-medium">{order.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Payment Status:</span>
                  <Badge className={getPaymentStatusColor(order.paymentStatus)} variant="secondary">
                    {order.paymentStatus}
                  </Badge>
                </div>
                <Separator />
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Subtotal:</span>
                    <span className="text-sm">${order.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Tax:</span>
                    <span className="text-sm">${order.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Shipping:</span>
                    <span className="text-sm">${order.shipping.toFixed(2)}</span>
                  </div>
                  {order.discount && order.discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span className="text-sm">Discount:</span>
                      <span className="text-sm">-${order.discount.toFixed(2)}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between font-medium">
                    <span>Total:</span>
                    <span>${order.total.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Order Items ({order.items.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Package className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{item.name}</h4>
                      {item.variant && <p className="text-sm text-muted-foreground">{item.variant}</p>}
                      <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                      <p className="text-sm text-muted-foreground">${item.price.toFixed(2)} each</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Shipping Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Shipping Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-sm font-medium">Shipping Method</Label>
                  <p className="text-sm">{order.shippingMethod}</p>
                </div>
                {order.trackingNumber && (
                  <div>
                    <Label className="text-sm font-medium">Tracking Number</Label>
                    <p className="text-sm font-mono">{order.trackingNumber}</p>
                  </div>
                )}
                {order.estimatedDelivery && (
                  <div>
                    <Label className="text-sm font-medium">Estimated Delivery</Label>
                    <p className="text-sm">{order.estimatedDelivery}</p>
                  </div>
                )}
                <div>
                  <Label className="text-sm font-medium">Shipping Address</Label>
                  <div className="text-sm space-y-1">
                    <p>{order.shippingAddress.name}</p>
                    <p>{order.shippingAddress.street}</p>
                    <p>
                      {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                    </p>
                    <p>{order.shippingAddress.country}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Billing Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Billing Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm space-y-1">
                  <p className="font-medium">{order.billingAddress.name}</p>
                  <p>{order.billingAddress.street}</p>
                  <p>
                    {order.billingAddress.city}, {order.billingAddress.state} {order.billingAddress.zipCode}
                  </p>
                  <p>{order.billingAddress.country}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Notes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Order Notes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {order.notes && (
                <div>
                  <Label className="text-sm font-medium">Customer Notes</Label>
                  <p className="text-sm bg-gray-50 p-3 rounded-lg">{order.notes}</p>
                </div>
              )}
              <div>
                <Label htmlFor="admin-notes" className="text-sm font-medium">
                  Admin Notes
                </Label>
                <Textarea
                  id="admin-notes"
                  placeholder="Add internal notes about this order..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="mt-1"
                />
                <Button size="sm" className="mt-2">
                  Save Notes
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
