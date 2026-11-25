import User from "../models/User.js";

/*CREATE SUB USER (ADMIN ONLY)*/
export const createSubUser = async (req, res) => {
  try {
    //Admin check
    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "Only admin can create sub users",
      });
    }

    const { username, password, permissions } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        message: "Username and password are required",
      });
    }

    // Duplicate check
    const exists = await User.findOne({ username });
    if (exists) {
      return res.status(400).json({
        message: "Username already exists",
      });
    }

    //  ONLY `add` — NO access ANYWHERE
    const safePermissions = {
      kitchen: { add: permissions?.kitchen?.add === true },
      taste: { add: permissions?.taste?.add === true },
      recipe: { add: permissions?.recipe?.add === true },
      blog: { add: permissions?.blog?.add === true },
    };

    const user = await User.create({
      username,
      password, 
      role: "subuser",
      permissions: safePermissions,
    });

    return res.status(201).json({
      message: "Sub user created successfully",
      user,
    });
  } catch (error) {
    console.error("CREATE SUB USER ERROR:", error);
    return res.status(500).json({
      message: "Create sub user failed",
    });
  }
};

/*GET SUB USERS (ADMIN)*/
export const getSubUsers = async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      message: "Admin only",
    });
  }

  const users = await User.find({ role: "subuser" }).select("-password");
  res.json(users);
};

/*DELETE SUB USER (ADMIN)*/
export const deleteSubUser = async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      message: "Admin only",
    });
  }

  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "User deleted" });
};
