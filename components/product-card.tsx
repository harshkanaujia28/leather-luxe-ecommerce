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
    <Card className="group overflow-hidden rounded-2xl border bg-white shadow-sm transition-all hover:shadow-lg">
      <div className="relative aspect-square w-full overflow-hidden">
        <Image
          src={product.images[0] || "/placeholder.svg?height=300&width=300"}
          alt={product.title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
        />

        {product.featured && (
          <Badge className="absolute top-3 left-3 text-xs bg-yellow-400 text-black shadow-md">
            Featured
          </Badge>
        )}

        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity z-10">
          <Button
            size="icon"
            variant="ghost"
            className="rounded-full bg-white/80 backdrop-blur-md hover:bg-white shadow"
            onClick={toggleWishlist}
          >
            <Heart
              className={`h-4 w-4 transition-colors ${
                inWishlist ? "text-red-500 fill-red-500" : "text-muted-foreground"
              }`}
            />
          </Button>
        </div>
      </div>

      <CardContent className="p-4 space-y-2">
        <Link href={`/product/${product.slug}`}>
          <h3 className="text-lg font-semibold tracking-tight hover:text-primary transition-colors">
            {product.title}
          </h3>
        </Link>

        <p className="text-sm text-muted-foreground line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center justify-between pt-1">
          <span className="text-base font-bold text-foreground">${product.price}</span>
          <span
            className={`text-xs font-medium ${
              product.stock > 0 ? "text-green-600" : "text-red-500"
            }`}
          >
            {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
          </span>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button
          className="w-full text-sm"
          onClick={handleAddToCart}
          disabled={product.stock === 0}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  )
}
