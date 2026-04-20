import express from "express";
import { isAdmin, isAuthanticated } from "../middleware/isAuthanticated.js";
import { getAllOrder, getAllUsers, getUserOrder } from "../controllers/adminController.js";
const router = express.Router();

router.get("/user-orders/:userId", isAuthanticated, isAdmin, getUserOrder);
router.get("/allordrs", isAuthanticated, isAdmin, getAllOrder);
router.get("/all-users", isAuthanticated, isAdmin, getAllUsers);
export default router;
