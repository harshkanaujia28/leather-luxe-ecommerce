
import Order from "../models/Order.js"; // assuming your Order model is here
import mongoose from "mongoose";
// Get all return requests with populated order data
import ReturnRequest from "../models/Return.js";

export const getReturnRequests = async (req, res) => {
  try {
    const requests = await ReturnRequest.find()
      .populate("orderId") // ✅ fix this
      .populate("user", "name email"); // ❌ remove this if you don't have a user field

    res.json({ requests });
  } catch (err) {
    console.error("❌ Fetching return requests failed:", err);
    res.status(500).json({ message: err.message });
  }
};


export const getReturnRequestById = async (req, res) => {
  try {
    const request = await ReturnRequest.findById(req.params.id)
      .populate("order")
      .populate("user", "name email");

    if (!request) return res.status(404).json({ message: "Return request not found" });
    res.json({ request });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const approveReturnRequest = async (req, res) => {
  const { id } = req.params;

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid return request ID" });
  }

  try {
    const request = await ReturnRequest.findByIdAndUpdate(
      id,
      { status: "approved" },
      { new: true }
    );

    if (!request) {
      return res.status(404).json({ message: "Return request not found" });
    }

    res.json({ request });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const rejectReturnRequest = async (req, res) => {
  try {
    const request = await ReturnRequest.findByIdAndUpdate(
      req.params.id,
      { status: "rejected", reason: req.body.reason },
      { new: true }
    );
    res.json({ request });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
