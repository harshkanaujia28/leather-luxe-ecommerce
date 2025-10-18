import mongoose from "mongoose";

const zoneSchema = new mongoose.Schema(
  {
   pincode: { type: String, required: true },
    area: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    deliveryFee: { type: Number, default: 0 },
    deliveryTime: { type: String, required: true }, // e.g., "1-2 days"
    zoneType: {
      type: String,
      enum: ["Metro", "Tier 1", "Tier 2", "Tier 3", "Rural"],
      default: "Metro",
    },
    isActive: { type: Boolean, default: true },
    coverage: { type: Number, default: 90 },
    assignedVendors: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Vendor" },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Zone", zoneSchema);
