import Link from "next/link"
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-muted/50 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              {/* <div className="h-8 w-8 rounded bg-primary" /> */}
              <span className="text-3xl font-bold">Koza</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Premium leather accessories crafted with passion and precision. Quality that lasts a lifetime.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Instagram className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold">Quick Links</h3>
            <div className="space-y-2 text-sm">
              <Link href="/about" className="block text-muted-foreground hover:text-primary">
                About Us
              </Link>
              <Link href="/contact" className="block text-muted-foreground hover:text-primary">
                Contact
              </Link>
              <Link href="/category/new-products" className="block text-muted-foreground hover:text-primary">
                New Products
              </Link>
              <Link href="/category/top-sellers" className="block text-muted-foreground hover:text-primary">
                Best Sellers
              </Link>
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h3 className="font-semibold">Categories</h3>
            <div className="space-y-2 text-sm">
              <Link href="/category/leather-belts" className="block text-muted-foreground hover:text-primary">
                Leather Belts
              </Link>
              <Link href="/category/backpacks" className="block text-muted-foreground hover:text-primary">
                Backpacks
              </Link>
              <Link href="/category/laptop-bags" className="block text-muted-foreground hover:text-primary">
                Laptop Bags
              </Link>
              <Link href="/category/womens-bags" className="block text-muted-foreground hover:text-primary">
                Women's Bags
              </Link>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="font-semibold">Contact Info</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>support@leatherluxe.com</span>
              </div>
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>123 Leather St, Craft City, CC 12345</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">© 2024 Koza. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link href="/legal/privacy" className="text-sm text-muted-foreground hover:text-primary">
              Privacy Policy
            </Link>
            <Link href="/legal/terms" className="text-sm text-muted-foreground hover:text-primary">
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
