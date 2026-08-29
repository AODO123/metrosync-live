import express from "express";
import { listStations, stationAnnouncements } from "../controllers/stationController.js";
import { createAnnouncementController } from "../controllers/announcementController.js";
import { requireAdmin } from "../middleware/middleware.auth.js";
import { validateAnnouncement, handleValidation } from "../middleware/validation.js";

// Create router for station routes
const router = express.Router();

// GET /api/v1/stations - Get all stations (anyone can access)
router.get("/", listStations);

// GET /api/v1/stations/:id/announcements - Get announcements for a station (public)
router.get("/:id/announcements", stationAnnouncements);

// POST /api/v1/stations/:id/announcements - Create announcement (admin only)
router.post(
  "/:id/announcements",
  requireAdmin,
  validateAnnouncement,
  handleValidation,
  createAnnouncementController
);

export default router;
