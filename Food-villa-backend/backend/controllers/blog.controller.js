import Blog from "../models/blog.js";
import fs from "fs";
import { v2 as cloudinary } from "cloudinary";

/*  CREATE BLOG */
/* Admin + permitted Sub User */
export const createBlog = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        message: "Title and description are required",
      });
    }

    if (!req.files?.smallImage || !req.files?.largeImage) {
      return res.status(400).json({
        message: "Both images are required",
      });
    }

    const smallUpload = await cloudinary.uploader.upload(
      req.files.smallImage[0].path,
      { folder: "foodvilla/blog/small" }
    );

    const largeUpload = await cloudinary.uploader.upload(
      req.files.largeImage[0].path,
      { folder: "foodvilla/blog/large" }
    );

    fs.unlinkSync(req.files.smallImage[0].path);
    fs.unlinkSync(req.files.largeImage[0].path);

    const blog = await Blog.create({
      title,
      description,
      smallImage: smallUpload.secure_url,
      smallPublicId: smallUpload.public_id,
      largeImage: largeUpload.secure_url,
      largePublicId: largeUpload.public_id,
    });

    return res.status(201).json(blog);
  } catch (error) {
    console.error("CREATE BLOG ERROR:", error);
    return res.status(500).json({
      message: "Create blog failed",
    });
  }
};

/* GET BLOGS  */
/* Admin + permitted Sub User */
export const getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({
      createdAt: -1,
    });
    return res.json(blogs);
  } catch (error) {
    console.error("GET BLOG ERROR:", error);
    return res.status(500).json({
      message: "Fetch blogs failed",
    });
  }
};

/* UPDATE BLOG  */
/* ❌ ADMIN ONLY */
export const updateBlog = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "Sub user is not allowed to update blog",
      });
    }

    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({
        message: "Blog not found",
      });
    }

    const { title, description } = req.body;

    if (title) blog.title = title;
    if (description) blog.description = description;

    /* SMALL IMAGE UPDATE */
    if (req.files?.smallImage) {
      if (blog.smallPublicId) {
        await cloudinary.uploader.destroy(
          blog.smallPublicId
        );
      }

      const upload = await cloudinary.uploader.upload(
        req.files.smallImage[0].path,
        { folder: "foodvilla/blog/small" }
      );

      fs.unlinkSync(req.files.smallImage[0].path);

      blog.smallImage = upload.secure_url;
      blog.smallPublicId = upload.public_id;
    }

    /* LARGE IMAGE UPDATE */
    if (req.files?.largeImage) {
      if (blog.largePublicId) {
        await cloudinary.uploader.destroy(
          blog.largePublicId
        );
      }

      const upload = await cloudinary.uploader.upload(
        req.files.largeImage[0].path,
        { folder: "foodvilla/blog/large" }
      );

      fs.unlinkSync(req.files.largeImage[0].path);

      blog.largeImage = upload.secure_url;
      blog.largePublicId = upload.public_id;
    }

    await blog.save();
    return res.json(blog);
  } catch (error) {
    console.error("UPDATE BLOG ERROR:", error);
    return res.status(500).json({
      message: "Update blog failed",
    });
  }
};

/*DELETE BLOG */
/* ❌ ADMIN ONLY */
export const deleteBlog = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "Sub user is not allowed to delete blog",
      });
    }

    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({
        message: "Blog not found",
      });
    }

    if (blog.smallPublicId) {
      await cloudinary.uploader.destroy(
        blog.smallPublicId
      );
    }

    if (blog.largePublicId) {
      await cloudinary.uploader.destroy(
        blog.largePublicId
      );
    }

    await Blog.findByIdAndDelete(req.params.id);

    return res.json({
      message: "Blog deleted successfully",
    });
  } catch (error) {
    console.error("DELETE BLOG ERROR:", error);
    return res.status(500).json({
      message: "Delete blog failed",
    });
  }
};
