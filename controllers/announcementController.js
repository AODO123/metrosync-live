import { createAnnouncement } from "../services/announcementService.js";
import { getIo } from "../sockets/ioInstance.js";

// POST /api/v1/stations/:id/announcements - Create a new announcement
export async function createAnnouncementController(req, res, next) {
  try {
    // Get station ID from URL parameter
    const stationId = req.params.id;

    // Get announcement text from request body
    const { text } = req.body;

    // Create announcement in database
    const announcement = await createAnnouncement(stationId, text);

    // Get socket.io instance to send real-time updates
    const io = getIo();

    // If socket.io is available, broadcast the announcement to everyone in this station's room
    if (io) {
      io.to(`station:${stationId}`).emit("announcement", announcement);
    }

    // Send success response with the new announcement
    res.status(201).json(announcement);
  } catch (err) {
    // Pass any errors to error handler
    next(err);
  }
}
