const express = require('express');
const router = express.Router();
const axios = require('axios');

const AVIATION_STACK_KEY = process.env.AVIATION_STACK_API_KEY;
const AVIATION_STACK_BASE = 'http://api.aviationstack.com/v1';

/**
 * GET /api/tracking/live?flight=6E123
 * Real-time flight tracking via AviationStack
 */
router.get('/live', async (req, res) => {
  try {
    const { flight, pnr } = req.query;

    if (!flight) {
      return res.status(400).json({ error: 'Flight number required' });
    }

    console.log(`[Tracking Service] Tracking flight: ${flight}`);

    const response = await axios.get(`${AVIATION_STACK_BASE}/flights`, {
      params: {
        access_key: AVIATION_STACK_KEY,
        flight_iata: flight,
      },
    });

    const flights = response.data?.data || [];

    if (flights.length === 0) {
      return res.json({
        success: true,
        telemetry: {
          flightStr: flight,
          pnrTag: pnr || 'N/A',
          status: 'not_found',
          message: 'No active flight found with this number',
        },
      });
    }

    const f = flights[0];

    const telemetry = {
      flightStr: f.flight?.iata || flight,
      pnrTag: pnr || 'N/A',
      status: f.flight_status || 'unknown',
      airline: f.airline?.name || 'Unknown',
      airlineIata: f.airline?.iata || '',
      departure: {
        airport: f.departure?.airport || '',
        iata: f.departure?.iata || '',
        terminal: f.departure?.terminal || '',
        gate: f.departure?.gate || '',
        scheduled: f.departure?.scheduled || '',
        actual: f.departure?.actual || '',
        delay: f.departure?.delay || 0,
      },
      arrival: {
        airport: f.arrival?.airport || '',
        iata: f.arrival?.iata || '',
        terminal: f.arrival?.terminal || '',
        gate: f.arrival?.gate || '',
        scheduled: f.arrival?.scheduled || '',
        actual: f.arrival?.actual || '',
        delay: f.arrival?.delay || 0,
      },
      live: f.live ? {
        latitude: f.live.latitude,
        longitude: f.live.longitude,
        altitude: f.live.altitude,
        speed: f.live.speed_horizontal,
        heading: f.live.direction,
        updated: f.live.updated,
        isGround: f.live.is_ground,
      } : null,
      lastContact: new Date().toISOString(),
    };

    res.json({ success: true, telemetry });
  } catch (error) {
    console.error('[Tracking Service] Error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Flight tracking failed' });
  }
});

/**
 * GET /api/tracking/airlines
 * Get all Indian airlines
 */
router.get('/airlines', async (req, res) => {
  try {
    const airlines = [
      { name: 'IndiGo', iata: '6E', icao: 'IGO', type: 'Low Cost', hub: 'DEL' },
      { name: 'Air India', iata: 'AI', icao: 'AIC', type: 'Full Service', hub: 'DEL' },
      { name: 'SpiceJet', iata: 'SG', icao: 'SEJ', type: 'Low Cost', hub: 'DEL' },
      { name: 'Vistara', iata: 'UK', icao: 'VTI', type: 'Full Service', hub: 'DEL' },
      { name: 'Go First', iata: 'G8', icao: 'GOW', type: 'Low Cost', hub: 'BOM' },
      { name: 'AirAsia India', iata: 'I5', icao: 'IAD', type: 'Low Cost', hub: 'BLR' },
      { name: 'Alliance Air', iata: '9I', icao: 'LLR', type: 'Regional', hub: 'DEL' },
      { name: 'Star Air', iata: 'OG', icao: 'SDG', type: 'Regional', hub: 'BLR' },
      { name: 'Akasa Air', iata: 'QP', icao: 'AKJ', type: 'Low Cost', hub: 'BOM' },
      { name: 'FlyBig', iata: 'S9', icao: 'FLY', type: 'Regional', hub: 'IDR' },
    ];

    res.json({ success: true, data: airlines });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get airlines data' });
  }
});

module.exports = router;
