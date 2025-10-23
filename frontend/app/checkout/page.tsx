"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/contexts/cart-context";
import { useCheckout } from "@/contexts/checkoutContext";
import { useToast } from "@/hooks/use-toast";
import { useApi } from "@/contexts/api-context";
import { Header } from "@/components/header";
import Footer from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem, RadioGroupIndicator } from "@radix-ui/react-radio-group";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import axios from "@/utils/axios";
import { loadRazorpayScript } from "@/utils/razorpay";


export default function CheckoutPage() {
  const router = useRouter();
  const { state, clearCart } = useCart();
  // const { delivery, setDelivery } = useCheckout();
  const { getProfile, updateProfile, createPaymentSession, placeOrder, validateCoupon } = useApi();
  const { toast } = useToast();

  const [hasMounted, setHasMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"razorpay" | "cod">("razorpay");
  const [profileData, setProfileData] = useState<any>({});
  const [couponCode, setCouponCode] = useState("");
  const [couponValue, setCouponValue] = useState(0);
  const [couponType, setCouponType] = useState<"Percentage" | "Fixed Amount" | null>(null);
  // const [pincode, setPincode] = useState("");
  // const [loading, setLoading] = useState(false);
  // const [error, setError] = useState<string | null>(null);
  // const [success, setSuccess] = useState<string | null>(null);
  // const [pincodeInput, setPincodeInput] = useState("");
  // const [pincodeError, setPincodeError] = useState("");
  // const [pincodeSuccess, setPincodeSuccess] = useState("");

  useEffect(() => {
    setHasMounted(true);
    const fetchProfile = async () => {
      try {
        const profile = await getProfile();
        if (profile) setProfileData(profile);
      } catch (err) {
        console.error("Failed to load profile", err);
      }
    };
    fetchProfile();
  }, []);

  if (!hasMounted) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  // ✅ Cart subtotal after offer discount
  const subtotalAfterOffer = state.items.reduce((sum, item) => {
    const price = item.price ?? item.product?.price ?? 0;
    let discount = 0;

    if (item.offer?.isActive) {
      if (item.offer.type === "Percentage") {
        discount = (price * item.offer.value) / 100;
      } else if (["Flat", "Fixed"].includes(item.offer.type)) {
        discount = item.offer.value;
      }
    }

    return sum + (price - discount) * item.quantity;
  }, 0);

  // ✅ Coupon discount (applied after offer)
  const couponDiscount =
    couponType === "Percentage"
      ? (couponValue / 100) * subtotalAfterOffer
      : couponType === "Fixed Amount"
        ? couponValue
        : 0;

  // ✅ Tax calculation
  const tax = parseFloat(((subtotalAfterOffer - couponDiscount) * 0.1).toFixed(2));

  // ✅ Final total including delivery fee
  const total = parseFloat(
    (subtotalAfterOffer - couponDiscount + tax).toFixed(2)
  );


  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(value);

  // ✅ Apply Coupon
  const applyCoupon = async () => {
    try {
      const result = await validateCoupon(couponCode, subtotalAfterOffer);
      if (result.valid) {
        setCouponValue(result.value);
        setCouponType(result.type);
        toast({
          title: "Coupon Applied",
          description:
            result.type === "Percentage"
              ? `${result.value}% discount applied`
              : `₹${result.value} discount applied`,
          variant: "success",
        });
      } else {
        let variant: "destructive" | "warning" | "info" = "destructive";

        if (result.message?.toLowerCase().includes("expired")) {
          variant = "warning"; // coupon expired
        } else if (result.message?.toLowerCase().includes("limit")) {
          variant = "warning"; // usage limit reached / per-user limit
        } else if (result.message?.toLowerCase().includes("minimum")) {
          variant = "info"; // min order / min quantity not met
        }
        setCouponValue(0);
        setCouponType(null);
        toast({
          title: "Coupon Error",
          description: result.message || "Coupon is not valid.",
          variant,
        });
      }
    } catch (err: any) {
      console.error(err);
      const errorMessage = err?.response?.data?.message || err?.message || "Something went wrong";
      toast({
        title: "Coupon Error",
        description: errorMessage,
        variant: "destructive",
      });
      setCouponValue(0);
      setCouponType(null);
    }
  };

  // ✅ Check Delivery (Pincode)
  // const checkDelivery = async () => {
  //   if (!pincode) {
  //     toast({
  //       title: "Pincode Required",
  //       description: "Please enter a pincode to check delivery.",
  //       variant: "info", // ✅ info because user input missing
  //     });
  //     return;
  //   }

  //   setLoading(true);
  //   setError("");
  //   setSuccess("");

  //   try {
  //     const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/zones/check-pincode`, { pincode });

  //     if (res.data.available) {
  //       setDelivery({
  //         deliveryFee: res.data.deliveryFee,
  //         deliveryTime: res.data.deliveryTime,
  //         zoneType: res.data.zoneType,
  //       });
  //       setSuccess("✅ Great news! Delivery is available in your area.");
  //       setError("");

  //       toast({
  //         title: "Delivery Available 🎉",
  //         description: `We deliver to your area. Delivery fee: ₹${res.data.deliveryFee}, Time: ${res.data.deliveryTime}`,
  //         variant: "success", // ✅ success when available
  //       });
  //     } else {
  //       setDelivery(null);
  //       setError(res.data.message || "❌ Sorry, we currently don't deliver to this pincode.");
  //       setSuccess("");

  //       toast({
  //         title: "Delivery Unavailable",
  //         description: res.data.message || "Sorry, we don't deliver to this pincode.",
  //         variant: "warning", // ✅ warning because condition unmet
  //       });
  //     }
  //   } catch (err: any) {
  //     console.error(err);
  //     const errorMessage =
  //       err.response?.data?.message || "Something went wrong! Please try again later.";

  //     setError(`❌ ${errorMessage}`);
  //     setSuccess("");

  //     toast({
  //       title: "Error",
  //       description: errorMessage,
  //       variant: "destructive", // ✅ destructive for server errors
  //     });
  //   } finally {
  //     setLoading(false);
  //   }
  // };


  // ✅ Place Order
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // 1️⃣ Update user profile
      await updateProfile(profileData);

      // 2️⃣ Map cart items and calculate finalPrice per item including offer
      const products = state.items.map((item) => {
        const price = item.price ?? item.product?.price ?? 0;
        let discount = 0;

        if (item.offer?.isActive) {
          if (item.offer.type === "Percentage") discount = (price * item.offer.value) / 100;
          else if (["Flat", "Fixed"].includes(item.offer.type)) discount = item.offer.value;
        }

        const finalPrice = price - discount;

        return {
          product: item.product?._id || item._id,
          quantity: item.quantity,
          selectedSize: item.selectedSize || "Default",
          selectedColor: item.selectedColor || null,
          selectedVariant: item.selectedVariant || null,
          name: item.product?.name || item.name,
          brand: item.product?.brand || item.brand,
          image: item.product?.image || item.image,
          price: finalPrice,       // ✅ offer-adjusted price
          originalPrice: price,
          offer: item.offer || null,
        };
      });

      // 3️⃣ Razorpay total = sum of finalPrice * quantity
      const razorpayTotal = products.reduce(
        (sum, p) => sum + p.price * p.quantity,
        0
      );

      // 4️⃣ Coupon discount
      const couponDiscount =
        couponType === "Percentage"
          ? (couponValue / 100) * razorpayTotal
          : couponType === "Fixed Amount"
            ? couponValue
            : 0;

      // 5️⃣ Tax 10% on subtotal after coupon
      const tax = parseFloat(((razorpayTotal - couponDiscount) * 0.1).toFixed(2));

      // 6️⃣ Final total for Razorpay
      const total = parseFloat((razorpayTotal - couponDiscount + tax).toFixed(2));

      // 7️⃣ Prepare order payload
      const orderPayload = {
        user: profileData._id,
        customer: profileData.name,
        email: profileData.email,
        products,
        itemsTotal: razorpayTotal,
        discount: products.reduce((sum, p) => sum + (p.originalPrice - p.price) * p.quantity, 0),
        couponCode: couponCode || null,
        couponType: couponType || null,
        couponValue: couponValue || 0,
        couponDiscount,
        taxAmount: tax,
        deliveryFee: 0,
        finalTotal: total,
        activeOffer: state.items.find((item) => item.offer?.isActive)?._id || null,
        shippingAddress: {
          address: profileData.address,
          city: profileData.city,
          state: profileData.state,
          zipCode: profileData.zipCode,
          phone: profileData.phone,
        },
        deliveryTime: "Standard 2-5 days",
      };

      if (typeof window === "undefined") return;

      // 8️⃣ Razorpay payment flow
      if (paymentMethod === "razorpay") {
        const res = await loadRazorpayScript();
        if (!res) {
          toast({
            title: "Payment Failed",
            description: "Razorpay SDK failed to load",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }

        // Pre-validate stock/offer
        // 🧩 Get backend-validated total (with offers, coupon, tax)
        const validated = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/payment/pre-validate`,
          { products, couponCode: couponCode || null }
        );

        if (!validated.data.success) {
          toast({
            title: "Validation Failed",
            description: validated.data.message || "Offer/Stock invalid",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }

        const backendFinalTotal = validated.data.finalTotal; // ✅ the backend-corrected total

        // 🧾 Now create Razorpay order with backend’s total
        const { data } = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/payment/create-order`,
          { amount: backendFinalTotal }
        );


        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: data.amount,
          currency: "INR",
          name: "Koza Leather",
          description: "Order Payment",
          order_id: data.orderId,
          handler: async (response: any) => {
            try {
              await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/payment/verify-payment`,
                {
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  orderDetails: { ...orderPayload, paymentMethod: "Razorpay", paymentStatus: "paid" },
                 amount: backendFinalTotal,    // ✅ final total after offers + coupons + tax + delivery

                }
              );

              toast({
                title: "Payment Successful 🎉",
                description: "Your order has been placed successfully!",
                variant: "success",
              });
              clearCart();
              router.push("/orders");
            } catch (err: any) {
              toast({
                title: "Payment Verification Failed",
                description: err?.response?.data?.message || "Something went wrong",
                variant: "destructive",
              });
            }
          },
          prefill: {
            name: profileData?.name,
            email: profileData?.email,
            contact: profileData?.phone,
          },
          theme: { color: "primary" },
        };

        const paymentObject = new (window as any).Razorpay(options);
        paymentObject.open();
      } else {
        // ✅ COD remains unchanged
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
          ...orderPayload,
          paymentMethod: "COD",
          paymentStatus: "pending",
        });

        toast({
          title: "Order Placed",
          description: "Your order has been placed successfully!",
          variant: "success",
        });

        clearCart();
        router.push("/orders");
      }
    } catch (err: any) {
      console.error(err);
      toast({
        title: "Checkout failed",
        description: err?.response?.data?.message || err?.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <>
      <Header />
      <div className="min-h-screen bg-white">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-36">
          <h1 className="text-3xl font-bold text-primary mb-8">Checkout</h1>


          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column: Shipping & Payment */}
            <div className="space-y-8">
              {/* Delivery Check */}
              {/* <Card className="bg-white border border-lime-500/30 shadow-lg rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-primary">Check Delivery Availability</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-gray-300">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter your Pincode"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      className="bg-white border-lime-500/40 text-primary"
                    />
                    <Button type="button" onClick={checkDelivery} disabled={loading}>
                      {loading ? "Checking..." : "Check"}
                    </Button>
                  </div>

                  {error && <p className="text-red-500">{error}</p>}
                  {success && <p className="text-green-500">{success}</p>}
                </CardContent>
              </Card> */}
              {/* Contact Info */}
              <Card className="bg-white border border-lime-500/30 shadow-lg rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-primary">Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-gray-300">
                  <Label className="text-black">Email</Label>
                  <Input
                    name="email"
                    type="email"
                    value={profileData.email || ""}
                    onChange={handleInputChange}
                    required
                    disabled
                    className="bg-white border-lime-500/40 text-primary"
                  />
                </CardContent>
              </Card>

              {/* Shipping Address */}
              <Card className="bg-white border border-lime-500/30 shadow-lg rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-primary">Shipping Address</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-gray-300">

                  <Label className="text-black">Name</Label>
                  <Input
                    name="name"
                    value={profileData.name || ""}
                    onChange={handleInputChange}
                    required
                    className="bg-white border-lime-500/40 text-primary"
                  />

                  <Label className="text-black">Address</Label>
                  <Input
                    name="address"
                    value={profileData.address || ""}
                    onChange={handleInputChange}
                    required
                    className="bg-white border-lime-500/40 text-primary"
                  />

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label className="text-black">City</Label>
                      <Input
                        name="city"
                        value={profileData.city || ""}
                        onChange={handleInputChange}
                        required
                        className="bg-white border-lime-500/40 text-primary"
                      />
                    </div>
                    <div>
                      <Label className="text-black">State</Label>
                      <Input
                        name="state"
                        value={profileData.state || ""}
                        onChange={handleInputChange}
                        required
                        className="bg-white border-lime-500/40 text-primary"
                      />
                    </div>
                    <div>
                      <Label className="text-black">PinCode</Label>
                      <Input
                        name="zipCode"
                        value={profileData.zipCode || ""}
                        onChange={handleInputChange}
                        required
                        className="bg-white border-lime-500/40 text-primary"
                      />
                    </div>
                  </div>

                  <Label className="text-black">Phone</Label>
                  <Input
                    name="phone"
                    value={profileData.phone || ""}
                    onChange={handleInputChange}
                    required
                    className="bg-white border-lime-500/40 text-primary"
                  />

                  {/* Pincode check */}

                </CardContent>
              </Card>

              {/* Payment Method */}


            </div>

            {/* Right Column: Order Summary */}
            <div>
              <Card className="bg-white border-2 border-primary/20shadow-xl rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-primary text-lg font-bold">Payment Method</CardTitle>
                </CardHeader>
                <CardContent className="text-primary">
                  <RadioGroup
                    value={paymentMethod}
                    onValueChange={(v) => setPaymentMethod(v as "razorpay" | "cod")}
                    className="flex flex-col space-y-2"
                  >
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <RadioGroupItem
                        value="razorpay"
                        id="razorpay"
                        className="w-5 h-5 border border-primary/20 rounded-full bg-white flex items-center justify-center focus:outline-none"
                      >
                        <RadioGroupIndicator className="w-2 h-2 bg-primary rounded-full" />
                      </RadioGroupItem>
                      <Label htmlFor="razorpay" className="text-primary font-medium">
                        Online Payment (Razorpay)
                      </Label>
                    </label>

                    <label className="flex items-center space-x-2 cursor-pointer">
                      <RadioGroupItem
                        value="cod"
                        id="cod"
                        className="w-5 h-5 border border-primary/20 rounded-full bg-white flex items-center justify-center focus:outline-none"
                      >
                        <RadioGroupIndicator className="w-2 h-2 bg-primary rounded-full" />
                      </RadioGroupItem>
                      <Label htmlFor="cod" className="text-primary font-medium">
                        Cash on Delivery (COD)
                      </Label>
                    </label>
                  </RadioGroup>

                </CardContent>
              </Card>

              <Card className="bg-white border border-lime-500/30 shadow-lg rounded-2xl mt-2">
                <CardHeader>
                  <CardTitle className="text-primary">Order Summary</CardTitle>
                </CardHeader>

                <CardContent className="space-y-4 text-sm text-gray-300">
                  {state.items.map((item, i) => {
                    const product = item.product || {};
                    const basePrice = product.price ?? item.price ?? 0;

                    // Determine if offer is active
                    const offer = product.offer || item.offer;
                    const hasOffer = offer?.isActive && offer?.value > 0;

                    // Calculate final price per item
                    const finalPrice = hasOffer
                      ? ["percentage", "Percentage"].includes(offer.type)
                        ? basePrice - (basePrice * offer.value) / 100
                        : basePrice - offer.value
                      : basePrice;


                    const name = product.name || item.name || "Product";
                    const brand = product.brand || item.brand || "Brand";
                    const selectedSize = item.selectedSize || "Default";
                    const selectedColor = item.selectedColor || "Default Color";
                    const selectedVariant = item.selectedVariant || "Default Variant";

                    return (
                      <div
                        key={i}
                        className="flex justify-between items-center border-b border-zinc-700 pb-3"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-gray-200">{name}</p>
                          <p className="text-gray-500 text-xs">
                            {brand} × {item.quantity} —
                            <span className="ml-1 italic text-gray-400">
                              Size: {selectedSize}, Color: {selectedColor}, Variant: {selectedVariant}
                            </span>
                          </p>

                          {hasOffer ? (
                            <p className="text-green-500 text-xs mt-0.5">
                              ₹{finalPrice.toFixed(2)}{" "}
                              <span className="line-through text-gray-400 ml-1">{basePrice.toFixed(2)}</span>
                              <span className="ml-1">
                                {offer.type === "percentage" ? `(${offer.value}% OFF)` : `(-₹${offer.value} OFF)`}
                              </span>
                            </p>
                          ) : (
                            <p className="text-gray-400 text-xs mt-0.5">₹{basePrice.toFixed(2)}</p>
                          )}
                        </div>

                        <span className="text-gray-500">{formatCurrency(finalPrice * item.quantity)}</span>

                      </div>
                    );
                  })}

                  <Separator className="bg-lime-500/30" />

                  {/* Coupon Section */}
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="Coupon code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="bg-white border-black/40 text-primary"
                    />
                    <Button
                      type="button"
                      onClick={applyCoupon}
                      disabled={!couponCode}
                      className="bg-primary text-white hover:bg-white hover:text-primary"
                    >
                      Apply
                    </Button>
                  </div>

                  <Separator className="bg-lime-500/30" />

                  {/* Totals */}
                  {(() => {
                    // Subtotal after offer
                    const subtotalAfterOffer = state.items.reduce((sum, item) => {
                      const product = item.product || {};
                      const basePrice = product.price ?? item.price ?? 0;
                      const offer = product.offer || item.offer;
                      const hasOffer = offer?.isActive && offer?.value > 0;
                      const finalPrice = hasOffer
                        ? offer.type === "percentage"
                          ? basePrice - basePrice * (offer.value / 100)
                          : basePrice - offer.value
                        : basePrice;
                      return sum + finalPrice * item.quantity;
                    }, 0);

                    // Coupon discount
                    const couponDiscount =
                      couponType === "Percentage"
                        ? (couponValue / 100) * subtotalAfterOffer
                        : couponType === "Fixed Amount"
                          ? couponValue
                          : 0;

                    // Tax 10% on subtotal after discount
                    const tax = parseFloat(((subtotalAfterOffer - couponDiscount) * 0.1).toFixed(2));

                    // Total
                    const total = parseFloat(
                      (subtotalAfterOffer - couponDiscount + tax).toFixed(2)
                    );


                    return (
                      <>
                        <div className="flex justify-between text-black">
                          <span>Subtotal</span>
                          <span>₹{subtotalAfterOffer.toFixed(2)}</span>
                        </div>

                        <div className="flex justify-between text-black">
                          <span>Tax</span>
                          <span>₹{tax.toFixed(2)}</span>
                        </div>

                        {/* {delivery && (
                          <div className="flex justify-between text-black">
                            <span>Delivery Fee</span>
                            <span>₹{delivery.deliveryFee.toFixed(2)}</span>
                          </div>
                        )} */}

                        {couponValue > 0 && (
                          <div className="flex justify-between text-black">
                            <span>Coupon Discount</span>
                            <span>
                              - ₹
                              {couponType === "Percentage"
                                ? ((couponValue / 100) * subtotalAfterOffer).toFixed(2)
                                : couponValue.toFixed(2)}
                            </span>
                          </div>
                        )}

                        <Separator className="bg-lime-500/30" />

                        <div className="flex justify-between font-semibold text-lg text-black">
                          <span>Total</span>
                          <span>₹{total.toFixed(2)}</span>
                        </div>

                        <Button
                          type="submit"
                          className="w-full bg-primary text-black hover:bg-white hover:text-primary transition font-semibold"
                          size="lg"
                          disabled={isLoading}
                        >
                          {isLoading
                            ? "Processing..."
                            : paymentMethod === "cod"
                              ? `Place COD Order - ₹${total.toFixed(2)}`
                              : `Pay ₹${total.toFixed(2)} Online`}
                        </Button>
                      </>
                    );
                  })()}
                </CardContent>
              </Card>



            </div>

          </form>
        </main>
      </div>
      <Footer />
    </>
  );
}
