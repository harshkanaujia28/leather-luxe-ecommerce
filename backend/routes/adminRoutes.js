import express from "express";
import { getAdminDashboard } from "../controllers/adminController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { isAdmin } from "../middlewares/roleMiddleware.js";

const router = express.Router();

// GET /api/admin/dashboard
router.get("/dashboard", protect, isAdmin, getAdminDashboard);

export default router;
