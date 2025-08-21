"use client"

import Image from "next/image"
import { notFound } from "next/navigation"
import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { getProductBySlug,getBestSellerProducts } from "@/lib/mock-data"
import { ProductCard } from "@/components/product-card"
import { AddToCartButton } from "@/components/add-to-cart-button"
import { Heart, Share2, Truck, Shield, RotateCcw, Star, ChevronRight } from "lucide-react"
import { Header } from "@/components/header"
import Footer from "@/components/footer"
import { useWishlist } from "@/contexts/wishlist-context"
import { useToast } from "@/hooks/use-toast"

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = getProductBySlug(params.slug)
  const { addItem, removeItem, isInWishlist } = useWishlist()
  const { toast } = useToast()
   const bestSellerProducts = getBestSellerProducts()
  const [wishlistToggled, setWishlistToggled] = useState(false)
  const [selectedImage, setSelectedImage] = useState(0)

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
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-background via-card to-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 py-16">
            {/* Product Images */}
            <div className="space-y-6">
              <div className="relative aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-card to-muted shadow-2xl group">
                <Image
                  src={
                    product.images[selectedImage] ||
                    "/placeholder.svg?height=600&width=600&query=premium product showcase"
                  }
                  alt={product.title}
                  fill
                  className="object-cover transition-all duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {product.featured && (
                  <Badge className="absolute top-6 left-6 bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-lg text-sm px-4 py-2 pulse-glow">
                    ✨ Featured
                  </Badge>
                )}

                <div className="absolute top-6 right-6">
                  <Badge variant={product.stock > 0 ? "default" : "destructive"} className="shadow-lg">
                    {product.stock > 0 ? `${product.stock} left` : "Sold out"}
                  </Badge>
                </div>
              </div>

              {product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                  {product.images.slice(0, 4).map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`relative aspect-square rounded-2xl overflow-hidden border-2 transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                        selectedImage === index
                          ? "border-primary shadow-lg ring-2 ring-primary/20"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <Image
                        src={image || "/placeholder.svg?height=150&width=150&query=product thumbnail"}
                        alt={`${product.title} ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-8 lg:pl-8">
              <div className="space-y-4">
                <div className="flex items-center text-sm text-muted-foreground">
                  <span>Home</span>
                  <ChevronRight className="h-4 w-4 mx-2" />
                  <span>{product.category?.name}</span>
                  <ChevronRight className="h-4 w-4 mx-2" />
                  <span className="text-foreground">{product.title}</span>
                </div>

                <div>
                  <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                    {product.title}
                  </h1>
                  <p className="text-lg text-muted-foreground mt-2">{product.category?.name}</p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">(4.9) • 127 reviews</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-baseline gap-4">
                  <span className="text-4xl font-bold text-primary">${product.price.toFixed(2)}</span>
                  <span className="text-xl text-muted-foreground line-through">
                    ${(product.price * 1.2).toFixed(2)}
                  </span>
                  <Badge variant="secondary" className="text-sm">
                    Save 20%
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">Free shipping on orders over $100</p>
              </div>

              <div className="prose prose-lg max-w-none">
                <p className="text-muted-foreground leading-relaxed text-lg">{product.description}</p>
              </div>

              <Separator className="my-8" />

              <div className="space-y-6">
                <div className="space-y-4">
                  <AddToCartButton product={product} />

                  <div className="flex gap-4">
                    <Button
                      variant="outline"
                      className="flex-1 rounded-full border-2 hover:border-primary hover:bg-primary/5 transition-all duration-300 bg-transparent"
                      onClick={toggleWishlist}
                    >
                      <Heart
                        key={wishlistToggled ? "toggled" : "idle"}
                        className={`h-5 w-5 mr-2 transition-all duration-300 ${
                          inWishlist
                            ? "text-primary fill-primary scale-110"
                            : "text-muted-foreground hover:text-primary"
                        }`}
                      />
                      {inWishlist ? "In Wishlist" : "Add to Wishlist"}
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full border-2 hover:border-primary hover:bg-primary/5 transition-all duration-300 bg-transparent"
                    >
                      <Share2 className="h-5 w-5" />
                    </Button>
                  </div>

                  {inWishlist && (
                    <div className="flex items-center gap-2 text-sm text-primary bg-primary/10 rounded-full px-4 py-2 w-fit">
                      <Heart className="h-4 w-4 fill-primary" />
                      <span>Saved to your wishlist</span>
                    </div>
                  )}
                </div>

                <Separator />

                <div className="space-y-6">
                  <h3 className="text-xl font-semibold">Premium Benefits</h3>
                  <div className="grid gap-4">
                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-card to-muted/50 border border-border/50">
                      <div className="p-2 rounded-full bg-primary/10">
                        <Truck className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <span className="font-medium">Free Express Shipping</span>
                        <p className="text-sm text-muted-foreground">On orders over $100</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-card to-muted/50 border border-border/50">
                      <div className="p-2 rounded-full bg-primary/10">
                        <Shield className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <span className="font-medium">Lifetime Warranty</span>
                        <p className="text-sm text-muted-foreground">Premium quality guarantee</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-card to-muted/50 border border-border/50">
                      <div className="p-2 rounded-full bg-primary/10">
                        <RotateCcw className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <span className="font-medium">30-Day Returns</span>
                        <p className="text-sm text-muted-foreground">Hassle-free exchanges</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-0 mb-16">
            <Card className="border-0 shadow-2xl rounded-3xl bg-gradient-to-br from-card via-background to-card overflow-hidden">
              <CardContent className="p-12">
                <div className="max-w-4xl mx-auto">
                  <h2 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    Product Details
                  </h2>
                  <div className="prose prose-lg max-w-none">
                    <p className="text-muted-foreground leading-relaxed text-lg mb-8">
                      This premium leather product is crafted with the finest materials and attention to detail. Each
                      piece is handmade by skilled artisans to ensure long-lasting durability and timeless style.
                    </p>

                    <div className="grid md:grid-cols-2 gap-8">
                      <div>
                        <h3 className="text-xl font-semibold mb-4 text-primary">Features</h3>
                        <ul className="space-y-2 text-muted-foreground">
                          <li className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-primary"></div>
                            100% genuine leather construction
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-primary"></div>
                            Hand-stitched with premium thread
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-primary"></div>
                            Durable brass hardware
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-primary"></div>
                            Protective finish against wear
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-primary"></div>
                            Comes with care instructions
                          </li>
                        </ul>
                      </div>

                      <div>
                        <h3 className="text-xl font-semibold mb-4 text-primary">Care Instructions</h3>
                        <ul className="space-y-2 text-muted-foreground">
                          <li className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-secondary"></div>
                            Clean with a soft, dry cloth
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-secondary"></div>
                            Apply leather conditioner monthly
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-secondary"></div>
                            Store in a cool, dry place
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-secondary"></div>
                            Avoid direct sunlight
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
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
    </>
  )
}
