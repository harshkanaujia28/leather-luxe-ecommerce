import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";

export const getAdminDashboard = async (req, res) => {
  try {
    console.log("🟡 [AdminDashboard] Fetching dashboard data...");

    // 1️⃣ Count totals
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalCustomers = await User.countDocuments({ role: "customer" });

    console.log("📊 Totals =>", {
      totalProducts,
      totalOrders,
      totalCustomers,
    });

    // 2️⃣ Total revenue
    const revenueData = await Order.aggregate([
      { $group: { _id: null, totalRevenue: { $sum: "$totalPrice" } } },
    ]);
    const totalRevenue = revenueData[0]?.totalRevenue || 0;
    console.log("💰 Total Revenue:", totalRevenue);

    // 3️⃣ Recent 5 orders
    const recentOrders = await Order.find()
      .populate("user", "first_name last_name email")
      .sort({ createdAt: -1 })
      .limit(5);
    console.log("🧾 Recent Orders Count:", recentOrders.length);

    // 4️⃣ Graph Data (Monthly sales for the last 6 months)
    const salesData = await Order.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          totalSales: { $sum: "$totalPrice" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    const formattedSales = salesData.map((d) => ({
      month: `${d._id.month}-${d._id.year}`,
      totalSales: d.totalSales,
    }));

    console.log("📈 Sales Graph Data:", formattedSales);

    // ✅ Send response once
    return res.status(200).json({
      success: true,
      totalProducts,
      totalOrders,
      totalCustomers,
      totalRevenue,
      recentOrders,
      salesGraph: formattedSales,
    });
  } catch (err) {
    console.error("❌ Dashboard Error:", err);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch admin dashboard data",
      error: err.message,
    });
  }
};
