"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { Edit, Eye, Plus, Trash2, Upload } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

const banners = [
  {
    id: 1,
    title: "Summer Sale",
    description: "Up to 50% off on summer collection",
    position: "Homepage Hero",
    status: "Active",
    startDate: "2024-06-01",
    endDate: "2024-08-31",
    clicks: 1250,
    image: "/placeholder.svg?height=100&width=200",
  },
  {
    id: 2,
    title: "New Arrivals",
    description: "Check out our latest products",
    position: "Category Page",
    status: "Active",
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    clicks: 890,
    image: "/placeholder.svg?height=100&width=200",
  },
  {
    id: 3,
    title: "Black Friday",
    description: "Biggest sale of the year",
    position: "Homepage Hero",
    status: "Scheduled",
    startDate: "2024-11-29",
    endDate: "2024-12-02",
    clicks: 0,
    image: "/placeholder.svg?height=100&width=200",
  },
  {
    id: 4,
    title: "Winter Collection",
    description: "Stay warm with our winter gear",
    position: "Sidebar",
    status: "Inactive",
    startDate: "2023-12-01",
    endDate: "2024-02-29",
    clicks: 2340,
    image: "/placeholder.svg?height=100&width=200",
  },
]

export default function BannersPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "default"
      case "Scheduled":
        return "secondary"
      case "Inactive":
        return "outline"
      default:
        return "secondary"
    }
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Banners</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Banner
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Banner</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Banner Title</Label>
                <Input id="title" placeholder="Enter banner title" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" placeholder="Banner description" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="position">Position</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select position" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="homepage-hero">Homepage Hero</SelectItem>
                    <SelectItem value="category-page">Category Page</SelectItem>
                    <SelectItem value="sidebar">Sidebar</SelectItem>
                    <SelectItem value="footer">Footer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="image">Banner Image</Label>
                <div className="flex items-center gap-2">
                  <Input id="image" type="file" accept="image/*" />
                  <Button variant="outline" size="icon">
                    <Upload className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="grid gap-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input id="startDate" type="date" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input id="endDate" type="date" />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsDialogOpen(false)}>Create Banner</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Banner Management</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Preview</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Clicks</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {banners.map((banner) => (
                <TableRow key={banner.id}>
                  <TableCell>
                    <Image
                      src={banner.image || "/placeholder.svg"}
                      alt={banner.title}
                      width={80}
                      height={40}
                      className="rounded object-cover"
                    />
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{banner.title}</div>
                      <div className="text-sm text-muted-foreground">{banner.description}</div>
                    </div>
                  </TableCell>
                  <TableCell>{banner.position}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(banner.status)}>{banner.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{banner.startDate}</div>
                      <div className="text-muted-foreground">to {banner.endDate}</div>
                    </div>
                  </TableCell>
                  <TableCell>{banner.clicks.toLocaleString()}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
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
    </div>
  )
}
