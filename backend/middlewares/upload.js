import multer from "multer";

// Store files in memory for direct Cloudinary upload
const storage = multer.memoryStorage();

const upload = multer({ storage });

export default upload;
