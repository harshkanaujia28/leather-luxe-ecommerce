"use client"

import Image from "next/image"
import { notFound } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { getProductBySlug } from "@/lib/mock-data"
import { AddToCartButton } from "@/components/add-to-cart-button"
import { Heart, Share2, Truck, Shield, RotateCcw } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useWishlist } from "@/contexts/wishlist-context"
import { useToast } from "@/hooks/use-toast"

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = getProductBySlug(params.slug)
  const { addItem, removeItem, isInWishlist } = useWishlist()
  const { toast } = useToast()
  const [wishlistToggled, setWishlistToggled] = useState(false)

  if (!product) notFound()

  const inWishlist = isInWishlist(product.id)

  const toggleWishlist = () => {
    setWishlistToggled(true)
    setTimeout(() => setWishlistToggled(false), 200)

    if (inWishlist) {
      removeItem(product.id)
      toast({
        title: "Removed from Wishlist",
        description: `${product.title} was removed from your wishlist.`,
      })
    } else {
      addItem(product)
      toast({
        title: "Added to Wishlist",
        description: `${product.title} was added to your wishlist.`,
      })
    }
  }

  return (
    <div className="container mx-auto px-4">
      <Header />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 py-8">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="relative aspect-square rounded-lg overflow-hidden">
            <Image
              src={product.images[0] || "/placeholder.svg?height=600&width=600"}
              alt={product.title}
              fill
              className="object-cover"
            />
            {product.featured && <Badge className="absolute top-4 left-4">Featured</Badge>}
          </div>

          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {product.images.slice(1, 5).map((image, index) => (
                <div key={index} className="relative aspect-square rounded-md overflow-hidden">
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`${product.title} ${index + 2}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{product.title}</h1>
            <p className="text-muted-foreground mt-2">{product.category?.name}</p>
          </div>

          <div className="text-3xl font-bold">${product.price.toFixed(2)}</div>

          <div className="space-y-4">
            <p className="text-muted-foreground">{product.description}</p>
            <div className="flex items-center space-x-4">
              <span
                className={`text-sm ${
                  product.stock > 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
              </span>
            </div>
          </div>

          <Separator />

          {/* Cart & Wishlist Buttons */}
          <div className="space-y-4">
            <AddToCartButton product={product} />
            <div className="flex space-x-4">
              <Button
                variant="outline"
                className="flex-1 bg-transparent"
                onClick={toggleWishlist}
              >
                <Heart
                  key={wishlistToggled ? "toggled" : "idle"}
                  className={`h-4 w-4 mr-2 transition-all duration-200 ${
                    inWishlist ? "text-red-500 fill-red-500 scale-110" : "text-muted-foreground"
                  }`}
                />
                {inWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
              </Button>
              <Button variant="outline" size="icon">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>

            {inWishlist && (
              <p className="text-sm text-green-600">
               ✅ This product is in your wishlist
              </p>
            )}
          </div>

          <Separator />

          {/* Features */}
          <div className="space-y-4">
            <h3 className="font-semibold">Why Choose This Product?</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Truck className="h-5 w-5 text-primary" />
                <span className="text-sm">Free shipping on orders over $100</span>
              </div>
              <div className="flex items-center space-x-3">
                <Shield className="h-5 w-5 text-primary" />
                <span className="text-sm">Lifetime warranty included</span>
              </div>
              <div className="flex items-center space-x-3">
                <RotateCcw className="h-5 w-5 text-primary" />
                <span className="text-sm">30-day return policy</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details */}
      <div className="mt-16">
        <Card>
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold mb-6">Product Details</h2>
            <div className="prose max-w-none">
              <p>
                This premium leather product is crafted with the finest materials and
                attention to detail. Each piece is handmade by skilled artisans who take
                pride in their work, ensuring that every product meets our high standards
                of quality and durability.
              </p>
              <h3>Features:</h3>
              <ul>
                <li>100% genuine leather construction</li>
                <li>Hand-stitched with premium thread</li>
                <li>Brass hardware for durability</li>
                <li>Protective finish to resist wear</li>
                <li>Comes with care instructions</li>
              </ul>
              <h3>Care Instructions:</h3>
              <ul>
                <li>Clean with a soft, dry cloth</li>
                <li>Apply leather conditioner monthly</li>
                <li>Store in a cool, dry place</li>
                <li>Avoid exposure to direct sunlight</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  )
}
