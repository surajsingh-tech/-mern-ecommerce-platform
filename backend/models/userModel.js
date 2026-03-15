import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
    },

    lastName: {
      type: String,
      required: [true, "Last name is required"],
    },

    profilePic: { type: String, default: "" }, // cloudinary image URL
    profilePublicId: { type: String, default: "" }, // cloudinary public_id for deletion

    email: {
      type: String,
      unique: true,
      required: [true, "Email is required"],
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      select: false,
      minlength: [6, "Password must be at least 6 characters"],
    },

    role: {
      type: String,
      required: [true, "Role is required"],
      enum: ["user", "admin"],
      default: "user",
    },

    token: { type: String, default: null },

    isVerified: { type: Boolean, default: false },

    isLoggedIn: { type: Boolean, default: false },

    otp: { type: String, default: null },

    otpExpiry: { type: Date, default: null },

    address: { type: String },

    city: { type: String },

    zipCode: { type: String },

    phoneNo: { type: String },
  },
  { timestamps: true },
);

export const User = mongoose.model("User", userSchema);
