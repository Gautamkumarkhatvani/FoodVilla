import Taste from "../models/Taste.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";

/* CREATE */
/* Admin + permitted Sub User */
export const createTaste = async (req, res) => {
  try {
    const { title, description, price, calories, protein } = req.body;

    if (
      !title ||
      !description ||
      price === undefined ||
      calories === undefined ||
      protein === undefined ||
      !req.file
    ) {
      return res.status(400).json({
        message:
          "Title, description, price, calories, protein and image are required",
      });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "foodvilla/taste",
    });

    fs.unlinkSync(req.file.path);

    const taste = await Taste.create({
      title,
      description,
      price,
      calories,
      protein,
      imageUrl: result.secure_url,
      publicId: result.public_id,
    });

    res.status(201).json(taste);
  } catch (err) {
    console.error("CREATE TASTE ERROR:", err);
    res.status(500).json({ message: "Create taste failed" });
  }
};

/*  READ */
/* PUBLIC */
export const getTastes = async (req, res) => {
  try {
    const { sort } = req.query;

    let sortOption = { createdAt: -1 };

    if (sort === "low") sortOption = { price: 1 };
    if (sort === "high") sortOption = { price: -1 };
    if (sort === "popular") sortOption = { orderCount: -1 };

    const tastes = await Taste.find().sort(sortOption);

    res.json(tastes);

  } catch (err) {
    console.error("GET TASTE ERROR:", err);
    res.status(500).json({ message: "Fetch tastes failed" });
  }
};
/*UPDATE  */
/*ADMIN ONLY */
export const updateTaste = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "Sub user is not allowed to update taste",
      });
    }

    const taste = await Taste.findById(req.params.id);
    if (!taste) {
      return res.status(404).json({ message: "Taste not found" });
    }

    const { title, description, price, calories, protein } = req.body;

    if (title) taste.title = title;
    if (description) taste.description = description;
    if (price !== undefined) taste.price = price;
    if (calories !== undefined) taste.calories = calories;
    if (protein !== undefined) taste.protein = protein;

    if (req.file) {
      if (taste.publicId) {
        await cloudinary.uploader.destroy(taste.publicId);
      }

      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "foodvilla/taste",
      });

      fs.unlinkSync(req.file.path);

      taste.imageUrl = result.secure_url;
      taste.publicId = result.public_id;
    }

    await taste.save();
    res.json(taste);
  } catch (err) {
    console.error("UPDATE TASTE ERROR:", err);
    res.status(500).json({ message: "Update taste failed" });
  }
};

/* DELETE  */
/* ADMIN ONLY */
export const deleteTaste = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "Sub user is not allowed to delete taste",
      });
    }

    const taste = await Taste.findById(req.params.id);
    if (!taste) {
      return res.status(404).json({ message: "Taste not found" });
    }

    if (taste.publicId) {
      await cloudinary.uploader.destroy(taste.publicId);
    }

    await Taste.findByIdAndDelete(req.params.id);

    res.json({ message: "Taste deleted successfully" });
  } catch (err) {
    console.error("DELETE TASTE ERROR:", err);
    res.status(500).json({ message: "Delete taste failed" });
  }
};
