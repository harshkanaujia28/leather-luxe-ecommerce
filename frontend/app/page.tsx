"use client"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ProductCard } from "@/components/product-card"
import { mockCategories, getFeaturedProducts, getBestSellerProducts } from "@/lib/mock-data"
import { Header } from "@/components/header"
// app/page.tsx
import Footer from "@/components/footer"  // ✅ for default export
import WhyUs from "@/components/whyus"
import { NewsletterSection } from "@/components/newsletter-section"
import HeroSection from "@/components/Hero"
import CategoryGrid from "@/components/CategoryGrid"
import api from "@/utils/axios";
import { useState, useEffect } from "react";

interface Product {
  _id: string;
  name: string;
  price: number;
  brand: string;
  category?: { subCategory?: string; gender?: string };
  offer?: { isActive: boolean; value?: number };
  rating?: number;
  image?: string;
}

export default function HomePage() {
  const featuredProducts = getFeaturedProducts()
  const bestSellerProducts = getBestSellerProducts()
  const categories = mockCategories.slice(0, 6)
    const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/products");
      // Optional: show only latest 8 products
      const allProducts = res.data.products || [];
      const sorted = allProducts.slice(-8).reverse(); // latest 8 products
      setProducts(sorted);
    } catch (err) {
      console.error(err);
      setError("Failed to load products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[60vh] text-lg font-medium">
        Loading products...
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center min-h-[60vh] text-red-600 font-medium">
        {error}
      </div>
    );

  return (
    <div className="space-y-0">
      <Header />
      <CategoryGrid categories={categories} />
      <HeroSection />
     

      {/* Featured Products */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl font-bold tracking-tight">✨ New Arrivals</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover the latest additions to our collection — crafted to impress.
          </p>
        </div>

        {products.length === 0 ? (
          <p className="text-center text-gray-500">No new arrivals available.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Button size="lg" variant="outline" asChild>
            <Link href="/products">View All Products</Link>
          </Button>
        </div>
      </section>
      <WhyUs />
      {/* Features Section */}
      <section className="bg-muted/50 py-16 px-4 pt-16 pb-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold">Premium Quality</h3>
              <p className="text-muted-foreground">
                Each product is crafted from the finest leather materials with attention to every detail.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold">Fast Shipping</h3>
              <p className="text-muted-foreground">
                Free shipping on orders over $100. Express delivery available nationwide.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold">Lifetime Warranty</h3>
              <p className="text-muted-foreground">
                We stand behind our craftsmanship with a comprehensive lifetime warranty.
              </p>
            </div>
          </div>
        </div>
      </section>
      <div>
        {/* Best Selling Products */}
        <section className="container mx-auto px-4 py-16">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold">Best Selling Products</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Customer favorites that are flying off the shelves
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {bestSellerProducts.slice(0, 6).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}

          </div>

          <div className="text-center mt-12">
            <Button size="lg" variant="outline" asChild>
              <Link href="/products">Shop Best Sellers</Link>
            </Button>
          </div>
        </section>


      </div>

      <Footer />
    </div>
  )
}
