"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Search, Edit, Trash2, Copy, Eye, Calendar, Users, TrendingUp } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const coupons = [
  {
    id: 1,
    code: "SAVE20",
    type: "Percentage",
    value: "20%",
    minOrder: "$100.00",
    usage: "45/100",
    status: "Active",
    expiry: "2024-03-15",
    description: "20% off on all fragrance orders above $100",
    createdDate: "2024-01-01",
    usedCount: 45,
    totalLimit: 100,
    categories: ["All Categories"],
    brands: ["All Brands"],
    customerType: "All Customers",
    startDate: "2024-01-01",
    analytics: {
      totalRevenue: 12500,
      avgOrderValue: 278,
      conversionRate: 8.5,
      topProducts: ["Chanel No. 5", "Dior Sauvage", "Tom Ford Black Orchid"],
    },
  },
  {
    id: 2,
    code: "WELCOME10",
    type: "Fixed Amount",
    value: "$10.00",
    minOrder: "$50.00",
    usage: "123/500",
    status: "Active",
    expiry: "2024-06-30",
    description: "Welcome discount for new customers",
    createdDate: "2023-12-01",
    usedCount: 123,
    totalLimit: 500,
    categories: ["Women's Fragrance", "Men's Fragrance"],
    brands: ["Chanel", "Dior", "Marc Jacobs"],
    customerType: "New Customers",
    startDate: "2023-12-01",
    analytics: {
      totalRevenue: 8900,
      avgOrderValue: 72,
      conversionRate: 12.3,
      topProducts: ["Marc Jacobs Daisy", "Dior Sauvage", "Chanel No. 5"],
    },
  },
  {
    id: 3,
    code: "FREESHIP",
    type: "Free Shipping",
    value: "Free",
    minOrder: "$25.00",
    usage: "89/200",
    status: "Active",
    expiry: "2024-12-31",
    description: "Free shipping on orders above $25",
    createdDate: "2024-01-15",
    usedCount: 89,
    totalLimit: 200,
    categories: ["All Categories"],
    brands: ["All Brands"],
    customerType: "All Customers",
    startDate: "2024-01-15",
    analytics: {
      totalRevenue: 6700,
      avgOrderValue: 75,
      conversionRate: 15.2,
      topProducts: ["Tom Ford Black Orchid", "Creed Aventus", "Marc Jacobs Daisy"],
    },
  },
  {
    id: 4,
    code: "EXPIRED50",
    type: "Percentage",
    value: "50%",
    minOrder: "$200.00",
    usage: "12/50",
    status: "Expired",
    expiry: "2024-01-01",
    description: "Holiday special - 50% off luxury fragrances",
    createdDate: "2023-11-01",
    usedCount: 12,
    totalLimit: 50,
    categories: ["Luxury Fragrances"],
    brands: ["Chanel", "Tom Ford", "Creed"],
    customerType: "VIP Customers",
    startDate: "2023-11-01",
    analytics: {
      totalRevenue: 15600,
      avgOrderValue: 1300,
      conversionRate: 24.0,
      topProducts: ["Creed Aventus", "Tom Ford Black Orchid", "Chanel No. 5"],
    },
  },
  {
    id: 5,
    code: "INACTIVE25",
    type: "Percentage",
    value: "25%",
    minOrder: "$75.00",
    usage: "0/100",
    status: "Inactive",
    expiry: "2024-04-20",
    description: "Spring collection discount",
    createdDate: "2024-01-10",
    usedCount: 0,
    totalLimit: 100,
    categories: ["Spring Collection"],
    brands: ["Marc Jacobs", "Calvin Klein"],
    customerType: "All Customers",
    startDate: "2024-03-01",
    analytics: {
      totalRevenue: 0,
      avgOrderValue: 0,
      conversionRate: 0,
      topProducts: [],
    },
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "Active":
      return "bg-green-100 text-green-800"
    case "Expired":
      return "bg-red-100 text-red-800"
    case "Inactive":
      return "bg-gray-100 text-gray-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export default function CouponsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [selectedCoupon, setSelectedCoupon] = useState<(typeof coupons)[0] | null>(null)
  const [editingCoupon, setEditingCoupon] = useState<(typeof coupons)[0] | null>(null)

  const filteredCoupons = coupons.filter((coupon) => coupon.code.toLowerCase().includes(searchTerm.toLowerCase()))

  const handleEdit = (coupon: (typeof coupons)[0]) => {
    setEditingCoupon({ ...coupon })
    setIsEditDialogOpen(true)
  }

  const handleView = (coupon: (typeof coupons)[0]) => {
    setSelectedCoupon(coupon)
    setIsViewDialogOpen(true)
  }

  const handleSaveEdit = () => {
    // Here you would typically make an API call to update the coupon
    console.log("Saving coupon:", editingCoupon)
    setIsEditDialogOpen(false)
    setEditingCoupon(null)
  }

  const copyCouponCode = (code: string) => {
    navigator.clipboard.writeText(code)
    // You could add a toast notification here
    console.log(`Copied coupon code: ${code}`)
  }

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Coupons & Discounts</h2>
            <p className="text-muted-foreground">Manage promotional codes and discounts</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Coupon
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Coupon</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="coupon-code">Coupon Code</Label>
                  <Input id="coupon-code" placeholder="Enter coupon code" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="discount-type">Discount Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select discount type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage</SelectItem>
                      <SelectItem value="fixed">Fixed Amount</SelectItem>
                      <SelectItem value="free-shipping">Free Shipping</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="discount-value">Discount Value</Label>
                  <Input id="discount-value" placeholder="Enter discount value" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="min-order">Minimum Order Amount</Label>
                  <Input id="min-order" placeholder="Enter minimum order amount" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="usage-limit">Usage Limit</Label>
                  <Input id="usage-limit" type="number" placeholder="Enter usage limit" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expiry-date">Expiry Date</Label>
                  <Input id="expiry-date" type="date" />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="active-coupon" />
                  <Label htmlFor="active-coupon">Active</Label>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setIsAddDialogOpen(false)}>Add Coupon</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Coupon List</CardTitle>
            <div className="flex items-center space-x-2">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search coupons..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Min Order</TableHead>
                  <TableHead>Usage</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Expiry</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCoupons.map((coupon) => (
                  <TableRow key={coupon.id}>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <code className="bg-muted px-2 py-1 rounded text-sm font-mono">{coupon.code}</code>
                        <Button variant="ghost" size="sm" onClick={() => copyCouponCode(coupon.code)}>
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>{coupon.type}</TableCell>
                    <TableCell className="font-medium">{coupon.value}</TableCell>
                    <TableCell>{coupon.minOrder}</TableCell>
                    <TableCell>{coupon.usage}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(coupon.status)} variant="secondary">
                        {coupon.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{coupon.expiry}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => handleView(coupon)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(coupon)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* View Coupon Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-purple-600" />
                Coupon Details - {selectedCoupon?.code}
              </DialogTitle>
            </DialogHeader>
            {selectedCoupon && (
              <div className="space-y-6">
                {/* Coupon Header */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="bg-purple-100 p-3 rounded-lg">
                      <code className="text-lg font-bold text-purple-800">{selectedCoupon.code}</code>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">{selectedCoupon.description}</h3>
                      <p className="text-muted-foreground">
                        {selectedCoupon.type} - {selectedCoupon.value}
                      </p>
                      <Badge className={getStatusColor(selectedCoupon.status)} variant="secondary">
                        {selectedCoupon.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Usage</p>
                    <p className="text-2xl font-bold">
                      {selectedCoupon.usedCount}/{selectedCoupon.totalLimit}
                    </p>
                  </div>
                </div>

                <Tabs defaultValue="details" className="space-y-4">
                  <TabsList>
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="analytics">Analytics</TabsTrigger>
                    <TabsTrigger value="restrictions">Restrictions</TabsTrigger>
                  </TabsList>

                  <TabsContent value="details" className="space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Calendar className="h-5 w-5" />
                            Coupon Information
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="font-medium">Coupon Code:</span>
                              <p className="text-muted-foreground">{selectedCoupon.code}</p>
                            </div>
                            <div>
                              <span className="font-medium">Discount Type:</span>
                              <p className="text-muted-foreground">{selectedCoupon.type}</p>
                            </div>
                            <div>
                              <span className="font-medium">Discount Value:</span>
                              <p className="text-muted-foreground">{selectedCoupon.value}</p>
                            </div>
                            <div>
                              <span className="font-medium">Min Order:</span>
                              <p className="text-muted-foreground">{selectedCoupon.minOrder}</p>
                            </div>
                            <div>
                              <span className="font-medium">Start Date:</span>
                              <p className="text-muted-foreground">{selectedCoupon.startDate}</p>
                            </div>
                            <div>
                              <span className="font-medium">Expiry Date:</span>
                              <p className="text-muted-foreground">{selectedCoupon.expiry}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Users className="h-5 w-5" />
                            Usage Statistics
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="font-medium">Times Used:</span>
                              <p className="text-muted-foreground">{selectedCoupon.usedCount}</p>
                            </div>
                            <div>
                              <span className="font-medium">Usage Limit:</span>
                              <p className="text-muted-foreground">{selectedCoupon.totalLimit}</p>
                            </div>
                            <div>
                              <span className="font-medium">Remaining:</span>
                              <p className="text-muted-foreground">
                                {selectedCoupon.totalLimit - selectedCoupon.usedCount}
                              </p>
                            </div>
                            <div>
                              <span className="font-medium">Usage Rate:</span>
                              <p className="text-muted-foreground">
                                {((selectedCoupon.usedCount / selectedCoupon.totalLimit) * 100).toFixed(1)}%
                              </p>
                            </div>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-purple-600 h-2 rounded-full"
                              style={{
                                width: `${(selectedCoupon.usedCount / selectedCoupon.totalLimit) * 100}%`,
                              }}
                            ></div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="analytics" className="space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-green-600" />
                            <span className="text-sm text-muted-foreground">Total Revenue</span>
                          </div>
                          <div className="text-2xl font-bold">
                            ${selectedCoupon.analytics.totalRevenue.toLocaleString()}
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-blue-600" />
                            <span className="text-sm text-muted-foreground">Avg Order Value</span>
                          </div>
                          <div className="text-2xl font-bold">${selectedCoupon.analytics.avgOrderValue}</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-purple-600" />
                            <span className="text-sm text-muted-foreground">Conversion Rate</span>
                          </div>
                          <div className="text-2xl font-bold">{selectedCoupon.analytics.conversionRate}%</div>
                        </CardContent>
                      </Card>
                    </div>

                    {selectedCoupon.analytics.topProducts.length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle>Top Products with This Coupon</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            {selectedCoupon.analytics.topProducts.map((product, index) => (
                              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                <span className="font-medium">{product}</span>
                                <Badge variant="secondary">#{index + 1}</Badge>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </TabsContent>

                  <TabsContent value="restrictions" className="space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle>Product Restrictions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div>
                            <span className="font-medium text-sm">Categories:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {selectedCoupon.categories.map((category) => (
                                <Badge key={category} variant="secondary" className="text-xs">
                                  {category}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div>
                            <span className="font-medium text-sm">Brands:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {selectedCoupon.brands.map((brand) => (
                                <Badge key={brand} variant="outline" className="text-xs">
                                  {brand}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle>Customer Restrictions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div>
                            <span className="font-medium text-sm">Customer Type:</span>
                            <p className="text-muted-foreground">{selectedCoupon.customerType}</p>
                          </div>
                          <div>
                            <span className="font-medium text-sm">Minimum Order:</span>
                            <p className="text-muted-foreground">{selectedCoupon.minOrder}</p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Edit Coupon Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Edit className="h-5 w-5 text-purple-600" />
                Edit Coupon - {editingCoupon?.code}
              </DialogTitle>
            </DialogHeader>
            {editingCoupon && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-coupon-code">Coupon Code</Label>
                    <Input
                      id="edit-coupon-code"
                      value={editingCoupon.code}
                      onChange={(e) => setEditingCoupon({ ...editingCoupon, code: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-discount-type">Discount Type</Label>
                    <Select
                      value={editingCoupon.type}
                      onValueChange={(value) => setEditingCoupon({ ...editingCoupon, type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Percentage">Percentage</SelectItem>
                        <SelectItem value="Fixed Amount">Fixed Amount</SelectItem>
                        <SelectItem value="Free Shipping">Free Shipping</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-discount-value">Discount Value</Label>
                    <Input
                      id="edit-discount-value"
                      value={editingCoupon.value}
                      onChange={(e) => setEditingCoupon({ ...editingCoupon, value: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-min-order">Minimum Order</Label>
                    <Input
                      id="edit-min-order"
                      value={editingCoupon.minOrder}
                      onChange={(e) => setEditingCoupon({ ...editingCoupon, minOrder: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-description">Description</Label>
                  <Textarea
                    id="edit-description"
                    value={editingCoupon.description}
                    onChange={(e) => setEditingCoupon({ ...editingCoupon, description: e.target.value })}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-start-date">Start Date</Label>
                    <Input
                      id="edit-start-date"
                      type="date"
                      value={editingCoupon.startDate}
                      onChange={(e) => setEditingCoupon({ ...editingCoupon, startDate: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-expiry-date">Expiry Date</Label>
                    <Input
                      id="edit-expiry-date"
                      type="date"
                      value={editingCoupon.expiry}
                      onChange={(e) => setEditingCoupon({ ...editingCoupon, expiry: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-usage-limit">Usage Limit</Label>
                    <Input
                      id="edit-usage-limit"
                      type="number"
                      value={editingCoupon.totalLimit}
                      onChange={(e) =>
                        setEditingCoupon({ ...editingCoupon, totalLimit: Number.parseInt(e.target.value) || 0 })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-status">Status</Label>
                  <Select
                    value={editingCoupon.status}
                    onValueChange={(value) => setEditingCoupon({ ...editingCoupon, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                      <SelectItem value="Expired">Expired</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveEdit}>Save Changes</Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
