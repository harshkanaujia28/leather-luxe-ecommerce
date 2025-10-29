import express from "express";
import multer from "multer";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import {
  getAllBanners,
  getHeroSlides,
  getBannerById,
  createBanner,
  updateBanner,
  deleteBanner,
  toggleActiveStatus,
  reorderHeroImage,
  fixHeroBannerOrder,
} from "../controllers/bannerController.js";

const router = express.Router();

// 🧩 Multer for memory storage (not disk)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ✅ Upload to Cloudinary instead of local
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    // Upload buffer to Cloudinary → banners folder
    const result = await uploadToCloudinary(req.file.buffer, "banners");

    // Cloudinary returns secure URL
    res.json({ url: result.secure_url });
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    res.status(500).json({ error: "Cloudinary upload failed" });
  }
});

// 📚 CRUD routes
router.get("/", getAllBanners);
router.get("/slides", getHeroSlides);
router.get("/:id", getBannerById);
router.post("/", createBanner);
router.put("/:id", updateBanner);
router.delete("/:id", deleteBanner);

// ⚡ Custom routes
router.patch("/:id/toggle", toggleActiveStatus);
router.post("/:id/reorder", reorderHeroImage);
router.post("/fix-order", fixHeroBannerOrder);

export default router;
