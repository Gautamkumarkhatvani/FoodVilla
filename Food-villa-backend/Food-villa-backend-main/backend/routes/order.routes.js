import express from "express";
import {
  createOrder,
  cancelOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
} from "../controllers/order.controller.js";

import { protect, adminOnly } from "../middleware/auth.middleware.js";

const router = express.Router();

/* =========================================
   CUSTOMER ROUTES
========================================= */

/* Place Order */
router.post("/", protect, createOrder);

/* Get My Orders */
router.get("/my", protect, getUserOrders);

/* Cancel My Order */
router.put("/cancel/:id", protect, cancelOrder);

/* =========================================
   ADMIN ROUTES
========================================= */

/* Get All Orders (ADMIN) */
router.get("/admin/all", protect, adminOnly, getAllOrders);

/* Update Order Status (ADMIN) */
router.put("/admin/status/:id", protect, adminOnly, updateOrderStatus);

export default router;
