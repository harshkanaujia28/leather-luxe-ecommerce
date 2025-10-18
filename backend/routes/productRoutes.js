import express from "express";
import {
  createProduct,
  updateProduct,
  getProducts,
  getProductById,
  deleteProduct,
  addReview, // <-- import your review controller
} from "../controllers/productController.js";
import upload from "../middlewares/cloudinaryMulter.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/:id", getProductById);
router.post("/", upload.any(), createProduct);  
router.put("/:id", upload.any(), updateProduct);
router.delete("/:id", deleteProduct);

// Add this route for reviews
router.post("/:id/reviews", addReview);  

export default router;
