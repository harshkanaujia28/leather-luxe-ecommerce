"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Edit, Trash2, X } from "lucide-react";
import AddProductForm from "@/components/add-product-form";
import UpdateProductForm from "@/components/UpdateProductForm";
import api from "@/utils/axios";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editingProductData, setEditingProductData] = useState<any>(null);

  // Fetch all products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get("/products");
      setProducts(Array.isArray(res.data) ? res.data : res.data.products || []);
      console.log(res.data.products)
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await api.delete(`/products/${id}`);
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete product");
    }
  };

  const handleAddProduct = (newProduct: any) => {
    setProducts((prev) => [...prev, { ...newProduct }]);
    setIsAddDialogOpen(false);
  };

  const handleUpdateProduct = (updatedProduct: any) => {
    setProducts((prev) =>
      prev.map((p) => (p._id === updatedProduct._id ? updatedProduct : p))
    );
    setEditingProductId(null);
    setEditingProductData(null);
  };

  const handleEditClick = async (id: string) => {
    setEditingProductId(id);
    try {
      const res = await api.get(`/products/${id}`);
      if (res.data.success) setEditingProductData(res.data.product);
    } catch (err) {
      console.error("Failed to fetch product for edit:", err);
      alert("Failed to fetch product data");
    }
  };

  const getProductImage = (product: any): string => {
    if (product.mainImage) return product.mainImage;
    const colors = product.specifications?.colors || [];
    if (colors.length > 0 && colors[0].images?.length > 0) {
      return colors[0].images[0];
    }
    return "/placeholder.svg?height=48&width=48";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-muted-foreground">Manage your product catalog</p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      {/* Product Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Products ({products.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading products...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => {
                  const image = getProductImage(product);
                  const totalStock = product.variants?.reduce(
                    (sum: number, v: any) => sum + (v.stock || 0),
                    0
                  );

                  return (
                    <TableRow key={product._id}>
                      <TableCell>
                        <div className="relative h-12 w-12 rounded-md overflow-hidden border">
                          <Image
                            src={image}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>
                        {product.category?.subCategory || product.category?.category || "—"}
                      </TableCell>
                      <TableCell>₹{product.price?.toFixed(2)}</TableCell>
                      <TableCell>{totalStock ?? 0}</TableCell>
                      <TableCell>
                        <Badge variant={totalStock > 0 ? "default" : "destructive"}>
                          {totalStock > 0 ? "In Stock" : "Out of Stock"}
                        </Badge>
                        {product.featured && <Badge variant="secondary" className="ml-2">Featured</Badge>}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button size="sm" variant="outline" onClick={() => handleEditClick(product._id)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleDelete(product._id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Add Product Dialog */}
      {isAddDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-lg w-[90%] max-w-3xl relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
              onClick={() => setIsAddDialogOpen(false)}
            >
              <X />
            </button>
            <h2 className="text-xl font-bold p-4 border-b">Add New Product</h2>
            <div className="p-4 max-h-[80vh] overflow-y-auto">
              <AddProductForm onSubmit={handleAddProduct} />
            </div>
          </div>
        </div>
      )}

      {/* Update Product Dialog */}
      {editingProductId && editingProductData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-lg w-[90%] max-w-4xl relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
              onClick={() => setEditingProductId(null)}
            >
              <X />
            </button>
            <h2 className="text-xl font-bold p-4 border-b">Edit Product</h2>
            <div className="p-4 max-h-[80vh] overflow-y-auto">
              <UpdateProductForm
                product={editingProductData}
                productId={editingProductId}
                onSubmit={handleUpdateProduct}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
