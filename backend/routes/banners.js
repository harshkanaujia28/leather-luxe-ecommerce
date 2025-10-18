import express from "express"
import multer from "multer"
import path from "path"
import {
  getAllBanners,
  getBannerById,
  createBanner,
  updateBanner,
  deleteBanner,
  toggleActiveStatus,
  reorderHeroImage,
} from "../controllers/bannerController.js"
import Banner from "../models/Banner.js" // needed for fix-order

const router = express.Router()

// Setup multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
})
const upload = multer({ storage })

// Upload endpoint
router.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" })
  res.json({ imageUrl: `/uploads/${req.file.filename}` })
})

// CRUD Routes
router.get("/", getAllBanners)
router.get("/:id", getBannerById)
router.post("/", createBanner)
router.put("/:id", updateBanner)
router.delete("/:id", deleteBanner)

// Custom actions
router.patch("/:id/toggle", toggleActiveStatus)
router.post("/:id/reorder", reorderHeroImage)

// 🔧 Fix hero banner order based on createdAt
router.post("/fix-order", async (req, res) => {
  try {
    const heroImages = await Banner.find({ type: "hero" }).sort({ createdAt: 1 })

    for (let i = 0; i < heroImages.length; i++) {
      heroImages[i].order = i + 1
      await heroImages[i].save()
    }

    res.json({ success: true, message: "✅ Hero banner order fixed." })
  } catch (err) {
    console.error("❌ Fix order error:", err)
    res.status(500).json({ error: err.message })
  }
})

export default router
