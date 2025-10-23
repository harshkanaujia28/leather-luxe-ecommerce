"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import {
  Facebook,
  Instagram,
  Twitter,
  Mail,
  Phone,
  MapPin,
  Heart
} from "lucide-react"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4">
        {/* Newsletter Section */}
        <div className="py-12 border-b border-primary-foreground/20">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-2xl font-bold mb-4">Stay Updated</h3>
            <p className="text-primary-foreground/80 mb-6">
              Subscribe to get new collections, care tips, and exclusive offers.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input
                placeholder="Enter your email"
                className="bg-primary-foreground/10 border-primary-foreground/30 text-primary-foreground placeholder:text-primary-foreground/60"
              />
              <Button variant="secondary" className="whitespace-nowrap">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h4 className="text-xl font-bold mb-4">Koza</h4>
            <p className="text-primary-foreground/80 mb-4">
              Premium leather accessories crafted with passion and precision.
              Quality that lasts a lifetime.
            </p>
            <div className="flex space-x-4">
              <Link
                href="https://www.facebook.com/profile.php?id=61581975248425" // 🔹 replace with your real page URL
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-primary-foreground hover:text-accent"
                >
                  <Facebook className="h-5 w-5" />
                </Button>
              </Link>

              <Link
                href="https://www.instagram.com/kozao_ffical/" // 🔹 replace with your real page URL
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-primary-foreground hover:text-accent"
                >
                  <Instagram className="h-5 w-5" />
                </Button>
              </Link>

             
            </div>
          </div>


          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { name: "About Us", href: "/about" },
                { name: "Contact", href: "/contact" },
                { name: "New Products", href: "/category/new-products" },
                { name: "Best Sellers", href: "/category/top-sellers" },
              ].map(({ name, href }) => (
                <li key={name}>
                  <Link
                    href={href}
                    className="text-primary-foreground/80 hover:text-accent transition-colors duration-200"
                  >
                    {name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Categories</h4>
            <ul className="space-y-2">
              {[
                { name: "Leather Belts", href: "/category/leather-belts" },
                { name: "Backpacks", href: "/category/backpacks" },
                { name: "Laptop Bags", href: "/category/laptop-bags" },
                { name: "Women's Bags", href: "/category/womens-bags" },
              ].map(({ name, href }) => (
                <li key={name}>
                  <Link
                    href={href}
                    className="text-primary-foreground/80 hover:text-accent transition-colors duration-200"
                  >
                    {name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-accent" />
                <span className="text-primary-foreground/80">
                  info@koza.co.in
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-accent" />
                <span className="text-primary-foreground/80">
                  +91 6392161771
                </span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-accent" />
                <span className="text-primary-foreground/80">
                  29/1, JUHI, Juhi Labour Colony, Deep Cinema, Kanpur, 208014
                </span>
              </div>
            </div>
          </div>

        </div>

        <Separator className="bg-primary-foreground/20" />

        {/* Bottom Footer */}
        <div className="py-6 flex flex-col md:flex-row justify-between items-center text-sm text-primary-foreground/80">
          <div className="flex items-center gap-1 mb-4 md:mb-0">
            <span>© {currentYear} Koza. Made with</span>
            <Heart className="h-4 w-4 text-accent fill-accent" />
            <span>for leather lovers</span>
          </div>

          <div className="flex flex-wrap gap-6">
            <Link href="/privacy-policy" className="hover:text-accent transition-colors duration-200">
              Privacy Policy
            </Link>
            <Link href="/terms-and-conditions" className="hover:text-accent transition-colors duration-200">
              Terms & Conditions
            </Link>
            <Link href="/cancellations-and-refunds" className="hover:text-accent transition-colors duration-200">
              Cancellations & Refunds
            </Link>
            <Link href="/shipping-policy" className="hover:text-accent transition-colors duration-200">
              Shipping Policy
            </Link>
            {/* <Link href="/legal/accessibility" className="hover:text-accent transition-colors duration-200">
              Accessibility
            </Link> */}
          </div>
        </div>
      </div>
    </footer>
  )
}
