import express from "express";
import {
  getLegalDocuments,
  getLegalDocumentById,
  updateLegalDocument,
  publishLegalDocument,
  getLegalDocumentHistory,
  createLegalDocument,
} from "../controllers/legalController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { isAdmin } from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.get("/", getLegalDocuments);
router.get("/:id", getLegalDocumentById);
router.put("/:id", protect, isAdmin, updateLegalDocument);
router.post("/", protect, isAdmin, createLegalDocument);
router.patch("/:id/publish", protect, isAdmin, publishLegalDocument);
router.get("/:id/history", protect, isAdmin, getLegalDocumentHistory);

export default router;