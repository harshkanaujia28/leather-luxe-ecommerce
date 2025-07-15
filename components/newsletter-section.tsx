"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"

export function NewsletterSection() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    toast({
      title: "Successfully subscribed!",
      description: "Thank you for subscribing to our newsletter.",
    })

    setEmail("")
    setIsLoading(false)
  }

  return (
     <section className=" rounded py-16 bg-white  text-gray-700 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-16 ">
 <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">Stay in the Loop</h2>
        <p className="text-lg text-gray-600 mb-8">
          Be the first to know about new arrivals, exclusive offers, and fragrance tips
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-1 bg-white text-black"
          />
          <Button type="submit" disabled={isLoading} className="bg-black text-white hover:bg-gray-500">
            {isLoading ? "Subscribing..." : "Subscribe"}
          </Button>
        </form>

        <p className="text-sm text-gray-400 mt-4">We respect your privacy. Unsubscribe at any time.</p>
      </div>
    </section>
  )
}
