import express from 'express';
import upload from '../middlewares/cloudinaryMulter.js'; // updated multer
const router = express.Router();

router.post('/', upload.single('file'), (req, res) => {
  if (!req.file || !req.file.path) {
    return res.status(400).json({ message: 'Upload failed' });
  }

  // Cloudinary provides the URL in req.file.path
  res.status(200).json({ url: req.file.path });
});

export default router;
