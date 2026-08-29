import { login } from "../services/authService.js";

// POST /api/v1/auth/login - Handle login requests
export async function loginController(req, res, next) {
  try {
    // Get email and password from request body
    const { email, password } = req.body;

    // Try to login with provided credentials
    const result = await login(email, password);

    // If login failed (wrong email or password)
    if (!result) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Login successful, send back token and user info
    res.status(200).json(result);
  } catch (err) {
    // Pass any errors to error handler
    next(err);
  }
}
