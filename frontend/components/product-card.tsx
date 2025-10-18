"use client";
import { useState } from "react";
import Link from "next/link";
import { Heart, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@/types";
import { useCart } from "@/contexts/cart-context";
import { useToast } from "@/hooks/use-toast";
import { useWishlist } from "@/contexts/wishlist-context";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  const { toast } = useToast();
  const { addItem: addToWishlist, removeItem, isInWishlist } = useWishlist();

  const productId = product._id || product.id;
  const inWishlist = isInWishlist(productId);

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (inWishlist) {
      removeItem(productId);
      toast({ title: "Removed from Wishlist", description: `${product.name} removed` });
    } else {
      addToWishlist(product);
      toast({ title: "Added to Wishlist", description: `${product.name} added` });
    }
  };

  const getFinalPrice = (product: Product) => {
    if (product.offer?.isActive) {
      if (product.offer.type === "percentage") {
        return product.price - product.price * (product.offer.value / 100);
      } else if (product.offer.type === "fixed") {
        return product.price - product.offer.value;
      }
    }
    return product.price;
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (product.stock <= 0) {
      toast({
        title: "Out of Stock",
        description: `${product.name} unavailable`,
        variant: "destructive",
      });
      return;
    }

    if (!product._id) {
      console.error("❌ Product missing _id");
      return;
    }


    await addToCart(
      product._id,
      quantity,
      selectedSize,
      selectedColor,
      selectedVariant,
      product.offer,       // ✅ send the offer object
      snapshotPrice        // ✅ send the final price
    );

    toast({
      title: "Added to Cart",
      description: `${product.name} added to cart`,
    });
  };
  // Total stock from variants
  const totalStock = product.variants?.reduce(
    (sum: number, v: any) => sum + (v.stock || 0),
    0
  ) ?? 0;

  const getProductImage = (product: Product): string => {
    if (product.mainImage) return product.mainImage;

    const colors = (product.specifications?.colors || product.colors || []) as any[];
    for (const c of colors) {
      if (c.images?.length > 0) return c.images[0];
    }

    return "/placeholder.svg?height=300&width=300";
  };

  return (
    <Link href={`/product/${productId}`} className="block group">
      <Card className="relative overflow-hidden rounded-2xl border bg-card shadow-sm transition-all hover:shadow-xl">
        <div className="relative aspect-square w-full overflow-hidden">
          <img
            src={getProductImage(product)}
            alt={product.name || "Product image"}
            className="object-cover w-full h-full transition-transform duration-500 ease-in-out group-hover:scale-110"
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1 z-10 pointer-events-none">
            {product.featured && <Badge className="text-xs bg-yellow-400 text-black shadow-md">Featured</Badge>}
            {product.bestSeller && <Badge className="text-xs bg-red-500 text-white shadow-md">Best Seller</Badge>}
            {product.offer?.isActive && (
              <Badge className="text-xs bg-green-500 text-white shadow-md">
                {product.offer.type === "percentage" && product.offer.value > 0
                  ? `${product.offer.value}% OFF`
                  : product.offer.type === "fixed" && product.offer.value > 0
                    ? `₹${product.offer.value} OFF`
                    : "Offer"}
              </Badge>
            )}
          </div>

          {/* Wishlist Button */}
          <div className="absolute top-3 right-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button
              size="icon"
              variant="ghost"
              className="rounded-full bg-white/80 backdrop-blur-md hover:bg-white shadow"
              onClick={toggleWishlist}
            >
              <Heart className={`h-5 w-5 transition-colors ${inWishlist ? "text-red-500 fill-red-500" : "text-muted-foreground"}`} />
            </Button>
          </div>

          {/* Add to Cart Overlay */}
          <div className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-black/40 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              size="sm"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="mb-4 rounded-full bg-white/80 backdrop-blur-md hover:bg-white text-black shadow pointer-events-auto"
            >
              <ShoppingCart className="h-4 w-4 mr-1" />
              Add to Cart
            </Button>
          </div>
        </div>

        <CardContent className="p-4 space-y-1">
          <h3 className="text-base font-semibold tracking-tight hover:text-primary transition-colors line-clamp-1 cursor-pointer">
            {product.name}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 pb-4 pt-2 space-y-1 sm:space-y-0">
          <div className="flex items-baseline gap-2">
            {/* Final Price */}
            <span className="text-lg font-bold text-foreground">
              ₹{getFinalPrice(product).toFixed(2)}
            </span>

            {/* Original Price if discounted */}
            {product.offer?.isActive && (
              <span className="text-xs sm:text-sm text-gray-500 line-through">
                ₹{product.price.toFixed(2)}
              </span>
            )}
          </div>

          {/* Stock Status */}
          <span
            className={`text-xs sm:text-sm font-medium ${totalStock > 0 ? "text-green-600" : "text-red-500"
              }`}
          >
            {totalStock > 0 ? `${totalStock} in stock` : "Out of stock"}
          </span>
        </CardFooter>

      </Card>
    </Link>
  );
}
