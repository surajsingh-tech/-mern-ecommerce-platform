import { User } from "../models/userModel.js";
import { Order } from "../models/orderModel.js";
import { Product } from "../models/productModel.js";
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    return res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getUserOrder = async (req, res) => {
  try {
    const admin = req.id;
    const { userId } = req.params;

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "unauthorized access",
      });
    }
    if (!userId) {
      return res.status(404).json({
        success: false,
        message: "user not found",
      });
    }
    const orders = await Order.find({ user: userId })
      .populate({ path: "user", select: "firstName lastName email" })
      .populate({
        path: "products.productId",
        select: "productName productPrice productImage",
      });

    return res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllOrder = async (req, res) => {
  try {
    const admin = req.id;

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    const allOrders = await Order.find()
      .sort({ createdAt: -1 })
      .populate({ path: "user", select: "firstName  email profilePic " })
      .populate({
        path: "products.productId",
        select: "productName productPrice productImage",
      });

    return res.status(200).json({
      success: true,
      orders: allOrders,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getSalesData = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({});
    const totalProducts = await Product.countDocuments({});
    const totalOrders = await Order.countDocuments({ status: "Paid" });
    //Total sales amount
    const totalSaleAgg = await Order.aggregate([
      { $match: { status: "Paid" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const totalSales = totalSaleAgg[0]?.total || 0;
    //Sales group by date (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const salesByDate = await Order.aggregate([
      { $match: { status: "Paid", createdAt: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          amount: { $sum: "$amount" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const formattedSales = salesByDate?.map((item) => ({
      date: item._id,
      amount: item.amount,
    }));

    console.log("formattedSales is ", formattedSales);

    return res.json({
      success: true,
      totalUsers,
      totalProducts,
      totalOrders,
      salesByDate,
      sales: formattedSales,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};
