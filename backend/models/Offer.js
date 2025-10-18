import mongoose from "mongoose";

const offerSchema = new mongoose.Schema({
  title: { type: String, required: true },
  discountType: { type: String, enum: ["percentage", "flat"], required: true },
  discountValue: { type: Number, required: true },
  minQuantity: { type: Number, default: 1 }, // ✅ minimum qty condition
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model("Offer", offerSchema);
