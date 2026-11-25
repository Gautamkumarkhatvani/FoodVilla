import Recipe from "../models/Recipe.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";

/*CREATE*/
/* Admin + permitted Sub User */
export const createRecipe = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description || !req.file) {
      return res.status(400).json({
        message: "Title, description and image are required",
      });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "foodvilla/recipes",
    });

    fs.unlinkSync(req.file.path);

    const recipe = await Recipe.create({
      title,
      description,
      imageUrl: result.secure_url,
      publicId: result.public_id,
    });

    return res.status(201).json(recipe);
  } catch (error) {
    console.error("CREATE RECIPE ERROR:", error);
    return res.status(500).json({
      message: "Create recipe failed",
    });
  }
};

/*READ */
/* Admin + permitted Sub User */
export const getRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find().sort({
      createdAt: -1,
    });
    return res.json(recipes);
  } catch (error) {
    console.error("GET RECIPE ERROR:", error);
    return res.status(500).json({
      message: "Fetch recipes failed",
    });
  }
};

/*UPDATE*/
/* ADMIN ONLY */
export const updateRecipe = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "Sub user is not allowed to update recipe",
      });
    }

    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({
        message: "Recipe not found",
      });
    }

    const { title, description } = req.body;

    recipe.title = title || recipe.title;
    recipe.description =
      description || recipe.description;

    if (req.file) {
      if (recipe.publicId) {
        await cloudinary.uploader.destroy(
          recipe.publicId
        );
      }

      const result =
        await cloudinary.uploader.upload(
          req.file.path,
          {
            folder: "foodvilla/recipes",
          }
        );

      fs.unlinkSync(req.file.path);

      recipe.imageUrl = result.secure_url;
      recipe.publicId = result.public_id;
    }

    await recipe.save();
    return res.json(recipe);
  } catch (error) {
    console.error("UPDATE RECIPE ERROR:", error);
    return res.status(500).json({
      message: "Update recipe failed",
    });
  }
};

/* DELETE */
/*  ADMIN ONLY */
export const deleteRecipe = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "Sub user is not allowed to delete recipe",
      });
    }

    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({
        message: "Recipe not found",
      });
    }

    if (recipe.publicId) {
      await cloudinary.uploader.destroy(
        recipe.publicId
      );
    }

    await Recipe.findByIdAndDelete(req.params.id);

    return res.json({
      message: "Recipe deleted successfully",
    });
  } catch (error) {
    console.error("DELETE RECIPE ERROR:", error);
    return res.status(500).json({
      message: "Delete recipe failed",
    });
  }
};
