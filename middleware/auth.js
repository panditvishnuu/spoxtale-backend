const jwt = require("jsonwebtoken");
const User = require("../models/User"); // Adjust the path based on your project structure

const authenticateUser = async (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1]; // Extract token from header

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token
    req.user = await User.findById(decoded.id).select("-password"); // Attach user to request
    if (!req.user) return res.status(404).json({ message: "User not found" });

    next();
  } catch (error) {
    res.status(401).json({ message: "Token is invalid" });
  }
};

module.exports = authenticateUser;
