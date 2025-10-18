import express from "express";
import {
  submitSupportTicket,
  getSupportTickets,
  getSupportTicketById,
  updateSupportTicketStatus,
} from "../controllers/supportController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { isAdmin } from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.post("/", protect, submitSupportTicket);
router.get("/", protect, isAdmin, getSupportTickets);
router.get("/:id", protect, getSupportTicketById);
router.patch("/:id/status", protect, isAdmin, updateSupportTicketStatus);

export default router;
