import express from "express";
import multer from "multer";
import { uploadToCloudinary } from "../utils/cloudinary.js";

const router = express.Router();
const upload = multer(); // use memory storage, not disk

router.post("/", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Upload to Cloudinary using your helper
    const result = await uploadToCloudinary(req.file.buffer, "banners");

    res.status(200).json({
      url: result.secure_url,
      public_id: result.public_id,
    });
  } catch (error) {
    console.error("Cloudinary upload failed:", error);
    res.status(500).json({ message: "Upload failed", error: error.message });
  }
});

export default router;
