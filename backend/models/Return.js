import mongoose from "mongoose";

const returnItemSchema = new mongoose.Schema({
  name: String,
  reason: String,
  condition: {
    type: String,
    enum: ["unopened", "partially_used", "damaged"],
  },
  refundAmount: Number,
});

const returnSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    customer: { type: String, required: true },
    email: { type: String, required: true },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    reason: String,
    items: [returnItemSchema],
    totalRefund: Number,
    returnMethod: String,
    status: {
      type: String,
      enum: ["pending_approval", "approved", "completed", "rejected"],
      default: "pending_approval",
    },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("ReturnRequest", returnSchema);
