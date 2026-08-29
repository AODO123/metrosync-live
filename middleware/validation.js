import { body, param, validationResult } from "express-validator";

// Check validation results and send a 400 if any failed
export function handleValidation(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: errors.array()[0].msg,
      errors: errors.array(),
    });
  }
  next();
}

// Validators for admin login
export const validateLogin = [
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email must be a valid email address")
    .normalizeEmail(),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];

// Validators for creating an announcement
export const validateAnnouncement = [
  param("id")
    .notEmpty()
    .withMessage("Station id is required")
    .trim(),
  body("text")
    .trim()
    .notEmpty()
    .withMessage("Announcement text is required")
    .isLength({ min: 1, max: 500 })
    .withMessage("Announcement text must be between 1 and 500 characters"),
];
