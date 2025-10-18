"use client"

import { useEffect, useState } from "react"
import axios from "@/utils/axios"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Search, Edit, Trash2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import Image from "next/image"

export default function CategoriesPage() {
  const [categories, setCategories] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(null)

  const [formData, setFormData] = useState({
    gender: "Men",
    productType: "",
    subCategories: "",
    image: null,
    state: "Active"
  })

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const res = await axios.get("/category")
      setCategories(res.data)
      console.log(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, files } = e.target
    if (files) setFormData({ ...formData, [name]: files[0] })
    else setFormData({ ...formData, [name]: value })
  }

  // Add category
  const handleAddCategory = async () => {
    if (!formData.productType.trim()) {
      alert("Product Type is required")
      return
    }

    try {
      const subCategoriesArray = formData.subCategories
        ? formData.subCategories.split(",").map(s => s.trim())
        : []

      await axios.post("/category", {
        gender: formData.gender,
        productType: formData.productType.trim(),
        subCategories: subCategoriesArray,
        state: formData.state
      }, {
        headers: { "Content-Type": "application/json" }
      })

      setIsAddDialogOpen(false)
      setFormData({ gender: "Men", productType: "", subCategories: "", image: null, state: "Active" })
      fetchCategories()
    } catch (err) {
      console.error(err)
    }
  }

  // Edit category
  const handleEditCategory = (category) => {
    setSelectedCategory(category)
    setFormData({
      gender: category.gender,
      productType: category.productType,
      subCategories: category.subCategories.join(", "),
      image: null,
      state: category.state || "Active"
    })
    setIsEditDialogOpen(true)
  }

  const handleUpdateCategory = async () => {
    if (!formData.productType.trim()) {
      alert("Product Type is required")
      return
    }

    try {
      const subCategoriesArray = formData.subCategories
        ? formData.subCategories.split(",").map(s => s.trim())
        : []

      await axios.put(`/category/${selectedCategory._id}`, {
        gender: formData.gender,
        productType: formData.productType.trim(),
        subCategories: subCategoriesArray,
        state: formData.state
      }, {
        headers: { "Content-Type": "application/json" }
      })

      setIsEditDialogOpen(false)
      setSelectedCategory(null)
      setFormData({ gender: "Men", productType: "", subCategories: "", image: null, state: "Active" })
      fetchCategories()
    } catch (err) {
      console.error(err)
    }
  }

  // Delete category
  const handleDeleteCategory = async (id) => {
    if (!confirm("Are you sure you want to delete this category?")) return
    try {
      await axios.delete(`/category/${id}`)
      fetchCategories()
    } catch (err) {
      console.error(err)
    }
  }

  const filteredCategories = categories.filter((c) =>
    c.productType.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="flex flex-col p-4 md:p-8">
      {/* Header + Add Dialog */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-3xl font-bold tracking-tight">Categories</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" />Add Category</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Category</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Gender</Label>
                <select name="gender" value={formData.gender} onChange={handleChange} className="w-full border rounded p-2">
                  <option>Men</option>
                  <option>Women</option>
                  <option>Unisex</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Product Type</Label>
                <Input name="productType" value={formData.productType} onChange={handleChange} placeholder="Enter product type" />
              </div>
              <div className="space-y-2">
                <Label>Subcategories (comma separated)</Label>
                <Input name="subCategories" value={formData.subCategories} onChange={handleChange} placeholder="Sub1, Sub2, Sub3" />
              </div>
              <div className="space-y-2">
                <Label>State</Label>
                <select name="state" value={formData.state} onChange={handleChange} className="w-full border rounded p-2">
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleAddCategory}>Add</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search + Table */}
      <Card>
        <CardHeader>
          <CardTitle>Category List</CardTitle>
          <div className="relative max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search product type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Gender</TableHead>
                <TableHead>Product Type</TableHead>
                <TableHead>Subcategories</TableHead>
                <TableHead>State</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCategories.map((category) => (
                <TableRow key={category._id}>
                  <TableCell>{category.gender}</TableCell>
                  <TableCell>{category.productType}</TableCell>
                  <TableCell>{category.subCategories.join(", ")}</TableCell>
                  <TableCell>{category.state || "Active"}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEditCategory(category)}><Edit className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteCategory(category._id)}><Trash2 className="h-4 w-4" /></Button>
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Gender</Label>
              <select name="gender" value={formData.gender} onChange={handleChange} className="w-full border rounded p-2">
                <option>Men</option>
                <option>Women</option>
                <option>Unisex</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>Product Type</Label>
              <Input name="productType" value={formData.productType} onChange={handleChange} placeholder="Enter product type" />
            </div>
            <div className="space-y-2">
              <Label>Subcategories (comma separated)</Label>
              <Input name="subCategories" value={formData.subCategories} onChange={handleChange} placeholder="Sub1, Sub2, Sub3" />
            </div>
            <div className="space-y-2">
              <Label>State</Label>
              <select name="state" value={formData.state} onChange={handleChange} className="w-full border rounded p-2">
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleUpdateCategory}>Update</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
