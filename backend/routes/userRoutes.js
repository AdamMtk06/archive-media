import express from "express";
import User from "../models/userModel.js";

const router = express.Router();

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get("/profile", async (req, res) => {
  try {
    // هذا مسار مؤقت، سنحتاج إلى إضافة المصادقة لاحقًا
    res.json({ message: "Profile route" });
  } catch (err) {
    console.error("Error getting profile:", err.message);
    res.status(500).send("Server error");
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put("/profile", async (req, res) => {
  try {
    // هذا مسار مؤقت، سنحتاج إلى إضافة المصادقة لاحقًا
    res.json({ message: "Profile update route" });
  } catch (err) {
    console.error("Error updating profile:", err.message);
    res.status(500).send("Server error");
  }
});

export default router;