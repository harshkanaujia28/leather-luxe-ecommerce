import express from "express";
import {
  getZones,
  createZone,
  updateZone,
  toggleZoneStatus,
  assignVendorsToZone,
  checkPincode
} from "../controllers/zoneController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { isAdmin } from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.get("/", protect, isAdmin, getZones);
router.post("/", protect, isAdmin, createZone);
router.put("/:id", protect, isAdmin, updateZone);
router.patch("/:id/toggle", protect, isAdmin, toggleZoneStatus);
router.patch("/:id/vendors", protect, isAdmin, assignVendorsToZone);
router.post("/check-pincode", checkPincode);

export default router;