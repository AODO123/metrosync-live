# MetroSync Live - Dockerfile for Hugging Face Spaces (Docker SDK)
FROM node:20-alpine

WORKDIR /app

# Install dependencies first to leverage Docker layer caching
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Copy the rest of the source
COPY . .

# Hugging Face Spaces exposes the service on $PORT (defaults to 7860)
ENV PORT=7860
ENV NODE_ENV=production

EXPOSE 7860

# Seed the database and start the server.
# The seed script is idempotent (upserts stations), so it is safe to run on every start.
CMD ["sh", "-c", "npm run seed && node server.js"]
