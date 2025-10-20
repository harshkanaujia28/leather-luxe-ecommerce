"use client";

import { Header } from "@/components/header";
import Footer from "@/components/footer";

export default function PrivacyPolicyPage() {
  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center space-y-6 mb-16">
          <h1 className="text-4xl md:text-5xl font-bold">Privacy Policy</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Legal Entity Name: <strong>M.S International</strong>
            <br />
            Last Updated: <strong>20/10/2025</strong>
            <br />
            M.S International (“we,” “our,” or “us”) operates the website{" "}
            <strong>www.koza.co.in</strong> and is committed to protecting the privacy of our
            customers and visitors.
          </p>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            This Privacy Policy describes how we collect, use, and safeguard your personal
            information when you visit our website or make a purchase from us. By using our
            website, you agree to the terms outlined in this Privacy Policy.
          </p>
        </div>

        {/* Policy Content */}
        <div className="space-y-10 text-muted-foreground leading-relaxed max-w-4xl mx-auto">
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">1. Information We Collect</h2>
            <p className="mb-3">
              We may collect the following types of information from you:
            </p>
            <h3 className="font-semibold text-foreground mb-2">A. Personal Information:</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Full Name: <strong>MERAJUL HASAN</strong></li>
              <li>Email Address: <strong>info@koza.co.in</strong></li>
              <li>Mobile Number: <strong>+91 6392161771</strong></li>
              <li>
                Shipping & Billing Address:{" "}
                <strong>29/1, JUHI, Juhi Labour Colony, Deep Cinema, Kanpur, 208014</strong>
              </li>
              <li>Payment details (processed securely through third-party gateways)</li>
            </ul>
            <h3 className="font-semibold text-foreground mt-4 mb-2">B. Non-Personal Information:</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Browser type and version</li>
              <li>IP address</li>
              <li>Device information</li>
              <li>Cookies and usage data to improve website performance</li>
            </ul>
            <p className="mt-3">
              We collect this information to fulfill your orders, provide customer support, and
              enhance your shopping experience.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">2. How We Use Your Information</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>To process and fulfill orders placed through our website.</li>
              <li>To send order updates, tracking details, and customer support messages.</li>
              <li>To improve website functionality, performance, and user experience.</li>
              <li>To send marketing emails, offers, or updates (only if you opt in).</li>
              <li>To comply with legal and regulatory requirements.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">3. Payment Information</h2>
            <p>
              All online payments are processed securely through verified third-party payment
              gateways such as Razorpay or PayU. We do not store or have access to your full
              credit/debit card or UPI details. These are handled directly by the payment provider
              in compliance with RBI and PCI-DSS standards.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">4. Data Security</h2>
            <p>
              We adopt industry-standard security practices to protect your personal data from
              unauthorized access, alteration, or disclosure. Our website uses SSL (Secure Socket
              Layer) encryption to ensure safe data transmission. However, while we strive to
              protect your information, no online transmission or storage is 100% secure, and we
              cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">5. Sharing of Information</h2>
            <p>
              We do not sell, rent, or trade your personal information. We may share limited data
              only with:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Shipping and logistics partners for order delivery.</li>
              <li>Payment gateway partners for transaction processing.</li>
              <li>Legal authorities if required by law or to prevent fraud.</li>
            </ul>
            <p>
              All such third parties are bound to protect your information and use it only for the
              intended purpose.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">6. Cookies</h2>
            <p>
              Our website uses cookies to remember preferences, analyze traffic, and personalize
              your experience. You can disable cookies in your browser settings, but some features
              may not function properly without them.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">7. Your Rights</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Access, correct, or update your personal information.</li>
              <li>Withdraw consent for marketing communications at any time.</li>
              <li>
                Request deletion of your data (subject to legal or transactional retention
                requirements).
              </li>
            </ul>
            <p>
              To exercise these rights, contact us at{" "}
              <a href="mailto:info@koza.co.in" className="text-primary hover:underline">
                info@koza.co.in
              </a>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">8. Data Retention</h2>
            <p>
              We retain your personal data only as long as necessary to fulfill the purposes for
              which it was collected or to comply with legal obligations. Once no longer needed,
              your data is securely deleted or anonymized.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">9. Third-Party Links</h2>
            <p>
              Our website may contain links to third-party websites. We are not responsible for the
              privacy practices or content of such sites and recommend reviewing their privacy
              policies before sharing any information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">10. Updates to This Policy</h2>
            <p>
              M.S International reserves the right to modify this Privacy Policy at any time.
              Changes will be posted here with the updated date. Continued use of our website after
              changes constitutes your acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">11. Contact Us</h2>
            <p>
              If you have any questions or concerns regarding this Privacy Policy, please contact
              us:
            </p>
            <ul className="list-none space-y-2">
              <li>📧 Email: <a href="mailto:info@koza.co.in" className="text-primary hover:underline">info@koza.co.in</a></li>
              <li>📞 Phone: +91 6392161771</li>
              <li>🕒 Support Hours: Monday–Saturday | 10:00 AM – 6:00 PM</li>
            </ul>
          </section>
        </div>
      </div>
      <Footer />
    </>
  );
}
