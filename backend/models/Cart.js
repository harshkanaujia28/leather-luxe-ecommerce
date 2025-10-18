import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: { type: Number, required: true, default: 1 },
  selectedSize: { type: String, default: "Default" },
  selectedColor: { type: String, default: "" },
  selectedVariant: { type: String, default: "" },
  price: { type: Number, required: true }, // original product price
  finalPrice: { type: Number, required: true }, // ✅ offer price
  offer: {
    // optional snapshot
    isActive: { type: Boolean, default: false },
    type: { type: String },
    value: { type: Number },
  },
});

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  items: [cartItemSchema],
});

export default mongoose.model("Cart", cartSchema);
