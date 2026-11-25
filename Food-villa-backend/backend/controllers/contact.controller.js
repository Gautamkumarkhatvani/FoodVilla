import Contact from "../models/contact.js";

/* CREATE CONTACT (PUBLIC) */
export const createContact = async (req, res) => {
  try {
    const { name, email, mobile, message } = req.body;

    if (!name || !email || !mobile || !message) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const contact = await Contact.create({
      name,
      email,
      mobile,
      message,
    });

    return res.status(201).json({
      message: "Message sent successfully",
      contact,
    });
  } catch (error) {
    console.error("CREATE CONTACT ERROR:", error);
    return res.status(500).json({
      message: "Failed to send message",
    });
  }
};

/*GET ALL CONTACTS (ADMIN ONLY) */
export const getContacts = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "Admin access only",
      });
    }

    const contacts = await Contact.find().sort({
      createdAt: -1,
    });

    return res.json(contacts);
  } catch (error) {
    console.error("GET CONTACT ERROR:", error);
    return res.status(500).json({
      message: "Failed to fetch contacts",
    });
  }
};

/* DELETE CONTACT (ADMIN ONLY)*/
export const deleteContact = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "Admin access only",
      });
    }

    const deleted = await Contact.findByIdAndDelete(
      req.params.id
    );

    if (!deleted) {
      return res.status(404).json({
        message: "Contact not found",
      });
    }

    return res.json({
      message: "Contact deleted successfully",
    });
  } catch (error) {
    console.error("DELETE CONTACT ERROR:", error);
    return res.status(500).json({
      message: "Failed to delete contact",
    });
  }
};
