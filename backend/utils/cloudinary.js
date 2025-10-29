import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadToCloudinary = (buffer, folder = "products") => {
  return new Promise((resolve, reject) => {
    const cleanFolder = (folder || "products").trim().replace(/\s+/g, "_");

    if (!buffer || !Buffer.isBuffer(buffer)) {
      return reject(new Error("Invalid file buffer"));
    }

    const stream = cloudinary.uploader.upload_stream(
      {
        folder: cleanFolder,
        timeout: 300000,
        chunk_size: 10_000_000,
        transformation: [{ quality: "auto:good", fetch_format: "auto" }],
      },
      (err, result) => {
        if (err) {
          console.error("❌ Cloudinary upload error:", err);
          reject(new Error(err?.message || "Upload failed"));
        } else {
          resolve(result);
        }
      }
    );

    streamifier.createReadStream(buffer).pipe(stream);
  });
};
