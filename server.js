// Import packages we need
import http from "http";
import { Server } from "socket.io";
import app from "./app.js";
import { connectDB } from "./config/db.js";
import { ensureAdminSeed } from "./services/authService.js";
import setupSockets from "./sockets/main.js";

// Create HTTP server using our Express app
const server = http.createServer(app);

// Create Socket.IO server for real-time communication
// Allow same-origin connections (frontend is served from this same server)
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins since this is a public dashboard
    methods: ["GET", "POST"],
  },
});

// Set up all socket event listeners (join, leave, etc.)
setupSockets(io);

// Connect to MongoDB, then create the default admin user
connectDB()
  .then(ensureAdminSeed)
  .catch((err) => {
    console.error("Failed during database setup:", err.message);
  });

// Get port from environment or use 3000 as default
const PORT = process.env.PORT || 3000;

// Start the server and listen for requests
server.listen(PORT, () => {
  console.log("MetroSync Live running at http://localhost:" + PORT);
});
