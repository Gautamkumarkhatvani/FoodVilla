import express from "express";
import { login, googleLogin } from "../controllers/auth.controller.js";

const router = express.Router();

/* ================= ADMIN / SUBUSER LOGIN ================= */
router.post("/login", login);

/* ================= CUSTOMER GOOGLE LOGIN ================= */
router.post("/google", googleLogin);

export default router;
