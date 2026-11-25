import express from "express";
import multer from "multer";

import { protect, adminOnly } from "../middleware/auth.middleware.js";
import permission from "../middleware/permission.middleware.js";

import {
  createTaste,
  getTastes,
  updateTaste,
  deleteTaste,
} from "../controllers/taste.controller.js";

const router = express.Router();

/*MULTER*/
const upload = multer({ dest: "tmp/" });

/*  PUBLIC */
router.get("/", getTastes);

/*  CREATE  */
/* Admin + permitted Sub User */
router.post(
  "/",
  protect,
  permission("taste"),
  upload.single("image"),
  createTaste
);

/* UPDATE */
/*  ADMIN ONLY */
router.put(
  "/:id",
  protect,
  adminOnly,
  upload.single("image"),
  updateTaste
);

/* DELETE */
/* ADMIN ONLY */
router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteTaste
);

export default router;
