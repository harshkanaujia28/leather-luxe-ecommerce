import Category from "../models/Category.js";

// CREATE NEW CATEGORY
export const createCategory = async (req, res) => {
  try {
    const { gender, productType, subCategories, state } = req.body;

    const existing = await Category.findOne({ gender, productType });
    if (existing) {
      const merged = [...new Set([...existing.subCategories, ...subCategories])];
      existing.subCategories = merged;
      if(state) existing.state = state; // update state if provided
      await existing.save();
      return res.status(200).json({ success: true, category: existing, message: "Subcategories merged" });
    }

    const category = await Category.create({ gender, productType, subCategories, state });
    res.status(201).json({ success: true, category });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET ALL CATEGORIES
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE CATEGORY (add/remove subcategories)
export const updateCategory = async (req, res) => {
  try {
    const { subCategories } = req.body;
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: "Category not found" });

    category.subCategories = [...new Set([...category.subCategories, ...subCategories])]; // merge without duplicates
    await category.save();
    res.json({ success: true, category });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE CATEGORY
export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ message: "Category not found" });
    res.json({ success: true, message: "Category deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
