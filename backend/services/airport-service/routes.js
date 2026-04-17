const express = require('express');
const router = express.Router();
const axios = require('axios');

const AIRPORT_DB_API_KEY = process.env.AIRPORT_DB_API_KEY;
const AIRPORT_DB_BASE = 'https://airportdb.io/api/v1';

/**
 * GET /api/airports/search?q=del
 * Search airports by name, city, or IATA code
 */
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.length < 2) {
      return res.json({ success: true, data: [] });
    }

    const response = await axios.get(
      `${AIRPORT_DB_BASE}/airports?apiToken=${AIRPORT_DB_API_KEY}&limit=20`,
    );

    // Filter results matching query
    const airports = (response.data?.items || []).filter(
      (a) =>
        a.iata_code &&
        (a.name?.toLowerCase().includes(q.toLowerCase()) ||
          a.municipality?.toLowerCase().includes(q.toLowerCase()) ||
          a.iata_code?.toLowerCase().includes(q.toLowerCase()))
    );

    res.json({
      success: true,
      data: airports.map((a) => ({
        code: a.iata_code,
        name: a.name,
        city: a.municipality || '',
        country: a.iso_country || '',
        lat: a.latitude_deg,
        lng: a.longitude_deg,
        type: a.type,
        elevation: a.elevation_ft,
      })),
    });
  } catch (error) {
    console.error('[Airport Service] Search error:', error.message);
    res.status(500).json({ error: 'Airport search failed' });
  }
});

/**
 * GET /api/airports/:iata
 * Get detailed airport info by IATA code
 */
router.get('/:iata', async (req, res) => {
  try {
    const { iata } = req.params;
    const response = await axios.get(
      `${AIRPORT_DB_BASE}/airports/${iata.toUpperCase()}?apiToken=${AIRPORT_DB_API_KEY}`
    );

    const a = response.data;
    res.json({
      success: true,
      data: {
        code: a.iata_code,
        icao: a.icao_code,
        name: a.name,
        city: a.municipality,
        country: a.iso_country,
        continent: a.continent,
        lat: a.latitude_deg,
        lng: a.longitude_deg,
        elevation: a.elevation_ft,
        type: a.type,
        website: a.home_link || '',
        wikipedia: a.wikipedia_link || '',
        runways: a.runways || [],
        frequencies: a.freqs || [],
      },
    });
  } catch (error) {
    console.error('[Airport Service] Detail error:', error.message);
    res.status(500).json({ error: 'Failed to get airport details' });
  }
});

/**
 * GET /api/airports
 * Get all major Indian airports (with comprehensive data)
 */
router.get('/', async (req, res) => {
  try {
    // Comprehensive Indian airports data
    const INDIAN_AIRPORTS = [
      { code: 'DEL', name: 'Indira Gandhi International Airport', city: 'New Delhi', state: 'Delhi', terminals: 3, lat: 28.5562, lng: 77.1000, type: 'large_airport' },
      { code: 'BOM', name: 'Chhatrapati Shivaji Maharaj International Airport', city: 'Mumbai', state: 'Maharashtra', terminals: 2, lat: 19.0896, lng: 72.8656, type: 'large_airport' },
      { code: 'BLR', name: 'Kempegowda International Airport', city: 'Bengaluru', state: 'Karnataka', terminals: 2, lat: 13.1986, lng: 77.7066, type: 'large_airport' },
      { code: 'MAA', name: 'Chennai International Airport', city: 'Chennai', state: 'Tamil Nadu', terminals: 2, lat: 12.9941, lng: 80.1709, type: 'large_airport' },
      { code: 'HYD', name: 'Rajiv Gandhi International Airport', city: 'Hyderabad', state: 'Telangana', terminals: 1, lat: 17.2403, lng: 78.4294, type: 'large_airport' },
      { code: 'CCU', name: 'Netaji Subhas Chandra Bose International Airport', city: 'Kolkata', state: 'West Bengal', terminals: 2, lat: 22.6520, lng: 88.4463, type: 'large_airport' },
      { code: 'COK', name: 'Cochin International Airport', city: 'Kochi', state: 'Kerala', terminals: 3, lat: 10.1518, lng: 76.3930, type: 'large_airport' },
      { code: 'AMD', name: 'Sardar Vallabhbhai Patel International Airport', city: 'Ahmedabad', state: 'Gujarat', terminals: 2, lat: 23.0772, lng: 72.6347, type: 'large_airport' },
      { code: 'PNQ', name: 'Pune Airport', city: 'Pune', state: 'Maharashtra', terminals: 1, lat: 18.5822, lng: 73.9197, type: 'medium_airport' },
      { code: 'GOI', name: 'Manohar International Airport', city: 'Goa', state: 'Goa', terminals: 1, lat: 15.3808, lng: 73.8313, type: 'large_airport' },
      { code: 'JAI', name: 'Jaipur International Airport', city: 'Jaipur', state: 'Rajasthan', terminals: 2, lat: 26.8242, lng: 75.8122, type: 'large_airport' },
      { code: 'LKO', name: 'Chaudhary Charan Singh International Airport', city: 'Lucknow', state: 'Uttar Pradesh', terminals: 2, lat: 26.7606, lng: 80.8893, type: 'large_airport' },
      { code: 'GAU', name: 'Lokpriya Gopinath Bordoloi International Airport', city: 'Guwahati', state: 'Assam', terminals: 1, lat: 26.1061, lng: 91.5859, type: 'large_airport' },
      { code: 'TRV', name: 'Trivandrum International Airport', city: 'Thiruvananthapuram', state: 'Kerala', terminals: 2, lat: 8.4821, lng: 76.9200, type: 'large_airport' },
      { code: 'VNS', name: 'Lal Bahadur Shastri International Airport', city: 'Varanasi', state: 'Uttar Pradesh', terminals: 1, lat: 25.4524, lng: 82.8592, type: 'medium_airport' },
      { code: 'PAT', name: 'Jay Prakash Narayan International Airport', city: 'Patna', state: 'Bihar', terminals: 1, lat: 25.5913, lng: 85.0880, type: 'medium_airport' },
      { code: 'IXC', name: 'Chandigarh International Airport', city: 'Chandigarh', state: 'Punjab', terminals: 1, lat: 30.6735, lng: 76.7885, type: 'medium_airport' },
      { code: 'BBI', name: 'Biju Patnaik International Airport', city: 'Bhubaneswar', state: 'Odisha', terminals: 1, lat: 20.2444, lng: 85.8178, type: 'large_airport' },
      { code: 'NAG', name: 'Dr. Babasaheb Ambedkar International Airport', city: 'Nagpur', state: 'Maharashtra', terminals: 2, lat: 21.0922, lng: 79.0472, type: 'large_airport' },
      { code: 'IDR', name: 'Devi Ahilyabai Holkar Airport', city: 'Indore', state: 'Madhya Pradesh', terminals: 1, lat: 22.7218, lng: 75.8011, type: 'medium_airport' },
      { code: 'RPR', name: 'Swami Vivekananda Airport', city: 'Raipur', state: 'Chhattisgarh', terminals: 1, lat: 21.1804, lng: 81.7388, type: 'medium_airport' },
      { code: 'IXR', name: 'Birsa Munda Airport', city: 'Ranchi', state: 'Jharkhand', terminals: 1, lat: 23.3143, lng: 85.3217, type: 'medium_airport' },
      { code: 'SXR', name: 'Sheikh ul-Alam International Airport', city: 'Srinagar', state: 'Jammu & Kashmir', terminals: 1, lat: 33.9870, lng: 74.7742, type: 'large_airport' },
      { code: 'VTZ', name: 'Visakhapatnam Airport', city: 'Visakhapatnam', state: 'Andhra Pradesh', terminals: 1, lat: 17.7212, lng: 83.2245, type: 'medium_airport' },
      { code: 'CJB', name: 'Coimbatore International Airport', city: 'Coimbatore', state: 'Tamil Nadu', terminals: 1, lat: 11.0300, lng: 77.0434, type: 'medium_airport' },
      { code: 'IXB', name: 'Bagdogra Airport', city: 'Siliguri', state: 'West Bengal', terminals: 1, lat: 26.6812, lng: 88.3286, type: 'medium_airport' },
      { code: 'IXM', name: 'Madurai Airport', city: 'Madurai', state: 'Tamil Nadu', terminals: 1, lat: 9.8345, lng: 78.0934, type: 'medium_airport' },
      { code: 'UDR', name: 'Maharana Pratap Airport', city: 'Udaipur', state: 'Rajasthan', terminals: 1, lat: 24.6177, lng: 73.8961, type: 'medium_airport' },
      { code: 'IXA', name: 'Maharaja Bir Bikram Airport', city: 'Agartala', state: 'Tripura', terminals: 1, lat: 23.8870, lng: 91.2404, type: 'medium_airport' },
      { code: 'IMF', name: 'Imphal Airport', city: 'Imphal', state: 'Manipur', terminals: 1, lat: 24.7600, lng: 93.8967, type: 'medium_airport' },
      { code: 'DIB', name: 'Dibrugarh Airport', city: 'Dibrugarh', state: 'Assam', terminals: 1, lat: 27.4839, lng: 95.0169, type: 'medium_airport' },
      { code: 'IXE', name: 'Mangalore International Airport', city: 'Mangalore', state: 'Karnataka', terminals: 1, lat: 12.9613, lng: 74.8901, type: 'medium_airport' },
      { code: 'STV', name: 'Surat Airport', city: 'Surat', state: 'Gujarat', terminals: 1, lat: 21.1141, lng: 72.7418, type: 'medium_airport' },
      { code: 'BDQ', name: 'Vadodara Airport', city: 'Vadodara', state: 'Gujarat', terminals: 1, lat: 22.3362, lng: 73.2263, type: 'medium_airport' },
      { code: 'JLR', name: 'Jabalpur Airport', city: 'Jabalpur', state: 'Madhya Pradesh', terminals: 1, lat: 23.1778, lng: 80.0520, type: 'medium_airport' },
      { code: 'DHM', name: 'Gaggal Airport', city: 'Dharamshala', state: 'Himachal Pradesh', terminals: 1, lat: 32.1651, lng: 76.2634, type: 'small_airport' },
      { code: 'DED', name: 'Jolly Grant Airport', city: 'Dehradun', state: 'Uttarakhand', terminals: 1, lat: 30.1897, lng: 78.1803, type: 'medium_airport' },
      { code: 'IXS', name: 'Silchar Airport', city: 'Silchar', state: 'Assam', terminals: 1, lat: 24.9129, lng: 92.9787, type: 'medium_airport' },
      { code: 'JRH', name: 'Jorhat Airport', city: 'Jorhat', state: 'Assam', terminals: 1, lat: 26.7315, lng: 94.1755, type: 'medium_airport' },
      { code: 'IXZ', name: 'Veer Savarkar International Airport', city: 'Port Blair', state: 'Andaman & Nicobar', terminals: 1, lat: 11.6412, lng: 92.7297, type: 'medium_airport' },
    ];

    res.json({ success: true, count: INDIAN_AIRPORTS.length, data: INDIAN_AIRPORTS });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve airport data' });
  }
});

module.exports = router;
