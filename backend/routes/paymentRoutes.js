import express from "express";
import { createPaymentOrder, verifyPayment, preValidateOrder } from "../controllers/paymentController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { isUser } from "../middlewares/roleMiddleware.js";

const router = express.Router();

// ✅ User ko authenticate karo
router.post("/create-order", protect, isUser, createPaymentOrder);
router.post("/verify-payment", protect, isUser, verifyPayment);
router.post("/pre-validate", protect, isUser, preValidateOrder);

export default router;
