"use client";

import Link from "next/link";
import { Header } from "@/components/header";
import Footer from "@/components/footer";

export default function TermsAndConditionsPage() {
  return (
    <>
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-primary/10 to-background py-20 md:py-28 text-center">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-foreground">
            Terms and Conditions
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
              Welcome to <strong>Koza Leather</strong> (“we,” “our,” or “us”). These Terms and
              Conditions (“Terms”) govern your use of our website{" "}
              <Link
                href="https://www.koza.co.in"
                target="_blank"
                className="text-primary hover:underline"
              >
                www.koza.co.in
              </Link>{" "}
              (the “Site”) and any purchases or interactions you make with our brand.
              By accessing or using our website, you agree to comply with and be bound by these Terms.
              If you do not agree, please do not use our website or services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">1. General Information</h2>
            <p>
              Koza Leather is an Indian-based brand offering premium leather products,
              including belts, bags, wallets, purses, and accessories. These Terms apply
              to all visitors, users, and customers of our website. We reserve the right
              to update or change these Terms at any time without prior notice. The
              latest version will always be available on this page.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">2. Eligibility</h2>
            <p>
              By using our website or making a purchase, you confirm that you are at
              least 18 years old or accessing the site under the supervision of a legal
              guardian. You agree to provide accurate and complete information when
              creating an account or placing an order.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">3. Products & Pricing</h2>
            <p>
              All product prices are listed in Indian Rupees (INR) and include applicable
              taxes, unless stated otherwise. We strive to ensure product descriptions
              and images are accurate; however, slight variations in color or texture may
              occur due to natural leather characteristics or screen settings. Prices and
              availability are subject to change without notice.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">4. Orders & Payments</h2>
            <p>
              Orders can be placed through our official website only. We accept secure
              online payments via credit/debit cards, UPI, net banking, and wallet
              payments through our verified payment gateway partners. Once an order is
              placed and payment is received, you will receive an order confirmation via
              email/SMS. Koza Leather reserves the right to cancel or refuse any order if
              fraud or error is suspected.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">5. Shipping & Delivery</h2>
            <p>
              Orders are processed within 1–2 business days and delivered within 3–7
              business days depending on your location. For full details, please refer to
              our{" "}
              <Link href="/shipping-policy" className="text-primary hover:underline">
                Shipping Policy
              </Link>
              .
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">
              6. Returns, Refunds & Exchanges
            </h2>
            <p>
              We aim for 100% customer satisfaction. If you receive a damaged or defective
              item, please contact us within 7 days of delivery. Returns and refunds are
              subject to our{" "}
              <Link href="/return-refund-policy" className="text-primary hover:underline">
                Return & Refund Policy
              </Link>
              .
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">7. Intellectual Property</h2>
            <p>
              All content on our website — including text, images, logos, product designs,
              and graphics — is the property of Koza Leather and protected under
              applicable copyright and trademark laws. You may not reproduce, distribute,
              or use any part of this website for commercial purposes without written
              permission.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">8. Limitation of Liability</h2>
            <p>
              Koza Leather shall not be held responsible for any indirect, incidental, or
              consequential damages arising from the use of our website or products. All
              products are intended for personal use only, and Koza Leather is not liable
              for misuse or unauthorized resale.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">9. Privacy Policy</h2>
            <p>
              Your personal information is handled in accordance with our{" "}
              <Link href="/privacy-policy" className="text-primary hover:underline">
                Privacy Policy
              </Link>
              , which outlines how we collect, use, and protect your data.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">10. Governing Law</h2>
            <p>
              These Terms are governed by and construed in accordance with the laws of
              India. Any disputes shall be subject to the exclusive jurisdiction of the
              courts in Kanpur, UP, India.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">11. Contact Us</h2>
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
