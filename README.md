# MetroSync Live

Real-time metro information dashboard with live station announcements and viewer tracking.

## Overview

MetroSync is a Node.js/Express + Socket.io backend that powers a real-time metro information system backed by MongoDB. It includes:

- **Passenger view** — browse stations, see live announcements the moment they're posted, without refreshing.
- **Admin panel** — sign in securely and post announcements that broadcast instantly to every passenger watching that station.
- **Live viewer tracking** — see how many people are watching each station in real time.

## Tech Stack

- **Node.js** + **Express** — REST API
- **MongoDB** + **Mongoose** — data layer
- **Socket.io** — real-time rooms, presence, and broadcast
- **JWT** + **bcrypt** — admin authentication
- **express-validator** — request validation
- **express-rate-limit** — login brute-force protection
- **Jest** + **Supertest** — integration tests

## Project Structure

```
├── config/          # Database connection
├── controllers/     # Request handlers (coordinate responses)
├── middleware/      # Auth guard + validation
├── models/          # Mongoose schemas (User, Station, Announcement)
├── public/          # Frontend (passenger + admin pages)
├── routes/          # API route definitions
├── seed/            # Station seeding script
├── services/        # Database logic (only layer that talks to Mongo)
├── sockets/         # Socket.io setup and room handling
└── tests/           # Jest integration tests
```

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Then edit `.env` and set your MongoDB connection string and a JWT secret.

### 3. Seed stations

```bash
npm run seed
```

### 4. Start the server

```bash
npm run dev      # with auto-reload (nodemon)
# or
npm start        # production
```

### 5. Open the app

- Passenger view: http://localhost:3000/passenger.html
- Admin login: http://localhost:3000/

Seeded admin credentials: `admin@metrosync.com` / `Admin123!`

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/health` | None | Health check |
| GET | `/api/v1/stations` | None | List all stations (sorted) |
| GET | `/api/v1/stations/:id/announcements` | None | Announcements for a station (newest first) |
| POST | `/api/v1/auth/login` | None | Admin login, returns JWT |
| POST | `/api/v1/stations/:id/announcements` | Admin | Create an announcement |

### Query params for announcements

- `page` — page number (default 1)
- `limit` — results per page (default 50)
- `from` / `to` — filter by creation time range

## Running Tests

```bash
npm test
```

## Socket Events

| Event | Direction | Payload | Description |
|-------|-----------|---------|-------------|
| `joinStation` | client → server | `stationId` | Join a station's room |
| `leaveStation` | client → server | `stationId` | Leave a station's room |
| `presenceUpdate` | server → client | `{stationId, watchers}` | Live viewer count |
| `announcement` | server → client | announcement object | New announcement broadcast |

## Deployment

The app is designed to run on any Node.js host. It uses MongoDB Atlas as the production database, so there are no local database files to manage.

### Deploying to Koyeb (free tier, WebSockets supported)

1. Create a free account at [app.koyeb.com](https://app.koyeb.com).
2. Click **Create App** → choose **GitHub** → select `AODO123/metrosync-live`.
3. Koyeb reads `koyeb.yml` automatically. Under **Environment variables**, add:
   - `MONGO_URL` — your MongoDB Atlas connection string
   - `JWT_SECRET` — a strong random string
4. Deploy. Once the build finishes, open the public URL and hit `/health`.

The seed script runs once in the Koyeb build, so the stations are loaded on first start.

### Environment variables

| Variable | Description |
|----------|-------------|
| `MONGO_URL` | MongoDB connection string (Atlas or local) |
| `JWT_SECRET` | Secret used to sign admin JWTs |
| `PORT` | Port the server listens on (default `3000`) |
