import express from "express";
const router = express.Router();
import {
  register,
  verify,
  reVerify,
  login,
  logout,
  forgotPassword,
  verifyOTP,
  changePassword
} from "../controllers/userController.js";
import { isAuthanticated } from "../middleware/isAuthanticated.js";

router.post("/register", register);
router.post("/verify", verify);
router.post("/reverify", reVerify);
router.post("/login", login);
router.post('/logout',isAuthanticated,logout);
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp/:email", verifyOTP);
router.post("/change-password/:email", changePassword);
export default router;
 