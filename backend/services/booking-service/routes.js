const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const redis = require('redis');

const prisma = new PrismaClient();

// Connect to simulated InMemory Redis Map (Removes Docker Dependency for User)
const memoryCache = new Map();
const redisClient = {
  get: async (key) => memoryCache.get(key),
  setEx: async (key, ttl, value) => { memoryCache.set(key, value); setTimeout(() => memoryCache.delete(key), ttl * 1000); },
  del: async (key) => memoryCache.delete(key)
};

/**
 * PATH: /api/booking/lock
 * DESCRIPTION: Leverages Redis TTL to temporarily lock a seat for 10 minutes.
 * Prevents double-booking race conditions during the payment flow.
 */
router.post('/lock', async (req, res) => {
  try {
    const { flightId, seats, userId } = req.body;
    
    // Simulate Redis Lock Flow
    const lockResults = [];
    for (const seat of seats) {
      const lockKey = `seat_lock:${flightId}:${seat}`;
      const isLocked = await redisClient.get(lockKey);
      
      if (isLocked && isLocked !== userId) {
        return res.status(409).json({ error: `Seat ${seat} is currently held by another user. Please choose another.` });
      }

      // Lock the seat for 10 minutes (600 seconds)
      await redisClient.setEx(lockKey, 600, userId || 'anonymous');
      lockResults.push(seat);
    }

    res.json({ success: true, message: 'Seats successfully locked for 10 minutes.', locked: lockResults });

  } catch (error) {
    console.error('[Booking Microservice] Redis Lock Error:', error);
    res.status(500).json({ error: 'Failed to establish distributed seat lock.' });
  }
});

/**
 * PATH: /api/booking/create
 * DESCRIPTION: Commits a final booking to PostgreSQL via Prisma after successful payment.
 */
router.post('/create', async (req, res) => {
  try {
    const { userId, pnr, operatorMode, operatorNo, origin, destination, totalFare, seats } = req.body;

    const booking = await prisma.booking.create({
      data: {
        userId,
        pnr: pnr || `PNR${Date.now()}`,
        operatorMode,
        operatorNo,
        origin,
        destination,
        totalFare: parseFloat(totalFare),
        seats: {
          create: seats.map(s => ({ seatIdentifier: s, class: 'Economy' })) // simplified for demo
        }
      },
      include: { seats: true }
    });

    // Release Redis Locks Early Since Postgres is Updated
    for (const seat of seats) {
        await redisClient.del(`seat_lock:${operatorNo}:${seat}`);
    }

    res.json({ success: true, booking });
  } catch (error) {
    console.error('[Booking Microservice] Database Commitment Error:', error);
    res.status(500).json({ error: 'Failed to persist booking data into PostgreSQL relation.' });
  }
});

module.exports = router;
