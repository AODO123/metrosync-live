import request from "supertest";
import mongoose from "mongoose";
import app from "../app.js";

// Note: These tests need a running MongoDB (local or Atlas).
// They use the in-memory Express app via Supertest (no real server port needed).

const testToken = process.env.TEST_TOKEN || "";

describe("MetroSync API integration tests", () => {
  beforeAll(async () => {
    // Ensure we have a connection for the tests
    const url = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/metrosync";
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(url);
    }
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe("GET /api/v1/stations", () => {
    it("returns 200 with a JSON array of stations", async () => {
      const res = await request(app).get("/api/v1/stations");
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
    });

    it("returns stations sorted by line then order", async () => {
      const res = await request(app).get("/api/v1/stations");
      const stations = res.body;
      for (let i = 1; i < stations.length; i++) {
        const prev = stations[i - 1];
        const curr = stations[i];
        if (prev.line === curr.line) {
          expect(prev.order).toBeLessThanOrEqual(curr.order);
        } else {
          expect(prev.line).toBeLessThan(curr.line);
        }
      }
    });
  });

  describe("POST /api/v1/auth/login", () => {
    it("returns a token for valid admin credentials", async () => {
      const res = await request(app)
        .post("/api/v1/auth/login")
        .send({ email: "admin@metrosync.com", password: "Admin123!" });
      expect(res.status).toBe(200);
      expect(res.body.token).toBeDefined();
      expect(typeof res.body.token).toBe("string");
    });

    it("rejects invalid credentials with 401", async () => {
      const res = await request(app)
        .post("/api/v1/auth/login")
        .send({ email: "admin@metrosync.com", password: "wrongpassword" });
      expect(res.status).toBe(401);
    });

    it("rejects missing email with 400", async () => {
      const res = await request(app)
        .post("/api/v1/auth/login")
        .send({ password: "Admin123!" });
      expect(res.status).toBe(400);
    });
  });

  describe("Protected announcement routes", () => {
    it("returns 401 when posting announcement without a token", async () => {
      const res = await request(app)
        .post("/api/v1/stations/sadat/announcements")
        .send({ text: "Test announcement" });
      expect(res.status).toBe(401);
    });

    it("returns 401 for an invalid token", async () => {
      const res = await request(app)
        .post("/api/v1/stations/sadat/announcements")
        .set("Authorization", "Bearer invalid.token.here")
        .send({ text: "Test announcement" });
      expect(res.status).toBe(401);
    });

    it("returns 400 for empty announcement text with a valid token", async () => {
      // Get a real token first
      const loginRes = await request(app)
        .post("/api/v1/auth/login")
        .send({ email: "admin@metrosync.com", password: "Admin123!" });
      const token = loginRes.body.token;

      const res = await request(app)
        .post("/api/v1/stations/sadat/announcements")
        .set("Authorization", "Bearer " + token)
        .send({ text: "" });
      expect(res.status).toBe(400);
    });

    it("creates an announcement with a valid token and returns 201", async () => {
      const loginRes = await request(app)
        .post("/api/v1/auth/login")
        .send({ email: "admin@metrosync.com", password: "Admin123!" });
      const token = loginRes.body.token;

      const res = await request(app)
        .post("/api/v1/stations/sadat/announcements")
        .set("Authorization", "Bearer " + token)
        .send({ text: "Integration test announcement" });
      expect(res.status).toBe(201);
      expect(res.body.text).toBe("Integration test announcement");
      expect(res.body.stationId).toBe("sadat");
    });
  });

  describe("GET /api/v1/stations/:id/announcements", () => {
    it("returns 200 with an array of announcements for a valid station", async () => {
      const res = await request(app).get("/api/v1/stations/sadat/announcements");
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it("supports pagination via limit and page query params", async () => {
      const res = await request(app).get(
        "/api/v1/stations/sadat/announcements?limit=1&page=1"
      );
      expect(res.status).toBe(200);
      expect(res.body.length).toBeLessThanOrEqual(1);
    });
  });

  describe("GET /health", () => {
    it("returns ok status", async () => {
      const res = await request(app).get("/health");
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ status: "ok" });
    });
  });
});
