"use client"

import Image from "next/image"

export default function WhyUs() {
  return (
    <section className="py-16 px-4 ">
      <div className="max-w-7xl mx-auto overflow-hidden">
        <div className="relative w-full h-[500px]"> {/* Adjust height here */}
          <Image
            src="/sept1_banner.jpg"
            alt="Bridal Lehenga"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>
    </section>
  )
}
