import { User } from "../models/userModel.js";
import jwt from 'jsonwebtoken';

export const isAuthanticated = async (req, res, next) => {
  try {
     const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(500).json({
        status: false,
        message: "Authorization is missing or Invalid",
      });
    }
    const token = authHeader.split(" ")[1];
    let decoded = jwt.verify(token, process.env.SECRET_KEY);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({
        status: false,
        message: "User not found",
      });
    }
    
    req.id = user._id;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "The registration token has expired",
      });
    } else if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Token Verification Failed",
      });
    }
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};
