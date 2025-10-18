import express from "express";
import { login, register, getProfile, updateProfile, forgotPassword, resetPassword, verifyOtp } from "../controllers/authController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Auth routes
router.post("/login", login);                // Login user
router.post("/register", register);          // Register user
router.post("/verify-otp", verifyOtp);
router.get("/profile", protect, getProfile); // Get profile (protected)
router.put("/profile", protect, updateProfile); // Update profile (protected)
router.post("/forgot-password", forgotPassword); // Request password reset
router.post("/reset-password/:token", resetPassword); // Reset password with token

export default router;
