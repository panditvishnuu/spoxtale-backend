const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { verifyAdmin } = require("../middleware/authMiddleware");

// Get all users (Admin only)
router.get("/users", verifyAdmin, async (req, res) => {
  try {
    const users = await User.find({}, "-password");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Update user role (Admin only)
router.put("/users/:id/role", verifyAdmin, async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    user.role = role;
    await user.save();

    res.status(200).json({ message: "User role updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Delete user (Admin only)
router.delete("/users/:id", verifyAdmin, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
