"use client";

import Link from "next/link";
import { Header } from "@/components/header";
import Footer from "@/components/footer";

export default function CancellationsAndRefundsPage() {
  return (
    <>
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-primary/10 to-background py-20 md:py-28 text-center">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-foreground">
            Cancellations & Refunds Policy
          </h1>
          <p className="text-muted-foreground text-lg">
            Last Updated: <strong>20/10/2025</strong>
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-16 max-w-4xl">
        <div className="bg-card shadow-sm rounded-2xl p-8 md:p-12 border border-border space-y-10 leading-relaxed text-foreground/90">
          <section>
            <p>
              At <strong>Koza Leather</strong>, we value our customers and want you to be
              completely satisfied with your purchase. This Cancellations and Refunds Policy
              explains how we handle order cancellations, returns, and refunds for our products.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">1. Order Cancellation</h2>
            <h3 className="text-lg font-medium mt-3 mb-1">Before Dispatch:</h3>
            <p>
              Orders can be cancelled within <strong>24 hours</strong> of placing them,
              provided they have not been shipped.
            </p>
            <p className="mt-3">
              To cancel your order, please email us at{" "}
              <a
                href="mailto:info@koza.co.in"
                className="text-primary hover:underline"
              >
                info@koza.co.in
              </a>{" "}
              or contact us at{" "}
              <a href="tel:+916392161771" className="text-primary hover:underline">
                +91 6392161771
              </a>{" "}
              with your Order ID.
            </p>
            <p className="mt-3">
              If the order has already been dispatched, it cannot be cancelled. You may,
              however, request a return after delivery (see below).
            </p>

            <h3 className="text-lg font-medium mt-6 mb-1">After Dispatch:</h3>
            <p>
              Once your order is shipped, it is not eligible for cancellation. In such
              cases, please refer to our{" "}
              <Link href="/return-refund-policy" className="text-primary hover:underline">
                Return & Refund Policy
              </Link>
              .
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">2. Return Eligibility</h2>
            <p>We accept returns only under the following conditions:</p>
            <ul className="list-disc list-inside mt-3 space-y-1">
              <li>You received a damaged, defective, or incorrect item.</li>
              <li>
                The product must be unused, unwashed, and in its original packaging with all
                tags intact.
              </li>
              <li>
                You must notify us of the issue within <strong>7 days</strong> of delivery by
                emailing{" "}
                <a
                  href="mailto:info@koza.co.in"
                  className="text-primary hover:underline"
                >
                  info@koza.co.in
                </a>{" "}
                with your order details and product photos as proof.
              </li>
            </ul>

            <h3 className="text-lg font-medium mt-6 mb-2">Items not eligible for return:</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>Products damaged due to customer handling or misuse.</li>
              <li>Customized or personalized leather products.</li>
              <li>Items purchased on sale or marked “non-returnable.”</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">3. Refunds Process</h2>
            <p>
              Once your return request is approved and the product is received in our
              warehouse:
            </p>
            <ul className="list-disc list-inside mt-3 space-y-1">
              <li>
                A refund will be initiated within <strong>5–7 business days</strong> to your
                original payment method.
              </li>
              <li>
                Refund timelines may vary depending on your bank or payment provider.
              </li>
              <li>
                If payment was made via <strong>COD (Cash on Delivery)</strong>, we will
                initiate the refund via bank transfer or UPI after verifying your details.
              </li>
            </ul>
            <p className="mt-3">
              <strong>Note:</strong> Shipping and handling charges are non-refundable unless
              the return is due to an error on our part (wrong or defective product).
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">4. Exchange Policy</h2>
            <p>Exchanges are subject to product availability.</p>
            <p className="mt-3">
              If the requested replacement is unavailable, a refund will be processed
              instead. Shipping charges for exchange may apply depending on the reason for
              return.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">5. Damaged or Incorrect Items</h2>
            <p>
              If your order arrives damaged, defective, or incorrect, please contact us
              within <strong>48 hours</strong> of delivery with supporting photos or videos.
              We will arrange for a free replacement or full refund, as applicable.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">6. Late or Missing Refunds</h2>
            <p>
              If you haven’t received your refund after the specified time:
            </p>
            <ul className="list-disc list-inside mt-3 space-y-1">
              <li>Recheck your bank account or payment app.</li>
              <li>Contact your bank or payment provider.</li>
              <li>
                If the issue persists, reach out to us at{" "}
                <a
                  href="mailto:info@koza.co.in"
                  className="text-primary hover:underline"
                >
                  info@koza.co.in
                </a>{" "}
                — we’ll assist you promptly.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">7. Contact Us</h2>
            <ul className="space-y-2">
              <li>
                📧 Email:{" "}
                <a
                  href="mailto:info@koza.co.in"
                  className="text-primary hover:underline"
                >
                  info@koza.co.in
                </a>
              </li>
              <li>
                📞 Phone:{" "}
                <a
                  href="tel:+916392161771"
                  className="text-primary hover:underline"
                >
                  +91 6392161771
                </a>
              </li>
              <li>🕒 Support Hours: Monday–Saturday | 10:00 AM – 6:00 PM</li>
            </ul>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}
