import express from "express";
import multer from "multer";

import {
  protect,
  adminOnly,
} from "../middleware/auth.middleware.js";

import permission from "../middleware/permission.middleware.js";

import {
  createBlog,
  getBlogs,
  updateBlog,
  deleteBlog,
} from "../controllers/blog.controller.js";

const router = express.Router();
const upload = multer({ dest: "tmp/" });

/*READ BLOGS PUBLIC (Homepage / Client side)*/
router.get(
  "/",
  getBlogs
);

/*CREATE BLOG Admin + Sub User (permission based) */
router.post(
  "/",
  protect,
  permission("blog"),
  upload.fields([
    { name: "smallImage", maxCount: 1 },
    { name: "largeImage", maxCount: 1 },
  ]),
  createBlog
);

/*UPDATE BLOG ADMIN ONLY */
router.put(
  "/:id",
  protect,
  adminOnly,
  upload.fields([
    { name: "smallImage", maxCount: 1 },
    { name: "largeImage", maxCount: 1 },
  ]),
  updateBlog
);

/* DELETE BLOG ADMIN ONLY */
router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteBlog
);

export default router;
