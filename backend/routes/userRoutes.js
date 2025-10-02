import express from "express";
import User from "../models/userModel.js";

const router = express.Router();

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get("/profile", async (req, res) => {
  try {
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
    res.json({ message: "Profile update route" });
  } catch (err) {
    console.error("Error updating profile:", err.message);
    res.status(500).send("Server error");
  }
});

// @route   GET /api/users/stats
// @desc    Get user statistics
// @access  Private
router.get("/stats", async (req, res) => {
  try {
    // مؤقتًا نرسل رسالة تجريبية
    res.json({ totalUsers: 100, activeUsers: 80 });
  } catch (err) {
    console.error("Error getting stats:", err.message);
    res.status(500).send("Server error");
  }
});

export default router;
