import User from "../models/User.js";

const permission = (module) => {
  return async (req, res, next) => {
    try {
      /* ADMIN FULL ACCESS*/
      if (req.user?.role === "admin") {
        return next();
      }

      /*RESOLVE USER ID*/
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({
          message: "Invalid user token",
        });
      }

      /*LOAD USER FROM DB*/
      const user = await User.findById(userId).lean();
      if (!user) {
        return res.status(401).json({
          message: "User not found",
        });
      }

      /*READ MODULE PERMISSIONS*/
      const perms = user.permissions?.[module];

      /*VIEW (GET) ALLOWED */
      if (req.method === "GET") {
        return next();
      }

      /*ADD (POST) → CHECK add === true*/
      if (req.method === "POST") {
        if (perms?.add === true) {
          return next();
        }
        return res.status(403).json({
          message: "Add permission denied",
        });
      }

      /*EDIT / DELETE → BLOCKED*/
      return res.status(403).json({
        message: "Action not allowed",
      });
    } catch (err) {
      console.error("PERMISSION ERROR:", err);
      return res.status(500).json({
        message: "Permission check failed",
      });
    }
  };
};

export default permission;
