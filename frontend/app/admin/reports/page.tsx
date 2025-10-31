"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import {
  Download,
  FileDown,
  IndianRupeeIcon,
  ShoppingCart,
  Users,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useApi } from "@/contexts/api-context";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

/**
 * Types aligned with backend reports controller
 */
type Range = "today" | "this-week" | "this-month" | "this-year";

type SalesPoint = {
  month: string;
  revenue: number;
  orders: number;
  customers?: number;
};

type ReportDoc = {
  _id: string;
  period?: string;
  salesData?: SalesPoint[]; // embedded monthly points in Report model
  createdAt: string;
  updatedAt: string;
};

type PaymentBreakdown = { status: string; count: number; amount: number };

type Product = {
  _id: string;
  name: string;
  brand?: string;
  price?: number;
  description?: string;
  revenue?: number;
  unitsSold?: number;
  category?: {
    type?: string;
    gender?: string;
    subCategory?: string;
  };
};

type Brand = { _id: string; name: string; description?: string; fragrances?: number };
type Vendor = {
  _id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  orders?: number;
  onTimeDelivery?: number;
  avgDeliveryTime?: number;
};

type Overview = {
  totalOrders: number;
  totalRevenue: number;
  totalUsers: number;
  totalProducts: number;
};

type ReportResponse = {
  salesData: ReportDoc[]; // array of Report docs (name matches backend response)
  vendors: Vendor[];
  products: Product[];
  brands: Brand[];
  overview: Overview;
  payments: PaymentBreakdown[];
};

export default function ReportsPage() {
  const { getReportData } = useApi();
  const [range, setRange] = useState<Range>("this-month");
  const [report, setReport] = useState<ReportResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await getReportData(range as any);
        setReport(data as ReportResponse);
        console.log(data);
      } catch (e) {
        console.error("Failed to load report", e);
      } finally {
        setLoading(false);
      }
    })();
  }, [getReportData, range]);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF", "#FF4560"];

  // ===== Derivations from data =====
  const overview = report?.overview ?? { totalOrders: 0, totalRevenue: 0, totalUsers: 0, totalProducts: 0 };

  // Use time-series embedded in first Report doc if present; fallback to empty
  const timeSeries: SalesPoint[] = useMemo(() => {
    return (report?.salesData ?? []).map((p) => ({
      month: p.month,                // already "Aug-2025"
      revenue: Number(p.revenue),    // ensure number
      orders: Number(p.orders),      // ensure number
      customers: Number(p.customers ?? 0),
    }));
  }, [report]);

  const users = report?.users ?? [];

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
    });
  };
  const formattedRevenue = useMemo(
    () => formatCurrency(overview.totalRevenue || 0),
    [overview.totalRevenue]
  );

  const fragranceCategoryData = useMemo(() => {
    const buckets: Record<string, { name: string; value: number }> = {};
    (report?.products ?? []).forEach((p) => {
      const key = p.category?.subCategory || p.category?.type || "Other";
      buckets[key] = buckets[key] || { name: key, value: 0 };
      buckets[key].value += 1;
    });
    return Object.values(buckets);
  }, [report?.products]);

  // ===== Export: Excel =====
  const handleExportExcel = () => {
    if (!report) return;
    const salesSheet = timeSeries.map((s) => ({ Month: s.month, Revenue: s.revenue, Orders: s.orders, Customers: s.customers ?? 0 }));
    const productsSheet = (report.products ?? []).map((p) => ({
      Name: p.name,
      Brand: p.brand ?? "",
      Price: p.price ?? "",
      Revenue: p.revenue ?? "",
      UnitsSold: p.unitsSold ?? "",
      Gender: p.category?.gender ?? "",
      Type: p.category?.type ?? "",
      Subcategory: p.category?.subCategory ?? "",
    }));
    const brandsSheet = (report.brands ?? []).map((b) => ({ Name: b.name, Description: b.description ?? "", Fragrances: b.fragrances ?? 0 }));
    const vendorsSheet = (report.vendors ?? []).map((v) => ({
      Name: v.name,
      Email: v.email ?? "",
      Phone: v.phone ?? "",
      Address: v.address ?? "",
      Orders: v.orders ?? 0,
      OnTimeDelivery: v.onTimeDelivery ?? 0,
      AvgDeliveryTime: v.avgDeliveryTime ?? 0,
    }));
    const paymentsSheet = (report.payments ?? []).map((p) => ({ Status: p.status, Count: p.count, Amount: p.amount }));
    const overviewSheet = [
      {
        TotalRevenue: overview.totalRevenue,
        TotalOrders: overview.totalOrders,
        TotalUsers: overview.totalUsers,
        TotalProducts: overview.totalProducts,
      },
    ];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(overviewSheet), "Overview");
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(salesSheet), "Sales");
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(productsSheet), "Products");
    // XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(brandsSheet), "Brands");
    // XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(vendorsSheet), "Vendors");
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(paymentsSheet), "Payments");
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([wbout], { type: "application/octet-stream" }), `report-${range}.xlsx`);
  };

  // ===== Export: PDF with tables =====
  // ===== Export: PDF with tables =====
  const handleExportPDF = () => {
    if (!report) return;
    const doc = new jsPDF({ orientation: "p", unit: "pt", format: "a4" });

    const addHeader = (title: string) => {
      doc.setFontSize(14);
      doc.text(title, 40, doc.lastAutoTable ? (doc as any).lastAutoTable.finalY + 40 : 40);
    };

    // 1) Overview
    addHeader("Overview");
    autoTable(doc, {
      startY: 60,
      head: [["Total Revenue", "Total Orders", "Total Users", "Total Products"]],
      body: [[
        formattedRevenue,
        String(overview.totalOrders ?? 0),
        String(overview.totalUsers ?? 0),
        String(overview.totalProducts ?? 0),
      ]],
      styles: { fontSize: 9 },
    });

    // 2) Sales
    addHeader("Sales Trend");
    autoTable(doc, {
      head: [["Month", "Revenue (₹)", "Orders", "Customers"]],
      body: timeSeries.map((s) => [s.month, s.revenue, s.orders, s.customers ?? 0]),
      styles: { fontSize: 9 },
    });

    // 3) Products
    addHeader("Products");
    autoTable(doc, {
      head: [["Name", "Brand", "Price", "Revenue", "Units", "Gender", "Type", "Subcategory"]],
      body: (report.products ?? []).map((p) => [
        p.name,
        p.brand ?? "",
        p.price ?? "",
        p.revenue ?? "",
        p.unitsSold ?? "",
        p.category?.gender ?? "",
        p.category?.type ?? "",
        p.category?.subCategory ?? "",
      ]),
      styles: { fontSize: 8 },
      columnStyles: { 0: { cellWidth: 150 } },
    });

    // 4) Brands
    // addHeader("Brands");
    // autoTable(doc, {
    //   head: [["Name", "Description", "Fragrances"]],
    //   body: (report.brands ?? []).map((b) => [b.name, b.description ?? "", b.fragrances ?? 0]),
    //   styles: { fontSize: 9 },
    // });

    // 5) Vendors
    // addHeader("Vendors");
    // autoTable(doc, {
    //   head: [["Name", "Email", "Phone", "Orders", "On-time %", "Avg Delivery"]],
    //   body: (report.vendors ?? []).map((v) => [
    //     v.name,
    //     v.email ?? "",
    //     v.phone ?? "",
    //     v.orders ?? 0,
    //     v.onTimeDelivery ?? 0,
    //     v.avgDeliveryTime ?? 0,
    //   ]),
    //   styles: { fontSize: 9 },
    // });

    // 6) Payments
    addHeader("Payments");
    autoTable(doc, {
      head: [["Status", "Count", "Amount (₹)"]],
      body: (report.payments ?? []).map((p) => [p.status, p.count, p.amount]),
      styles: { fontSize: 9 },
    });

    // 7) Customers 👈 NEW
    addHeader("Customers");
    autoTable(doc, {
      head: [["Name", "Email", "Joined", "Orders", "Revenue (₹)"]],
      body: (report.users ?? []).map((u) => [
        u.name,
        u.email,
        new Date(u.createdAt).toLocaleDateString("en-IN"),
        u.orders ?? 0,
        (u.revenue ?? 0).toLocaleString("en-IN", { style: "currency", currency: "INR" }),
      ]),
      styles: { fontSize: 9 },
      columnStyles: { 0: { cellWidth: 120 }, 1: { cellWidth: 150 } },
    });

    doc.save(`report-${range}.pdf`);
  };


  if (loading) {
    return (
      <div className="p-8">
        <p>Loading reports…</p>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="p-8">
        <p>No report data available.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Analytics & Reports</h2>
            <p className="text-muted-foreground">Comprehensive insights into your store performance</p>
          </div>
          <div className="flex items-center gap-2">
            <Select value={range} onValueChange={(v) => setRange(v as Range)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="this-week">This Week</SelectItem>
                <SelectItem value="this-month">This Month</SelectItem>
                <SelectItem value="this-year">This Year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={handleExportPDF}>
              <FileDown className="mr-2 h-4 w-4" /> PDF
            </Button>
            <Button onClick={handleExportExcel}>
              <Download className="mr-2 h-4 w-4" /> Excel
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="sales">Sales Analytics</TabsTrigger>
            <TabsTrigger value="products">Product Performance</TabsTrigger>
            <TabsTrigger value="customers">Customer Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {/* KPI Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <IndianRupeeIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-bold">{formattedRevenue}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Orders Deliverd</CardTitle>
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-bold">{overview.totalOrders ?? 0}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-bold">{overview.totalUsers ?? 0}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Products</CardTitle>
                  <Sparkles className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-bold">{overview.totalProducts ?? 0}</div>
                </CardContent>
              </Card>
            </div>

            {/* Revenue Trend + Category Split */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Revenue & Orders Trend</CardTitle>
                  <CardDescription>
                    Monthly revenue (₹) and delivered orders
                  </CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                  <ChartContainer
                    config={{
                      revenue: { label: "Revenue (₹)", color: "hsl(var(--chart-1))" },
                      orders: { label: "Orders", color: "hsl(var(--chart-2))" },
                    }}
                    className="h-[350px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={timeSeries} barCategoryGap="20%">
                        <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                        <YAxis tick={{ fontSize: 12 }} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <legend />

                        {/* Revenue Bar */}
                        <Bar
                          dataKey="revenue"
                          fill="#4f46e5"
                          radius={[6, 6, 0, 0]}
                          name="Revenue (₹)"
                        />

                        {/* Orders Bar */}
                        <Bar
                          dataKey="orders"
                          fill="#f97316"
                          radius={[6, 6, 0, 0]}
                          name="Orders"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>



              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Category Split</CardTitle>
                  <CardDescription>Count of products per subcategory</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={{ value: { label: "%", color: "hsl(var(--chart-2))" } }} className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={fragranceCategoryData} cx="50%" cy="50%" labelLine={false} label={({ name, value }) => `${name}: ${value}`} outerRadius={80} fill="#8884d8" dataKey="value">
                          {fragranceCategoryData.map((_, i) => (
                            <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                          ))}
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="sales" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Sales Performance</CardTitle>
                <CardDescription>Monthly sales and order trends</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={{ revenue: { label: "Revenue" }, orders: { label: "Orders" } }} className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={timeSeries}>
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line type="monotone" dataKey="revenue" stroke="#8884d8" name="Revenue (₹)" />
                      <Line type="monotone" dataKey="orders" stroke="#82ca9d" name="Orders" />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Top Fragrances</CardTitle>
                <CardDescription>Products with basic metrics from DB</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>#</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Gender</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Subcategory</TableHead>
                      <TableHead>Brand</TableHead>
                      <TableHead>Units</TableHead>
                      <TableHead>Revenue</TableHead>
                      <TableHead>Avg Price</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[...(report.products ?? [])]
                      .sort((a, b) => (b.unitsSold ?? 0) - (a.unitsSold ?? 0)) // ✅ highest sold first
                      .slice(0, 1) // ✅ ONLY top 1
                      .map((p, idx) => {
                        const units = p.unitsSold ?? 0;
                        const revenue = p.revenue ?? (typeof p.price === "number" ? p.price : 0);
                        const avg = units ? (revenue / units).toFixed(2) : "-";

                        return (
                          <TableRow key={p._id}>
                            <TableCell>{idx + 1}</TableCell>
                            <TableCell>{p.name}</TableCell>
                            <TableCell>{p.category?.gender ?? "-"}</TableCell>
                            <TableCell>{p.category?.productType ?? "-"}</TableCell>
                            <TableCell>{p.category?.subCategory ?? "-"}</TableCell>
                            <TableCell>
                              <Badge variant="secondary">{p.brand ?? "-"}</Badge>
                            </TableCell>
                            <TableCell>{units}</TableCell>
                            <TableCell>₹{revenue?.toLocaleString("en-IN")}</TableCell>
                            <TableCell>{avg === "-" ? "-" : `₹${avg}`}</TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>

                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="customers" className="space-y-4">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Customers</CardTitle>
                <CardDescription>Users who placed orders</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead>Orders</TableHead>
                      <TableHead>Revenue (₹)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((u) => (
                      <TableRow key={u._id}>
                        <TableCell>{u.name}</TableCell>
                        <TableCell>{u.email}</TableCell>
                        <TableCell>
                          {new Date(u.createdAt).toLocaleDateString("en-IN")}
                        </TableCell>
                        <TableCell>{u.orders}</TableCell>
                        <TableCell>
                          {u.revenue.toLocaleString("en-IN", {
                            style: "currency",
                            currency: "INR",
                          })}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
