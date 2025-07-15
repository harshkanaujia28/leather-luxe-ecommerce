"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Search, Edit, Trash2, MapPin, Clock, Truck, Users } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"

const vendors = [
  { id: 1, name: "FastTrack Logistics", active: true },
  { id: 2, name: "Express Delivery Co", active: true },
  { id: 3, name: "Quick Ship Services", active: true },
  { id: 4, name: "Metro Courier", active: true },
  { id: 5, name: "City Express", active: false },
]

const indianStates = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Lakshadweep",
  "Puducherry",
]

const initialZones = [
  {
    id: 1,
    pincode: "110001",
    area: "Connaught Place",
    city: "New Delhi",
    state: "Delhi",
    deliveryFee: 50,
    deliveryTime: "1-2 days",
    isActive: true,
    zoneType: "Metro",
    assignedVendors: [1, 2],
    coverage: 95,
  },
  {
    id: 2,
    pincode: "400001",
    area: "Fort",
    city: "Mumbai",
    state: "Maharashtra",
    deliveryFee: 60,
    deliveryTime: "1-2 days",
    isActive: true,
    zoneType: "Metro",
    assignedVendors: [1, 3],
    coverage: 98,
  },
  {
    id: 3,
    pincode: "560001",
    area: "Bangalore City",
    city: "Bangalore",
    state: "Karnataka",
    deliveryFee: 55,
    deliveryTime: "2-3 days",
    isActive: true,
    zoneType: "Tier 1",
    assignedVendors: [2, 4],
    coverage: 92,
  },
  {
    id: 4,
    pincode: "600001",
    area: "George Town",
    city: "Chennai",
    state: "Tamil Nadu",
    deliveryFee: 65,
    deliveryTime: "2-3 days",
    isActive: true,
    zoneType: "Tier 1",
    assignedVendors: [1, 4],
    coverage: 90,
  },
  {
    id: 5,
    pincode: "700001",
    area: "BBD Bagh",
    city: "Kolkata",
    state: "West Bengal",
    deliveryFee: 70,
    deliveryTime: "3-4 days",
    isActive: false,
    zoneType: "Tier 2",
    assignedVendors: [3],
    coverage: 85,
  },
]

export default function DeliveryZonesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [zones, setZones] = useState(initialZones)
  const [editingZone, setEditingZone] = useState(null)
  const [editFormData, setEditFormData] = useState({
    pincode: "",
    area: "",
    city: "",
    state: "",
    deliveryFee: "",
    deliveryTime: "",
    zoneType: "",
    assignedVendors: [],
  })
  const { toast } = useToast()

  const filteredZones = zones.filter(
    (zone) =>
      zone.pincode.includes(searchTerm) ||
      zone.area.toLowerCase().includes(searchTerm.toLowerCase()) ||
      zone.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      zone.state.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const totalZones = zones.length
  const activeZones = zones.filter((z) => z.isActive).length
  const averageFee = zones.reduce((sum, zone) => sum + zone.deliveryFee, 0) / zones.length
  const averageCoverage = zones.reduce((sum, zone) => sum + zone.coverage, 0) / zones.length

  const handleToggleZone = (zoneId: number) => {
    setZones(zones.map((zone) => (zone.id === zoneId ? { ...zone, isActive: !zone.isActive } : zone)))
    toast({
      title: "Zone Updated",
      description: "Delivery zone status has been updated successfully.",
    })
  }

  const handleEditZone = (zone) => {
    setEditingZone(zone)
    setEditFormData({
      pincode: zone.pincode,
      area: zone.area,
      city: zone.city,
      state: zone.state,
      deliveryFee: zone.deliveryFee.toString(),
      deliveryTime: zone.deliveryTime,
      zoneType: zone.zoneType,
      assignedVendors: zone.assignedVendors,
    })
    setIsEditDialogOpen(true)
  }

  const handleSaveEdit = () => {
    if (!editingZone) return

    const updatedZones = zones.map((zone) =>
      zone.id === editingZone.id
        ? {
            ...zone,
            pincode: editFormData.pincode,
            area: editFormData.area,
            city: editFormData.city,
            state: editFormData.state,
            deliveryFee: Number.parseInt(editFormData.deliveryFee),
            deliveryTime: editFormData.deliveryTime,
            zoneType: editFormData.zoneType,
            assignedVendors: editFormData.assignedVendors,
          }
        : zone,
    )

    setZones(updatedZones)
    setIsEditDialogOpen(false)
    setEditingZone(null)

    toast({
      title: "Zone Updated",
      description: "Delivery zone has been updated successfully.",
    })
  }

  const handleVendorToggle = (vendorId: number, checked: boolean) => {
    setEditFormData((prev) => ({
      ...prev,
      assignedVendors: checked
        ? [...prev.assignedVendors, vendorId]
        : prev.assignedVendors.filter((id) => id !== vendorId),
    }))
  }

  const getVendorNames = (vendorIds: number[]) => {
    return vendors
      .filter((vendor) => vendorIds.includes(vendor.id))
      .map((vendor) => vendor.name)
      .join(", ")
  }

  return (
    <div className="flex flex-col">
     
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Pincode-Based Delivery Management</h2>
            <p className="text-muted-foreground">Manage delivery zones, fees, and vendor assignments</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Zone
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Delivery Zone</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="new-pincode">Pincode *</Label>
                    <Input id="new-pincode" placeholder="Enter 6-digit pincode" maxLength={6} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-area">Area/Locality *</Label>
                    <Input id="new-area" placeholder="Enter area name" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="new-city">City *</Label>
                    <Input id="new-city" placeholder="Enter city name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-state">State *</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        {indianStates.map((state) => (
                          <SelectItem key={state} value={state.toLowerCase().replace(/\s+/g, "-")}>
                            {state}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="new-fee">Delivery Fee (₹) *</Label>
                    <Input id="new-fee" placeholder="50" type="number" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-time">Delivery Time *</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select time" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="same-day">Same Day</SelectItem>
                        <SelectItem value="1-2-days">1-2 Days</SelectItem>
                        <SelectItem value="2-3-days">2-3 Days</SelectItem>
                        <SelectItem value="3-5-days">3-5 Days</SelectItem>
                        <SelectItem value="5-7-days">5-7 Days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-type">Zone Type *</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="metro">Metro</SelectItem>
                        <SelectItem value="tier-1">Tier 1</SelectItem>
                        <SelectItem value="tier-2">Tier 2</SelectItem>
                        <SelectItem value="tier-3">Tier 3</SelectItem>
                        <SelectItem value="rural">Rural</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Assign Vendors</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {vendors
                      .filter((v) => v.active)
                      .map((vendor) => (
                        <div key={vendor.id} className="flex items-center space-x-2">
                          <Checkbox id={`vendor-${vendor.id}`} />
                          <Label htmlFor={`vendor-${vendor.id}`} className="text-sm">
                            {vendor.name}
                          </Label>
                        </div>
                      ))}
                  </div>
                </div>
                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setIsAddDialogOpen(false)}>Add Zone</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Zones</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalZones}</div>
              <p className="text-xs text-muted-foreground">{activeZones} active zones</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Fee</CardTitle>
              <Truck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{averageFee.toFixed(0)}</div>
              <p className="text-xs text-muted-foreground">Per delivery</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Coverage</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{averageCoverage.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground">Average coverage</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Vendors</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{vendors.filter((v) => v.active).length}</div>
              <p className="text-xs text-muted-foreground">Active partners</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Delivery Zone Management</CardTitle>
            <div className="flex items-center space-x-2">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by pincode, area, city, or state..."
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
                  <TableHead>Pincode</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Zone Type</TableHead>
                  <TableHead>Delivery Fee</TableHead>
                  <TableHead>Delivery Time</TableHead>
                  <TableHead>Assigned Vendors</TableHead>
                  <TableHead>Coverage</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredZones.map((zone) => (
                  <TableRow key={zone.id}>
                    <TableCell className="font-mono font-medium">{zone.pincode}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{zone.area}</div>
                        <div className="text-sm text-muted-foreground">
                          {zone.city}, {zone.state}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          zone.zoneType === "Metro"
                            ? "border-green-500 text-green-700"
                            : zone.zoneType === "Tier 1"
                              ? "border-blue-500 text-blue-700"
                              : zone.zoneType === "Tier 2"
                                ? "border-yellow-500 text-yellow-700"
                                : "border-gray-500 text-gray-700"
                        }
                      >
                        {zone.zoneType}
                      </Badge>
                    </TableCell>
                    <TableCell>₹{zone.deliveryFee}</TableCell>
                    <TableCell>{zone.deliveryTime}</TableCell>
                    <TableCell className="max-w-[200px]">
                      <div className="truncate text-sm" title={getVendorNames(zone.assignedVendors)}>
                        {getVendorNames(zone.assignedVendors)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-12 bg-gray-200 rounded-full h-2">
                          <div className="bg-green-600 h-2 rounded-full" style={{ width: `${zone.coverage}%` }}></div>
                        </div>
                        <span className="text-sm">{zone.coverage}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Switch checked={zone.isActive} onCheckedChange={() => handleToggleZone(zone.id)} />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEditZone(zone)}>
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

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Delivery Zone</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-pincode">Pincode *</Label>
                  <Input
                    id="edit-pincode"
                    value={editFormData.pincode}
                    onChange={(e) => setEditFormData((prev) => ({ ...prev, pincode: e.target.value }))}
                    maxLength={6}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-area">Area/Locality *</Label>
                  <Input
                    id="edit-area"
                    value={editFormData.area}
                    onChange={(e) => setEditFormData((prev) => ({ ...prev, area: e.target.value }))}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-city">City *</Label>
                  <Input
                    id="edit-city"
                    value={editFormData.city}
                    onChange={(e) => setEditFormData((prev) => ({ ...prev, city: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-state">State *</Label>
                  <Select
                    value={editFormData.state.toLowerCase().replace(/\s+/g, "-")}
                    onValueChange={(value) => {
                      const stateName = indianStates.find((state) => state.toLowerCase().replace(/\s+/g, "-") === value)
                      setEditFormData((prev) => ({ ...prev, state: stateName || value }))
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {indianStates.map((state) => (
                        <SelectItem key={state} value={state.toLowerCase().replace(/\s+/g, "-")}>
                          {state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-fee">Delivery Fee (₹) *</Label>
                  <Input
                    id="edit-fee"
                    type="number"
                    value={editFormData.deliveryFee}
                    onChange={(e) => setEditFormData((prev) => ({ ...prev, deliveryFee: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-time">Delivery Time *</Label>
                  <Select
                    value={editFormData.deliveryTime}
                    onValueChange={(value) => setEditFormData((prev) => ({ ...prev, deliveryTime: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Same Day">Same Day</SelectItem>
                      <SelectItem value="1-2 days">1-2 Days</SelectItem>
                      <SelectItem value="2-3 days">2-3 Days</SelectItem>
                      <SelectItem value="3-5 days">3-5 Days</SelectItem>
                      <SelectItem value="5-7 days">5-7 Days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-type">Zone Type *</Label>
                  <Select
                    value={editFormData.zoneType}
                    onValueChange={(value) => setEditFormData((prev) => ({ ...prev, zoneType: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Metro">Metro</SelectItem>
                      <SelectItem value="Tier 1">Tier 1</SelectItem>
                      <SelectItem value="Tier 2">Tier 2</SelectItem>
                      <SelectItem value="Tier 3">Tier 3</SelectItem>
                      <SelectItem value="Rural">Rural</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Assign Vendors</Label>
                <div className="grid grid-cols-2 gap-2">
                  {vendors
                    .filter((v) => v.active)
                    .map((vendor) => (
                      <div key={vendor.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`edit-vendor-${vendor.id}`}
                          checked={editFormData.assignedVendors.includes(vendor.id)}
                          onCheckedChange={(checked) => handleVendorToggle(vendor.id, checked)}
                        />
                        <Label htmlFor={`edit-vendor-${vendor.id}`} className="text-sm">
                          {vendor.name}
                        </Label>
                      </div>
                    ))}
                </div>
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveEdit}>Save Changes</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
