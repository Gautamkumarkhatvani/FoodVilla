import Customer from "../models/customer.js";
import jwt from "jsonwebtoken";
import { sendOtpEmail } from "../utils/sendOtp.js";

/* =====================================
   SEND OTP (After Google Login)
===================================== */
export const sendOtp = async (req, res) => {
  try {
    const { email, name, googleId } = req.body;

    if (!email || !name) {
      return res.status(400).json({
        message: "Email and name are required",
      });
    }

    let customer = await Customer.findOne({ email });

    /* First time customer */
    if (!customer) {
      customer = await Customer.create({
        email,
        name,
        googleId,
        isVerified: false,
        tokenVersion: 0,

      });
    }

    /* Generate 6 digit OTP */
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    customer.otp = otp;
    customer.otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 min
    await customer.save();

    await sendOtpEmail(email, otp);

    return res.json({
      message: "OTP sent successfully",
    });
  } catch (err) {
    console.error("SEND OTP ERROR:", err);
    return res.status(500).json({
      message: "OTP sending failed",
    });
  }
};

/* =====================================
   VERIFY OTP & LOGIN (Create JWT)
===================================== */
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    console.log("Incoming OTP:", otp);

    const customer = await Customer.findOne({ email });

    if (!customer) {
      return res.status(404).json({
        message: "Customer not found",
      });
    }

    console.log("DB OTP:", customer.otp);
    console.log("Expiry:", customer.otpExpiry);
    console.log("Now:", Date.now());

    if (
      !customer.otp ||
      String(customer.otp).trim() !== String(otp).trim() ||
      !customer.otpExpiry ||
      customer.otpExpiry < Date.now()
    ) {
      return res.status(400).json({
        message: "Invalid or expired OTP",
      });
    }

    /* Mark verified */
    customer.isVerified = true;
    customer.otp = null;
    customer.otpExpiry = null;
    customer.tokenVersion = (customer.tokenVersion || 0) + 1;

    await customer.save();

    const token = jwt.sign(
      {
        id: customer._id,
        role: "customer",
        tokenVersion: customer.tokenVersion,
      },
      process.env.JWT_SECRET,
      { expiresIn: "2d" }
    );

    return res.json({
      message: "Login successful",
      token,
      customer: {
        id: customer._id,
        name: customer.name,
        email: customer.email,
      },
    });
  } catch (err) {
    console.error("VERIFY OTP ERROR:", err);
    return res.status(500).json({
      message: "Verification failed",
    });
  }
};

/* =====================================
   LOGOUT (Invalidate All Tokens)
===================================== */
export const logoutCustomer = async (req, res) => {
  try {
    const customerId = req.user?.id;

    if (!customerId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    await Customer.findByIdAndUpdate(customerId, {
      $inc: { tokenVersion: 1 },
    });

    return res.json({
      message: "Logged out successfully",
    });
  } catch (err) {
    console.error("LOGOUT ERROR:", err);
    return res.status(500).json({
      message: "Logout failed",
    });
  }
};
