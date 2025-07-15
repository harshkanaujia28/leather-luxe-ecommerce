import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="luxury-gradient py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">Terms of Service</h1>
            <p className="text-xl text-gray-600">
              Please read these terms carefully before using our website and services.
            </p>
            <p className="text-sm text-gray-500 mt-4">Last updated: January 1, 2024</p>
          </div>
        </section>

        {/* Terms Content */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>1. Acceptance of Terms</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    By accessing and using the Luxe Fragrances website and services, you accept and agree to be bound by
                    the terms and provision of this agreement. If you do not agree to abide by the above, please do not
                    use this service.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>2. Use License</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600">
                    Permission is granted to temporarily download one copy of the materials on Luxe Fragrances' website
                    for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer
                    of title, and under this license you may not:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>modify or copy the materials</li>
                    <li>use the materials for any commercial purpose or for any public display</li>
                    <li>attempt to reverse engineer any software contained on the website</li>
                    <li>remove any copyright or other proprietary notations from the materials</li>
                  </ul>
                  <p className="text-gray-600">
                    This license shall automatically terminate if you violate any of these restrictions and may be
                    terminated by Luxe Fragrances at any time.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>3. Product Information and Pricing</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Product Descriptions</h4>
                    <p className="text-gray-600">
                      We strive to provide accurate product descriptions and images. However, we do not warrant that
                      product descriptions or other content is accurate, complete, reliable, current, or error-free.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Pricing</h4>
                    <p className="text-gray-600">
                      All prices are subject to change without notice. We reserve the right to modify prices at any
                      time. In case of a pricing error, we reserve the right to cancel orders placed at the incorrect
                      price.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Availability</h4>
                    <p className="text-gray-600">
                      All products are subject to availability. We reserve the right to discontinue any product at any
                      time.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>4. Orders and Payment</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Order Acceptance</h4>
                    <p className="text-gray-600">
                      Your receipt of an order confirmation does not signify our acceptance of your order. We reserve
                      the right to accept or decline your order for any reason.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Payment</h4>
                    <p className="text-gray-600">
                      Payment must be received by us before we ship your order. We accept major credit cards, PayPal,
                      and other payment methods as displayed during checkout.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Taxes</h4>
                    <p className="text-gray-600">
                      You are responsible for any applicable taxes, duties, or customs fees associated with your order.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>5. Shipping and Delivery</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Shipping Times</h4>
                    <p className="text-gray-600">
                      Shipping times are estimates and not guaranteed. We are not responsible for delays caused by
                      shipping carriers or customs.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Risk of Loss</h4>
                    <p className="text-gray-600">
                      Risk of loss and title for items purchased pass to you upon delivery to the shipping carrier.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">International Shipping</h4>
                    <p className="text-gray-600">
                      International customers are responsible for any customs duties, taxes, or fees imposed by their
                      country.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>6. Returns and Refunds</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Our return policy is detailed on our Returns page. Key points include:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>Returns must be initiated within 30 days of delivery</li>
                    <li>Items must be unopened and in original packaging</li>
                    <li>Refunds will be processed to the original payment method</li>
                    <li>Return shipping costs may apply</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>7. User Accounts</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Account Security</h4>
                    <p className="text-gray-600">
                      You are responsible for maintaining the confidentiality of your account credentials and for all
                      activities that occur under your account.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Accurate Information</h4>
                    <p className="text-gray-600">
                      You agree to provide accurate, current, and complete information when creating your account and to
                      update such information as necessary.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Account Termination</h4>
                    <p className="text-gray-600">
                      We reserve the right to terminate or suspend your account at any time for violation of these
                      terms.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>8. Prohibited Uses</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    You may not use our website for any unlawful purpose or to solicit others to perform unlawful acts.
                    You may not:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>Violate any applicable laws or regulations</li>
                    <li>Transmit any harmful or malicious code</li>
                    <li>Interfere with or disrupt our services</li>
                    <li>Attempt to gain unauthorized access to our systems</li>
                    <li>Use our website for fraudulent purposes</li>
                    <li>Infringe upon intellectual property rights</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>9. Intellectual Property</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    All content on this website, including text, graphics, logos, images, and software, is the property
                    of Luxe Fragrances or its content suppliers and is protected by copyright and other intellectual
                    property laws. You may not reproduce, distribute, or create derivative works without our express
                    written permission.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>10. Disclaimers</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Website Content</h4>
                    <p className="text-gray-600">
                      The information on this website is provided on an 'as is' basis. We make no warranties, expressed
                      or implied, and hereby disclaim all other warranties.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Product Performance</h4>
                    <p className="text-gray-600">
                      Fragrance performance may vary based on individual skin chemistry, environmental factors, and
                      personal perception. We cannot guarantee specific performance outcomes.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>11. Limitation of Liability</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    In no event shall Luxe Fragrances or its suppliers be liable for any damages (including, without
                    limitation, damages for loss of data or profit, or due to business interruption) arising out of the
                    use or inability to use the materials on our website, even if we have been notified orally or in
                    writing of the possibility of such damage. Our total liability shall not exceed the amount paid by
                    you for the product(s) in question.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>12. Governing Law</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    These terms and conditions are governed by and construed in accordance with the laws of the State of
                    New York, and you irrevocably submit to the exclusive jurisdiction of the courts in that state or
                    location.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>13. Changes to Terms</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    We reserve the right to revise these terms of service at any time without notice. By using this
                    website, you are agreeing to be bound by the then current version of these terms of service.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>14. Contact Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    If you have any questions about these Terms of Service, please contact us:
                  </p>
                  <div className="space-y-2 text-gray-600">
                    <p>
                      <strong>Email:</strong> legal@luxefragrances.com
                    </p>
                    <p>
                      <strong>Phone:</strong> (555) 123-4567
                    </p>
                    <p>
                      <strong>Mail:</strong> Luxe Fragrances Legal Department
                      <br />
                      123 Fragrance Avenue
                      <br />
                      New York, NY 10001
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
