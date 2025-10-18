"use client"

import { useEffect, useState, } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, ArrowRight, Truck } from "lucide-react"
import { orders } from "@/lib/mock-data"

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams()
  const [orderData, setOrderData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  const paymentMethod = searchParams.get("method") || "card"
  const orderId = searchParams.get("order_id") || "ORD-001"

  const successTitle =
    paymentMethod === "cod"
      ? "Order Placed Successfully!"
      : "Payment Successful!"

  const successMessage =
    paymentMethod === "cod"
      ? "Cash on Delivery selected. Your order has been placed and will be shipped soon."
      : "Thank you for your payment. Your order is now being processed."

useEffect(() => {
  const orderId = searchParams.get("order_id")
  const localOrders = JSON.parse(localStorage.getItem("orders") || "[]")
  const foundOrder = localOrders.find((o: any) => o.id === orderId)

  if (foundOrder) {
    if (foundOrder.paymentInfo.method === "cod") {
      // If payment method is Cash on Delivery, redirect immediately
      router.push(`/order-confirmation/${foundOrder.id}`)
      return
    }

    setOrderData(foundOrder) // for card/upi
  }

  setIsLoading(false)
}, [searchParams])


const handleTrackOrder = () => {
  if (orderData?.id) {
    router.push(`/order-confirmation/${orderData.id}`)
  }
}


  if (isLoading || !orderData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }


  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-green-100 p-4 rounded-full">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            {successTitle}
          </h1>
          <p className="text-lg text-gray-600 mb-4">{successMessage}</p>

          {orderData && (
            <Badge variant="secondary" className="text-sm">
              Order #{orderData.id}
            </Badge>
          )}
        </div>

        {/* Continue Shopping & Track Order */}
        <div className="mt-12 text-center">
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-0">
            <CardContent className="py-8 space-y-4">
              <h3 className="text-xl font-semibold">What would you like to do next?</h3>
              <div className="flex flex-col md:flex-row justify-center items-center gap-4">
                <Link href="/">
                  <Button>
                    Continue Shopping <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
                <Button variant="outline" onClick={handleTrackOrder}>
                  Track Your Order <Truck className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
