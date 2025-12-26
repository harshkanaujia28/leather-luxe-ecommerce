import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { CartProvider } from "@/contexts/cart-context";
import { WishlistProvider } from "@/contexts/wishlist-context";
import { CheckoutProvider } from "@/contexts/checkoutContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { ApiProvider } from "@/contexts/api-context";
import { Toaster } from "@/components/ui/toaster";
import ClientLayoutWrapper from "@/components/ClientLayoutWrapper";

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
      {/* Meta Pixel */}
      <Script id="meta-pixel" strategy="afterInteractive">
        {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}
          (window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');

          fbq('init', '828735630019424');
          fbq('track', 'PageView');
        `}
      </Script>

      <body className={inter.className}>
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=828735630019424&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>

        <ApiProvider>
          <AuthProvider>
            <CartProvider>
              <WishlistProvider>
                <CheckoutProvider>
                  <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
                  <Toaster />
                </CheckoutProvider>
              </WishlistProvider>
            </CartProvider>
          </AuthProvider>
        </ApiProvider>
      </body>
    </html>
  );
}
