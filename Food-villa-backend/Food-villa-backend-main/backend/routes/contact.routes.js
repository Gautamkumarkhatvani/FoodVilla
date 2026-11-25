import express from "express";
import {
  createContact,
  getContacts,
  deleteContact,
} from "../controllers/contact.controller.js";

import {
  protect,
  adminOnly,
} from "../middleware/auth.middleware.js";

const router = express.Router();

/*PUBLIC – CONTACT FORM*/
router.post("/", createContact);

/*ADMIN ONLY*/
router.get("/", protect, adminOnly, getContacts);
router.delete("/:id", protect, adminOnly, deleteContact);

export default router;
