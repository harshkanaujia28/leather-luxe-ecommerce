import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import http from "http"; // ✅ required

// routes
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/auth.js";
import CategoryRoutes from "./routes/categoryRoutes.js";
import ProductRoutes from "./routes/productRoutes.js";
import wishlistRoutes from "./routes/wishlist.js";
import cartRoutes from "./routes/cart.js";
import orderRoutes from "./routes/orders.js";
import couponRoutes from "./routes/couponRoutes.js";
import zoneRoutes from "./routes/zones.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import bannerRoutes from "./routes/banners.js";
import supportRoutes from "./routes/support.js";
import returnRoutes from "./routes/returns.js";
import reportRoutes from "./routes/reportRoutes.js";

dotenv.config();

const app = express();
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json({ limit: "100mb" })); // ✅ handle large JSON payloads
app.use(morgan("dev"));

// routes
app.use("/uploads", express.static("uploads"));
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/category", CategoryRoutes);
app.use("/api/products", ProductRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/zones", zoneRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/banners", bannerRoutes);
app.use("/api/support", supportRoutes);
app.use("/api/returns", returnRoutes);
app.use("/api/reports", reportRoutes);


// root
app.get("/", (req, res) => res.send("🚀 API is running"));

// mongo
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ create server manually to extend timeout
const PORT = process.env.PORT || 5000;
const server = http.createServer(app);
server.setTimeout(300000); // ✅ 5 minutes
server.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
