import Announcement from "../models/Announcement.js";

// Get all announcements for a specific station (newest first)
// Supports pagination via page/limit and time-range filtering via from/to
export async function getAnnouncementsForStation(stationId, options = {}) {
  const page = options.page || 1;
  const limit = options.limit || 50;

  // Build filter query based on provided options
  const filter = { stationId };

  // Optional time-range filtering (e.g. ?from=<date>&to=<date>)
  if (options.from || options.to) {
    filter.createdAt = {};
    if (options.from) filter.createdAt.$gte = new Date(options.from);
    if (options.to) filter.createdAt.$lte = new Date(options.to);
  }

  // Query with newest first, apply pagination
  const announcements = await Announcement.find(filter)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();

  return announcements;
}

// Create a new announcement for a station
export async function createAnnouncement(stationId, text) {
  // Create announcement in database
  const doc = await Announcement.create({ stationId, text });

  // Convert to plain JavaScript object and return
  return doc.toObject();
}
