# Production Dockerfile for TravelWise Backend API Gateway

FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies and Prisma
COPY package*.json ./
COPY prisma ./prisma/
RUN npm install
RUN npx prisma generate

# Copy source code
COPY . .

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy built assets and necessary files
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma
COPY . .

# Environment variables
ENV NODE_ENV=production
ENV PORT=5002

EXPOSE 5002

# Startup command
CMD ["npm", "start"]
