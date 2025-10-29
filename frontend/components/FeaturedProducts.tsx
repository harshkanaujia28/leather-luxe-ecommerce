"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product-card";

export default function FeaturedProducts({ products }: { products: any[] }) {
    const featured = products
        ?.filter((p) => p.featured === true)
        .slice(0, 6);

    return (
        <section className="container mx-auto px-4 py-16">
            <div className="text-center space-y-4 mb-12">
                <h2 className="text-3xl font-bold tracking-tight">🌟 Featured Products</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                    Our most popular & premium picks — curated just for you.
                </p>
            </div>

            {featured.length === 0 ? (
                <p className="text-center text-gray-500">No featured products available.</p>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
                    {featured.map((product) => (
                        <ProductCard key={product._id} product={product} />
                    ))}
                </div>
            )}

            <div className="text-center mt-12">
                <Button size="lg" variant="outline" asChild>
                    <Link href="/products?featured=true">Show All Featured Products</Link>
                </Button>
            </div>

        </section>
    );
}
