import express from "express";
import { isAuthanticated } from "../middleware/isAuthanticated.js";
import {
  addToCart,
  getCart,
  removeFromCart,
  updateQuantity,
} from "../controllers/cartController.js";
const router = express.Router();

router.get("/", isAuthanticated, getCart);
router.post("/add", isAuthanticated, addToCart);
router.put("/update", isAuthanticated, updateQuantity);
router.delete("/remove", isAuthanticated, removeFromCart);
export default router;
