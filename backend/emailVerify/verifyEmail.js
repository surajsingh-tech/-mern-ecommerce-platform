import nodemailer from "nodemailer";
import "dotenv/config";

export const verifyEmail = async (token, email) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: process.env.MAIL_USER,
      to: email,
      subject: "Email Verification",
      text: `Welcome! You have recently visited our website and entered your email address. 
      Please follow the link below to verify your email:\n\nhttp://localhost:5173/verify/${token}\n\n
      If you did not request this, please ignore this email.`,
      html: `
        <h2>Email Verification</h2>
        <p>Please click the button below to verify your email:</p>
        <a href="http://localhost:5173/verify/${token}" 
           style="display:inline-block;padding:10px 20px;background:#007BFF;color:#fff;text-decoration:none;border-radius:5px;">
           Verify Email
        </a>
      `,
    });
    return info;
  } catch (error) {
    console.error("Error sending email:", error.message);
    throw error;
  }
};


