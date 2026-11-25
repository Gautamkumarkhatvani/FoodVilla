import express from "express";
import {
  googleLogin,
  verifyOtp,
  getProfile,
} from "../controllers/customer.controller.js";

import { protectCustomer } from "../middleware/customerAuth.middleware.js";

const router = express.Router();

router.post("/google-login", googleLogin);
router.post("/verify-otp", verifyOtp);
router.get("/profile", protectCustomer, getProfile);

export default router;
