import { User } from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { verifyEmail } from "../emailVerify/verifyEmail.js";
import { Session } from "../models/sessionModel.js";
import { sendOTPMail } from "../emailVerify/sendOTPMail.js";
import cloudinary from "../utils/cloudinary.js";
export const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All Fields are Required",
      });
    }
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }
    const user = await User.findOne({ email: email.toLowerCase() });
    if (user) {
      return res.status(409).json({
        success: false,
        message: "User already Exist",
      });
    }
    const hashPassWord = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      firstName,
      lastName,
      email: email.toLowerCase(),
      password: hashPassWord,
    });

    const token = jwt.sign({ id: newUser._id }, process.env.SECRET_KEY, {
      expiresIn: "10m",
    });
    const info = await verifyEmail(token, email);
    if (!info || !info.messageId) {
      return res.status(500).json({
        success: false,
        message: "Failed to send verification email",
      });
    }
    newUser.token = token;
    await newUser.save();
    const userResponse = newUser.toObject();
    delete userResponse.password;

    return res.status(201).json({
      success: true,
      message: "user registered successfully ",
      user: userResponse,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const verify = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(400).json({
        success: false,
        message: "Authorization Token is missing or Invalid",
      });
    }

    const token = authHeader.split(" ")[1];

    let decoded = jwt.verify(token, process.env.SECRET_KEY);

    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "user not found",
      });
    }

    user.token = null;

    user.isVerified = true;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Email verified successfully",
    });
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
    } else {
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
        error: error.message,
      });
    }
  }
};

export const reVerify = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not Found",
        error: error.message,
      });
    }
    const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
      expiresIn: "10m",
    });
    const info = await verifyEmail(token, email);
    if (!info || !info.messageId) {
      return res.status(500).json({
        success: false,
        message: "Failed to send verification email",
      });
    }
    user.token = token;
    await user.save();
    return res.status(200).json({
      success: true,
      message: "Email send again successfully",
      user: user.token,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All Fields are Required",
      });
    }
    const existingUser = await User.findOne({ email }).select("+password");
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "user not found",
      });
    }

    const verifyPass = await bcrypt.compare(password, existingUser.password);
    if (!verifyPass) {
      return res.status(400).json({
        success: false,
        message: "Password do not match",
      });
    }
    if (!existingUser.isVerified) {
      return res.status(400).json({
        success: false,
        message: "verify your account then login",
      });
    }
    //genrate token
    const accessToken = jwt.sign(
      { id: existingUser._id },
      process.env.SECRET_KEY,
      {
        expiresIn: "10d",
      },
    );
    const refreshToken = jwt.sign(
      { id: existingUser._id },
      process.env.SECRET_KEY,
      {
        expiresIn: "30d",
      },
    );

    existingUser.isLoggedIn = true;
    await existingUser.save();
    //Check for existing Session and delete it
    const existingSession = await Session.findOne({ userId: existingUser._id });
    if (existingSession) {
      await Session.deleteOne({ userId: existingUser._id });
    }
    // create new session
    await Session.create({ userId: existingUser._id });
    const userObj = existingUser.toObject();
    delete userObj.password;

    return res.status(200).json({
      success: true,
      message: `Welcome Back  ${existingUser.firstName}`,
      user: userObj,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const logout = async (req, res) => {
  try {
    const userId = req.id;
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    await Session.deleteMany({ userId });
    await User.findByIdAndUpdate(userId, { isLoggedIn: false });
    return res.status(200).json({
      success: true,
      message: "User logout successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(404).json({
        success: false,
        message: "Email is Required",
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes in ms
    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();
    await sendOTPMail(otp, email);
    return res.status(200).json({
      success: true,
      message: "OTP send to email successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const verifyOTP = async (req, res) => {
  try {
    const { otp } = req.body;
    const { email } = req.params;
    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "email or otp must required",
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    if (!user.otp || !user.otpExpiry) {
      return res.status(400).json({
        success: false,
        message: "OTP is not genrated or already verifyed",
      });
    }
    if (user.otpExpiry < new Date()) {
      return res.status(400).json({
        success: false,
        message: "Otp has expired please request a new one",
      });
    }
    if (otp !== user.otp) {
      return res.status(400).json({
        success: false,
        message: "Otp is invalid",
      });
    }

    user.otp = null;
    user.otpExpiry = null;
    await user.save();
    return res.status(200).json({
      success: true,
      message: "OTP verified successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { newPassword, confirmPassword } = req.body;
    const { email } = req.params;
    if (!newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are mandatory",
      });
    }
    if (newPassword.length < 6 || confirmPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must at least 6 characters",
      });
    }
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password do not Match",
      });
    }
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "email are required",
      });
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "user not found",
      });
    }
    const hashPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashPassword;
    await user.save();
    return res.status(200).json({
      success: true,
      message: "Password change successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      res.status(400).json({
        success: false,
        message: "user id is required",
      });
    }
    const user = await User.findById(userId).select("-otp -otpExpiry -token");
    if (!user) {
      res.status(404).json({
        success: false,
        message: "user not found",
      });
    }
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const userIdToUpdate = req.params.id;
    const loggedInUser = req.user; // from isAuthanticated
    const {
      firstName,
      lastName,
      city,
      address,
      zipCode,
      email,
      phoneNo,
      role,
    } = req.body;
    if (
      loggedInUser._id.toString() !== userIdToUpdate &&
      loggedInUser.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to update this profile",
      });
    }

    let user = await User.findById(userIdToUpdate);
    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    let profilePicUrl = user.profilePic;
    let profilePublicId = user.profilePublicId;

    //If a new file is uploaded
    if (req.file) {
      if (profilePublicId) {
        await cloudinary.uploader.destroy(profilePublicId);
      }
      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "profiles" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          },
        );
        stream.end(req.file.buffer);
      });
      profilePicUrl = uploadResult.secure_url;
      profilePublicId = uploadResult.public_id;
    }
    //Update Fields
    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.city = city || user.city;
    user.address = address || user.address;
    user.zipCode = zipCode || user.zipCode;
    user.email = email || user.email;
    user.phoneNo = phoneNo || user.phoneNo;
    user.role = role || user.role;
    user.profilePic = profilePicUrl;
    user.profilePublicId = profilePublicId;

    const updateUser = await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile Updeted Successfully",
      user: updateUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
