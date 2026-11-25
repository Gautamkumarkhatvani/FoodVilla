import Kitchen from "../models/Kitchen.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";

/*CREATE*/
/* Admin + permitted Sub User */
export const createKitchen = async (req, res) => {
  try {
    // permission already checked in middleware
    const { title, description } = req.body;

    if (!title || !description || !req.file) {
      return res.status(400).json({
        message: "Title, description and image are required",
      });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "foodvilla/kitchen",
    });

    fs.unlinkSync(req.file.path);

    const kitchen = await Kitchen.create({
      title,
      description,
      imageUrl: result.secure_url,
      publicId: result.public_id,
    });

    res.status(201).json(kitchen);
  } catch (err) {
    console.error("CREATE KITCHEN ERROR:", err);
    res.status(500).json({ message: "Create kitchen failed" });
  }
};

/*READ*/
/* Admin + permitted Sub User */
export const getKitchens = async (req, res) => {
  const kitchens = await Kitchen.find().sort({ createdAt: -1 });
  res.json(kitchens);
};

/*UPDATE*/
/*ADMIN ONLY */
export const updateKitchen = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "Sub user is not allowed to update kitchen",
      });
    }

    const { title, description } = req.body;

    const kitchen = await Kitchen.findById(req.params.id);
    if (!kitchen) {
      return res.status(404).json({ message: "Kitchen not found" });
    }

    kitchen.title = title || kitchen.title;
    kitchen.description = description || kitchen.description;

    if (req.file) {
      if (kitchen.publicId) {
        await cloudinary.uploader.destroy(kitchen.publicId);
      }

      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "foodvilla/kitchen",
      });

      fs.unlinkSync(req.file.path);

      kitchen.imageUrl = result.secure_url;
      kitchen.publicId = result.public_id;
    }

    await kitchen.save();
    res.json(kitchen);
  } catch (err) {
    console.error("UPDATE KITCHEN ERROR:", err);
    res.status(500).json({ message: "Update kitchen failed" });
  }
};

/* DELETE*/
/*  ADMIN ONLY */
export const deleteKitchen = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "Sub user is not allowed to delete kitchen",
      });
    }

    const kitchen = await Kitchen.findById(req.params.id);
    if (!kitchen) {
      return res.status(404).json({ message: "Kitchen not found" });
    }

    if (kitchen.publicId) {
      await cloudinary.uploader.destroy(kitchen.publicId);
    }

    await Kitchen.findByIdAndDelete(req.params.id);
    res.json({ message: "Kitchen deleted" });
  } catch (err) {
    console.error("DELETE KITCHEN ERROR:", err);
    res.status(500).json({ message: "Delete kitchen failed" });
  }
};
