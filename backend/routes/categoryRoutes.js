import express from "express";
import { createCategory, getCategories, updateCategory, deleteCategory } from "../controllers/categoryController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { isAdmin } from "../middlewares/roleMiddleware.js";
const router = express.Router();

router.post("/",protect, isAdmin, createCategory);        // create or merge subcategories
router.get("/",  getCategories);          // list all categories
router.put("/:id",protect, isAdmin, updateCategory);      // add/remove subcategories
router.delete("/:id",protect, isAdmin, deleteCategory);   // delete category

export default router;
