import express from "express";
import {
  sendOtp,
  verifyOtp,
  logoutCustomer,
} from "../controllers/customer.controller.js";

const router = express.Router();

router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/logout", logoutCustomer);

export default router;
