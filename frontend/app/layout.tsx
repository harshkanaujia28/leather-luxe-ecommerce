
import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { Header } from "@/components/header";
import Footer from "@/components/footer";
import { CartProvider } from "@/contexts/cart-context";
import { WishlistProvider } from "@/contexts/wishlist-context";
import { CheckoutProvider } from "@/contexts/checkoutContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { ApiProvider } from "@/contexts/api-context";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Koza - Premium Leather Accessories",
  description:
    "Discover premium leather belts, bags, and accessories crafted with passion and precision.",
  generator: "v0.dev",
  icons: {
    icon: "/Screenshot 2025-07-16 015118.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ApiProvider>
          <AuthProvider>
            <CartProvider>
              <WishlistProvider>
                <CheckoutProvider>
                
                    <div className="min-h-screen flex flex-col bg-background">
                     
                      <main className="flex-1">{children}</main>
                     
                    </div>
                 
                </CheckoutProvider>
                <Toaster />
              </WishlistProvider>
            </CartProvider>
          </AuthProvider>
        </ApiProvider>
      </body>
    </html>
  );
}
