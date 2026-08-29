import express from "express";
import rateLimit from "express-rate-limit";
import { loginController } from "../controllers/authController.js";
import { validateLogin, handleValidation } from "../middleware/validation.js";

// Create router for authentication routes
const router = express.Router();

// Limit login attempts to stop brute-force attacks
// Max 10 attempts per 15 minutes per IP
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 tries
  message: { message: "Too many login attempts. Please try again later." },
  standardHeaders: true, // Send rate limit info in standard headers
  legacyHeaders: false,
});

// POST /api/v1/auth/login - Login endpoint
// Validation runs before any database or auth logic
router.post(
  "/login",
  loginLimiter,
  validateLogin,
  handleValidation,
  loginController
);

export default router;
