import express from "express";
import multer from "multer";

import {
  protect,
  adminOnly,
} from "../middleware/auth.middleware.js";

import permission from "../middleware/permission.middleware.js";

import {
  createRecipe,
  getRecipes,
  updateRecipe,
  deleteRecipe,
} from "../controllers/recipe.controller.js";

const router = express.Router();
const upload = multer({ dest: "tmp/" });

/* READ*/
/*PUBLIC – Client side / Homepage */
router.get(
  "/",
  getRecipes
);

/*  CREATE  */
/* Admin + permitted Sub User */
router.post(
  "/",
  protect,
  permission("recipe"),
  upload.single("image"),
  createRecipe
);

/* UPDATE */
/*ADMIN ONLY */
router.put(
  "/:id",
  protect,
  adminOnly,
  upload.single("image"),
  updateRecipe
);

/* DELETE */
/* ADMIN ONLY */
router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteRecipe
);

export default router;
