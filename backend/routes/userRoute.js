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
  changePassword,
  getUserById,
  updateUserProfile,
} from "../controllers/userController.js";
import { isAdmin, isAuthanticated } from "../middleware/isAuthanticated.js";
import { getAllUsers } from "../controllers/adminController.js";
import { singleUpload } from "../middleware/multer.js";

router.post("/register", register);
router.post("/verify", verify);
router.post("/reverify", reVerify);
router.post("/login", login);
router.post("/logout", isAuthanticated, logout);
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp/:email", verifyOTP);
router.post("/change-password/:email", changePassword);
router.get("/get-user/:userId", getUserById);
router.put("/update/:userId", isAuthanticated , singleUpload,updateUserProfile);
//Admin Routes
router.get("/all-users", isAuthanticated, isAdmin, getAllUsers);
export default router;
