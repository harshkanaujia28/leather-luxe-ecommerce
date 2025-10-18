"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { useApi } from "@/contexts/api-context";
import { Header } from "@/components/header";
import Footer from "@/components/footer";
import { Calendar, CheckCircle, Package, Truck, XCircle } from "lucide-react";
import Link from "next/link";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const statusSteps = [
  { status: "pending", icon: XCircle },
  { status: "confirmed", icon: CheckCircle },
  { status: "processing", icon: Package },
  { status: "shipped", icon: Truck },
  { status: "delivered", icon: CheckCircle },
];

const statusConfig = {
  pending: {
    icon: XCircle,
    color: "var(--accent)",
    title: "Order Pending",
    message: "Your order is pending. We'll notify you once it's confirmed.",
  },
  confirmed: {
    icon: CheckCircle,
    color: "var(--primary)",
    title: "Order Confirmed!",
    message: "Thank you for your purchase. Your order is being processed.",
  },
  processing: {
    icon: Package,
    color: "var(--secondary)",
    title: "Order Processing",
    message: "We are preparing your order for shipment.",
  },
  shipped: {
    icon: Truck,
    color: "var(--primary-glow)",
    title: "Order Shipped",
    message: "Your order has been shipped and is on its way.",
  },
  delivered: {
    icon: CheckCircle,
    color: "var(--primary-foreground)",
    title: "Order Delivered",
    message: "Your order has been delivered successfully.",
  },
  cancelled: {
    icon: XCircle,
    color: "var(--destructive)",
    title: "Order Cancelled",
    message: "Your order has been cancelled.",
  },
};

export default function OrderDetailPage() {
  const { id } = useParams();
  const { getOrderById, cancelOrder } = useApi();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchOrder = async () => {
      try {
        const data = await getOrderById(id);
        setOrder(data);
      } catch (error) {
        console.error("Failed to fetch order:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  const handleCancel = async () => {
    try {
      await cancelOrder(order._id);
      setOrder({ ...order, status: "cancelled" });
    } catch (err) {
      console.error("Cancel failed", err);
    }
  };

  const latestStatus = order?.statusHistory?.length
    ? order.statusHistory.findLast((entry) => entry.status === order.status)
    : null;

  const currentStep = useMemo(
    () => statusSteps.findIndex((step) => step.status === order?.status),
    [order]
  );

  return (
    <>
      <Header />
      <div className="min-h-screen bg-[hsl(var(--background))] py-32">
        <main className="max-w-5xl mx-auto px-4 py-10">
          {loading ? (
            <p className="text-[hsl(var(--primary))]">Loading order...</p>
          ) : !order ? (
            <p className="text-[hsl(var(--destructive))]">Order not found.</p>
          ) : (
            <>
              {/* Order Status Banner */}
              <div className="text-center mb-10">
                {order.status &&
                  (() => {
                    const config =
                      statusConfig[order.status] || statusConfig["pending"];
                    const Icon = config.icon;

                    return (
                      <>
                        <Icon
                          className={`mx-auto w-14 h-14 drop-shadow-lg`}
                          style={{ color: config.color }}
                        />
                        <h1
                          className="text-2xl font-bold mt-4"
                          style={{ color: config.color }}
                        >
                          {config.title}
                        </h1>
                        <p className="text-sm text-[hsl(var(--muted-foreground))]">
                          {config.message}
                        </p>
                        <p className="text-sm mt-2 text-[hsl(var(--muted-foreground))]">
                          <strong>Order ID:</strong> ORD-
                          {order._id.slice(-6).toUpperCase()} • Placed on{" "}
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </>
                    );
                  })()}
              </div>

              {/* Order Status Progress */}
              <div
                className="rounded-xl p-6 mb-10"
                style={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                }}
              >
                <h2
                  className="text-lg font-semibold mb-4"
                  style={{ color: "hsl(var(--primary))" }}
                >
                  Order Status
                </h2>
                <div className="relative flex justify-between items-center text-center w-full">
                  {statusSteps.map((step, index) => {
                    const Icon = step.icon;
                    const completed = index <= currentStep;
                    return (
                      <div
                        key={step.status}
                        className="flex flex-col items-center flex-1 relative"
                      >
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center border-2 z-10`}
                          style={{
                            backgroundColor: completed
                              ? "hsl(var(--primary))"
                              : "hsl(var(--secondary))",
                            borderColor: completed
                              ? "hsl(var(--primary))"
                              : "hsl(var(--border))",
                            color: completed
                              ? "hsl(var(--primary-foreground))"
                              : "hsl(var(--muted-foreground))",
                          }}
                        >
                          <Icon className="h-5 w-5" />
                        </div>
                        <span
                          className="text-xs mt-2 font-medium"
                          style={{
                            color: completed
                              ? "hsl(var(--primary))"
                              : "hsl(var(--muted-foreground))",
                          }}
                        >
                          {step.status}
                        </span>

                        {index < statusSteps.length - 1 && (
                          <div
                            className="absolute top-5 left-1/2 h-0.5 z-0"
                            style={{
                              transform: "translateX(50%)",
                              width: "100%",
                              backgroundColor:
                                index < currentStep
                                  ? "hsl(var(--primary))"
                                  : "hsl(var(--border))",
                            }}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>

                <div
                  className="mt-4 p-4 rounded flex items-center gap-2 text-sm"
                  style={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    color: "hsl(var(--muted-foreground))",
                  }}
                >
                  <Calendar size={16} />
                  <span>
                    <strong>Status Updated:</strong>{" "}
                    {latestStatus
                      ? new Date(latestStatus.updatedAt).toLocaleString()
                      : "N/A"}{" "}
                    • Estimated delivery within {order?.deliveryTime || "N/A"}
                  </span>
                </div>
              </div>

              {/* Shipping & Summary */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Shipping Address */}
                <div
                  className="p-4 rounded-xl"
                  style={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                  }}
                >
                  <h3
                    className="font-semibold text-lg mb-2 flex items-center gap-2"
                    style={{ color: "hsl(var(--primary))" }}
                  >
                    <Package size={18} /> Shipping Address
                  </h3>
                  <div
                    className="text-sm space-y-1"
                    style={{ color: "hsl(var(--foreground))" }}
                  >
                    <p>
                      <strong>Name:</strong> {order.customer}
                    </p>
                    <p>
                      <strong>Email:</strong> {order.email}
                    </p>
                    <p>
                      <strong>Phone:</strong> {order.shippingAddress?.phone}
                    </p>
                    <p>
                      <strong>Address:</strong> {order.shippingAddress?.address}
                    </p>
                    <p>
                      <strong>City/State/ZIP:</strong>{" "}
                      {order.shippingAddress?.city}, {order.shippingAddress?.state}{" "}
                      - {order.shippingAddress?.zipCode}
                    </p>
                  </div>
                </div>

                {/* Order Summary */}
                <div
                  className="p-4 rounded-xl"
                  style={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                  }}
                >
                  <h3
                    className="font-semibold text-lg mb-2"
                    style={{ color: "hsl(var(--primary))" }}
                  >
                    Order Summary
                  </h3>
                  {order.products.map((p, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-4 mb-4 border-b pb-3"
                      style={{
                        borderColor: "hsl(var(--border))",
                      }}
                    >
                      <img
                        src={
                          p.product.image?.startsWith("http")
                            ? p.product.image
                            : `${BASE_URL}${p.product.image}`
                        }
                        alt={p.product.name}
                        className="w-16 h-16 rounded object-cover"
                        style={{ border: "1px solid hsl(var(--border))" }}
                      />
                      <div className="flex-1">
                        <p
                          className="font-medium text-sm"
                          style={{ color: "hsl(var(--foreground))" }}
                        >
                          {p.product.name}
                        </p>
                        <p
                          className="text-xs"
                          style={{ color: "hsl(var(--muted-foreground))" }}
                        >
                          Qty: {p.quantity} × ₹{p.product.price}
                        </p>
                        <p
                          className="text-xs font-semibold"
                          style={{ color: "hsl(var(--primary))" }}
                        >
                          Total: ₹{p.quantity * p.product.price}
                        </p>
                        {p.selectedSize && (
                          <p
                            className="text-xs italic"
                            style={{ color: "hsl(var(--muted-foreground))" }}
                          >
                            Selected Size: {p.selectedSize}
                          </p>
                        )}
                        <Link
                          href={`/products/${p.product._id}`}
                          className="text-xs hover:underline"
                          style={{ color: "hsl(var(--accent))" }}
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  ))}
                  <p
                    className="font-semibold mt-2 text-right"
                    style={{ color: "hsl(var(--primary))" }}
                  >
                    Grand Total: ₹
                    {typeof order.finalTotal === "number"
                      ? Math.round(order.finalTotal)
                      : 0}
                  </p>

                  {order.status === "pending" && (
                    <button
                      onClick={handleCancel}
                      className="mt-4 px-4 py-2 text-sm rounded btn-press"
                      style={{
                        backgroundColor: "hsl(var(--destructive))",
                        color: "hsl(var(--destructive-foreground))",
                        border: `1px solid hsl(var(--destructive))`,
                      }}
                    >
                      Cancel Order
                    </button>
                  )}
                </div>
              </div>
            </>
          )}
        </main>
      </div>
      <Footer />
    </>
  );
}
