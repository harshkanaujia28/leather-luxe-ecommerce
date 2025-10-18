"use client";

import { useCart } from "@/contexts/cart-context";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { Header } from "@/components/header";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

// Utility: get product image based on selected color or variant
const getProductImage = (item: any): string => {
  if (item.selectedColor) {
    const colorObj = item.product.specifications?.colors?.find((c: any) => c.color === item.selectedColor);
    if (colorObj?.images?.length) return colorObj.images[0];
  }

  // fallback first image from product
  if (item.product.images?.length) return item.product.images[0];

  // fallback placeholder
  return "/placeholder.svg?height=300&width=300";
};

// Calculate final price after offer
const getFinalPrice = (product: any) => {
  if (product.offer?.isActive) {
    if (product.offer.type === "percentage") return product.price - (product.price * product.offer.value) / 100;
    if (product.offer.type === "fixed") return product.price - product.offer.value;
  }
  return product.price;
};

export default function CartPage() {
  const { state, updateQuantity, removeFromCart, clearCart } = useCart();
  const items = state.items;

  const safePrice = (p: any) => (typeof p === "number" && !isNaN(p) ? p : 0);
  const safeQuantity = (q: any) => (typeof q === "number" && !isNaN(q) ? q : 1);

  if (!items || items.length === 0) {
    return (
      <>
        <Header />
        <div className="flex flex-col items-center justify-center py-36 text-center px-4 space-y-4 bg-white text-primary min-h-screen">
          <ShoppingBag className="mx-auto h-12 w-12 text-primary" />
          <h2 className="text-2xl font-semibold text-primary">Your Cart is empty</h2>
          <p className="text-gray-400 max-w-md">Start shopping to add items to your cart.</p>
          <Button className="mt-6 bg-primary text-white hover:bg-gray-700" asChild>
            <Link href="/products">Continue Shopping</Link>
          </Button>
        </div>
        <Footer />
      </>
    );
  }

  const calculateSummary = () => {
    const itemCount = items.reduce((sum, item) => sum + safeQuantity(item.quantity), 0);
    const subtotal = items.reduce((sum, item) => sum + getFinalPrice(item.product) * safeQuantity(item.quantity), 0);
    const tax = subtotal * 0.10;
    const total = subtotal + tax;
    return { itemCount, subtotal, tax, total };
  };

  const { itemCount, subtotal, tax, total } = calculateSummary();

  return (
    <>
      <Header />
      <div className="min-h-screen bg-white text-primary pt-36 px-4 sm:px-10">
        <main className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="md:col-span-2 space-y-4">
            {items.map((item) => {
              const quantity = safeQuantity(item.quantity);
              const price = getFinalPrice(item.product);
              const originalPrice = safePrice(item.product.price);
              const totalItemPrice = price * quantity;

              return (
                <Card key={item._id} className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      {/* Product Image */}
                      <div className="relative w-24 h-24 flex-shrink-0 rounded overflow-hidden border border-gray-200">
                        <Image
                          src={getProductImage(item)}
                          alt={item.product?.name || "Product image"}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
                        />
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 w-full space-y-1">
                        <h3 className="text-lg font-semibold text-primary">{item.product?.name}</h3>
                        <p className="text-sm text-gray-400">{item.product?.brand}</p>
                        {item.selectedColor && (
                          <p className="text-sm text-gray-500">
                            Color: <span className="font-medium text-gray-700">{item.selectedColor}</span>
                          </p>
                        )}
                        {item.selectedSize && (
                          <p className="text-sm text-gray-500">
                            Size: <span className="font-medium text-gray-700">{item.selectedSize}</span>
                          </p>
                        )}

                        {/* Price with offer */}
                        <div className="text-md font-medium text-primary">
                          ₹{price.toFixed(2)}
                          {price < originalPrice && (
                            <span className="ml-2 text-sm text-red-400 line-through">₹{originalPrice.toFixed(2)}</span>
                          )}
                        </div>
                      </div>

                      {/* Quantity & Remove */}
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item._id, Math.max(1, quantity - 1))}
                          disabled={quantity <= 1}
                          className="text-gray-700 hover:bg-gray-100"
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="w-8 text-center">{quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item._id, quantity + 1)}
                          className="text-gray-700 hover:bg-gray-100"
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>

                      {/* Total & Remove */}
                      <div className="text-right space-y-1">
                        <p className="text-lg font-semibold text-primary">₹{totalItemPrice.toFixed(2)}</p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromCart(item._id)}
                          className="text-red-500 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            <div className="flex justify-between items-center pt-2">
              <Button variant="ghost" onClick={clearCart} className="text-red-500 hover:text-red-600">
                Clear Cart
              </Button>
              <Button variant="outline" asChild>
                <Link href="/products">Continue Shopping</Link>
              </Button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="border rounded-2xl p-6 shadow-lg h-fit bg-white border-primary/40">
            <CardHeader>
              <CardTitle className="text-primary text-lg font-semibold">Order Summary</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4 text-sm text-gray-800">
              <div className="flex justify-between">
                <span>Subtotal ({itemCount} items)</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-primary">Free</span>
              </div>

              <div className="flex justify-between">
                <span>Tax (10%)</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>

              <Separator className="bg-primary/30" />

              <div className="flex justify-between text-primary font-semibold text-base">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>

              <Button
                size="lg"
                className="w-full bg-primary text-black hover:bg-primary/90 mt-2"
                onClick={() => {
                  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
                  window.location.href = token ? "/checkout" : "/auth/login";
                }}
              >
                Proceed to Checkout
              </Button>

              {subtotal < 100 && (
                <p className="text-center text-xs text-gray-400 mt-2">
                  Add ₹{(100 - subtotal).toFixed(2)} more for free shipping!
                </p>
              )}
            </CardContent>
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
}
