// components/CategorySlider.tsx
"use client"

import Image from "next/image"
import Link from "next/link"

interface Category {
  id: number | string
  name: string
  slug: string
  image?: string
}

interface CategorySliderProps {
  categories: Category[]
}

export default function CategorySlider({ categories }: CategorySliderProps) {
  return (
    <section className="bg-[var(--background)] py-4 border-b">
      {/* Mobile / Tablet (Horizontal Scroll) */}
      <div className="block lg:hidden overflow-x-auto whitespace-nowrap no-scrollbar">
        <div className="flex gap-6 px-4 sm:px-8">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/category/${category.slug}`}
              className="flex flex-col items-center flex-shrink-0 group"
            >
              {/* Circle Image */}
              <div
                className="
                  rounded-full border-2 border-[var(--accent)] overflow-hidden 
                  flex items-center justify-center bg-[var(--background)] 
                  transition-transform duration-300 group-hover:scale-105
                  w-20 h-20 sm:w-24 sm:h-24
                "
              >
                <Image
                  src={
                    category.image ||
                    `/placeholder.svg?height=150&width=150&text=${encodeURIComponent(
                      category.name
                    )}`
                  }
                  alt={category.name}
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Category Name */}
              <p className="mt-2 text-sm font-medium text-foreground text-center group-hover:text-[var(--accent)] transition-colors duration-300">
                {category.name}
              </p>
            </Link>
          ))}
        </div>
      </div>

      {/* Desktop (Centered Grid with Gap-28) */}
      <div className="hidden lg:flex justify-center">
        <div className="flex gap-28">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/category/${category.slug}`}
              className="flex flex-col items-center group"
            >
              {/* Circle Image */}
              <div
                className="
                  rounded-full border-2 border-[var(--accent)] overflow-hidden 
                  flex items-center justify-center bg-[var(--background)] 
                  transition-transform duration-300 group-hover:scale-105
                  w-28 h-28
                "
              >
                <Image
                  src={
                    category.image ||
                    `/placeholder.svg?height=150&width=150&text=${encodeURIComponent(
                      category.name
                    )}`
                  }
                  alt={category.name}
                  width={128}
                  height={128}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Category Name */}
              <p className="mt-4 text-base font-medium text-foreground text-center group-hover:text-[var(--accent)] transition-colors duration-300">
                {category.name}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
