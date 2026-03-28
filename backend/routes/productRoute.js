import express from "express";
import {
  addProduct,
  deleteProduct,
  getAllProduct,
  updateProduct,
} from "../controllers/productController.js";
import { isAdmin, isAuthanticated } from "../middleware/isAuthanticated.js";
import { multiUpload } from "../middleware/multer.js";
const router = express.Router();

router.post("/add", isAuthanticated,isAdmin, multiUpload, addProduct);
router.get("/getallproducts", getAllProduct);
router.delete("/delete/:productId", isAuthanticated, isAdmin, deleteProduct);
router.put("/update/:productId", isAuthanticated,isAdmin, multiUpload, updateProduct);
export default router;
