"use client"

import type React from "react"

import { useState } from "react"
import { Header } from "@/components/header"
import Footer from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Phone,
  Mail,
  Clock,
  HelpCircle,
  FileText,
  Package,
  CreditCard,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useApi } from "@/contexts/api-context"

export default function SupportPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    orderNumber: "",
    category: "",
    priority: "",
    subject: "",
    message: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const { submitSupportTicket } = useApi()

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const payload = {
        customer: formData.name,
        email: formData.email,
        subject: formData.subject,
        priority: formData.priority,
        category: formData.category,
        orderId: formData.orderNumber || undefined,
        description: formData.message,
      }

      await submitSupportTicket(payload)

      toast({
        title: "Support request submitted!",
        description: "Our team will reach out within 24 hours.",
      })

      setFormData({
        name: "",
        email: "",
        orderNumber: "",
        category: "",
        priority: "",
        subject: "",
        message: "",
      })
    } catch (error) {
      toast({
        title: "Failed to submit",
        description: "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const commonIssues = [
    {
      icon: Package,
      title: "Order & Shipping",
      description: "Track orders, delayed shipment, wrong product",
      link: "/orders",
    },
    {
      icon: CreditCard,
      title: "Payment & Refunds",
      description: "Payment issues, refund status, invoice request",
      link: "/returns",
    },
    {
      icon: FileText,
      title: "Returns & Exchange",
      description: "Return pickup, replacement, quality concern",
      link: "/returns",
    },
    {
      icon: HelpCircle,
      title: "Product Help",
      description: "Leather care, size guide, customization",
      link: "/faq",
    },
  ]

  return (
    <>
      <Header />
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-12 py-16">
          <h1 className="text-4xl font-bold">Support</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Need help with an order, return, or product? Our team is here for you.
          </p>
        </div>

        {/* Common Issues */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-center mb-8">Common Issues</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {commonIssues.map((issue) => {
              const Icon = issue.icon
              return (
                <Card key={issue.title} className="hover:shadow-lg transition">
                  <CardContent className="p-6 text-center space-y-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold">{issue.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {issue.description}
                    </p>
                    <Button variant="outline" size="sm" asChild>
                      <a href={issue.link}>Learn More</a>
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Form + Contact */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* FORM */}
          <Card>
            <CardHeader>
              <CardTitle>Submit a Support Request</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Name</Label>
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label>Order Number (optional)</Label>
                  <Input
                    name="orderNumber"
                    placeholder="ORD-12345"
                    value={formData.orderNumber}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Category</Label>
                    <Select onValueChange={(v) => handleSelectChange("category", v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="product_issue">Product Issue</SelectItem>
                        <SelectItem value="shipping_issue">Shipping Issue</SelectItem>
                        <SelectItem value="billing">Billing</SelectItem>
                        <SelectItem value="general">General</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Priority</Label>
                    <Select onValueChange={(v) => handleSelectChange("priority", v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>Subject</Label>
                  <Input
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div>
                  <Label>Message</Label>
                  <Textarea
                    name="message"
                    rows={6}
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Submitting..." : "Submit Request"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* CONTACT INFO */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium">Phone</p>
                    <p className="text-muted-foreground">+91 79051 68856</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-muted-foreground">support@koza.co.in</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium">Business Hours</p>
                    <p className="text-muted-foreground">Mon–Sat: 10:00 AM – 6:00 PM</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Before You Contact</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Check order confirmation email for tracking details</li>
                  <li>• View FAQ for instant answers</li>
                  <li>• Keep your Order ID ready for faster help</li>
                  <li>• Check spam folder for missed replies</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

      </div>
      <Footer />
    </>
  )
}
