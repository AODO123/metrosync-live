// Import packages we need
import dotenv from "dotenv";
import cors from "cors";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/authRoutes.js";
import stationRoutes from "./routes/stationRoutes.js";

// Load environment variables from .env file
dotenv.config();

// Get current file and directory paths (needed for ES modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create Express application
const app = express();

// Allow requests from other websites (CORS)
app.use(cors());

// Parse incoming JSON data in request bodies
app.use(express.json());

// Serve static files (HTML, CSS, JS) from public folder
app.use(express.static(path.join(__dirname, "public")));

// Set up authentication routes (login, etc.)
app.use("/api/v1/auth", authRoutes);

// Set up station routes (get stations, announcements, etc.)
app.use("/api/v1/stations", stationRoutes);

// Health check endpoint to test if server is running
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// 404 handler for unknown API routes
app.use("/api", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Central error handler - catches any errors and sends a consistent JSON response
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    message: err.message || "Internal server error",
  });
});

export default app;
