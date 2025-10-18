import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan"; // ✅ HTTP request logging
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/auth.js";
import CategoryRoutes from "./routes/categoryRoutes.js";
import ProductRoutes from "./routes/productRoutes.js";
import wishlistRoutes from "./routes/wishlist.js";
import cartRoutes from "./routes/cart.js";
import orderRoutes from "./routes/orders.js";
import couponRoutes from "./routes/couponRoutes.js"
import zoneRoutes from "./routes/zones.js";
import paymentRoutes from "./routes/paymentRoutes.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: "http://localhost:3000", // frontend origin
  credentials: true
}));
app.use(express.json());
app.use(morgan("dev")); // ✅ logs each request in console

// Routes
app.use("/uploads", express.static("uploads"));
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/category", CategoryRoutes);
app.use("/api/products", ProductRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/coupons", couponRoutes)
app.use("/api/zones", zoneRoutes)
app.use("/api/payment", paymentRoutes);



// Root test route
app.get("/", (req, res) => res.send("🚀 API is running"));

// Connect MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("❌ Global error caught:", JSON.stringify(err, null, 2));
  res.status(500).json({ success: false, error: err.message || err });
});
