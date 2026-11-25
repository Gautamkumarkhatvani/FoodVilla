import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import User from "../models/User.js";
import Customer from "../models/customer.js";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/* ===================================================
   ADMIN / SUBUSER LOGIN
=================================================== */
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    /* ===== ADMIN LOGIN ===== */
    if (
      username === process.env.ADMIN_USERNAME &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign(
        { id: "admin", role: "admin" },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      return res.json({
        token,
        user: {
          username,
          role: "admin",
        },
      });
    }

    /* ===== SUB USER LOGIN ===== */
    const user = await User.findOne({ username });

    if (!user || user.password !== password) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.json({
      token,
      user: {
        _id: user._id,
        username: user.username,
        role: user.role,
        permissions: user.permissions,
      },
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return res.status(500).json({
      message: "Login failed",
    });
  }
};

/* ===================================================
   GOOGLE CUSTOMER LOGIN
=================================================== */
export const googleLogin = async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({
        message: "Google credential missing",
      });
    }

    /* ===== VERIFY GOOGLE TOKEN ===== */
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    const { sub, email, name } = payload;

    /* ===== CHECK IF CUSTOMER EXISTS ===== */
    let customer = await Customer.findOne({ email });

    if (!customer) {
      customer = await Customer.create({
        googleId: sub,
        name,
        email,
      });
    }

    /* ===== CREATE JWT (2 DAYS) ===== */
    const token = jwt.sign(
      { id: customer._id, role: "customer" },
      process.env.JWT_SECRET,
      { expiresIn: "2d" }
    );

    return res.json({
      token,
      user: {
        id: customer._id,
        name: customer.name,
        email: customer.email,
        role: "customer",
        isVerified: customer.isVerified,
      },
    });
  } catch (error) {
    console.error("GOOGLE LOGIN ERROR:", error);
    return res.status(500).json({
      message: "Google login failed",
    });
  }
};
