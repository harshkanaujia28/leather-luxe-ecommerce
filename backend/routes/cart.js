import express from "express";
import {
  getCart,
  addToCart,
  removeFromCart,
  updateCartItem,
  clearCart,
} from "../controllers/cartController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { isUser } from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.get("/", protect,  getCart);
router.post("/add", protect,  addToCart);
router.post("/remove", protect,  removeFromCart);
router.post("/update", protect, updateCartItem);
router.delete("/clear", protect, clearCart);



export default router;