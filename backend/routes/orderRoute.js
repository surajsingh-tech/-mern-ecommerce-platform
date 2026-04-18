import express from "express";
import { isAuthanticated } from "../middleware/isAuthanticated.js";
import {
  createOrder,
  getMyOrder,
  verifyPayment,
} from "../controllers/orderController.js";
const router = express.Router();

router.post("/create-order", isAuthanticated, createOrder);
router.post("/verify-payment", isAuthanticated, verifyPayment);
router.get("/myorder", isAuthanticated, getMyOrder);

export default router;
