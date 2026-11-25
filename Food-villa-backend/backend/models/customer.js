import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
  {
    /* ================= GOOGLE INFO ================= */
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    /* ================= CONTACT ================= */
    mobile: {
      type: String,
      trim: true,
    },

    /* ================= ADDRESS ================= */
    address: {
      fullAddress: String,
      city: String,
      state: String,
      pincode: String,
    },

    location: {
      latitude: Number,
      longitude: Number,
    },

    /* ================= OTP SYSTEM ================= */
    otp: {
      type: String,
    },

    otpExpiry: {
      type: Date,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    /* ================= SESSION CONTROL ================= */
    tokenVersion: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Customer =
  mongoose.models.Customer ||
  mongoose.model("Customer", customerSchema);

export default Customer;
