import { User } from "../models/userModel.js";
import { Order } from "../models/orderModel.js";
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
      .populate({ path: "user", select: "firstName  email" })
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
