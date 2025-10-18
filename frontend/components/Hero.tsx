"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"

export default function HeroSection() {
  return (
    <section className="relative w-full h-[80vh] bg-[#e1905b] text-white flex items-center justify-center overflow-hidden">
      {/* Background Overlay */}
      <div className="absolute inset-0  z-10" />

      {/* Background Image */}
      <Image
        src="/hero-craftsmanship.jpg" // replace with your image
        alt="Luxury Perfume"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-primary/60 to-primary/40"></div>
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold text-primary-foreground mb-6 leading-tight">
            Hand-stitched leather.
            <br />
            <span style={{ color: "#d98c46", fontWeight: "bold" }}>Built to travel.</span>

          </h1>

          <p className="text-xl md:text-2xl text-primary-foreground/90 mb-8 leading-relaxed">
            Premium full-grain leather laptop & travel bags — made to age beautifully.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              variant="hero" 
              size="xl"
              className="hover-glow text-lg font-semibold"
            >
              Shop Collections
            </Button>


            <Button
              variant="outline"
              size="xl"
              className="text-lg font-semibold bg-primary-foreground/10 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/20 hover:border-primary-foreground/50"
            >
              Explore Craftsmanship
            </Button>
          </div>

        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-gentle-bounce">
        <div className="w-6 h-10 border-2 border-primary-foreground/50 rounded-full flex justify-center">
          <div className="w-1 h-2 bg-primary-foreground/70 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  )
}
