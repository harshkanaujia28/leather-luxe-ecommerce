import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import streamifier from "streamifier";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload buffer to Cloudinary with timeout and optimization.
 * Supports large images (up to ~50MB) and auto quality adjustment.
 */
export const uploadToCloudinary = (buffer, folder) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        timeout: 300000, // 5 min
        chunk_size: 10_000_000, // 10 MB chunks
        allowed_formats: ["jpg", "jpeg", "png", "webp"],
        transformation: [{ quality: "auto:good", fetch_format: "auto" }],
      },
      (err, result) => (err ? reject(err) : resolve(result))
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });


export default cloudinary;
