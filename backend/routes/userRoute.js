import express from "express";
const router = express.Router();
import {
  register,
  verify,
  reVerify,
  login,
  logout
} from "../controllers/userController.js";
import { isAuthanticated } from "../middleware/isAuthanticated.js";

router.post("/register", register);
router.post("/verify", verify);
router.post("/reverify", reVerify);
router.post("/login", login);
router.get('/logout',isAuthanticated,logout);
export default router;
 