import express from "express";
import multer from "multer";

import {
  protect,
  adminOnly,
} from "../middleware/auth.middleware.js";

import permission from "../middleware/permission.middleware.js";

import {
  createKitchen,
  getKitchens,
  updateKitchen,
  deleteKitchen,
} from "../controllers/kitchen.controller.js";

const router = express.Router();

/* MULTER */
const upload = multer({ dest: "tmp/" });

/*READ*/
/*PUBLIC – Homepage / Client side */
router.get(
  "/",
  getKitchens
);

/*  CREATE */
/* Admin + permitted Sub User */
router.post(
  "/",
  protect,
  permission("kitchen"),
  upload.single("image"),
  createKitchen
);

/* UPDATE */
/* ADMIN ONLY */
router.put(
  "/:id",
  protect,
  adminOnly,
  upload.single("image"),
  updateKitchen
);

/* DELETE */
/* ADMIN ONLY */
router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteKitchen
);

export default router;
