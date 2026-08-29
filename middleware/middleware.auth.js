import jwt from "jsonwebtoken";

// Middleware to check if user is an admin
export function requireAdmin(req, res, next) {
  // Get authorization header from request
  const authHeader = req.headers.authorization;

  // Check if header exists and has correct format "Bearer <token>"
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  // Extract the token part (after "Bearer ")
  const token = authHeader.split(" ")[1];

  try {
    // Verify token and decode the data inside it
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if user has admin role
    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }

    // Save user info to request for next middleware/controller
    req.user = decoded;

    // User is admin, continue to next function
    next();
  } catch (err) {
    // Token is invalid or expired
    return res.status(401).json({ message: "Invalid token" });
  }
}
