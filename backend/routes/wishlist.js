import express from "express";
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} from "../controllers/wishlistController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { isUser } from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.get("/", protect,getWishlist);
router.post("/add", protect,isUser,addToWishlist);
router.post("/remove", protect,isUser,removeFromWishlist);

export default router;
