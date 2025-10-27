"use client";

import Image from "next/image";

export default function WhyUs() {
  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="relative w-full" style={{ paddingTop: '56.25%' }}> 
          {/* 16:9 aspect ratio container */}
          <Image
            src="/sept1_banner.jpg"
            alt="Bridal Lehenga"
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>
    </section>
  );
}
