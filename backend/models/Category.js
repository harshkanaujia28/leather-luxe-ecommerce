import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  gender: {
    type: String,
    enum: ["Men", "Women", "Unisex"],
    required: true
  },
  productType: {
    type: String,
    required: true
  },
  subCategories: {
    type: [String],
    default: []
  },
  state: {           // ✅ New field
    type: String,
    enum: ["Active", "Inactive"],
    default: "Active"
  }
}, { timestamps: true });

export default mongoose.model("Category", categorySchema);
