import mongoose from "mongoose";

// Define structure for Announcement documents in database
const announcementSchema = new mongoose.Schema(
  {
    stationId: { type: String, required: true, index: true }, // Which station this is for (custom station id)
    text: { type: String, required: true, trim: true }, // The announcement message
  },
  { timestamps: true } // Adds createdAt and updatedAt automatically
);

// Index for faster newest-first queries per station
announcementSchema.index({ stationId: 1, createdAt: -1 });

// Export Announcement model (creates "announcements" collection)
export default mongoose.models.Announcement ||
  mongoose.model("Announcement", announcementSchema);
