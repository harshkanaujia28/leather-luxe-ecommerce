import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ProductCard } from "@/components/product-card"
import { mockCategories, getFeaturedProducts } from "@/lib/mock-data"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import WhyUs from "@/components/whyus"
import { NewsletterSection } from "@/components/newsletter-section"

export default function HomePage() {
  const featuredProducts = getFeaturedProducts()
  const categories = mockCategories.slice(0, 6)

  return (
    <div className="space-y-0">
      <Header/>
      <section className="relative h-[600px] flex items-center justify-center bg-gradient-to-r from-amber-50 to-orange-50">
        <div className="absolute inset-0">
          <Image
            src="/fitte.webp"
            alt="Hero background"
            fill
            className="object-cover opacity-50"
          />
        </div>
        <div className="relative z-10 text-center space-y-6 max-w-3xl mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900">
            Premium Leather
            <span className="block text-white">Crafted to Perfection</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover our collection of handcrafted leather accessories. From belts to bags, each piece tells a story of
            quality and craftsmanship.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/products">Shop All Products</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/about">Our Story</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl font-bold">Shop by Category</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore our carefully curated collection of premium leather goods
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-6 max-w-7xl mx-auto gap-6">
          {categories.map((category) => (
            <Card
              key={category.id}
              className="group overflow-hidden hover:shadow-lg transition-shadow"
            >
              <Link href={`/category/${category.slug}`}>
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <Image
                    src={
                      category.image ||
                      `/placeholder.svg?height=300&width=400&text=${encodeURIComponent(
                        category.name
                      )}`
                    }
                    alt={category.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <h3 className="text-white text-xl font-semibold">
                      {category.name}
                    </h3>
                  </div>
                </div>
              </Link>
            </Card>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl font-bold">Featured Products</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Handpicked favorites that showcase our finest craftsmanship
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {featuredProducts.slice(0, 6).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="text-center mt-12">
          <Button size="lg" variant="outline" asChild>
            <Link href="/products">View All Products</Link>
          </Button>
        </div>
      </section>
      <WhyUs/>
      {/* Features Section */}
      <section className="bg-muted/50 py-16 px-4 pt-16 pb-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold">Premium Quality</h3>
              <p className="text-muted-foreground">
                Each product is crafted from the finest leather materials with attention to every detail.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold">Fast Shipping</h3>
              <p className="text-muted-foreground">
                Free shipping on orders over $100. Express delivery available nationwide.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold">Lifetime Warranty</h3>
              <p className="text-muted-foreground">
                We stand behind our craftsmanship with a comprehensive lifetime warranty.
              </p>
            </div>
          </div>
        </div>
      </section>
      <div>
        <NewsletterSection />

      </div>

      <Footer />
    </div>
  )
}
