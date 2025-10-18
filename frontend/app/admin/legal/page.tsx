"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Calendar, FileText, Shield } from "lucide-react"

export default function LegalPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Legal</h2>
        <Badge variant="outline" className="text-green-600">
          <Shield className="mr-1 h-3 w-3" />
          Compliant
        </Badge>
      </div>

      <Tabs defaultValue="terms" className="space-y-4">
        <TabsList>
          <TabsTrigger value="terms">Terms of Service</TabsTrigger>
          <TabsTrigger value="privacy">Privacy Policy</TabsTrigger>
          <TabsTrigger value="refund">Refund Policy</TabsTrigger>
          <TabsTrigger value="shipping">Shipping Policy</TabsTrigger>
        </TabsList>

        <TabsContent value="terms" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Terms of Service
              </CardTitle>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Last updated: January 15, 2024
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                className="min-h-[400px]"
                defaultValue={`TERMS OF SERVICE

1. ACCEPTANCE OF TERMS
By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement.

2. USE LICENSE
Permission is granted to temporarily download one copy of the materials on our website for personal, non-commercial transitory viewing only.

3. DISCLAIMER
The materials on our website are provided on an 'as is' basis. We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.

4. LIMITATIONS
In no event shall our company or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on our website.

5. ACCURACY OF MATERIALS
The materials appearing on our website could include technical, typographical, or photographic errors. We do not warrant that any of the materials on its website are accurate, complete, or current.

6. LINKS
We have not reviewed all of the sites linked to our website and are not responsible for the contents of any such linked site.

7. MODIFICATIONS
We may revise these terms of service for its website at any time without notice.

8. GOVERNING LAW
These terms and conditions are governed by and construed in accordance with the laws and you irrevocably submit to the exclusive jurisdiction of the courts.`}
              />
              <div className="flex gap-2">
                <Button>Save Changes</Button>
                <Button variant="outline">Preview</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Privacy Policy
              </CardTitle>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Last updated: January 15, 2024
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                className="min-h-[400px]"
                defaultValue={`PRIVACY POLICY

1. INFORMATION WE COLLECT
We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us for support.

2. HOW WE USE YOUR INFORMATION
We use the information we collect to:
- Process transactions and send related information
- Send you technical notices and support messages
- Respond to your comments and questions
- Monitor and analyze trends and usage

3. INFORMATION SHARING
We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy.

4. DATA SECURITY
We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.

5. COOKIES
We use cookies to enhance your experience, gather general visitor information, and track visits to our website.

6. THIRD-PARTY LINKS
Our website may contain links to third-party websites. We are not responsible for the privacy practices of these sites.

7. CHILDREN'S PRIVACY
We do not knowingly collect personal information from children under 13 years of age.

8. CHANGES TO PRIVACY POLICY
We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page.

9. CONTACT US
If you have questions about this privacy policy, please contact us at privacy@example.com.`}
              />
              <div className="flex gap-2">
                <Button>Save Changes</Button>
                <Button variant="outline">Preview</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="refund" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Refund Policy
              </CardTitle>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Last updated: January 15, 2024
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                className="min-h-[400px]"
                defaultValue={`REFUND POLICY

1. RETURN PERIOD
You have 30 days from the date of purchase to return an item for a full refund.

2. CONDITION OF ITEMS
Items must be returned in their original condition, unused, and in original packaging.

3. REFUND PROCESS
Once we receive your returned item, we will inspect it and notify you of the approval or rejection of your refund.

4. PROCESSING TIME
If approved, your refund will be processed within 5-7 business days to your original payment method.

5. SHIPPING COSTS
You will be responsible for paying your own shipping costs for returning items unless the return is due to our error.

6. NON-RETURNABLE ITEMS
Certain items cannot be returned, including:
- Perishable goods
- Custom or personalized items
- Digital downloads
- Gift cards

7. EXCHANGES
We only replace items if they are defective or damaged. Contact us for exchange requests.

8. LATE OR MISSING REFUNDS
If you haven't received your refund, first check your bank account, then contact your credit card company.

9. CONTACT US
For refund questions, contact us at refunds@example.com or call (555) 123-4567.`}
              />
              <div className="flex gap-2">
                <Button>Save Changes</Button>
                <Button variant="outline">Preview</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="shipping" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Shipping Policy
              </CardTitle>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Last updated: January 15, 2024
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                className="min-h-[400px]"
                defaultValue={`SHIPPING POLICY

1. PROCESSING TIME
Orders are processed within 1-2 business days. Orders placed on weekends or holidays will be processed the next business day.

2. SHIPPING METHODS
We offer the following shipping options:
- Standard Shipping (5-7 business days): $9.99
- Express Shipping (2-3 business days): $19.99
- Overnight Shipping (1 business day): $39.99

3. FREE SHIPPING
Free standard shipping on orders over $100 within the continental United States.

4. INTERNATIONAL SHIPPING
We ship internationally to most countries. International shipping rates and delivery times vary by destination.

5. SHIPPING RESTRICTIONS
We cannot ship to P.O. boxes for certain items. Some products may have shipping restrictions to certain locations.

6. DELIVERY
Delivery times are estimates and not guaranteed. We are not responsible for delays caused by shipping carriers.

7. DAMAGED OR LOST PACKAGES
If your package arrives damaged or is lost in transit, please contact us immediately for assistance.

8. ADDRESS ACCURACY
Please ensure your shipping address is correct. We are not responsible for packages shipped to incorrect addresses.

9. TRACKING
You will receive a tracking number via email once your order ships. Use this to track your package.

10. CONTACT US
For shipping questions, contact us at shipping@example.com or call (555) 123-4567.`}
              />
              <div className="flex gap-2">
                <Button>Save Changes</Button>
                <Button variant="outline">Preview</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
