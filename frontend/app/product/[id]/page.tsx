"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Heart, Star, ChevronRight, ShoppingCart, Share2 } from "lucide-react";
import { Header } from "@/components/header";
import Footer from "@/components/footer";
import { useWishlist } from "@/contexts/wishlist-context";
import { useToast } from "@/hooks/use-toast";
import CategoryGrid from "@/components/CategoryGrid";
import axios from "@/utils/axios";
import { useCart } from "@/contexts/cart-context";

interface Review {
  userId?: string;
  name: string;
  comment: string;
  stars: number;
  createdAt: string;
}

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { toast } = useToast();
  const { addItem, removeItem, isInWishlist } = useWishlist();
  const { addToCart } = useCart();

  const { id } = React.use(params); // ✅ unwrap params
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewForm, setReviewForm] = useState({ name: "", stars: 5, comment: "" });

  useEffect(() => {
    async function fetchProduct() {
      try {
        const { data } = await axios.get(`/products/${id}`);
        if (!data.product) return notFound();
        setProduct(data.product);
        setReviews(data.product.reviews || []);
        const firstColor = data.product.specifications?.colors?.[0]?.color;
        setSelectedColor(firstColor || null);
      } catch (err) {
        console.error(err);
        return notFound();
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!product) return notFound();

  const inWishlist = isInWishlist(product._id);

  const toggleWishlist = () => {
    if (inWishlist) {
      removeItem(product._id);
      toast({ title: "Removed from Wishlist", description: `${product.name} removed.` });
    } else {
      addItem(product);
      toast({ title: "Added to Wishlist", description: `${product.name} added.` });
    }
  };

  const getFinalPrice = (product: any) => {
    if (product.offer?.isActive) {
      if (product.offer.type === "percentage") {
        return product.price - product.price * (product.offer.value / 100);
      } else if (product.offer.type === "fixed") {
        return product.price - product.offer.value;
      }
    }
    return product.price;
  };
  const handleBuyNow = async () => {
    if (!product) return;
    const snapshotPrice = getFinalPrice(product);

    await addToCart(
      product._id,
      quantity,
      selectedSize,
      selectedColor,
      selectedVariant,
      product.offer,       // ✅ send the offer object
      snapshotPrice        // ✅ send the final price
    );

    window.location.href = "/checkout";
  };

  const handleAddToCart = async () => {
    if (!product) return;
    const snapshotPrice = getFinalPrice(product);

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
      description: `${quantity} x ${product.name} added.`,
    });
  };


  const submitReview = async () => {
    if (!reviewForm.name || !reviewForm.comment) {
      toast({ title: "Error", description: "Please fill all fields." });
      return;
    }

    try {
      const { data } = await axios.post(`/products/${product._id}/reviews`, reviewForm);
      setReviews(data.reviews || []);
      setReviewForm({ name: "", stars: 5, comment: "" });
      toast({ title: "Review submitted", description: "Thank you for your review!" });
    } catch (err: any) {
      console.error(err);
      toast({ title: "Error", description: err.response?.data?.message || "Failed to submit review." });
    }
  };

  // Get images for selected color or default to main images
  const displayedImages = selectedColor
    ? product.specifications?.colors?.find((c: any) => c.color === selectedColor)?.images || [product.mainImage]
    : [product.mainImage];

  return (
    <>
      <Header />
      <CategoryGrid categories={[]} />

      <div className="min-h-screen bg-gradient-to-br from-background via-card to-background">
        <div className="container mx-auto px-4 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

            {/* Images */}
            <div className="space-y-6">
              <div className="relative aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-card to-muted shadow-2xl group">
                <Image
                  src={displayedImages[selectedImage] || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  className="object-cover transition-all duration-700 group-hover:scale-110"
                />
                {product.featured && (
                  <Badge className="absolute top-6 left-6 bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-lg text-sm px-4 py-2 pulse-glow">
                    ✨ Featured
                  </Badge>
                )}
              </div>

              {/* Thumbnails */}
              {displayedImages.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                  {displayedImages.map((img: string, i: number) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(i)}
                      className={`relative aspect-square rounded-2xl overflow-hidden border-2 transition-all duration-300 hover:scale-105 hover:shadow-lg ${selectedImage === i ? "border-primary shadow-lg ring-2 ring-primary/20" : "border-border hover:border-primary/50"}`}
                    >
                      <Image src={img} alt={`${product.name} ${i + 1}`} fill className="object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Color Selector */}
              {product.specifications?.colors?.length > 0 && (
                <div className="flex gap-2 mt-4">
                  {product.specifications.colors.map((c: any, i: number) => (
                    <button
                      key={i}
                      onClick={() => { setSelectedColor(c.color); setSelectedImage(0); }}
                      className={`w-8 h-8 rounded-full border-2 ${selectedColor === c.color ? "border-primary" : "border-gray-300"}`}
                      style={{ backgroundColor: c.color }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-8 lg:pl-8">

              {/* Breadcrumbs */}
              <div className="flex items-center text-sm text-muted-foreground">
                <span>Home</span>
                <ChevronRight className="h-4 w-4 mx-2" />
                {product.category?.gender && (
                  <p className="text-sm text-muted-foreground">{product.category.gender}</p>
                )}
                <ChevronRight className="h-4 w-4 mx-2" />

                <span>{product.category?.subCategory}</span>
                <ChevronRight className="h-4 w-4 mx-2" />
                <span className="text-foreground">{product.name}</span>
              </div>

              {/* Name & Brand */}
              <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">{product.name}</h1>
              <p className="text-lg text-muted-foreground">{product.brand}</p>

              {/* Price */}
              <div className="flex items-baseline gap-4">
                {/* 🧮 Final price after applying offer */}
                <span className="text-4xl font-bold text-primary">
                  ₹{getFinalPrice(product).toFixed(2)}
                </span>

                {/* 🔁 If offer exists and reduces the price, show original and discount */}
                {product.offer?.isActive && getFinalPrice(product) < product.price && (
                  <>
                    <span className="text-xl text-muted-foreground line-through">
                      ₹{product.price.toFixed(2)}
                    </span>
                    <Badge variant="secondary" className="text-sm">
                      Save{" "}
                      {product.offer.type === "percentage"
                        ? `${product.offer.value}%`
                        : `₹${product.offer.value}`}{" "}
                      OFF
                    </Badge>
                  </>
                )}
              </div>


              {/* Description */}
              <div className="prose prose-lg max-w-none text-muted-foreground">{product.description}</div>

              {/* Quantity + Buttons */}
              <div className="flex flex-col gap-4 mt-6">
                <div className="flex items-center border rounded-xl p-2 space-x-2 w-44">
                  <span className="text-sm font-medium text-muted-foreground">Quantity:</span>
                  <Button variant="outline" onClick={() => setQuantity(prev => Math.max(1, prev - 1))}>-</Button>
                  <span className="text-lg font-medium">{quantity}</span>
                  <Button variant="outline" onClick={() => setQuantity(prev => prev + 1)}>+</Button>
                </div>

                <div className="flex items-center gap-3">
                  <Button onClick={handleBuyNow} className="flex-1 bg-primary text-white font-semibold py-3 rounded-md hover:bg-white hover:text-primary transition-colors">
                    Buy Now
                  </Button>

                  <div className="flex items-center gap-2">
                    <Button onClick={handleAddToCart} className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-600 hover:bg-gray-700 transition-colors" title="Add to Cart">
                      <ShoppingCart className="w-5 h-5 text-white" />
                    </Button>

                    <Button onClick={toggleWishlist} className="w-10 h-10 flex items-center justify-center rounded-full bg-white hover:bg-gray-100 border border-gray-200 transition-colors" title="Add to Wishlist">
                      <Heart className="w-5 h-5 text-gray-800" />
                    </Button>

                    <Button className="w-10 h-10 flex items-center justify-center rounded-full bg-white hover:bg-gray-100 border border-gray-200 transition-colors" title="Share">
                      <Share2 className="w-5 h-5 text-gray-800" />
                    </Button>
                  </div>
                </div>
              </div>

              <Separator className="my-8" />

              {/* Features & Specifications */}
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-primary">Features</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    {product.features?.length ? product.features.map((f: string, idx: number) => (
                      <li key={idx} className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary"></div>{f}
                      </li>
                    )) : <li>No features listed</li>}
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4 text-primary">Specifications</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    {product.specifications && Object.entries(product.specifications).map(([key, value]) => {
                      if (key === "colors" && Array.isArray(value)) {
                        return (
                          <li key={key} className="flex items-center gap-2">
                            <strong>Colors:</strong>
                            <div className="flex gap-2">
                              {value.map((c: any, idx: number) => (
                                <div key={idx} className="w-6 h-6 rounded-full border" style={{ backgroundColor: c.color }} />
                              ))}
                            </div>
                          </li>
                        );
                      }
                      return (
                        <li key={key} className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-secondary"></div>
                          <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong> {String(value)}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>

              {/* Reviews */}
              <Separator className="my-8" />
              <div className="space-y-6">
                <h3 className="text-2xl font-semibold text-primary">Customer Reviews</h3>

                {/* Review Form */}
                <div className="space-y-2">
                  <h4 className="font-medium text-lg">Leave a Review</h4>
                  <div className="flex items-center gap-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-6 h-6 cursor-pointer ${i < reviewForm.stars ? "fill-primary text-primary" : ""}`}
                        onClick={() => setReviewForm(prev => ({ ...prev, stars: i + 1 }))}
                      />
                    ))}
                  </div>
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={reviewForm.name}
                    onChange={e => setReviewForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                  <textarea
                    placeholder="Your Review"
                    value={reviewForm.comment}
                    onChange={e => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
                    className="w-full border rounded-lg px-3 py-2"
                    rows={3}
                  />
                  <Button onClick={submitReview}>Submit Review</Button>
                </div>

                {/* Display Reviews */}
                <div className="space-y-4">
                  {reviews.length ? reviews.map((r, idx) => (
                    <div key={idx} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{r.name}</span>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-4 h-4 ${i < r.stars ? "fill-primary text-primary" : ""}`} />
                          ))}
                        </div>
                      </div>
                      <p className="text-muted-foreground">{r.comment}</p>
                      <span className="text-xs text-muted-foreground">{new Date(r.createdAt).toLocaleDateString()}</span>
                    </div>
                  )) : <p className="text-muted-foreground">No reviews yet. Be the first!</p>}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}