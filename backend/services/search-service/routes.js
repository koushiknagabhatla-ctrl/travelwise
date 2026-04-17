const express = require('express');
const router = express.Router();
const axios = require('axios');

const DUFFEL_API_KEY = process.env.DUFFEL_API_KEY;
const DUFFEL_BASE = 'https://api.duffel.com';

const duffelHeaders = {
  'Authorization': `Bearer ${DUFFEL_API_KEY}`,
  'Duffel-Version': 'v2',
  'Content-Type': 'application/json',
  'Accept': 'application/json',
};

/**
 * POST /api/search/offers
 * Create an offer request via Duffel API for real flight data
 */
router.post('/offers', async (req, res) => {
  try {
    const { from, to, date, pax, cabinClass, returnDate } = req.body;

    console.log(`[Search Service] Duffel search: ${from} → ${to} on ${date}`);

    const slices = [
      {
        origin: from,
        destination: to,
        departure_date: date,
      },
    ];

    if (returnDate) {
      slices.push({
        origin: to,
        destination: from,
        departure_date: returnDate,
      });
    }

    const passengers = [];
    const passengerCount = parseInt(pax) || 1;
    for (let i = 0; i < passengerCount; i++) {
      passengers.push({ type: 'adult' });
    }

    const response = await axios.post(
      `${DUFFEL_BASE}/air/offer_requests`,
      {
        data: {
          slices,
          passengers,
          cabin_class: cabinClass || 'economy',
          return_offers: true,
          max_connections: 1,
        },
      },
      { headers: duffelHeaders }
    );

    const offers = response.data.data.offers || [];

    // Format offers for frontend
    const formattedOffers = offers.slice(0, 20).map((offer) => {
      const slice = offer.slices[0];
      const segments = slice?.segments || [];
      const firstSeg = segments[0];
      const lastSeg = segments[segments.length - 1];

      return {
        id: offer.id,
        totalAmount: offer.total_amount,
        totalCurrency: offer.total_currency,
        airline: firstSeg?.marketing_carrier?.name || 'Unknown',
        airlineLogo: firstSeg?.marketing_carrier?.logo_symbol_url || '',
        airlineCode: firstSeg?.marketing_carrier?.iata_code || '',
        flightNumber: `${firstSeg?.marketing_carrier?.iata_code || ''}${firstSeg?.marketing_carrier_flight_number || ''}`,
        departure: firstSeg?.departing_at || '',
        arrival: lastSeg?.arriving_at || '',
        origin: firstSeg?.origin?.iata_code || from,
        originCity: firstSeg?.origin?.city_name || from,
        destination: lastSeg?.destination?.iata_code || to,
        destinationCity: lastSeg?.destination?.city_name || to,
        duration: slice?.duration || '',
        stops: segments.length - 1,
        cabinClass: offer.slices[0]?.segments[0]?.passengers[0]?.cabin_class_marketing_name || 'Economy',
        baggages: offer.slices[0]?.segments[0]?.passengers[0]?.baggages || [],
        conditions: offer.conditions || {},
        passengers: offer.passengers || [],
      };
    });

    res.json({
      success: true,
      count: formattedOffers.length,
      data: formattedOffers,
    });
  } catch (error) {
    console.error('[Search Service] Duffel Error:', error.response?.data || error.message);
    res.status(500).json({
      error: 'Failed to search flights',
      details: error.response?.data?.errors || error.message,
    });
  }
});

/**
 * GET /api/search
 * Legacy search endpoint — redirects to Duffel
 */
router.get('/', async (req, res) => {
  try {
    const { from, to, date, pax, carrier } = req.query;

    // Redirect to Duffel search
    const slices = [{ origin: from, destination: to, departure_date: date }];
    const passengers = [];
    for (let i = 0; i < (parseInt(pax) || 1); i++) {
      passengers.push({ type: 'adult' });
    }

    const response = await axios.post(
      `${DUFFEL_BASE}/air/offer_requests`,
      {
        data: {
          slices,
          passengers,
          cabin_class: 'economy',
          return_offers: true,
          max_connections: 1,
        },
      },
      { headers: duffelHeaders }
    );

    const offers = response.data.data.offers || [];

    const results = offers.slice(0, 15).map((offer) => {
      const slice = offer.slices[0];
      const seg = slice?.segments[0];
      const lastSeg = slice?.segments[slice.segments.length - 1];

      return {
        id: offer.id,
        mode: 'flights',
        carrier: seg?.marketing_carrier?.name || carrier || 'Airline',
        flightNumber: `${seg?.marketing_carrier?.iata_code || ''}${seg?.marketing_carrier_flight_number || ''}`,
        departure: seg?.departing_at ? new Date(seg.departing_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : 'N/A',
        arrival: lastSeg?.arriving_at ? new Date(lastSeg.arriving_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : 'N/A',
        duration: slice?.duration || 'N/A',
        stops: (slice?.segments?.length || 1) - 1 === 0 ? 'Direct' : `${(slice?.segments?.length || 1) - 1} Stop`,
        onTimeRating: '—',
        baggage: seg?.passengers?.[0]?.baggages?.map(b => `${b.quantity}x ${b.type}`).join(', ') || 'Check airline',
        classes: [
          { name: seg?.passengers?.[0]?.cabin_class_marketing_name || 'Economy', price: parseFloat(offer.total_amount) || 0 },
        ],
        totalAmount: offer.total_amount,
        currency: offer.total_currency,
      };
    });

    res.json({ success: true, source: 'Duffel API', cached: false, data: results });
  } catch (error) {
    console.error('[Search Service] Error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Flight search failed', details: error.response?.data?.errors });
  }
});

module.exports = router;
