import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Header } from "@/components/header"
import Footer from "@/components/footer"

export default function AboutPage() {
  return (
    <>
      <Header />
      <div className="container mx-auto px-4 ">

        {/* Hero Section */}
        <div className="text-center space-y-6 mb-16 py-16">
          <h1 className="text-4xl md:text-5xl font-bold">About Leather Luxe</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Crafting premium leather accessories with passion, precision, and an unwavering commitment to quality since
            our founding.
          </p>
        </div>

        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Our Story</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                Founded in 2010, Leather Luxe began as a small workshop with a simple mission: to create leather goods
                that would last a lifetime. What started as a passion project has grown into a trusted brand known for
                exceptional quality and timeless design.
              </p>
              <p>
                Every piece in our collection is carefully crafted by skilled artisans who share our commitment to
                excellence. We source only the finest leather from sustainable suppliers and use traditional techniques
                passed down through generations.
              </p>
              <p>
                Today, Leather Luxe continues to honor its roots while embracing innovation, creating products that blend
                classic craftsmanship with modern functionality.
              </p>
            </div>
          </div>
          <div className="relative aspect-square rounded-lg overflow-hidden">
            <Image
              src="/placeholder.svg?height=500&width=500"
              alt="Leather crafting workshop"
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-8 text-center space-y-4">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto">
                  <svg className="w-8 h-8 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold">Quality First</h3>
                <p className="text-muted-foreground">
                  We never compromise on quality. Every product undergoes rigorous testing to ensure it meets our exacting
                  standards.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8 text-center space-y-4">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto">
                  <svg className="w-8 h-8 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold">Sustainable Practices</h3>
                <p className="text-muted-foreground">
                  We're committed to environmental responsibility, sourcing materials ethically and minimizing our
                  ecological footprint.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8 text-center space-y-4">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto">
                  <svg className="w-8 h-8 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold">Customer Focus</h3>
                <p className="text-muted-foreground">
                  Our customers are at the heart of everything we do. We strive to exceed expectations with every
                  interaction.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Team Section */}
        <div className="text-center pb-16">
          <h2 className="text-3xl font-bold mb-12">Meet Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Sarah Johnson", role: "Founder & CEO", image: "/placeholder.svg?height=300&width=300" },
              { name: "Michael Chen", role: "Head of Design", image: "/placeholder.svg?height=300&width=300" },
              { name: "Emily Rodriguez", role: "Master Craftsperson", image: "/placeholder.svg?height=300&width=300" },
            ].map((member) => (
              <div key={member.name} className="space-y-4">
                <div className="relative w-48 h-48 mx-auto rounded-full overflow-hidden">
                  <Image src={member.image || "/placeholder.svg"} alt={member.name} fill className="object-cover" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{member.name}</h3>
                  <p className="text-muted-foreground">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
      <Footer />
    </>
  )
}
