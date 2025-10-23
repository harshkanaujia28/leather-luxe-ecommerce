"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Header } from "@/components/header";
import Footer from "@/components/footer";
import { ProductCard } from "@/components/product-card";
import api from "@/utils/axios";
import { Button } from "@/components/ui/button";

interface Product {
  _id: string;
  name: string;
  price: number;
  brand: string;
  images?: string[];
  category: { subCategory: string; gender: string };
  offer?: { isActive: boolean; value?: number };
  rating?: number;
}

export default function CategoryPage() {
  const { slug } = useParams();
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ Fetch products only if category = "leather-belts"
  const fetchCategoryProducts = async () => {
    try {
      setLoading(true);
      setError("");

      if (slug !== "leather-belts") {
        // For other categories → directly show "Coming Soon"
        setProducts([]);
        setLoading(false);
        return;
      }

      const res = await api.get(`/products?categorySlug=${slug}`);
      setProducts(res.data.products || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load products. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (slug) fetchCategoryProducts();
  }, [slug]);

  const formattedTitle = slug?.toString().replaceAll("-", " ");

  return (
    <>
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-12 min-h-screen">
        {/* Category Title */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-amber-700 to-yellow-600 bg-clip-text text-transparent capitalize">
            {formattedTitle}
          </h1>
          <p className="text-muted-foreground mt-3">
            Explore our finest collection of {formattedTitle}.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="text-center text-red-500 mb-6">
            <p>{error}</p>
            <Button
              variant="outline"
              onClick={fetchCategoryProducts}
              className="mt-3"
            >
              Retry
            </Button>
          </div>
        )}

        {/* Loading Skeleton */}
        {loading ? (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="animate-pulse bg-gray-200 h-80 rounded-xl shadow-sm"
              />
            ))}
          </div>
        ) : products.length > 0 ? (
          // ✅ Product Grid (only for Leather Belts)
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          // ✅ Coming Soon Section (for all other categories)
          <div className="flex flex-col items-center justify-center h-[60vh] bg-gradient-to-b from-gray-50 to-white rounded-2xl border border-gray-200 text-center shadow-sm">
            <h2 className="text-3xl md:text-4xl text-gray-700 font-semibold mb-4">
              Coming Soon!
            </h2>
            <p className="text-gray-500 mb-8 max-w-md">
              We’re crafting premium {formattedTitle} — check back soon for new arrivals!
            </p>
            <Button
              variant="outline"
              onClick={() => router.push("/products")}
              className="text-lg hover:bg-gray-100"
            >
              Explore Other Products
            </Button>
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}
