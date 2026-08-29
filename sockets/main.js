// Import function to save socket.io instance
import { setIo } from "./ioInstance.js";

// Track how many viewers are watching each station room
const viewerCounts = new Map(); // stationId -> count

// Helper to get the socket room name for a station
function roomName(stationId) {
  return `station:${stationId}`;
}

// Helper to update viewer count for a room and broadcast it
function broadcastPresence(io, stationId) {
  const room = io.sockets.adapter.rooms.get(roomName(stationId));
  const count = room ? room.size : 0;

  // Update our tracking map
  viewerCounts.set(stationId, count);

  // Tell everyone in the room the current viewer count
  io.to(roomName(stationId)).emit("presenceUpdate", {
    stationId,
    watchers: count,
  });
}

// Main function to set up all socket events
export default function setupSockets(io) {
  // Save io instance so other files can use it
  setIo(io);

  // Listen for new socket connections
  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    // Track which station this socket is currently in
    let currentStation = null;

    // When a user joins a station room
    socket.on("joinStation", (stationId) => {
      // If they were in a different room, leave it first
      if (currentStation && currentStation !== stationId) {
        socket.leave(roomName(currentStation));
        // Broadcast updated count to the old room
        broadcastPresence(io, currentStation);
      }

      // Join the new station room
      currentStation = stationId;
      socket.join(roomName(stationId));

      // Broadcast updated viewer count to the new room
      broadcastPresence(io, stationId);
    });

    // When a user leaves a station room (e.g. switches stations)
    socket.on("leaveStation", (stationId) => {
      if (currentStation === stationId) {
        socket.leave(roomName(stationId));
        currentStation = null;
        // Broadcast updated viewer count
        broadcastPresence(io, stationId);
      }
    });

    // When socket disconnects (user closes browser/tab)
    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);

      // If the socket was in a station room, update that room's viewer count
      if (currentStation) {
        broadcastPresence(io, currentStation);
      }
    });
  });
}
