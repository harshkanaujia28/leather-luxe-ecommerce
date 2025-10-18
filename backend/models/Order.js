import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    customer: String,
    email: String,

    products: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        quantity: { type: Number, required: true },
        selectedSize: { type: String },
        selectedColor: { type: String }, // ✅ already present
        selectedVariant: { type: String }, // ✅ add this line
        name: String,
        brand: String,
        price: Number,
        originalPrice: Number,
        image: String,

        offer: {
          isActive: { type: Boolean, default: false },
          type: {
            type: String,
            enum: ["percentage", "flat", "fixed", "bogo", "bundle"],
            default: null,
          },
          value: { type: Number, default: 0 },
          discountApplied: { type: Number, default: 0 },
          description: String,
        },
      },
    ],

    itemsTotal: { type: Number, default: 0 },
    deliveryFee: { type: Number, default: 0 },
    taxAmount: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    finalTotal: { type: Number, default: 0 },

    couponCode: { type: String },
    couponType: { type: String },
    couponValue: { type: Number, default: 0 },
    couponDiscount: { type: Number, default: 0 },

    shippingAddress: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipCode: { type: String, required: true },
      phone: { type: String, required: true },
    },
    deliveryTime: { type: String },

    paymentMethod: {
      type: String,
      enum: ["COD", "Razorpay"],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },

    razorpayOrderId: String,
    razorpayPaymentId: String,
    razorpaySignature: String,

    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
      ],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
