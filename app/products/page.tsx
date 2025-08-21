"use client"

import { useState } from "react"
import { ProductCard } from "@/components/product-card"
import { Header } from "@/components/header"
import Footer from "@/components/footer"
import { mockProducts } from "@/lib/mock-data"
import type { Product } from "@/types"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

export default function AllProductsPage({
  searchParams,
}: {
  searchParams: { search?: string }
}) {
  const searchQuery = searchParams.search?.toLowerCase() || ""

  const [selectedCategory, setSelectedCategory] = useState("all")

  // 🔍 Get unique categories from products
  const categories = Array.from(
    new Set(mockProducts.map((product) => product.category?.name).filter(Boolean))
  )

  // 🎯 Filter by search and category
  const filteredProducts: Product[] = mockProducts.filter((product) => {
    const matchesSearch =
      product.title.toLowerCase().includes(searchQuery) ||
      product.category?.name.toLowerCase().includes(searchQuery)

    const matchesCategory =
      selectedCategory === "all" ||
      product.category?.name.toLowerCase() === selectedCategory.toLowerCase()

    return matchesSearch && matchesCategory
  })

  return (
    <>
    <Header />
    <div className="container mx-auto px-4">
      <div className="text-start space-y-4 mb-12 py-8">
        <h1 className="text-4xl font-bold">All Products</h1>
        <p className="text-muted-foreground">
          Browse our complete collection of premium leather goods
        </p>
        <p className="text-sm text-muted-foreground">
          Showing {filteredProducts.length} product
          {filteredProducts.length !== 1 && "s"}
          {searchQuery && ` matching “${searchQuery}”`}
        </p>
      </div>

      {/* 🔽 Sort by Category Dropdown */}
      <div className="mb-8 max-w-xs">
        <Label htmlFor="category-select" className="block mb-1">
          Sort by Category
        </Label>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger id="category-select" className="w-full">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* 🧱 Product Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <h2 className="text-2xl font-semibold">No products found</h2>
          <p className="text-muted-foreground">
            Try a different search term or category.
          </p>
        </div>
      )}
    </div>
    <Footer />
    </>
  )
}
