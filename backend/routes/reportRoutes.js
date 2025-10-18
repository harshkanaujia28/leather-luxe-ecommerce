import express from 'express'
import { getReportData } from '../controllers/reportController.js'
import { protect } from '../middlewares/authMiddleware.js'
import { isAdmin } from "../middlewares/roleMiddleware.js";

const router = express.Router()

router.get('/', protect, isAdmin, getReportData)

export default router
