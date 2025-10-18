import Wishlist from "../models/Wishlist.js";
import Product from "../models/Product.js";
import mongoose from "mongoose";

export const getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ userId: req.user._id }).populate("products");

    if (!wishlist) {
      return res.json({ items: [] }); // Empty wishlist
    }

    res.json({ items: wishlist.products }); // Already populated
  } catch (err) {
    console.error("Error fetching wishlist:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Add to wishlist (server-side)
export const addToWishlist = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.body;

    let wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      // ✅ Don't add product automatically
      wishlist = await Wishlist.create({ userId, products: [] });
    }

    if (!wishlist.products.includes(productId)) {
      wishlist.products.push(productId);
      await wishlist.save();
    }

    res.status(200).json({ message: "Product added to wishlist" });
  } catch (err) {
    console.error("Add to wishlist error:", err);
    res.status(500).json({ message: "Server error" });
  }
};



export const removeFromWishlist = async (req, res) => {
  const { productId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).json({ message: "Invalid product ID" });
  }

  try {
    const wishlist = await Wishlist.findOneAndUpdate(
      { userId: req.user._id },
      { $pull: { products: new mongoose.Types.ObjectId(productId) } },
      { new: true }
    );

    res.status(200).json({ message: "Removed from wishlist", wishlist });
  } catch (err) {
    console.error("Remove from wishlist failed:", err);
    res.status(500).json({ message: "Server error" });
  }
};