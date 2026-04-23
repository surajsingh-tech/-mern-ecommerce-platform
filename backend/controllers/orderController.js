import razorpayInstance from "../config/razorpay.js";
import { Order } from "../models/orderModel.js";
import { Cart } from "../models/cartModel.js";
import crypto from "crypto";

export const createOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    if (!userId) {
      return res.status(404).json({
        success: false,
        message: "user not found",
      });
    }
    const { products, amount, tax, shipping, currency } = req.body;

    if (!amount || !products?.length) {
      return res.status(400).json({
        success: false,
        message: "Invalid order data",
      });
    }

    const razorpayOrder = await razorpayInstance.orders.create({
      amount: Math.round(amount * 100), // rupees → paise
      currency: currency || "INR",
      receipt: "receipt_" + Date.now(),
    });

    const newOrder = await Order.create({
      user: req.user._id,
      products,
      amount,
      tax,
      shipping,
      currency,
      razorpayOrderId: razorpayOrder.id,
      status: "Pending",
    });

    res.json({
      success: true,
      order: razorpayOrder,
      dbOrder: newOrder,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const userId = req.user._id;
    if (!userId) {
      return res.status(404).json({
        success: false,
        message: "user not found",
      });
    }
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment data",
      });
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Signature mismatch",
      });
    }

    const order = await Order.findOneAndUpdate(
      { razorpayOrderId: razorpay_order_id, user: userId },
      {
        status: "Paid",
        razorpayPaymentId: razorpay_payment_id,
      },
      { new: true },
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    await Cart.findOneAndDelete({ userId : userId });

    res.json({
      success: true,
      order,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false });
  }
};

export const getMyOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    if (!userId) {
      return res.status(404).json({
        success: false,
        message: "user not found",
      });
    }
    const orders = await Order.find({ user: userId })
      .populate({
        path: "products.productId",
        select: "productName productPrice productImage",
      })
      .populate({ path: "user", select: "firstName lastName email" });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

