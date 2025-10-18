import express from "express";
import {
  getReturnRequests,
  getReturnRequestById,
  approveReturnRequest,
  rejectReturnRequest,
} from "../controllers/returnController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { isAdmin } from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.get("/", protect, isAdmin, getReturnRequests);
router.get("/:id", protect, isAdmin, getReturnRequestById);
router.patch("/:id/approve", protect, isAdmin, approveReturnRequest);
router.patch("/:id/reject", protect, isAdmin, rejectReturnRequest);

export default router;