const express = require("express");
const authenticateUser = require("../middleware/auth");
const roleMiddleware = require("../middleware/roleMiddleware");
const User = require("../models/User");
const router = express.Router();

// Get all employees (Only for Admins/Managers)
router.get(
  "/",
  authenticateUser,
  roleMiddleware(["Administrator", "Manager"]),
  async (req, res) => {
    try {
      const employees = await User.find({ role: "Employee" }).select(
        "-password"
      ); // Exclude passwords
      res.json(employees);
    } catch (err) {
      res
        .status(500)
        .json({ message: "Failed to fetch employees", error: err.message });
    }
  }
);

module.exports = router;
