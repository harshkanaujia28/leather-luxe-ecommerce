import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema({
  type: { type: String, enum: ["promotional", "hero"], required: true },
  title: { type: String, required: true },
  imageUrl: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },

  // Promotional
  description: String,
  linkUrl: String,
  priority: Number,
  startDate: Date,
  endDate: Date,

  // Hero
  subtitle: String,
  buttonText: String,
  buttonLink: String,
  order: { type: Number, default: 0 }, // ✅ Add default
});

const Banner = mongoose.model("Banner", bannerSchema);
export default Banner;
