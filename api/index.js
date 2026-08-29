// Vercel serverless entry point.
// Vercel routes all requests through this handler, which reuses the
// same Express app used for local development (app.js).
import app from "../app.js";

// On serverless platforms (Vercel), server.js is not executed, so we
// make sure the default admin account exists every time the app boots.
// This keeps /api/v1/auth/login working after a cold start.
import { connectDB } from "../config/db.js";
import { ensureAdminSeed } from "../services/authService.js";

let ready = false;

export default async (req, res) => {
  if (!ready) {
    await connectDB();
    await ensureAdminSeed();
    ready = true;
  }
  return app(req, res);
};

