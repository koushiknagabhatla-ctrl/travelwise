const express = require('express');
const router = express.Router();
// const Amadeus = require('amadeus');

// Initialize Amadeus (Requires Real API Keys in Production)
/*
const amadeus = new Amadeus({
  clientId: process.env.AMADEUS_CLIENT_ID,
  clientSecret: process.env.AMADEUS_CLIENT_SECRET
});
*/

/**
 * PATH: /api/search
 * DESCRIPTION: Queries the Amadeus API for flights or RailYatri API for trains.
 * Uses a Redis cache (simulated here) to drop 5-minute TTL locks on identical searches to save API quota.
 */
router.get('/', async (req, res) => {
  try {
    const { mode, carrier, from, to, date, pax } = req.query;

    console.log(`[Search Microservice] Request triggered: ${mode} via ${carrier} from ${from} to ${to}`);

    // In a real execution, we would hit Redis first to check for `search:${from}:${to}:${date}` pattern.

    // ── SIMULATED AMADEUS/RAIL API RESPONSE ──
    // Generating flight grids dynamically based on search params to simulate the massive Amadeus payloads
    const results = [];
    
    // Create 3 deterministic results covering different times and seat classes
    for (let i = 1; i <= 3; i++) {
        results.push({
            id: `amadeus-offer-${Date.now()}-${i}`,
            mode: mode || 'flights',
            carrier: carrier || 'IndiGo',
            flightNumber: mode === 'flights' ? `${carrier.substring(0,2).toUpperCase()}-${300 + i}` : `1295${i} Exp`,
            departure: '08:00 AM', // Simulated parsing of Amadeus ISO strings
            arrival: '10:30 AM',
            duration: '2h 30m',
            stops: i === 3 ? '1 Stop' : 'Direct',
            onTimeRating: '94%',
            baggage: mode === 'flights' ? '15kg Cabin, 7kg Hand' : 'Unrestricted',
            classes: [
                { name: 'Economy', price: 4500 + (i * 500) },
                { name: 'Business', price: 12500 + (i * 1000) }
            ]
        });
    }

    res.json({
        success: true,
        source: mode === 'flights' ? 'Amadeus API' : 'RailYatri API',
        cached: false, // Simulated Redis Miss
        data: results
    });

  } catch (error) {
    console.error('[Search Microservice] Failed Amadeus Interrogation:', error);
    res.status(500).json({ error: 'Failed to access remote reservation database.' });
  }
});

module.exports = router;
