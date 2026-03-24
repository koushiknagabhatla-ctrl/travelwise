const express = require('express');
const router = express.Router();

/**
 * PATH: /api/tracking/live
 * DESCRIPTION: Polls the OpenSky Network REST API (simulated for deterministic local testing)
 * to stream aircraft geographic vectors to the React client every 30 seconds.
 */
router.get('/live', (req, res) => {
  try {
    const { pnr, flightId } = req.query;
    
    // Simulate real-time ADS-B transponder data from OpenSky
    // In production, interpolations track true GPS altitudes and heading.
    const timeFactor = Math.abs(Math.sin(Date.now() / 100000));
    const currentLat = 19.0896 + (timeFactor * (28.5562 - 19.0896)); // Interpolating BOM -> DEL
    const currentLng = 72.8656 + (timeFactor * (77.1000 - 72.8656));

    const mockOpenSkyFeed = {
      flightStr: flightId || 'IG-305',
      pnrTag: pnr || 'AWT6XY',
      velocity: Math.floor(850 + (Math.random() * 50)), // Kmph
      altitude: Math.floor(35000 + (Math.random() * 2000)), // ft
      heading: 42.5,
      coordinates: [currentLng, currentLat], // GeoJSON standard [lng, lat]
      eta: '45 mins',
      lastContact: new Date().toISOString()
    };

    res.json({ success: true, telemetry: mockOpenSkyFeed });

  } catch (error) {
    console.error('[Tracking Microservice] Failed OpenSky Handshake:', error);
    res.status(500).json({ error: 'Loss of signal with satellite transponder data.' });
  }
});

module.exports = router;
