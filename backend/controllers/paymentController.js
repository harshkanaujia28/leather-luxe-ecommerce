import Razorpay from "razorpay";
import crypto from "crypto";
import dotenv from "dotenv";
import mongoose from "mongoose";

import Order from "../models/Order.js";
import Product from "../models/Product.js";
import { Coupon } from "../models/couponModel.js";

dotenv.config();

// Ensure env present
if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  console.error("RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET not set in env");
}

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Utility to round to 2 decimals
const round2 = (v) => Math.round(v * 100) / 100;

/**
 * Create Razorpay Order
 * Request body: { amount } -- amount in ₹ (number)
 * Response: { success, orderId, amount (paise), currency }
 */
export const createPaymentOrder = async (req, res) => {
  try {
    const { amount } = req.body;
    if (typeof amount !== "number" || !isFinite(amount) || amount <= 0) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid amount" });
    }

    const paise = Math.round(amount * 100);
    const options = {
      amount: paise,
      currency: "INR",
      receipt: `order_rcpt_${Date.now()}`,
      payment_capture: 1,
    };

    const order = await razorpay.orders.create(options);

    console.log("✅ Razorpay order created:", {
      frontendAmount: amount,
      razorpayAmount: order.amount / 100,
      orderId: order.id,
    });

    return res.status(200).json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (err) {
    console.error("❌ Razorpay order creation failed:", err);
    return res
      .status(500)
      .json({ success: false, message: "Razorpay order creation failed" });
  }
};

/**
 * Verify Razorpay payment and persist Order.
 * Request body:
 * {
 *   razorpay_order_id,
 *   razorpay_payment_id,
 *   razorpay_signature,
 *   orderDetails // full order payload calculated on client (or from pre-validate)
 * }
 */
export const verifyPayment = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderDetails,
    } = req.body;

    // Basic validation
    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !orderDetails
    ) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    // Verify signature
    const generated = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generated !== razorpay_signature) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(400)
        .json({ success: false, message: "Invalid signature" });
    }

    // Prevent double-processing: if order with this razorpayOrderId exists, return it (idempotency)
    const existing = await Order.findOne({
      razorpayOrderId: razorpay_order_id,
    }).session(session);
    if (existing) {
      await session.commitTransaction();
      session.endSession();
      return res.status(200).json({
        success: true,
        message: "Order already processed",
        order: existing,
      });
    }

    // Compute items / offers / totals from DB authoritative data
    let itemsTotal = 0;
    let totalDiscount = 0;
    const productsWithDetails = [];

    for (const item of orderDetails.products) {
      const dbProduct = await Product.findById(item.product).session(session);
      if (!dbProduct) throw new Error(`Product ${item.product} not found`);

      if (typeof item.quantity !== "number" || item.quantity <= 0)
        throw new Error(`Invalid quantity for product ${dbProduct._id}`);

      // Stock check
      if (dbProduct.stock < item.quantity) {
        throw new Error(
          `Insufficient stock for ${dbProduct.name}. Available: ${dbProduct.stock}`
        );
      }

      let discountAppliedSingle = 0;

      // Offer check (authoritative)
      if (
        dbProduct.offer?.isActive &&
        typeof dbProduct.offer.value === "number"
      ) {
        // optionally: call dbProduct.offer.isOfferValid?.() if function exists
        if (
          dbProduct.offer.minQuantity &&
          item.quantity < dbProduct.offer.minQuantity
        ) {
          throw new Error(
            `Minimum ${dbProduct.offer.minQuantity} required for ${dbProduct.name}`
          );
        }

        if (String(dbProduct.offer.type).toLowerCase() === "percentage") {
          discountAppliedSingle =
            (dbProduct.price * dbProduct.offer.value) / 100;
        } else if (
          ["flat", "fixed"].includes(String(dbProduct.offer.type).toLowerCase())
        ) {
          discountAppliedSingle = dbProduct.offer.value;
        }

        // don't let discount exceed price
        discountAppliedSingle = Math.min(
          discountAppliedSingle,
          dbProduct.price
        );
      }

      const subtotalBefore = dbProduct.price * item.quantity;
      const discountOnThis = discountAppliedSingle * item.quantity;

      itemsTotal += subtotalBefore;
      totalDiscount += discountOnThis;

      productsWithDetails.push({
        product: dbProduct._id,
        quantity: item.quantity,
        selectedSize: item.selectedSize ?? null,
        selectedColor: item.selectedColor ?? null,
        name: dbProduct.name,
        brand: dbProduct.brand,
        price: dbProduct.price - discountAppliedSingle,
        originalPrice: dbProduct.price,
        image:
          dbProduct.image ||
          dbProduct.thumbnail ||
          dbProduct.images?.[0] ||
          dbProduct.specifications?.colors?.[0]?.images?.[0] ||
          "",
        offer: {
          isActive: !!dbProduct.offer?.isActive,
          type: dbProduct.offer?.type || null,
          value: dbProduct.offer?.value || 0,
          discountAppliedPerUnit: discountAppliedSingle,
          discountAppliedTotal: discountOnThis,
        },
        subtotalAfterOffer: subtotalBefore - discountOnThis,
      });
    }

    // Coupon handling (server authoritative)
    let couponDocument = null;
    let couponDiscount = 0;

    if (orderDetails.couponCode) {
      couponDocument = await Coupon.findOne({
        code: orderDetails.couponCode,
      }).session(session);
      if (!couponDocument) throw new Error("Invalid coupon code");

      if (couponDocument.expiry && new Date() > couponDocument.expiry)
        throw new Error("Coupon expired");

      if (couponDocument.usedCount >= (couponDocument.totalLimit || Infinity))
        throw new Error("Coupon usage limit reached");

      // per-user limit
      const userUsedCount = await Order.countDocuments({
        user: orderDetails.user,
        couponCode: couponDocument.code,
      }).session(session);

      if (userUsedCount >= (couponDocument.perUserLimit || 0))
        throw new Error("Coupon already used by this user");

      // min order & quantity validations
      const subtotalAfterOffers = itemsTotal - totalDiscount;
      if (
        couponDocument.minOrder &&
        subtotalAfterOffers < couponDocument.minOrder
      )
        throw new Error(
          `Minimum order ₹${couponDocument.minOrder} required for this coupon`
        );

      if (couponDocument.minQuantity) {
        const totalQty = orderDetails.products.reduce(
          (s, it) => s + (it.quantity || 0),
          0
        );
        if (totalQty < couponDocument.minQuantity)
          throw new Error(
            `Minimum ${couponDocument.minQuantity} items required for this coupon`
          );
      }

      if (String(couponDocument.type).toLowerCase() === "percentage") {
        couponDiscount =
          ((itemsTotal - totalDiscount) * couponDocument.value) / 100;
      } else {
        couponDiscount = couponDocument.value;
      }

      couponDiscount = Math.min(couponDiscount, itemsTotal - totalDiscount); // cannot exceed subtotal
    }

    // Tax & final total
    const TAX_RATE = 0.1;
    const taxableAmount = itemsTotal - totalDiscount - couponDiscount;
    const taxAmount = round2(taxableAmount * TAX_RATE);
    const finalTotal = round2(
      taxableAmount + taxAmount + (orderDetails.deliveryFee || 0)
    );

    // Quick final amount check: ensure finalTotal matches what frontend paid (optional but recommended)
    if (typeof orderDetails.paidAmount === "number") {
      const paidPaise = Math.round(orderDetails.paidAmount * 100);
      // razorpay order amount available in request? We verified signature only. For extra safety:
      // We don't have razorpay order object here; we compare finalTotal vs paidAmount
      if (Math.abs(finalTotal - orderDetails.paidAmount) > 0.5) {
        throw new Error(
          "Final total mismatch between server and client. Aborting."
        );
      }
    }

    // Create Order document (inside transaction)
    const newOrder = new Order({
      user: orderDetails.user,
      customer: orderDetails.customer,
      email: orderDetails.email,
      products: productsWithDetails,
      itemsTotal: round2(itemsTotal),
      discount: round2(totalDiscount),
      couponCode: couponDocument?.code || null,
      couponType: couponDocument?.type || null,
      couponValue: couponDocument?.value || 0,
      couponDiscount: round2(couponDiscount),
      taxAmount,
      deliveryFee: orderDetails.deliveryFee || 0,
      finalTotal,
      activeOffer: orderDetails.activeOffer || null,
      shippingAddress: orderDetails.shippingAddress,
      deliveryTime: orderDetails.deliveryTime || "1-2 days",
      paymentMethod: "Razorpay",
      paymentStatus: "paid",
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
      status: "pending",
    });

    await newOrder.save({ session });

    // Update stock & offer usage & coupon counters
    for (const p of productsWithDetails) {
      // decrement stock
      await Product.findByIdAndUpdate(
        p.product,
        {
          $inc: { stock: -p.quantity, "offer.usedCount": p.quantity },
        },
        { session }
      );

      // If product offer maxUses reached, set isActive false (performed on DB side)
      const prod = await Product.findById(p.product).session(session);
      if (prod?.offer?.maxUses && prod.offer.usedCount >= prod.offer.maxUses) {
        prod.offer.isActive = false;
        await prod.save({ session });
      }
    }

    if (couponDocument) {
      couponDocument.usedCount = (couponDocument.usedCount || 0) + 1;
      // if totalLimit reached, disable coupon
      if (
        couponDocument.totalLimit &&
        couponDocument.usedCount >= couponDocument.totalLimit
      ) {
        couponDocument.isActive = false;
      }
      await couponDocument.save({ session });
    }

    await session.commitTransaction();
    session.endSession();

    // NOTE: send confirmation email outside transaction (best-effort)
    try {
      // sendEmail(...) -- your mailer here
    } catch (mailErr) {
      console.warn("Order saved but sending email failed:", mailErr.message);
    }

    return res.status(200).json({
      success: true,
      message: "Payment verified and order placed successfully",
      order: newOrder,
    });
  } catch (err) {
    console.error("❌ Verification error:", err.message);
    try {
      await session.abortTransaction();
    } catch (e) {
      console.error("Failed to abort transaction:", e.message);
    }
    session.endSession();
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Pre-validate order before payment
 * Expects { products, shippingAddress, couponCode? }
 * Responds with computed totals and any validation errors.
 */
export const preValidateOrder = async (req, res) => {
  try {
    const { products = [], shippingAddress = {}, couponCode } = req.body;
    if (!Array.isArray(products) || products.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No products provided" });
    }

    let itemsTotal = 0;
    let totalQuantity = 0;

    for (const item of products) {
      const dbProduct = await Product.findById(item.product);
      if (!dbProduct) {
        return res.status(400).json({
          success: false,
          message: `Product not found: ${item.product}`,
        });
      }

      if (typeof item.quantity !== "number" || item.quantity <= 0) {
        return res.status(400).json({
          success: false,
          message: `Invalid quantity for ${dbProduct.name}`,
        });
      }

      // Stock
      if (item.quantity > dbProduct.stock) {
        return res.status(400).json({
          success: false,
          message: `Only ${dbProduct.stock} units available for ${dbProduct.name}`,
        });
      }

      // Min quantity for offer
      if (
        dbProduct.offer?.isActive &&
        dbProduct.offer.minQuantity &&
        item.quantity < dbProduct.offer.minQuantity
      ) {
        return res.status(400).json({
          success: false,
          message: `Minimum quantity ${dbProduct.offer.minQuantity} required for ${dbProduct.name}`,
        });
      }

      // price accounting uses DB price + offer (authoritative)
      let perPrice = dbProduct.price;
      if (dbProduct.offer?.isActive) {
        if (String(dbProduct.offer.type).toLowerCase() === "percentage") {
          perPrice = perPrice - (perPrice * dbProduct.offer.value) / 100;
        } else if (
          ["flat", "fixed"].includes(String(dbProduct.offer.type).toLowerCase())
        ) {
          perPrice = perPrice - dbProduct.offer.value;
        }
      }

      perPrice = Math.max(0, round2(perPrice));
      itemsTotal += perPrice * item.quantity;
      totalQuantity += item.quantity;
    }

    // Delivery fee lookup should be done here (zone lookup) — returning 0 for caller to compute or you can call Zone logic
    const deliveryFee = 0;

    // Coupon validation (basic)
    let couponDiscount = 0;
    if (couponCode) {
      const applied = await Coupon.findOne({ code: couponCode });
      if (!applied)
        return res
          .status(400)
          .json({ success: false, message: "Invalid coupon" });
      if (applied.expiry && new Date() > applied.expiry)
        return res
          .status(400)
          .json({ success: false, message: "Coupon expired" });
      if (applied.minOrder && itemsTotal < applied.minOrder)
        return res.status(400).json({
          success: false,
          message: `Minimum order ₹${applied.minOrder} required`,
        });
      // compute discount
      if (String(applied.type).toLowerCase() === "percentage")
        couponDiscount = (itemsTotal * applied.value) / 100;
      else couponDiscount = applied.value;
      couponDiscount = Math.min(couponDiscount, itemsTotal);
    }

    const TAX_RATE = 0.1;
    const taxable = itemsTotal - couponDiscount;
    const taxAmount = round2(taxable * TAX_RATE);
    const finalTotal = round2(taxable + taxAmount + deliveryFee);

    return res.status(200).json({
      success: true,
      itemsTotal: round2(itemsTotal),
      couponDiscount: round2(couponDiscount),
      taxAmount,
      deliveryFee,
      finalTotal,
      totalQuantity,
    });
  } catch (err) {
    console.error("❌ Pre-validation failed:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};
