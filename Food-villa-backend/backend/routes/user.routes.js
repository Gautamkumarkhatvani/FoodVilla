import express from "express";
import {
  createSubUser,
  getSubUsers,
  deleteSubUser,
} from "../controllers/user.controller.js";

import {
  protect,
  adminOnly,
} from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protect, adminOnly, createSubUser);
router.get("/", protect, adminOnly, getSubUsers);
router.delete("/:id", protect, adminOnly, deleteSubUser);

export default router;
