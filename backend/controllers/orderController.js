import Order from "../models/Order.js";
import ReturnRequest from "../models/Return.js";
import { Coupon } from "../models/couponModel.js";
import Zone from "../models/Zone.js";
import Offer from "../models/Offer.js";
import Product from "../models/Product.js";
import { getOrderEmailTemplate } from "../utils/emailTemplates.js";
import { sendEmail } from "../utils/sendEmail.js";

// =========================
// Place Order
// =========================
export const placeOrder = async (req, res) => {
  try {
    const { _id: userId, name, email } = req.user;
    const { products, shippingAddress, couponCode, paymentMethod } = req.body;

    if (!["COD", "Razorpay"].includes(paymentMethod)) {
      return res.status(400).json({ message: "Invalid payment method" });
    }

    let subtotal = 0;
    let totalQuantity = 0;
    const processedProducts = [];

    for (const item of products) {
      const dbProduct = await Product.findById(item.product);
      if (!dbProduct)
        return res
          .status(400)
          .json({ message: `Product not found: ${item.product}` });

      totalQuantity += item.quantity;

      // Determine final price
      let finalPrice = item.finalPrice ?? dbProduct.price; // frontend price takes priority
      let discountApplied = 0;
      let offerSnapshot = {
        isActive: false,
        type: null,
        value: 0,
        discountApplied: 0,
        description: "",
      };

      // Apply backend DB offer if frontend price is not passed or equals original
      if (
        (!item.finalPrice || item.finalPrice === dbProduct.price) &&
        dbProduct.offer?.isActive &&
        dbProduct.offer.isOfferValid?.()
      ) {
        if (item.quantity < (dbProduct.offer.minQuantity || 1)) {
          return res.status(400).json({
            message: `Minimum quantity ${dbProduct.offer.minQuantity} required for offer on ${dbProduct.name}`,
          });
        }

        if (dbProduct.offer.type === "percentage") {
          discountApplied = (dbProduct.price * dbProduct.offer.value) / 100;
        } else if (["fixed", "flat"].includes(dbProduct.offer.type)) {
          discountApplied = dbProduct.offer.value;
        }

        finalPrice = dbProduct.price - discountApplied;

        offerSnapshot = {
          isActive: true,
          type: dbProduct.offer.type,
          value: dbProduct.offer.value,
          discountApplied,
          description: dbProduct.offer.description || "",
        };

        dbProduct.offer.usedCount = (dbProduct.offer.usedCount || 0) + 1;
        if (
          dbProduct.offer.maxUses &&
          dbProduct.offer.usedCount >= dbProduct.offer.maxUses
        ) {
          dbProduct.offer.isActive = false;
        }
        await dbProduct.save();
      } else if (item.offer) {
        // Use frontend offer if provided
        offerSnapshot = { ...item.offer };
        discountApplied = item.offer.discountApplied || 0;
        finalPrice = dbProduct.price - discountApplied;
      }

      subtotal += finalPrice * item.quantity;

      processedProducts.push({
        product: dbProduct._id,
        quantity: item.quantity,
        selectedSize: item.selectedSize ?? null,
        selectedColor: item.selectedColor ?? null,
        selectedVariant: item.selectedVariant ?? null,
        name: dbProduct.name,
        brand: dbProduct.brand,
        price: finalPrice,
        originalPrice: dbProduct.price,
        image: dbProduct.specifications?.colors?.[0]?.images?.[0] || "",
        offer: offerSnapshot,
      });
    }

    // Delivery Fee
    let deliveryFee = 0;
    let deliveryTime = null;
    const zone = await Zone.findOne({ pincode: shippingAddress.zipCode });
    if (zone) {
      deliveryFee = zone.deliveryFee;
      deliveryTime = zone.deliveryTime;
    }

    // Coupon Logic
    let appliedCoupon = null;
    let couponDiscount = 0;
    if (couponCode) {
      appliedCoupon = await Coupon.findOne({ code: couponCode });
      if (!appliedCoupon)
        return res.status(400).json({ message: "Invalid coupon" });

      if (appliedCoupon.expiry && new Date() > appliedCoupon.expiry)
        return res.status(400).json({ message: "Coupon expired" });

      if (appliedCoupon.usedCount >= appliedCoupon.totalLimit)
        return res.status(400).json({ message: "Coupon usage limit reached" });

      if (appliedCoupon.minOrder && subtotal < appliedCoupon.minOrder)
        return res
          .status(400)
          .json({
            message: `Minimum order amount is ${appliedCoupon.minOrder}`,
          });

      if (
        appliedCoupon.minQuantity &&
        totalQuantity < appliedCoupon.minQuantity
      )
        return res
          .status(400)
          .json({
            message: `Minimum ${appliedCoupon.minQuantity} items required to use this coupon`,
          });

      const userOrders = await Order.find({ user: userId, couponCode });
      if (userOrders.length >= appliedCoupon.perUserLimit)
        return res
          .status(400)
          .json({ message: "You have already used this coupon" });

      couponDiscount =
        appliedCoupon.type.toLowerCase() === "percentage"
          ? (subtotal * appliedCoupon.value) / 100
          : appliedCoupon.value;
    }

    // Tax & Final Total
    const TAX_RATE = 0.1;
    const taxableAmount = subtotal - couponDiscount;
    const taxAmount = Math.round(taxableAmount * TAX_RATE * 100) / 100;
    const finalTotal =
      Math.round((taxableAmount + taxAmount + deliveryFee) * 100) / 100;

    // Create order
    const orderData = {
      user: userId,
      customer: name,
      email,
      products: processedProducts,
      shippingAddress,
      itemsTotal: Math.round(subtotal * 100) / 100,
      deliveryFee,
      deliveryTime,
      taxAmount,
      discount: Math.round(couponDiscount * 100) / 100,
      finalTotal,
      couponCode: appliedCoupon ? appliedCoupon.code : null,
      couponType: appliedCoupon ? appliedCoupon.type : null,
      couponValue: appliedCoupon ? appliedCoupon.value : 0,
      couponDiscount: Math.round(couponDiscount * 100) / 100,
      paymentMethod,
      status: "pending",
    };

    const order = await Order.create(orderData);

    if (appliedCoupon) {
      await Coupon.updateOne(
        { _id: appliedCoupon._id },
        { $inc: { usedCount: 1 } }
      );
    }

    // Send notification email
    try {
      const html = getOrderEmailTemplate(order);
      await sendEmail(
        process.env.ADMIN_EMAIL,
        `🛒 New Order #${order._id}`,
        html
      );
    } catch (err) {
      console.error("❌ Failed to send order notification:", err.message);
    }

    res.status(201).json(order);
  } catch (err) {
    console.error("❌ Order creation failed:", err.message);
    res.status(400).json({ message: err.message });
  }
};

// =========================
// Get Order By ID
// =========================
export const getOrderById = async (req, res) => {
  try {
    const orderId = req.params.id;
    if (!orderId.match(/^[0-9a-fA-F]{24}$/))
      return res.status(400).json({ message: "Invalid order ID format" });

    const order = await Order.findById(orderId)
      .populate("products.product")
      .populate("user", "name email");

    if (!order) return res.status(404).json({ message: "Order not found" });
    res.status(200).json(order);
  } catch (err) {
    console.error("❌ Error in getOrderById:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// =========================
// Get All Orders (Admin)
// =========================
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.json({ orders });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =========================
// Track Order
// =========================
export const trackOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json({ order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =========================
// Request Return
// =========================
export const requestReturn = async (req, res) => {
  try {
    const { name, email, id: userId } = req.user;
    const orderId = req.params.id;
    const { reason, items, totalRefund, returnMethod } = req.body;

    const newRequest = new ReturnRequest({
      customer: name,
      email,
      user: userId,
      orderId,
      reason,
      items,
      totalRefund,
      returnMethod,
    });

    await newRequest.save();
    res
      .status(201)
      .json({ message: "Return request submitted", request: newRequest });
  } catch (err) {
    console.error("❌ Return request failed:", err);
    res.status(500).json({ message: err.message });
  }
};

// =========================
// Admin Update Order Status
// =========================
export const updateOrderStatusByAdmin = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = status;
    if (
      status === "delivered" &&
      order.paymentMethod === "COD" &&
      order.paymentStatus === "pending"
    ) {
      order.paymentStatus = "paid";
    }

    await order.save();
    res.json({ message: "Order status updated successfully", order });
  } catch (err) {
    console.error("Error updating order status:", err);
    res.status(400).json({ message: err.message });
  }
};

// =========================
// Admin Revenue
// =========================
export const getRevenue = async (req, res) => {
  try {
    const result = await Order.aggregate([
      { $match: { paymentStatus: "paid" } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$finalTotal" },
          totalOrders: { $sum: 1 },
        },
      },
    ]);

    const revenue = result[0] || { totalRevenue: 0, totalOrders: 0 };
    res.json({
      totalRevenue: revenue.totalRevenue,
      totalOrders: revenue.totalOrders,
      currency: "INR",
    });
  } catch (err) {
    console.error("Revenue fetch failed:", err.message);
    res.status(500).json({ message: err.message });
  }
};

// =========================
// Get Orders By User
// =========================
export const getOrdersByUser = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate(
      "products.product"
    );
    res.status(200).json({ orders });
  } catch (error) {
    console.error("Failed to fetch user orders:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// =========================
// Cancel Order
// =========================
export const cancelOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (["delivered", "cancelled"].includes(order.status))
      return res
        .status(400)
        .json({
          message: `Order cannot be cancelled. Current status: ${order.status}`,
        });

    order.status = "cancelled";
    await order.save();
    res.status(200).json({ message: "Order cancelled successfully", order });
  } catch (err) {
    console.error("Cancel Order Error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// =========================
// Delete Order
// =========================
export const deleteOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    await Order.findByIdAndDelete(orderId);
    res.status(200).json({ message: "Order deleted successfully", orderId });
  } catch (err) {
    console.error("❌ Delete order failed:", err.message);
    res.status(500).json({ message: err.message });
  }
};
