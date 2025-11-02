import { Coupon } from "../models/couponModel.js";
import order from "../models/Order.js";

// Get all coupons
export const getCoupons = async (req, res) => {
  const coupons = await Coupon.find();
  res.json(coupons);
};

// Get one coupon
export const getCouponById = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) return res.status(404).json({ message: "Coupon not found" });

    // 🔍 Find orders where this coupon was used
    const orders = await order
      .find({ couponCode: coupon.code })
      .select("email customer");

    res.json({
      coupon,
      usageCount: orders.length,
      users: orders.map((o) => ({
        email: o.email,
        customer: o.customer,
      })),
    });
  } catch (error) {
    console.error("Error fetching coupon:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Create a new coupon
export const createCoupon = async (req, res) => {
  const newCoupon = new Coupon(req.body);
  const saved = await newCoupon.save();
  res.status(201).json(saved);
};

// Update coupon
export const updateCoupon = async (req, res) => {
  const updated = await Coupon.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!updated) return res.status(404).json({ message: "Coupon not found" });
  res.json(updated);
};

// Delete coupon
export const deleteCoupon = async (req, res) => {
  const deleted = await Coupon.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ message: "Coupon not found" });
  res.json({ message: "Coupon deleted" });
};

export const validateCouponByCode = async (req, res) => {
  try {
    const { code, orderTotal } = req.query;
    const userId = req.user?._id;

    if (!code)
      return res
        .status(400)
        .json({ valid: false, message: "Coupon code is required" });

    const coupon = await Coupon.findOne({ code });
    if (!coupon)
      return res
        .status(404)
        .json({ valid: false, message: "Coupon not found" });

    // status
    if (coupon.status !== "Active") {
      return res
        .status(400)
        .json({ valid: false, message: "Coupon is not active" });
    }

    // expiry
    if (coupon.expiry && new Date() > coupon.expiry) {
      return res.status(400).json({ valid: false, message: "Coupon expired" });
    }

    // usage limit
    if (coupon.usedCount >= coupon.totalLimit) {
      return res
        .status(400)
        .json({ valid: false, message: "Coupon usage limit reached" });
    }

    // min order
    if (orderTotal && Number(orderTotal) < coupon.minOrder) {
      return res.status(400).json({
        valid: false,
        message: `Minimum order amount is ${coupon.minOrder}`,
      });
    }

    // per-user limit
    if (userId && coupon.perUserLimit) {
      const userOrders = await order.find({ user: userId, couponCode: code });
      if (userOrders.length >= coupon.perUserLimit) {
        return res
          .status(400)
          .json({ valid: false, message: "You have already used this coupon" });
      }
    }

    return res.status(200).json({
      valid: true,
      value: coupon.value,
      type: coupon.type,
      message: "Coupon is valid",
    });
  } catch (error) {
    console.error("Coupon validation error:", error);
    res.status(500).json({ valid: false, message: "Server error" });
  }
};

export const getAvailableCoupons = async (req, res) => {
  try {
    const userId = req.user?._id;
    const { subtotal } = req.body;

    if (!subtotal || isNaN(subtotal)) {
      return res.status(400).json({
        message: "Subtotal is required and must be a number",
      });
    }

    // ✅ Fetch all active coupons that match global conditions
    const coupons = await Coupon.find({
      status: "Active",
      expiry: { $gt: new Date() },
      minOrder: { $lte: Number(subtotal) },
      $expr: { $lt: ["$usedCount", "$totalLimit"] },
    });

    // ✅ Filter by per-user limit if user is logged in
    let filtered = coupons;

    if (userId) {
      const usedCoupons = await order.find({ user: userId }).select("couponCode");

      const userUsedCount = usedCoupons.reduce((acc, o) => {
        acc[o.couponCode] = (acc[o.couponCode] || 0) + 1;
        return acc;
      }, {});

      filtered = coupons.filter((coupon) => {
        const used = userUsedCount[coupon.code] || 0;
        return used < coupon.perUserLimit;
      });
    }

    return res.status(200).json({
      success: true,
      coupons: filtered.sort((a, b) => b.value - a.value),
    });

  } catch (error) {
    console.error("❌ [getAvailableCoupons] Error:", error);
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};
