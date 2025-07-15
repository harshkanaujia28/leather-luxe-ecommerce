"use client"

import { useState } from "react"
import { Search, MessageSquare, Package, DollarSign, Eye, CheckCircle, XCircle, Clock, Mail, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"


const mockSupportTickets = [
  {
    id: "ST-001",
    customer: "Sarah Johnson",
    email: "sarah@example.com",
    subject: "Allergic reaction to Tom Ford Oud Wood",
    priority: "high",
    status: "open",
    category: "product_issue",
    date: "2024-01-15",
    lastUpdate: "2024-01-15",
    orderId: "FR-1001",
    fragrance: "Tom Ford Oud Wood 50ml",
    description: "Customer experienced allergic reaction after using the fragrance. Requesting return and refund.",
  },
  {
    id: "ST-002",
    customer: "Mike Chen",
    email: "mike@example.com",
    subject: "Wrong fragrance received",
    priority: "medium",
    status: "in_progress",
    category: "shipping_issue",
    date: "2024-01-14",
    lastUpdate: "2024-01-14",
    orderId: "FR-1002",
    fragrance: "Chanel No. 5 100ml",
    description: "Customer ordered Chanel No. 5 but received Chanel Coco Mademoiselle instead.",
  },
  {
    id: "ST-003",
    customer: "Emma Davis",
    email: "emma@example.com",
    subject: "Damaged bottle during shipping",
    priority: "high",
    status: "resolved",
    category: "shipping_issue",
    date: "2024-01-13",
    lastUpdate: "2024-01-13",
    orderId: "FR-1003",
    fragrance: "Dior Sauvage 100ml",
    description: "Fragrance bottle arrived cracked, product leaked during transit.",
  },
]

const mockReturns = [
  {
    id: "RT-001",
    customer: "John Smith",
    email: "john@example.com",
    orderId: "FR-1004",
    status: "pending_approval",
    reason: "not_as_described",
    date: "2024-01-15",
    items: [
      {
        name: "Creed Aventus 50ml",
        reason: "Scent doesn't match description",
        condition: "unopened",
        refundAmount: 299.99,
      },
    ],
    totalRefund: 299.99,
    returnMethod: "mail",
  },
  {
    id: "RT-002",
    customer: "Lisa Wilson",
    email: "lisa@example.com",
    orderId: "FR-1005",
    status: "approved",
    reason: "allergic_reaction",
    date: "2024-01-14",
    items: [
      {
        name: "Chanel Chance 100ml",
        reason: "Allergic reaction to ingredients",
        condition: "partially_used",
        refundAmount: 120.0,
      },
    ],
    totalRefund: 120.0,
    returnMethod: "mail",
  },
  {
    id: "RT-003",
    customer: "David Brown",
    email: "david@example.com",
    orderId: "FR-1006",
    status: "completed",
    reason: "damaged",
    date: "2024-01-13",
    items: [
      {
        name: "Versace Eros 100ml",
        reason: "Bottle cracked during shipping",
        condition: "damaged",
        refundAmount: 89.99,
      },
    ],
    totalRefund: 89.99,
    returnMethod: "replacement_sent",
  },
]

const mockRefunds = [
  {
    id: "RF-001",
    customer: "Anna Taylor",
    email: "anna@example.com",
    orderId: "FR-1007",
    amount: 199.99,
    status: "processed",
    method: "credit_card",
    date: "2024-01-15",
    reason: "Return approved - allergic reaction",
    fragrance: "Dolce & Gabbana Light Blue 100ml",
  },
  {
    id: "RF-002",
    customer: "Robert Lee",
    email: "robert@example.com",
    orderId: "FR-1008",
    amount: 149.99,
    status: "pending",
    method: "paypal",
    date: "2024-01-14",
    reason: "Return approved - wrong item",
    fragrance: "Hugo Boss Bottled 100ml",
  },
]

export default function SupportPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [selectedTicket, setSelectedTicket] = useState<any>(null)
  const [selectedReturn, setSelectedReturn] = useState<any>(null)
  const { toast } = useToast()

  const filteredTickets = mockSupportTickets.filter((ticket) => {
    const matchesSearch =
      ticket.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.fragrance.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || ticket.status === statusFilter
    const matchesPriority = priorityFilter === "all" || ticket.priority === priorityFilter
    const matchesCategory = categoryFilter === "all" || ticket.category === categoryFilter
    return matchesSearch && matchesStatus && matchesPriority && matchesCategory
  })

  const filteredReturns = mockReturns.filter((returnItem) => {
    const matchesSearch =
      returnItem.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      returnItem.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      returnItem.orderId.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || returnItem.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const filteredRefunds = mockRefunds.filter((refund) => {
    const matchesSearch =
      refund.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      refund.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      refund.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      refund.fragrance.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || refund.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
      case "pending_approval":
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "in_progress":
      case "approved":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "resolved":
      case "completed":
      case "processed":
        return "bg-green-100 text-green-800 border-green-200"
      case "closed":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const handleStatusUpdate = (id: string, newStatus: string, type: string) => {
    toast({
      title: `${type} updated`,
      description: `${type} ${id} status updated to ${newStatus}.`,
    })
  }

  const handleApproveReturn = (returnId: string) => {
    toast({
      title: "Return approved",
      description: `Return ${returnId} has been approved and refund will be processed.`,
    })
  }

  const handleProcessRefund = (refundId: string) => {
    toast({
      title: "Refund processed",
      description: `Refund ${refundId} has been processed successfully.`,
    })
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
     

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Tickets</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockSupportTickets.filter((t) => t.status === "open").length}</div>
            <p className="text-xs text-muted-foreground">+2 from yesterday</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Returns</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockReturns.filter((r) => r.status === "pending_approval").length}
            </div>
            <p className="text-xs text-muted-foreground">Awaiting approval</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Refunds</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockRefunds.filter((r) => r.status === "pending").length}</div>
            <p className="text-xs text-muted-foreground">
              $
              {mockRefunds
                .filter((r) => r.status === "pending")
                .reduce((sum, r) => sum + r.amount, 0)
                .toFixed(2)}{" "}
              total
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.4h</div>
            <p className="text-xs text-muted-foreground">-0.5h from last week</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="tickets" className="space-y-4">
        <TabsList>
          <TabsTrigger value="tickets">Support Tickets</TabsTrigger>
          <TabsTrigger value="returns">Returns & Exchanges</TabsTrigger>
          <TabsTrigger value="refunds">Refunds</TabsTrigger>
        </TabsList>

        <TabsContent value="tickets" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Support Tickets ({filteredTickets.length})</CardTitle>
                <div className="flex space-x-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search tickets..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Priority</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="product_issue">Product Issue</SelectItem>
                      <SelectItem value="shipping_issue">Shipping Issue</SelectItem>
                      <SelectItem value="billing">Billing</SelectItem>
                      <SelectItem value="general">General</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Ticket ID</th>
                      <th className="text-left py-3 px-4">Customer</th>
                      <th className="text-left py-3 px-4">Subject</th>
                      <th className="text-left py-3 px-4">Fragrance</th>
                      <th className="text-left py-3 px-4">Priority</th>
                      <th className="text-left py-3 px-4">Status</th>
                      <th className="text-left py-3 px-4">Date</th>
                      <th className="text-left py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTickets.map((ticket) => (
                      <tr key={ticket.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium">{ticket.id}</td>
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium">{ticket.customer}</p>
                            <p className="text-sm text-gray-600">{ticket.email}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <p className="font-medium">{ticket.subject}</p>
                          <p className="text-sm text-gray-600">Order: {ticket.orderId}</p>
                        </td>
                        <td className="py-3 px-4 text-sm">{ticket.fragrance}</td>
                        <td className="py-3 px-4">
                          <Badge className={getPriorityColor(ticket.priority)}>{ticket.priority}</Badge>
                        </td>
                        <td className="py-3 px-4">
                          <Badge className={getStatusColor(ticket.status)}>{ticket.status.replace("_", " ")}</Badge>
                        </td>
                        <td className="py-3 px-4">{ticket.date}</td>
                        <td className="py-3 px-4">
                          <div className="flex space-x-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm" onClick={() => setSelectedTicket(ticket)}>
                                  <Eye className="w-4 h-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle>Ticket Details - {selectedTicket?.id}</DialogTitle>
                                </DialogHeader>
                                {selectedTicket && (
                                  <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <Label className="font-medium">Customer</Label>
                                        <p>{selectedTicket.customer}</p>
                                        <p className="text-sm text-gray-600">{selectedTicket.email}</p>
                                      </div>
                                      <div>
                                        <Label className="font-medium">Order</Label>
                                        <p>{selectedTicket.orderId}</p>
                                        <p className="text-sm text-gray-600">{selectedTicket.fragrance}</p>
                                      </div>
                                    </div>
                                    <div>
                                      <Label className="font-medium">Subject</Label>
                                      <p>{selectedTicket.subject}</p>
                                    </div>
                                    <div>
                                      <Label className="font-medium">Description</Label>
                                      <p className="text-sm">{selectedTicket.description}</p>
                                    </div>
                                    <div className="flex space-x-4">
                                      <div>
                                        <Label className="font-medium">Priority</Label>
                                        <Badge className={getPriorityColor(selectedTicket.priority)}>
                                          {selectedTicket.priority}
                                        </Badge>
                                      </div>
                                      <div>
                                        <Label className="font-medium">Status</Label>
                                        <Badge className={getStatusColor(selectedTicket.status)}>
                                          {selectedTicket.status.replace("_", " ")}
                                        </Badge>
                                      </div>
                                    </div>
                                    <div className="space-y-2">
                                      <Label className="font-medium">Response</Label>
                                      <Textarea placeholder="Type your response..." />
                                      <div className="flex space-x-2">
                                        <Button>Send Response</Button>
                                        <Button variant="outline">
                                          <Mail className="w-4 h-4 mr-2" />
                                          Email Customer
                                        </Button>
                                        <Button variant="outline">
                                          <Phone className="w-4 h-4 mr-2" />
                                          Call Customer
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>
                            <Select onValueChange={(value) => handleStatusUpdate(ticket.id, value, "Ticket")}>
                              <SelectTrigger className="w-32">
                                <SelectValue placeholder="Update" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="open">Open</SelectItem>
                                <SelectItem value="in_progress">In Progress</SelectItem>
                                <SelectItem value="resolved">Resolved</SelectItem>
                                <SelectItem value="closed">Closed</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="returns" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Returns & Exchanges ({filteredReturns.length})</CardTitle>
                <div className="flex space-x-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search returns..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending_approval">Pending Approval</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Return ID</th>
                      <th className="text-left py-3 px-4">Customer</th>
                      <th className="text-left py-3 px-4">Order ID</th>
                      <th className="text-left py-3 px-4">Reason</th>
                      <th className="text-left py-3 px-4">Refund Amount</th>
                      <th className="text-left py-3 px-4">Status</th>
                      <th className="text-left py-3 px-4">Date</th>
                      <th className="text-left py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredReturns.map((returnItem) => (
                      <tr key={returnItem.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium">{returnItem.id}</td>
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium">{returnItem.customer}</p>
                            <p className="text-sm text-gray-600">{returnItem.email}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4">{returnItem.orderId}</td>
                        <td className="py-3 px-4">
                          <Badge variant="outline">{returnItem.reason.replace("_", " ")}</Badge>
                        </td>
                        <td className="py-3 px-4 font-medium">${returnItem.totalRefund}</td>
                        <td className="py-3 px-4">
                          <Badge className={getStatusColor(returnItem.status)}>
                            {returnItem.status.replace("_", " ")}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">{returnItem.date}</td>
                        <td className="py-3 px-4">
                          <div className="flex space-x-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm" onClick={() => setSelectedReturn(returnItem)}>
                                  <Eye className="w-4 h-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle>Return Details - {selectedReturn?.id}</DialogTitle>
                                </DialogHeader>
                                {selectedReturn && (
                                  <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <Label className="font-medium">Customer</Label>
                                        <p>{selectedReturn.customer}</p>
                                        <p className="text-sm text-gray-600">{selectedReturn.email}</p>
                                      </div>
                                      <div>
                                        <Label className="font-medium">Order ID</Label>
                                        <p>{selectedReturn.orderId}</p>
                                      </div>
                                    </div>
                                    <div>
                                      <Label className="font-medium">Items to Return</Label>
                                      {selectedReturn.items.map((item: any, index: number) => (
                                        <div key={index} className="border rounded p-3 mt-2">
                                          <p className="font-medium">{item.name}</p>
                                          <p className="text-sm text-gray-600">Reason: {item.reason}</p>
                                          <p className="text-sm text-gray-600">Condition: {item.condition}</p>
                                          <p className="text-sm font-medium">Refund: ${item.refundAmount}</p>
                                        </div>
                                      ))}
                                    </div>
                                    <div className="flex space-x-4">
                                      <div>
                                        <Label className="font-medium">Total Refund</Label>
                                        <p className="text-lg font-bold">${selectedReturn.totalRefund}</p>
                                      </div>
                                      <div>
                                        <Label className="font-medium">Return Method</Label>
                                        <p>{selectedReturn.returnMethod.replace("_", " ")}</p>
                                      </div>
                                    </div>
                                    {selectedReturn.status === "pending_approval" && (
                                      <div className="flex space-x-2">
                                        <Button onClick={() => handleApproveReturn(selectedReturn.id)}>
                                          <CheckCircle className="w-4 h-4 mr-2" />
                                          Approve Return
                                        </Button>
                                        <Button variant="destructive">
                                          <XCircle className="w-4 h-4 mr-2" />
                                          Reject Return
                                        </Button>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>
                            {returnItem.status === "pending_approval" && (
                              <Button size="sm" onClick={() => handleApproveReturn(returnItem.id)}>
                                <CheckCircle className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="refunds" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Refunds ({filteredRefunds.length})</CardTitle>
                <div className="flex space-x-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search refunds..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="processed">Processed</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Refund ID</th>
                      <th className="text-left py-3 px-4">Customer</th>
                      <th className="text-left py-3 px-4">Order ID</th>
                      <th className="text-left py-3 px-4">Fragrance</th>
                      <th className="text-left py-3 px-4">Amount</th>
                      <th className="text-left py-3 px-4">Method</th>
                      <th className="text-left py-3 px-4">Status</th>
                      <th className="text-left py-3 px-4">Date</th>
                      <th className="text-left py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRefunds.map((refund) => (
                      <tr key={refund.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium">{refund.id}</td>
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium">{refund.customer}</p>
                            <p className="text-sm text-gray-600">{refund.email}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4">{refund.orderId}</td>
                        <td className="py-3 px-4 text-sm">{refund.fragrance}</td>
                        <td className="py-3 px-4 font-medium">${refund.amount}</td>
                        <td className="py-3 px-4">
                          <Badge variant="outline">{refund.method.replace("_", " ")}</Badge>
                        </td>
                        <td className="py-3 px-4">
                          <Badge className={getStatusColor(refund.status)}>{refund.status}</Badge>
                        </td>
                        <td className="py-3 px-4">{refund.date}</td>
                        <td className="py-3 px-4">
                          <div className="flex space-x-2">
                            {refund.status === "pending" && (
                              <Button size="sm" onClick={() => handleProcessRefund(refund.id)}>
                                <DollarSign className="w-4 h-4" />
                              </Button>
                            )}
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
