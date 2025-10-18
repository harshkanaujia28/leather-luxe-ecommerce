import mongoose from "mongoose";

const supportSchema = new mongoose.Schema(
  {
    customer: String,
    email: String,
    subject: String,
    priority: { type: String, enum: ["low", "medium", "high", "urgent"], default: "low" },
    status: {
      type: String,
      enum: ["open", "in_progress", "resolved", "closed"],
      default: "open",
    },
    category: {
      type: String,
      enum: ["product_issue", "shipping_issue", "billing", "general", "other"],
    },
    date: { type: Date, default: Date.now },
    lastUpdate: Date,
    orderId: String,
    fragrance: String,
    description: String,
  },
  { timestamps: true }
);

export default mongoose.model("SupportTicket", supportSchema);