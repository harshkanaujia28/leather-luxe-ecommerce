import Vendor from "../models/Vendor.js";
import Product from "../models/Product.js";
import Brand from "../models/Brand.js";
import User from "../models/User.js";
import Order from "../models/Order.js";

export const getReportData = async (req, res) => {
  try {
    const { range } = req.query;

    const now = new Date();
    let startDate;

    switch (range?.toLowerCase()) {
      case "today":
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;

      case "this-week": {
        const dayOfWeek = now.getDay();
        const diffToMonday = (dayOfWeek + 6) % 7;
        startDate = new Date(now);
        startDate.setDate(now.getDate() - diffToMonday);
        startDate.setHours(0, 0, 0, 0);
        break;
      }

      case "this-month":
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;

      case "this-year":
        startDate = new Date(now.getFullYear(), 0, 1);
        break;

      default:
        startDate = null;
    }

    const dateFilter = startDate ? { createdAt: { $gte: startDate } } : {};

    // ===== Sales Trend aggregation (Orders, delivered only)
    const salesDataRaw = await Order.aggregate([
      {
        $match: {
          status: "delivered",
          paymentStatus: "paid", // ✅ सिर्फ़ paid orders
          ...dateFilter,
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          revenue: { $sum: "$finalTotal" },
          orders: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const salesData = salesDataRaw.map((s) => ({
      month: `${monthNames[s._id.month - 1]}-${s._id.year}`, // formatted label
      revenue: s.revenue,
      orders: s.orders,
    }));

    // ===== Other collections
    const vendors = await Vendor.find();
    const products = await Product.find();
    const brands = await Brand.find();

    // ===== Users involved in orders (with order count + revenue)
    const userAgg = await Order.aggregate([
      {
        $match: {
          status: "delivered",
          paymentStatus: "paid", // ✅ सिर्फ़ paid orders
          ...dateFilter,
        },
      },
      {
        $group: {
          _id: "$user",
          orders: { $sum: 1 },
          revenue: { $sum: "$finalTotal" },
        },
      },
    ]);

    const userStats = {};
    userAgg.forEach((u) => {
      userStats[u._id.toString()] = {
        orders: u.orders,
        revenue: u.revenue,
      };
    });

    const userIds = userAgg.map((u) => u._id);
    const usersRaw = await User.find({ _id: { $in: userIds } }).select(
      "name email createdAt"
    );

    const users = usersRaw.map((u) => ({
      _id: u._id,
      name: u.name,
      email: u.email,
      createdAt: u.createdAt,
      orders: userStats[u._id.toString()]?.orders || 0,
      revenue: userStats[u._id.toString()]?.revenue || 0,
    }));

    // ===== Overview
    const [totalOrders, totalRevenueAgg, totalUsers, totalProducts] =
      await Promise.all([
        Order.countDocuments({
          status: "delivered",
          paymentStatus: "paid",
          ...dateFilter,
        }),
        Order.aggregate([
          {
            $match: {
              status: "delivered",
              paymentStatus: "paid",
              ...dateFilter,
            },
          },
          { $group: { _id: null, total: { $sum: "$finalTotal" } } },
        ]),
        User.countDocuments(),
        Product.countDocuments(),
      ]);

    const overview = {
      totalOrders,
      totalRevenue: totalRevenueAgg[0]?.total || 0,
      totalUsers,
      totalProducts,
    };

    // ===== Payments
    const payments = await Order.aggregate([
      {
        $match: {
          paymentStatus: "paid", // ✅ sirf paid orders
          ...dateFilter,
        },
      },
      {
        $group: {
          _id: "$status", // delivered, shipped etc
          count: { $sum: 1 },
          amount: { $sum: "$finalTotal" },
        },
      },
      {
        $project: {
          status: "$_id",
          count: 1,
          amount: 1,
          _id: 0,
        },
      },
    ]);

    // ===== Final Response
    res.json({
      salesData,
      vendors,
      products,
      brands,
      users, // 👈 ab users me orders + revenue bhi aa rahe hain
      overview,
      payments,
    });
  } catch (err) {
    console.error("getReportData error:", err);
    res.status(500).json({
      message: "Failed to fetch report data",
      error: err.message,
    });
  }
};
