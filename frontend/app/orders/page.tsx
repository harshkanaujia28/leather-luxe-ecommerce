"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useApi } from "@/contexts/api-context";
import { Header } from "@/components/header";
import Footer from "@/components/footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import clsx from "clsx";
import { format } from "date-fns";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export default function OrdersPage() {
  const { getMyOrders } = useApi();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getMyOrders();
        const sortedOrders = (data.orders || []).sort(
          (a: any, b: any) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setOrders(sortedOrders);
      } catch (error) {
        console.error("Failed to fetch orders", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [getMyOrders]);

  const getStatusColor = (status: string) => {
    const s = status?.toLowerCase();
    return clsx(
      "px-3 py-1 rounded-full text-xs font-medium capitalize border",
      {
        "bg-green-50 text-green-700 border-green-200": s === "delivered",
        "bg-yellow-50 text-yellow-700 border-yellow-200": s === "pending",
        "bg-red-50 text-red-700 border-red-200": s === "cancelled",
        "bg-gray-50 text-gray-600 border-gray-200":
          !["delivered", "pending", "cancelled"].includes(s),
      }
    );
  };

  return (
    <div className="min-h-screen bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
      <Header />
      <main className="max-w-6xl mx-auto min-h-screen px-4 py-36">
        <h1 className="text-3xl font-bold mb-8 text-center text-primary">
          My Orders
        </h1>

        {/* Loading state */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <p className="text-[hsl(var(--muted-foreground))] animate-pulse">
              Loading your orders...
            </p>
          </div>
        ) : orders.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
            <img
              src="/empty-orders.svg"
              alt="No orders"
              className="w-40 h-40 opacity-80"
            />
            <p className="text-[hsl(var(--muted-foreground))] text-lg">
              You haven’t placed any orders yet.
            </p>
            <Link href="/products">
              <Button className="px-5 py-2 rounded-lg shadow hover:opacity-95 transition">
                Shop Now
              </Button>
            </Link>
          </div>
        ) : (
          /* Orders list */
          <div className="space-y-6">
            {orders.map((order) => {
              const item = order.products?.[0];
              const prod = item?.product || {};
              const imgSrc =
                item?.image?.startsWith("http")
                  ? item.image
                  : prod?.image?.startsWith("http")
                  ? prod.image
                  : prod?.images?.[0]?.startsWith("http")
                  ? prod.images[0]
                  : prod?.images?.[0]
                  ? `${BASE_URL}${prod.images[0]}`
                  : "/placeholder.svg";

              return (
                <Card
                  key={order._id}
                  className="flex flex-col sm:flex-row items-center sm:justify-between border border-gray-200 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300"
                >
                  {/* Left: Product Image + Info */}
                  <div className="flex items-center gap-4 w-full sm:w-[40%] mb-4 sm:mb-0">
                    <div className="relative w-20 h-20 flex-shrink-0">
                      <Image
                        src={imgSrc}
                        alt={prod.name || "Product"}
                        fill
                        className="object-cover rounded-lg border border-gray-200"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[hsl(var(--foreground))]">
                        {prod.name}
                      </h3>
                      <p className="text-sm text-[hsl(var(--muted-foreground))]">
                        ₹{prod.price ?? item?.price ?? 0} Qty: {item?.quantity}
                      </p>
                      <p className="text-xs text-[hsl(var(--muted-foreground))]">
                        {format(new Date(order.createdAt), "EEE MMM dd yyyy")}
                      </p>
                    </div>
                  </div>

                  {/* Middle: Shipping Address */}
                  <div className="text-sm text-gray-600 leading-snug w-full sm:w-[40%]">
                    <p className="font-medium text-gray-800">
                      {order.shippingAddress?.fullName}
                    </p>
                    <p>
                      {order.shippingAddress?.address},{" "}
                      {order.shippingAddress?.city},{" "}
                      {order.shippingAddress?.state},{" "}
                      {order.shippingAddress?.postalCode},{" "}
                      {order.shippingAddress?.country}
                    </p>
                    {order.shippingAddress?.phone && (
                      <p className="text-gray-500 mt-1">
                        +{order.shippingAddress.phone}
                      </p>
                    )}
                  </div>

                  {/* Right: Total + Status + View Details Button */}
                  <div className="flex flex-col items-end text-right w-full sm:w-[20%] mt-3 sm:mt-0">
                    <p className="text-base font-semibold text-gray-800">
                      ₹{order.finalTotal?.toFixed(2)}
                    </p>
                    <span className={getStatusColor(order.status)}>
                      {order.status}
                    </span>

                    <Link href={`/orders/${order._id}`} className="w-full sm:w-auto">
                      <Button
                        variant="default"
                        className="mt-3 w-full sm:w-auto text-sm font-medium rounded-lg"
                      >
                        View Details
                      </Button>
                    </Link>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
