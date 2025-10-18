import express from "express"
import {
  getCoupons,
  getCouponById,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  validateCouponByCode, // 👈 Add this
} from "../controllers/couponController.js"

import { protect } from "../middlewares/authMiddleware.js"
import { isAdmin } from "../middlewares/roleMiddleware.js"

const router = express.Router()

// Public route for coupon validation
router.get("/validate", validateCouponByCode) // ✅ NEW PUBLIC ROUTE

// Admin protected routes
router.get("/", protect, isAdmin, getCoupons)
router.post("/", protect, isAdmin, createCoupon)
router.get("/:id", protect, isAdmin, getCouponById)
router.put("/:id", protect, isAdmin, updateCoupon)
router.delete("/:id", protect, isAdmin, deleteCoupon)

export default router
