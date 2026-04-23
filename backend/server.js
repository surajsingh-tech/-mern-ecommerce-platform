import express from "express";
import "dotenv/config";
import connectDB from "./database/db.js";
import userRoute from "./routes/userRoute.js";
import cartRoute from "./routes/cartRoute.js";
import productRoute from "./routes/productRoute.js";
import oderRoutes from "./routes/orderRoute.js";
import adminRoutes from "./routes/adminRoutes.js";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: ["http://localhost:5173", "https://mern-ecommerce-platform-seven.vercel.app"],
    credentials: true,
  }),
);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/product", productRoute);
app.use("/api/v1/cart", cartRoute);
app.use("/api/v1/orders", oderRoutes);
app.use("/api/v1/admin", adminRoutes);
//Test route
app.get("/", (req, res) => {
  res.send("API is working 🚀");
});
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on PORT ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("DB Connection Failed ❌", err);
  });
