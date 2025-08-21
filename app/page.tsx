import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ProductCard } from "@/components/product-card"
import { mockCategories, getFeaturedProducts, getBestSellerProducts } from "@/lib/mock-data"
import { Header } from "@/components/header"
// app/page.tsx
import Footer from "@/components/footer"  // ✅ for default export
import WhyUs from "@/components/whyus"
import { NewsletterSection } from "@/components/newsletter-section"
import HeroSection from "@/components/Hero"

export default function HomePage() {
  const featuredProducts = getFeaturedProducts()
 const bestSellerProducts = getBestSellerProducts()
  const categories = mockCategories.slice(0, 6)

  return (
    <div className="space-y-0">
      <Header />
      <HeroSection />
      {/* <section className="relative min-h-[80vh] bg-[#2a1a0f] flex items-center justify-center overflow-hidden ">

        <div className="absolute inset-0 z-0">
          <img
            src="/hero-craftsmanship.jpg"
            alt="Handcrafted leather bag being made in artisan workshop"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-primary/60 to-primary/40"></div>
        </div>
        <div className="relative z-10 container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold text-primary-foreground mb-6 leading-tight">
              Hand-stitched leather.
              <br />
              <span className="text-accent">Built to travel.</span>
            </h1>

            <p className="text-xl md:text-2xl text-primary-foreground/90 mb-8 leading-relaxed">
              Premium full-grain leather laptop &amp; travel bags — made to age beautifully.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button variant="default" size="lg" className="hover-glow text-lg font-semibold">
                Shop Collections
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="text-lg font-semibold bg-primary-foreground/10 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/20 hover:border-primary-foreground/50"
              >
                Explore Craftsmanship
              </Button>
            </div>
          </div>
        </div>


        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-gentle-bounce">
          <div className="w-6 h-10 border-2 border-primary-foreground/50 rounded-full flex justify-center">
            <div className="w-1 h-2 bg-primary-foreground/70 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section> */}


      {/* Categories Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12 animate-slide-up">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            Shop by Category
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover our carefully curated collection of handcrafted leather goods,
            each piece telling its own story of artisan excellence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 max-w-7xl mx-auto">
          {categories.map((category, index) => (
            <Link key={category.id} href={`/category/${category.slug}`}>
              <Card
                className="group cursor-pointer bg-card border border-border/50 hover:border-accent/50 overflow-hidden"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-0">
                  <div className="relative overflow-hidden">
                    <Image
                      src={
                        category.image ||
                        `/placeholder.svg?height=300&width=400&text=${encodeURIComponent(
                          category.name
                        )}`
                      }
                      alt={category.name}
                      width={400}
                      height={300}
                      className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>

                    {/* Title + Subtitle */}
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <h3 className="text-xl font-bold mb-1">{category.name}</h3>
                      <p className="text-sm opacity-90">{category.subtitle}</p>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <div className="p-6">
                    <Button
                      variant="leather"
                      className="w-full group-hover:shadow-[var(--shadow-glow)] transition-all duration-300"
                    >
                      Explore Collection
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Link>
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
      <WhyUs />
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
    </div>
  )
}
