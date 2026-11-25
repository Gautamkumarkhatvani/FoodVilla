import mongoose from "mongoose";

const permissionSchema = new mongoose.Schema(
  {
    add: {
      type: Boolean,
      default: false,
    },
    view: {
      type: Boolean,
      default: true,
    },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["admin", "subuser"],
      default: "subuser",
    },

    permissions: {
      kitchen: { type: permissionSchema, default: () => ({}) },
      taste: { type: permissionSchema, default: () => ({}) },
      recipe: { type: permissionSchema, default: () => ({}) },
      blog: { type: permissionSchema, default: () => ({}) },
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;
