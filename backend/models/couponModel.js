import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, "Coupon code is required"],
      unique: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["Percentage", "Fixed Amount", "Free Shipping"],
      required: [true, "Coupon type is required"],
    },
    value: {
      type: Number,
      required: [true, "Coupon value is required"],
    },
    minOrder: {
      type: Number,
      default: 0, // ✅ use number for comparisons
    },
    usedCount: {
      type: Number,
      default: 0, // ✅ total global usage so far
    },
    totalLimit: {
      type: Number,
      required: [true, "Total usage limit is required"],
    },
    perUserLimit: {
      type: Number,
      default: 1, // ✅ NEW: max times a single user can use this coupon
    },
    status: {
      type: String,
      enum: ["Active", "Inactive", "Expired"],
      default: "Active",
    },
    expiry: {
      type: Date, // ✅ real date for proper comparisons
    },
    createdDate: {
      type: Date,
      default: Date.now,
    },
    startDate: {
      type: Date,
    },
    description: {
      type: String,
    },
  },
  { timestamps: true }
);

export const Coupon = mongoose.model("Coupon", couponSchema);
