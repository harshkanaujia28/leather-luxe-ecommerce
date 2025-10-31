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
import { ProductCard } from "@/components/product-card";

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
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null); // stores variant name
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewForm, setReviewForm] = useState({ name: "", stars: 5, comment: "" });
  const [isExpanded, setIsExpanded] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [loadingRelated, setLoadingRelated] = useState(false);


  // token check
  const isLoggedIn = typeof window !== "undefined" && !!localStorage.getItem("token");

  useEffect(() => {
    async function fetchProduct() {
      try {
        const { data } = await axios.get(`/products/${id}`);
        if (!data.product) return notFound();
        setProduct(data.product);
        setReviews(data.product.reviews || []);

        // set default selected color & variant
        const firstColor = data.product.specifications?.colors?.[0]?.color;
        setSelectedColor(firstColor || null);

        // if variants exist, set first variant name
        const firstVariantName = data.product.variants?.[0]?.name ?? null;
        setSelectedVariant((prev) => prev ?? firstVariantName);
      } catch (err) {
        console.error(err);
        return notFound();
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]);
  useEffect(() => {
    if (!product?._id) return;

    const fetchRelated = async () => {
      try {
        setLoadingRelated(true);

        const { data } = await axios.get(`/products/related/${product._id}`);

        // exclude same product
        const filtered = data.products.filter((p: any) => p._id !== product._id);

        setRelatedProducts(filtered);
        console.log(filtered);
      } catch (error) {
        console.error("Related fetch failed", error);
      } finally {
        setLoadingRelated(false);
      }
    };

    fetchRelated();
  }, [product]);
  // if selected variant not found, fallback to first
  useEffect(() => {
    if (!product?.variants || product.variants.length === 0) return;
    const exists = product.variants.some(v => v.name === selectedVariant);
    if (!exists) setSelectedVariant(product.variants[0].name);
  }, [selectedColor]);


  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!product) return notFound();
  // ✅ Fetch Related Products


  // find current variant object by selectedVariant name; fallback to first variant
  const currentVariant = product.variants?.find((v: any) => v.name === selectedVariant) ?? product.variants?.[0] ?? null;
  const stock = currentVariant?.stock ?? 0;
  const isOutOfStock = stock <= 0;

  const inWishlist = isInWishlist(product._id);

  const toggleWishlist = () => {
    if (!isLoggedIn) {
      toast({ title: "Login Required", description: "Please login to add wishlist items." });
      window.location.href = "/login";
      return;
    }

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
    if (!isLoggedIn) {
      toast({ title: "Login Required", description: "Please login to continue." });
      window.location.href = "/auth/login";
      return;
    }

    if (isOutOfStock) {
      toast({ title: "Out of Stock", description: "Selected variant is out of stock." });
      return;
    }

    if (quantity > stock) {
      toast({ title: "Stock Error", description: `Only ${stock} left in stock.` });
      return;
    }

    const snapshotPrice = getFinalPrice(product);

    await addToCart(
      product._id,
      quantity,
      selectedSize,
      selectedColor,
      selectedVariant,
      product.offer,
      snapshotPrice
    );

    window.location.href = "/checkout";
  };

  const handleAddToCart = async () => {
    if (!isLoggedIn) {
      toast({ title: "Login Required", description: "Please login to continue." });
      window.location.href = "/auth/login";
      return;
    }

    if (isOutOfStock) {
      toast({ title: "Out of Stock", description: "Selected variant is out of stock." });
      return;
    }

    if (quantity > stock) {
      toast({ title: "Stock Error", description: `Only ${stock} left in stock.` });
      return;
    }

    const snapshotPrice = getFinalPrice(product);

    await addToCart(
      product._id,
      quantity,
      selectedSize,
      selectedColor,
      selectedVariant,
      product.offer,
      snapshotPrice
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

    const user = typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || "{}")
      : {};

    try {
      const payload = {
        userId: user._id || null,   // ✅ safetly added
        productId: product._id,
        ...reviewForm,
      };

      const { data } = await axios.post(`/products/${product._id}/reviews`, payload);

      setReviews(data.reviews || []);
      setReviewForm({ name: "", stars: 5, comment: "" });

      toast({ title: "Review submitted", description: "Thank you for your review!" });

    } catch (err: any) {
      console.error(err);
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to submit review.",
      });
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 relative">

            {/* Images */}
            <div className="space-y-6">
              <div className="relative aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-card to-muted shadow-2xl group">

                {/* ✅ Product Image (blurs when out of stock) */}
                <Image
                  src={displayedImages[selectedImage] || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  className={`object-cover transition-all duration-700 group-hover:scale-110 ${isOutOfStock ? "blur-sm brightness-50" : ""}`}
                />

                {/* ✅ OUT OF STOCK overlay (only on image) */}
                {isOutOfStock && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-black/60 rounded-3xl px-8 py-6 text-center translate-y-[-10%]">
                      <h2 className="text-4xl font-bold text-red-600">OUT OF STOCK</h2>
                      <p className="text-sm text-white/80 mt-2">This variant is currently unavailable.</p>
                    </div>
                  </div>
                )}

                {product.featured && (
                  <Badge className="absolute top-6 left-6 bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-lg text-sm px-4 py-2 pulse-glow">
                    ✨ Featured
                  </Badge>
                )}
              </div>



              {/* Thumbnails */}
              {displayedImages.length > 1 && (
                <div className={`grid grid-cols-4 gap-4 ${isOutOfStock ? "opacity-60" : ""}`}>
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
                      onClick={() => {
                        setSelectedColor(c.color);
                        setSelectedImage(0);

                        const match = product.variants?.find(
                          v => v.name?.toLowerCase() === c.color?.toLowerCase()
                        );

                        if (match) {
                          setSelectedVariant(match.name);
                        } else {
                          console.log("No variant found for color:", c.color);
                        }
                      }}

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
                  <span className="text-sm text-muted-foreground">
                    {product.category.gender}
                  </span>
                )}

                <ChevronRight className="h-4 w-4 mx-2" />
                {product.category?.productType && (
                  <span className="text-sm text-muted-foreground">
                    {product.category.productType}
                  </span>
                )}

                <ChevronRight className="h-4 w-4 mx-2" />
                <span>{product.category?.subCategory}</span>

                {/* <ChevronRight className="h-4 w-4 mx-2" />
                <span className="text-foreground">{product.name}</span> */}
              </div>


              {/* Name & Brand */}
              {/* ✅ Title & Brand */}
              <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                {product.name}
              </h1>
              <p className="text-lg text-muted-foreground mb-6">{product.brand}</p>

              {/* ✅ Price Section */}


              {/* ✅ Quantity + Stock + Colour + Material */}
              <div className="flex flex-col gap-5 mt-6">

                {/* ✅ Price Section */}
                <div className="flex items-baseline gap-4">
                  <span className="text-4xl font-bold text-primary">
                    ₹{getFinalPrice(product).toFixed(2)}
                  </span>

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

                {/* ✅ Quantity + Stock */}
                <div className="w-40 space-y-2">
                  <span className="text-sm font-semibold text-primary">Add:</span>

                  <div className="flex items-center justify-between bg-background border border-primary rounded-full px-3 h-9 shadow-sm">
                    <Button
                      variant="ghost"
                      className="p-0 w-6 h-6 text-primary hover:bg-transparent"
                      disabled={quantity === 1}
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    >
                      -
                    </Button>

                    <span className="text-base font-semibold text-foreground">{quantity}</span>

                    <Button
                      variant="ghost"
                      className="p-0 w-6 h-6 text-primary hover:bg-transparent"
                      disabled={quantity >= stock}
                      onClick={() => {
                        if (quantity + 1 > stock) {
                          toast({
                            title: "Stock Limit",
                            description: `Only ${stock} left.`,
                          });
                          return;
                        }
                        setQuantity(q => q + 1);
                      }}
                    >
                      +
                    </Button>
                  </div>

                  {/* ✅ Stock */}
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">Stock:</span>
                    <span
                      className={`px-2 py-0.5 rounded-md text-xs font-medium ${stock > 0
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                        }`}
                    >
                      {stock > 0 ? `${stock} Available` : "Out of Stock"}
                    </span>
                  </div>
                </div>


                {/* ✅ Material */}
                {product.specifications?.material && (
                  <div className="flex items-center gap-2 text-muted-foreground text-sm">
                    <strong className="text-foreground">Material:</strong>
                    {product.specifications.material}
                  </div>
                )}

                {/* ✅ Colors */}
                {product.specifications?.colors?.length > 0 && (
                  <div className="flex items-center gap-2">
                    <strong className="text-sm">Colors:</strong>
                    <div className="flex gap-2">
                      {product.specifications.colors.map((c: any, idx: number) => (
                        <div
                          key={idx}
                          className="w-6 h-6 rounded-full border"
                          style={{ backgroundColor: c.color }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>


              {/* ✅ Collapsible Description */}
              <div className="mt-6 max-w-none text-muted-foreground">
                <strong className="text-foreground mb-3">Discription</strong>
                <p className={`${isExpanded ? "whitespace-pre-line" : "line-clamp-3 whitespace-pre-line"}`}>
                  {product.description}
                </p>

                {/* ✅ Read More / Less Button */}
                {product.description.length > 150 && (
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="text-primary font-semibold mt-1"
                  >
                    {isExpanded ? "Read Less" : "Read More"}
                  </button>
                )}
              </div>

              {/* ✅ Buttons */}
              <div className="flex items-center gap-3 mt-6">
                <Button
                  onClick={handleBuyNow}
                  disabled={isOutOfStock || quantity > stock}
                  className={`flex-1 bg-primary text-white py-3 font-semibold rounded-md ${isOutOfStock ? "opacity-60 cursor-not-allowed" : ""
                    }`}
                >
                  {isOutOfStock ? "Out of Stock" : "Buy Now"}
                </Button>

                <Button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock || quantity > stock}
                  className={`w-10 h-10 flex items-center justify-center rounded-full ${isOutOfStock ? "bg-gray-300 cursor-not-allowed" : "bg-gray-600 hover:bg-gray-700"
                    }`}
                  title="Add to Cart"
                >
                  <ShoppingCart className="w-5 h-5 text-white" />
                </Button>

                <Button
                  onClick={toggleWishlist}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-white hover:bg-gray-100 border transition-colors"
                  title="Wishlist"
                >
                  <Heart className="w-5 h-5 text-gray-800" />
                </Button>

                <Button
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-white hover:bg-gray-100 border transition-colors"
                  title="Share"
                >
                  <Share2 className="w-5 h-5 text-gray-800" />
                </Button>
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
                        className={`w-6 h-6 cursor-pointer ${i < reviewForm.stars ? "fill-yellow-500 text-yellow-500" : "text-gray-300"
                          }`}
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
                            <Star key={i} className={`w-4 h-4 ${i < r.stars ? "fill-yellow-500 text-yellow-500" : "text-gray-300"
                              }`} />
                          ))}
                        </div>
                      </div>
                      <p className="text-muted-foreground">{r.comment}</p>
                      <span className="text-xs text-muted-foreground">{new Date(r.createdAt).toLocaleDateString()}</span>
                    </div>
                  )) : <p className="text-muted-foreground">No reviews yet. Be the first!</p>}
                </div>
                <Separator className="my-10" />

                <div className="mt-10">
                  <h3 className="text-2xl font-semibold mb-6 text-primary">
                    Related Products
                  </h3>

                  {loadingRelated && (
                    <p className="text-muted-foreground">Loading related products...</p>
                  )}

                  {!loadingRelated && relatedProducts.length === 0 && (
                    <div className="text-center py-10">
                      <h3 className="text-xl font-semibold text-gray-700">Coming Soon</h3>
                      <p className="text-gray-500 text-sm">
                        Similar products will appear here once available.
                      </p>
                    </div>
                  )}

                  {!loadingRelated && relatedProducts.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                      {relatedProducts.map((p) => (
                        <ProductCard key={p._id} product={p} />
                      ))}
                    </div>
                  )}
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
