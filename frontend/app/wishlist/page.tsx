"use client";

import { useWishlist } from "@/contexts/wishlist-context";
import { Heart } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { Header } from "@/components/header";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function WishlistPage() {
  const { items: wishlist } = useWishlist();

  return (
    <>
      <Header />
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold my-8 text-center">Your Wishlist</h1>

        {wishlist.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlist.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 space-y-6">
            <Heart className="h-24 w-24 mx-auto text-gray-400" />
            <p className="text-lg font-medium text-muted-foreground">
              Your wishlist is empty.
            </p>
            <p className="text-muted-foreground">
              Looks like you haven’t added any items yet.
            </p>
            <Button asChild>
              <Link href="/products">Continue Shopping</Link>
            </Button>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
