"use client"

import Image from "next/image"
import Link from "next/link"
import { Heart, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Product } from "@/types"
import { useCart } from "@/contexts/cart-context"
import { useToast } from "@/hooks/use-toast"
import { useWishlist } from "@/contexts/wishlist-context"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart()
  const { toast } = useToast()
  const { addItem: addToWishlist, removeItem, isInWishlist } = useWishlist()

  const inWishlist = isInWishlist(product.id)

  const toggleWishlist = () => {
    if (inWishlist) {
      removeItem(product.id)
      toast({
        title: "Removed from Wishlist",
        description: `${product.title} was removed from your wishlist.`,
      })
    } else {
      addToWishlist(product)
      toast({
        title: "Added to Wishlist",
        description: `${product.title} was added to your wishlist.`,
      })
    }
  }

  const handleAddToCart = () => {
    addItem(product)
    toast({
      title: "Added to cart",
      description: `${product.title} has been added to your cart.`,
    })
  }

  return (
    <Card className="group relative overflow-hidden rounded-2xl border bg-card shadow-sm transition-all hover:shadow-xl">
      {/* Image wrapper */}
      <div className="relative aspect-square w-full overflow-hidden">
        <Image
          src={product.images[0] || "/placeholder.svg?height=300&width=300"}
          alt={product.title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
        />

        {/* Badge container */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
          {product.featured && (
            <Badge className="text-xs bg-yellow-400 text-black shadow-md">
              Featured
            </Badge>
          )}
          {product.bestSeller && (
            <Badge className="text-xs bg-red-500 text-white shadow-md">
              Best Seller
            </Badge>
          )}
        </div>

        {/* Wishlist button */}
        <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-x-[-2.5rem]">
          <Button
            size="icon"
            variant="ghost"
            className="rounded-full bg-white/80 backdrop-blur-md hover:bg-white shadow"
            onClick={toggleWishlist}
          >
            <Heart
              className={`h-5 w-5 transition-colors ${
                inWishlist ? "text-red-500 fill-red-500" : "text-muted-foreground"
              }`}
            />
          </Button>
        </div>

        {/* Overlay + Quick Add */}
        <div className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-black/40 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            size="sm"
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="mb-4 rounded-full group-hover:shadow-[var(--shadow-glow)] transition-all duration-300"
          >
            <ShoppingCart className="h-4 w-4 mr-1" />
            Add to Cart
          </Button>
        </div>
      </div>

      {/* Content */}
      <CardContent className="p-4 space-y-1">
        <Link href={`/product/${product.slug}`}>
          <h3 className="text-base font-semibold tracking-tight hover:text-primary transition-colors line-clamp-1">
            {product.title}
          </h3>
        </Link>

        <p className="text-sm text-muted-foreground line-clamp-2">
          {product.description}
        </p>
      </CardContent>

      {/* Price & stock */}
      <CardFooter className="flex items-center justify-between px-4 pb-4 pt-0">
        <span className="text-lg font-bold text-foreground">₹{product.price}</span>
        <span
          className={`text-xs font-medium ${
            product.stock > 0 ? "text-green-600" : "text-red-500"
          }`}
        >
          {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
        </span>
      </CardFooter>
    </Card>
  )
}
