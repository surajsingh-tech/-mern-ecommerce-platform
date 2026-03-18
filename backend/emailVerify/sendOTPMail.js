import nodemailer from "nodemailer";
import "dotenv/config";

export const sendOTPMail = async (OTP, email) => {
  if (!process.env.MAIL_USER || !process.env.MAIL_PASS) {
    throw new Error("Missing MAIL_USER or MAIL_PASS in environment variables");
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: `"Support Team" <${process.env.MAIL_USER}>`,
      to: email,
      subject: "Password Reset OTP",
      text: `Your OTP for password reset is: ${OTP}`, // Plain text fallback
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.5;">
          <h2>Password Reset Request</h2>
          <p>Your OTP for password reset is: <strong>${OTP}</strong></p>
          <p>This OTP will expire in 10 minutes.</p>
        </div>
      `,
    });
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send OTP email. Please try again later.",error.message);
  }
};
