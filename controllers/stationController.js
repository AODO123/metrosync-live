import { getAllStations } from "../services/stationService.js";
import { getAnnouncementsForStation } from "../services/announcementService.js";

// GET /api/v1/stations - Get list of all stations
export async function listStations(req, res, next) {
  try {
    const stations = await getAllStations();
    res.status(200).json(stations);
  } catch (err) {
    next(err);
  }
}

// GET /api/v1/stations/:id/announcements - Get all announcements for a station
export async function stationAnnouncements(req, res, next) {
  try {
    const { id } = req.params;
    const { page = 1, limit = 50, from, to } = req.query;

    // Delegate to announcement service to fetch paged, newest-first
    // Supports pagination (page/limit) and time filtering (from/to)
    const announcements = await getAnnouncementsForStation(id, {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      from,
      to,
    });

    res.status(200).json(announcements);
  } catch (err) {
    next(err);
  }
}
