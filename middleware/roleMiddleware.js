const roleMiddleware = (roles) => {
    return (req, res, next) => {
      const userRole = req.user.role; // Assuming the user role is stored in the JWT payload
      if (roles.includes(userRole)) {
        next(); // User has the required role
      } else {
        res.status(403).json({ message: "Access denied. Insufficient permissions." });
      }
    };
  };
  
  module.exports = roleMiddleware;