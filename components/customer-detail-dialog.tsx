"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ShoppingBag,
  DollarSign,
  TrendingUp,
  Edit,
  MessageSquare,
  Gift,
  Star,
} from "lucide-react"

interface CustomerOrder {
  id: string
  date: string
  total: number
  status: string
  items: number
}

interface CustomerDetails {
  id: string
  name: string
  email: string
  phone: string
  location: string
  totalOrders: number
  totalSpent: number
  lastOrder: string
  status: "active" | "inactive" | "vip" | "at-risk"
  joinDate: string
  avatar?: string
  segment: "new" | "regular" | "vip" | "at-risk"
  address: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  orders: CustomerOrder[]
  notes?: string
  tags: string[]
  loyaltyPoints: number
  averageOrderValue: number
}

interface CustomerDetailDialogProps {
  customerId: string | null
  isOpen: boolean
  onClose: () => void
}

// Mock customer details - in real app, this would come from API
const getCustomerDetails = (customerId: string): CustomerDetails => {
  const mockDetails: Record<string, CustomerDetails> = {
    "CUST-001": {
      id: "CUST-001",
      name: "Sarah Johnson",
      email: "sarah@example.com",
      phone: "+1 (555) 123-4567",
      location: "New York, NY",
      totalOrders: 12,
      totalSpent: 1250.5,
      lastOrder: "2024-01-15",
      status: "vip",
      joinDate: "2023-03-15",
      segment: "vip",
      avatar: "/placeholder.svg?height=80&width=80",
      address: {
        street: "123 Main Street, Apt 4B",
        city: "New York",
        state: "NY",
        zipCode: "10001",
        country: "United States",
      },
      orders: [
        { id: "FR-3210", date: "2024-01-15", total: 188.6, status: "processing", items: 2 },
        { id: "FR-3180", date: "2024-01-02", total: 245.0, status: "delivered", items: 1 },
        { id: "FR-3156", date: "2023-12-20", total: 320.5, status: "delivered", items: 3 },
        { id: "FR-3134", date: "2023-12-05", total: 159.99, status: "delivered", items: 1 },
        { id: "FR-3098", date: "2023-11-18", total: 336.41, status: "delivered", items: 2 },
      ],
      notes: "VIP customer - prefers premium fragrances. Very responsive to email campaigns.",
      tags: ["VIP", "Email Subscriber", "Repeat Customer", "High Value"],
      loyaltyPoints: 1250,
      averageOrderValue: 104.21,
    },
  }

  return mockDetails[customerId] || mockDetails["CUST-001"]
}

export function CustomerDetailDialog({ customerId, isOpen, onClose }: CustomerDetailDialogProps) {
  if (!customerId) return null

  const customer = getCustomerDetails(customerId)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200"
      case "vip":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "inactive":
        return "bg-gray-100 text-gray-800 border-gray-200"
      case "at-risk":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getOrderStatusColor = (status: string) => {
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold">Customer Profile</DialogTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Mail className="h-4 w-4 mr-2" />
                Send Email
              </Button>
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="grid gap-6">
          {/* Customer Header */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-6">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={customer.avatar || "/placeholder.svg"} alt={customer.name} />
                  <AvatarFallback className="text-lg">
                    {customer.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-2xl font-bold">{customer.name}</h3>
                    <Badge className={getStatusColor(customer.status)} variant="secondary">
                      {customer.status}
                    </Badge>
                    {customer.status === "vip" && (
                      <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200" variant="secondary">
                        <Star className="h-3 w-3 mr-1" />
                        VIP
                      </Badge>
                    )}
                  </div>
                  <p className="text-muted-foreground mb-4">Customer ID: {customer.id}</p>
                  <div className="flex flex-wrap gap-2">
                    {customer.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600">${customer.totalSpent.toLocaleString()}</div>
                  <p className="text-sm text-muted-foreground">Total Spent</p>
                  <div className="text-lg font-semibold mt-2">{customer.totalOrders}</div>
                  <p className="text-sm text-muted-foreground">Orders</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">{customer.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Phone</p>
                    <p className="text-sm text-muted-foreground">{customer.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Address</p>
                    <p className="text-sm text-muted-foreground">
                      {customer.address.street}
                      <br />
                      {customer.address.city}, {customer.address.state} {customer.address.zipCode}
                      <br />
                      {customer.address.country}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Customer Since</p>
                    <p className="text-sm text-muted-foreground">{customer.joinDate}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Customer Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Customer Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Total Orders</span>
                  </div>
                  <span className="font-medium">{customer.totalOrders}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Average Order Value</span>
                  </div>
                  <span className="font-medium">${customer.averageOrderValue}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Gift className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Loyalty Points</span>
                  </div>
                  <span className="font-medium">{customer.loyaltyPoints}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Last Order</span>
                  </div>
                  <span className="font-medium">{customer.lastOrder}</span>
                </div>
              </CardContent>
            </Card>

            {/* Customer Notes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Customer Notes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  {customer.notes || "No notes available for this customer."}
                </p>
                <Button variant="outline" size="sm" className="w-full bg-transparent">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Notes
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Order History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5" />
                Order History ({customer.orders.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customer.orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">#{order.id}</TableCell>
                      <TableCell>{order.date}</TableCell>
                      <TableCell>{order.items}</TableCell>
                      <TableCell>${order.total.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge className={getOrderStatusColor(order.status)} variant="secondary">
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          View Order
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
