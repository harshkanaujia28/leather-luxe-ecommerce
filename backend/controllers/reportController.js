import Product from "../models/Product.js";
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

    // ✅ SALES DATA
    const salesDataRaw = await Order.aggregate([
      {
        $match: {
          status: "delivered",
          paymentStatus: "paid",
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

    const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const salesData = salesDataRaw.map((s) => ({
      month: `${monthNames[s._id.month - 1]}-${s._id.year}`,
      revenue: s.revenue,
      orders: s.orders,
    }));

    // ✅ USERS
    const userAgg = await Order.aggregate([
      {
        $match: {
          status: "delivered",
          paymentStatus: "paid",
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

    // ✅ OVERVIEW
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

    // ✅ PAYMENTS
    const payments = await Order.aggregate([
      {
        $match: {
          paymentStatus: "paid",
          ...dateFilter,
        },
      },
      {
        $group: {
          _id: "$status",
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

    // ✅ ✅ ✅ TOP SELLING PRODUCTS BASED ON YOUR SCHEMA
    const productAgg = await Order.aggregate([
      {
        $match: {
          status: "delivered",
          paymentStatus: "paid",
          ...dateFilter,
        },
      },
      { $unwind: "$products" },
      {
        $group: {
          _id: "$products.product",
          unitsSold: { $sum: "$products.quantity" },
          revenue: { $sum: { $multiply: ["$products.quantity", "$products.price"] } },
        },
      },
      { $sort: { unitsSold: -1 } },
      { $limit: 10 }, // top 10
    ]);

    const productIds = productAgg.map((p) => p._id);
    const productDetails = await Product.find({ _id: { $in: productIds } });

    const products = productAgg.map((p) => {
      const prod = productDetails.find(
        (d) => d._id.toString() === p._id.toString()
      );
      return {
        _id: prod?._id,
        name: prod?.name,
        brand: prod?.brand,
        price: prod?.price,
        category: prod?.category,
        unitsSold: p.unitsSold,
        revenue: p.revenue,
      };
    });

    // ✅ SEND RESPONSE
    res.json({
      salesData,
      products,
      users,
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
