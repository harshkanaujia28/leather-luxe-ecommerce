"use client";

import { useEffect, useState } from "react";
import { ProductCard } from "@/components/product-card";
import { Header } from "@/components/header";
import Footer from "@/components/footer";
import { ProductFilter } from "@/components/ProductFilter";
import api from "@/utils/axios";

interface Product {
  _id: string;
  name: string;
  price: number;
  brand: string;
  category: {
    category: string;      // ✅ your backend sends THIS
    subCategory: string;
    gender: string;
  };
  offer?: { isActive: boolean; value?: number };
  rating?: number;
}

type Filters = {
  gender: string;
  productType: string;
  subCategory: string;
  minPrice: string;
  maxPrice: string;
  offer: boolean;
};

export default function AllProductsPage() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState<Filters>({
    gender: "",
    productType: "",
    subCategory: "",
    minPrice: "",
    maxPrice: "",
    offer: false,
  });

  // ✅ Load once
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const res = await api.get("/products");
        setAllProducts(res.data.products || []);
        setProducts(res.data.products || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load products.");
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  // ✅ Filter on frontend
  useEffect(() => {
    let filtered = [...allProducts];

    if (filters.gender) {
      filtered = filtered.filter(
        (p) =>
          p.category?.gender?.toLowerCase() ===
          filters.gender.toLowerCase()
      );
    }

    if (filters.productType) {
      filtered = filtered.filter(
        (p) => p.category?.category === filters.productType
      );
    }

    if (filters.subCategory) {
      filtered = filtered.filter(
        (p) =>
          p.category?.subCategory?.toLowerCase() ===
          filters.subCategory.toLowerCase()
      );
    }

    if (filters.minPrice) {
      filtered = filtered.filter(
        (p) => p.price >= Number(filters.minPrice)
      );
    }

    if (filters.maxPrice) {
      filtered = filtered.filter(
        (p) => p.price <= Number(filters.maxPrice)
      );
    }

    if (filters.offer) {
      filtered = filtered.filter((p) => p.offer?.isActive === true);
    }

    setProducts(filtered);
  }, [filters, allProducts]);

  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-10 flex flex-col min-h-screen">
        <h1 className="text-4xl font-bold mb-4 text-center">All Products</h1>

        <p className="text-center text-muted-foreground mb-6">
          {loading
            ? "Loading products..."
            : `Showing ${products.length} product${products.length !== 1 ? "s" : ""}`}
        </p>

        {/* ✅ Filters */}
        <div className="max-h-screen overflow-y-auto mb-6">
          <ProductFilter filters={filters} onFilterChange={setFilters} />
        </div>

        {/* ✅ Error handling */}
        {error && (
          <div className="text-center py-4 text-red-500">
            {error}{" "}
            <button
              onClick={() => window.location.reload()}
              className="ml-2 px-4 py-2 bg-blue-500 text-white rounded"
            >
              Retry
            </button>
          </div>
        )}

        {/* ✅ Products */}
        <div className="flex-1 max-h-screen overflow-y-auto">
          {loading ? (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="animate-pulse bg-gray-200 h-80 rounded-lg"></div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          ) : filters.productType || filters.subCategory ? (
            <div className="flex-1 flex items-center justify-center">
              <h2 className="text-2xl font-semibold text-gray-500 text-center">
                Coming Soon in this category!
              </h2>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <h2 className="text-2xl font-semibold text-center">
                No products found.
              </h2>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
