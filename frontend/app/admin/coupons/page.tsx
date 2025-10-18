"use client"

import { useState, useEffect } from "react"

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
import { useApi } from "@/contexts/api-context"
import { useToast } from "@/hooks/use-toast";


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
interface Coupon {
  _id: string
  code: string
  type: string
  value: number
  minOrder?: string
  usage?: string
  usedCount?: number
  totalLimit: number
  perUserLimit?: number
  status: string
  expiry?: string
  createdDate?: string
  startDate?: string
  description?: string
}
export default function CouponsPage() {
  const { getCoupons, getCouponById, addCoupon, updateCoupon, deleteCoupon } = useApi()
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [selectedCoupon, setSelectedCoupon] = useState<(typeof coupons)[0] | null>(null)
  const [editingCoupon, setEditingCoupon] = useState<(typeof coupons)[0] | null>(null)
  const [coupons, setCoupons] = useState<Coupon[]>([]) // ✅ must be an array, not null
  const [loading, setLoading] = useState(true)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [newCoupon, setNewCoupon] = useState<Partial<Coupon>>({
    code: "",
    type: "Percentage",
    value: 0,
    totalLimit: 1,
    perUserLimit: 1,
    status: "Active",
    minOrder: "",
    usage: "",
    usedCount: 0,
    expiry: "",
    createdDate: "",
    startDate: "",
    description: ""
  })


  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const data = await getCoupons()
        if (Array.isArray(data)) {
          setCoupons(data)
          console.log("Fetched coupons:", data)
        } else {
          console.warn("Expected an array but got:", data)
          setCoupons([]) // fallback to empty
        }
      } catch (error) {
        console.error("Error loading coupons", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCoupons()
  }, [])



  const filteredCoupons = (coupons || []).filter(
    (coupon) =>
      coupon && typeof coupon.code === "string" &&
      coupon.code.toLowerCase().includes(searchTerm.toLowerCase())
  )


  const handleView = async (id: string) => {
    try {
      const data = await getCouponById(id)
      setSelectedCoupon({
        ...data,
        analytics: {
          totalRevenue: 0,
          avgOrderValue: 0,
          conversionRate: 0,
          topProducts: []
        },
        categories: [],
        brands: [],
        customerType: ""
      })
      setIsViewDialogOpen(true)
    } catch (error) {
      console.error("Failed to fetch coupon details", error)
    }
  }

  const handleEdit = (coupon: Coupon) => {
    setSelectedCoupon({
      _id: coupon._id,
      code: coupon.code ?? "",
      type: coupon.type ?? "Percentage",
      value: coupon.value ?? 0,
      totalLimit: coupon.totalLimit ?? 1,
      status: coupon.status ?? "Active",
      minOrder: coupon.minOrder ?? "",
      usage: coupon.usage ?? "",
      expiry: coupon.expiry ?? "",
      createdDate: coupon.createdDate ?? "",
      startDate: coupon.startDate ?? "",
      description: coupon.description ?? ""
    })
    setEditDialogOpen(true)
  }


  const handleEditSave = async () => {
    if (!editingCoupon || !editingCoupon._id) {
      console.error("Missing editingCoupon or coupon ID")
      return
    }

    try {
      const updated = await updateCoupon(editingCoupon._id, editingCoupon)

      if (!updated || !updated._id) {
        console.error("Invalid updateCoupon response", updated)
        return
      }

      setCoupons((prev) =>
        Array.isArray(prev)
          ? prev.map((c) => (c._id === updated._id ? updated : c))
          : []
      )
      toast({
        title: "Coupon updated",
        description: "Coupon has been updated successfully.",
        variant: "success",
      });
    } catch (error) {
      console.error("Failed to update coupon", error)
    } finally {
      // setIsEditDialogOpen(false)
      setEditingCoupon(null)
    }
  }



  const handleAddSave = async () => {
    try {
      const created = await addCoupon({
        ...newCoupon,
        value: Number(newCoupon.value),
        totalLimit: Number(newCoupon.totalLimit),
      })
      setCoupons((prev) => Array.isArray(prev) ? [...prev, created] : [created])
    } catch (error) {
      console.error("Failed to add coupon", error)
    } finally {
      setIsAddDialogOpen(false)
      setNewCoupon({
        code: "",
        type: "Percentage",
        value: 0,
        totalLimit: 1,
        status: "Active",
        minOrder: "",
        usage: "",
        usedCount: 0,
        expiry: "",
        createdDate: "",
        startDate: "",
        description: ""
      })
    }
  }



  const handleDelete = async (id: string) => {
    try {
      await deleteCoupon(id)
      setCoupons((prev) => prev.filter((c) => c._id !== id))
      toast({ title: "Coupon deleted", description: "Coupon has been deleted successfully.",variant:"success" });
    } catch (error) {
      console.error("Failed to delete coupon", error)
    }
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
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  Add New Coupon
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                {/* Coupon Code + Discount Type */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="coupon-code">Coupon Code</Label>
                    <Input
                      id="coupon-code"
                      placeholder="Enter coupon code"
                      value={newCoupon.code}
                      onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="discount-type">Discount Type</Label>
                    <Select
                      value={newCoupon.type}
                      onValueChange={(value) => setNewCoupon({ ...newCoupon, type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select discount type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Percentage">Percentage</SelectItem>
                        <SelectItem value="Fixed Amount">Fixed Amount</SelectItem>
                        <SelectItem value="Free Shipping">Free Shipping</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Value + Minimum Order */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="discount-value">Discount Value</Label>
                    <Input
                      id="discount-value"
                      type="number"
                      placeholder="Enter value"
                      value={newCoupon.value}
                      onChange={(e) =>
                        setNewCoupon({ ...newCoupon, value: Number.parseInt(e.target.value) || 0 })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="min-order">Minimum Order Ammount(₹) </Label>
                    <Input
                      id="min-order"
                      type="number"
                      placeholder="Enter min order"
                      value={newCoupon.minOrder}
                      onChange={(e) => setNewCoupon({ ...newCoupon, minOrder: e.target.value })}
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    rows={3}
                    placeholder="Write a short description..."
                    value={newCoupon.description}
                    onChange={(e) => setNewCoupon({ ...newCoupon, description: e.target.value })}
                  />
                </div>

                {/* Start Date + Expiry Date + Usage Limit */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start-date">Start Date</Label>
                    <Input
                      id="start-date"
                      type="date"
                      value={newCoupon.startDate}
                      onChange={(e) => setNewCoupon({ ...newCoupon, startDate: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expiry-date">Expiry Date</Label>
                    <Input
                      id="expiry-date"
                      type="date"
                      value={newCoupon.expiry}
                      onChange={(e) => setNewCoupon({ ...newCoupon, expiry: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="usage-limit">Usage Limit</Label>
                    <Input
                      id="usage-limit"
                      type="number"
                      value={newCoupon.totalLimit}
                      onChange={(e) =>
                        setNewCoupon({ ...newCoupon, totalLimit: Number.parseInt(e.target.value) || 0 })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="per-user-limit">Per User Limit</Label>
                    <Input
                      id="per-user-limit"
                      type="number"
                      value={newCoupon.perUserLimit}
                      onChange={(e) =>
                        setNewCoupon({ ...newCoupon, perUserLimit: Number.parseInt(e.target.value) || 1 })
                      }
                    />
                  </div>

                </div>

                {/* Status */}
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={newCoupon.status}
                    onValueChange={(value) => setNewCoupon({ ...newCoupon, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                      <SelectItem value="Expired">Expired</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Footer */}
                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddSave}>Add Coupon</Button>
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
                  <TableHead>Per User</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Expiry</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCoupons.map((coupon) => (
                  <TableRow key={coupon._id}>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <code className="bg-muted px-2 py-1 rounded text-sm font-mono">{coupon.code}</code>
                        <Button variant="ghost" size="sm" onClick={() => copyCouponCode(coupon.code)} title="Copy code">
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>{coupon.type}</TableCell>
                    <TableCell className="font-medium">
                      {coupon.type === "Percentage" ? `${coupon.value}%` : `$${coupon.value}`}
                    </TableCell>
                    <TableCell>{coupon.minOrder || "-"}</TableCell>
                    <TableCell>{coupon.usedCount || "-"}</TableCell>
                    <TableCell>{coupon.perUserLimit || "-"}</TableCell>

                    <TableCell>
                      <Badge className={getStatusColor(coupon.status)} variant="secondary">
                        {coupon.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{coupon.expiry ? new Date(coupon.expiry).toLocaleDateString() : "-"}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => handleView(coupon._id)} title="View">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button onClick={() => {
                          setEditingCoupon(coupon)
                          setEditDialogOpen(true)
                        }}>
                          Edit
                        </Button>

                        <Button variant="ghost" size="sm" onClick={() => handleDelete(coupon._id)} title="Delete">
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
                    {/* <TabsTrigger value="analytics">Analytics</TabsTrigger>
                    <TabsTrigger value="restrictions">Restrictions</TabsTrigger> */}
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
                            <div>
                              <span className="font-medium text-sm">Minimum Order:</span>
                              <p className="text-muted-foreground">{selectedCoupon.minOrder}</p>
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
                              <span className="font-medium">Per User Limit:</span>
                              <p className="text-muted-foreground">{selectedCoupon.perUserLimit}</p>
                            </div>

                            <div>
                              <span className="font-medium">Remaining:</span>
                              <p className="text-muted-foreground">
                                {selectedCoupon.totalLimit
                                  ? selectedCoupon.totalLimit - (selectedCoupon.usedCount || 0)
                                  : "-"}
                              </p>
                            </div>
                            <div>
                              <span className="font-medium">Usage Rate:</span>
                              <p className="text-muted-foreground">
                                {selectedCoupon.totalLimit
                                  ? `${((selectedCoupon.usedCount || 0) / selectedCoupon.totalLimit * 100).toFixed(1)}%`
                                  : "0%"}
                              </p>
                            </div>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-purple-600 h-2 rounded-full"
                              style={{
                                width: selectedCoupon.totalLimit
                                  ? `${((selectedCoupon.usedCount || 0) / selectedCoupon.totalLimit) * 100}%`
                                  : "0%",
                              }}
                            ></div>
                          </div>

                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Users className="h-5 w-5" />
                            Users Who Used This Coupon
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          {selectedCoupon?.users && selectedCoupon.users.length > 0 ? (
                            <div className="space-y-2">
                              {selectedCoupon.users.map((u, idx) => (
                                <div key={idx} className="flex justify-between p-2 bg-gray-50 rounded">
                                  <span>{u.customer}</span>
                                  <span className="text-sm text-muted-foreground">{u.email}</span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-muted-foreground">No users have used this coupon yet.</p>
                          )}
                        </CardContent>
                      </Card>

                    </div>
                  </TabsContent>

                  {/* <TabsContent value="analytics" className="space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-green-600" />
                            <span className="text-sm text-muted-foreground">Total Revenue</span>
                          </div>
                          <div className="text-2xl font-bold">
                            {selectedCoupon.analytics?.totalRevenue !== undefined
                              ? `$${selectedCoupon.analytics.totalRevenue.toLocaleString()}`
                              : "N/A"}
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-blue-600" />
                            <span className="text-sm text-muted-foreground">Avg Order Value</span>
                          </div>
                          <div className="text-2xl font-bold">
                            {selectedCoupon.analytics?.avgOrderValue !== undefined
                              ? `$${selectedCoupon.analytics.avgOrderValue}`
                              : "N/A"}
                          </div>

                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-purple-600" />
                            <span className="text-sm text-muted-foreground">Conversion Rate</span>
                          </div>
                          <div className="text-2xl font-bold">
                            {selectedCoupon?.analytics?.conversionRate !== undefined
                              ? `${selectedCoupon.analytics.conversionRate}%`
                              : "N/A"}
                          </div>

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
                  </TabsContent> */}

                  {/* <TabsContent value="restrictions" className="space-y-4">
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
                         
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent> */}
                </Tabs>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Edit Coupon Dialog */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Edit className="h-5 w-5 text-purple-600" />
                Edit Coupon {editingCoupon?.code ? `- ${editingCoupon.code}` : ""}
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
                    <Label htmlFor="edit-min-order">Minimum Order Ammount(₹)</Label>
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

                <div className="grid grid-cols-2 gap-4">
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
                  <div className="space-y-2">
                    <Label htmlFor="edit-per-user-limit">Per User Limit</Label>
                    <Input
                      id="edit-per-user-limit"
                      type="number"
                      value={editingCoupon.perUserLimit}
                      onChange={(e) =>
                        setEditingCoupon({ ...editingCoupon, perUserLimit: Number.parseInt(e.target.value) || 1 })
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
                  <Button onClick={handleEditSave}>Save Changes</Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
