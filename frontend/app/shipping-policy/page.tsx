"use client";

import Link from "next/link";
import { Header } from "@/components/header";
import Footer from "@/components/footer";

export default function ShippingPolicyPage() {
  return (
    <>
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-primary/10 to-background py-20 md:py-28 text-center">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-foreground">
            Shipping Policy
          </h1>
          <p className="text-muted-foreground text-lg">
            Last Updated: <strong>20/10/2025</strong>
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-16 max-w-4xl">
        <div className="bg-card shadow-sm rounded-2xl p-8 md:p-12 border border-border space-y-10 leading-relaxed text-foreground/90">
          
          {/* 1. Order Processing */}
          <section>
            <h2 className="text-2xl font-semibold mb-3">1. Order Processing</h2>
            <p>All orders are processed within 1–2 business days (excluding weekends and holidays) after receiving your payment confirmation.</p>
            <p>You will receive an email or SMS notification once your order has been shipped, along with a tracking number.</p>
          </section>

          {/* 2. Shipping Rates & Delivery Estimates */}
          <section>
            <h2 className="text-2xl font-semibold mb-3">2. Shipping Rates & Delivery Estimates</h2>
            <p><strong>Shipping Charges:</strong> Shipping charges for your order will be calculated and displayed at checkout.</p>
            <p><strong>Delivery Time:</strong></p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Metro Cities: 3–5 business days</li>
              <li>Other Locations: 5–7 business days</li>
              <li>Remote Areas: 7–10 business days</li>
            </ul>
            <p>Please note: Delivery times are estimates and may vary due to logistics delays, weather conditions, or unforeseen events.</p>
          </section>

          {/* 3. Shipping Partners */}
          <section>
            <h2 className="text-2xl font-semibold mb-3">3. Shipping Partners</h2>
            <p>We partner with trusted national courier services such as Delhivery, Bluedart, DTDC, and India Post to ensure timely and safe delivery of your products.</p>
          </section>

          {/* 4. Order Tracking */}
          <section>
            <h2 className="text-2xl font-semibold mb-3">4. Order Tracking</h2>
            <p>Once your order is shipped, you will receive a tracking link via email/SMS to monitor the delivery status in real-time. You can also track your order from the “Track Order” section on our website using your order ID.</p>
          </section>

          {/* 5. Address Accuracy */}
          <section>
            <h2 className="text-2xl font-semibold mb-3">5. Address Accuracy</h2>
            <p>Please ensure that your shipping address, contact number, and pin code are correct at the time of checkout. We will not be responsible for non-delivery due to incorrect or incomplete details.</p>
          </section>

          {/* 6. International Shipping */}
          <section>
            <h2 className="text-2xl font-semibold mb-3">6. International Shipping</h2>
            <p>Currently, we only ship within India. For international delivery requests, please contact our support team at <a href="mailto:info@koza.co.in" className="text-primary hover:underline">info@koza.co.in</a>.</p>
          </section>

          {/* 7. Damaged or Lost Packages */}
          <section>
            <h2 className="text-2xl font-semibold mb-3">7. Damaged or Lost Packages</h2>
            <p>If you receive a damaged item or your package is lost during transit, please contact us immediately at <a href="mailto:info@koza.co.in" className="text-primary hover:underline">info@koza.co.in</a> with your order details. We will investigate and provide a replacement or refund as per our <Link href="/return-refund-policy" className="text-primary hover:underline">Return & Refund Policy</Link>.</p>
          </section>

          {/* 8. Contact Us */}
          <section>
            <h2 className="text-2xl font-semibold mb-3">8. Contact Us</h2>
            <ul className="space-y-2">
              <li>📧 Email: <a href="mailto:info@koza.co.in" className="text-primary hover:underline">info@koza.co.in</a></li>
              <li>📞 Phone: <a href="tel:+916392161771" className="text-primary hover:underline">+91 6392161771</a></li>
              <li>🕒 Support Hours: Monday–Saturday | 10:00 AM – 6:00 PM</li>
            </ul>
          </section>

        </div>
      </main>

      <Footer />
    </>
  );
}
