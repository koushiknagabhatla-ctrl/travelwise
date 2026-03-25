const { PrismaClient } = require('@prisma/client');

// Singleton pattern to ensure only one Prisma client instance is created
// This is critical for serverless environments (like Neon/Vercel) to avoid connection pool exhaustion.
const prisma = new PrismaClient({
  log: ['error', 'warn'],
});

module.exports = prisma;
