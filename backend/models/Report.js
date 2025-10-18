import mongoose from 'mongoose'

// Sales per month
const salesSchema = new mongoose.Schema({
  month: String,
  revenue: Number,
  orders: Number,
  customers: Number,
}, { _id: false })

// Vendor performance
const vendorSchema = new mongoose.Schema({
  vendor: String,
  totalPurchases: Number,
  orders: Number,
  avgDeliveryTime: Number,
  qualityRating: Number,
  onTimeDelivery: Number,
  paymentTerms: String,
  status: String,
}, { _id: false })

// Product performance
const productSchema = new mongoose.Schema({
  name: String,
  sales: Number,
  units: Number,
  category: String,
}, { _id: false })

// Brand growth
const brandSchema = new mongoose.Schema({
  brand: String,
  sales: Number,
  orders: Number,
  growth: Number,
}, { _id: false })

// Top user performance
const topUserSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  totalOrders: Number,
  revenue: Number,
}, { _id: false })

// Main report schema
const reportSchema = new mongoose.Schema({
  period: String, // e.g., "last-6-months", "Q1-2025"
  salesData: [salesSchema],
  vendors: [vendorSchema],
  products: [productSchema],
  brands: [brandSchema],
  topUsers: [topUserSchema],
}, { timestamps: true })

export default mongoose.models.Report || mongoose.model('Report', reportSchema)
