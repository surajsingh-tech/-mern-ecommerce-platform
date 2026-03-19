import { User } from "../models/userModel.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
    return res.status(200).json({
      success: true,
      users
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
