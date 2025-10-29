"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Slide {
  imageUrl: string;
  buttonLink?: string;
}

export default function HeroSection() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const router = useRouter();

  // ✅ Fetch hero slides from backend
  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/banners?type=hero`, {
          cache: "no-store",
        });


        if (!res.ok) throw new Error("Failed to fetch hero slides");

        const data = await res.json();
        // Filter only active slides & map to image + link
        const activeSlides = data
          .filter((item: any) => item.isActive)
          .map((item: any) => ({
            imageUrl: item.imageUrl,
            buttonLink: item.buttonLink || "",
          }));

        setSlides(activeSlides);
      } catch (error) {
        console.error("Error loading hero slides:", error);
      }
    };

    fetchSlides();
  }, []);

  // ✅ Auto change slide every 5s
  useEffect(() => {
    if (slides.length === 0) return;
    const interval = setInterval(
      () => setCurrentIndex((prev) => (prev + 1) % slides.length),
      5000
    );
    return () => clearInterval(interval);
  }, [slides]);

  // ✅ Loading state
  if (slides.length === 0)
    return (
      <section className="relative w-full h-[80vh] bg-gray-100 flex items-center justify-center">
        <p className="text-gray-600 text-lg">Loading...</p>
      </section>
    );

  // ✅ Render Hero Carousel
  return (
    <section
      className="relative w-full h-[80vh] bg-[#e1905b] text-white flex items-center justify-center overflow-hidden cursor-pointer"
      onClick={() => {
        const currentSlide = slides[currentIndex];
        if (currentSlide.buttonLink) router.push(currentSlide.buttonLink);
      }}
    >
      {/* Background Slider */}
      <div className="absolute inset-0">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-[2000ms] ease-in-out ${index === currentIndex ? "opacity-100" : "opacity-0"
              }`}
          >
            <Image
              src={
                slide.imageUrl.startsWith("http")
                  ? slide.imageUrl
                  : `${process.env.NEXT_PUBLIC_API_URL?.replace("/api", "")}${slide.imageUrl}`
              }
              alt={`Slide ${index + 1}`}
              fill
              className="object-cover"
              priority={index === 0}
            />
          </div>
        ))}
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-gentle-bounce z-10">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-2 bg-white/70 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
}
