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
    <section className="bg-[var(--background)] py-6 border-b">
      {/* ✅ Mobile / Tablet – Smooth Scroll + Snap */}
      <div className="lg:hidden overflow-x-auto no-scrollbar px-4">
        <div className="flex gap-6 sm:gap-8 snap-x">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/category/${category.slug}`}
              className="flex flex-col items-center flex-shrink-0 snap-always snap-center group"
            >
              {/* Image with glow + soft hover */}
              <div
                className="
                  rounded-full overflow-hidden border border-transparent
                  bg-white/10 backdrop-blur-sm shadow-sm
                  flex items-center justify-center
                  transition-all duration-300
                  group-hover:scale-[1.07] group-hover:shadow-lg
                  group-hover:border-[var(--accent)]
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
                  width={100}
                  height={100}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Name */}
              <p
                className="
                  mt-2 text-sm font-medium text-foreground text-center
                  transition-all duration-300
                  group-hover:text-[var(--accent)]
                "
              >
                {category.name}
              </p>
            </Link>
          ))}
        </div>
      </div>

      {/* ✅ Desktop – Clean Center Grid with Bigger Icons */}
      <div className="hidden lg:flex justify-center">
        <div className="flex gap-14 2xl:gap-20">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/category/${category.slug}`}
              className="flex flex-col items-center group"
            >
              <div
                className="
                  rounded-full overflow-hidden border border-transparent
                  bg-white/10 backdrop-blur-md shadow
                  flex items-center justify-center
                  transition-all duration-300
                  group-hover:scale-[1.09] group-hover:shadow-xl
                  group-hover:border-[var(--accent)]
                  w-28 h-28 2xl:w-32 2xl:h-32
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
                  width={150}
                  height={150}
                  className="w-full h-full object-cover"
                />
              </div>

              <p
                className="
                  mt-4 text-base font-semibold text-foreground text-center
                  transition-colors duration-300
                  group-hover:text-[var(--accent)]
                "
              >
                {category.name}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
