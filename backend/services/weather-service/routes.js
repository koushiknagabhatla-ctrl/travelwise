const express = require('express');
const router = express.Router();
const axios = require('axios');

const OPENWEATHER_KEY = process.env.OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

/**
 * GET /api/weather?lat=28.55&lon=77.10
 * Current weather at coordinates
 */
router.get('/', async (req, res) => {
  try {
    const { lat, lon, city } = req.query;

    let url;
    if (city) {
      url = `${BASE_URL}/weather?q=${city}&units=metric&appid=${OPENWEATHER_KEY}`;
    } else if (lat && lon) {
      url = `${BASE_URL}/weather?lat=${lat}&lon=${lon}&units=metric&appid=${OPENWEATHER_KEY}`;
    } else {
      return res.status(400).json({ error: 'Provide lat/lon or city' });
    }

    const response = await axios.get(url);
    const d = response.data;

    res.json({
      success: true,
      data: {
        city: d.name,
        country: d.sys?.country,
        temp: Math.round(d.main?.temp),
        feelsLike: Math.round(d.main?.feels_like),
        humidity: d.main?.humidity,
        description: d.weather?.[0]?.description,
        icon: d.weather?.[0]?.icon,
        iconUrl: `https://openweathermap.org/img/wn/${d.weather?.[0]?.icon}@2x.png`,
        windSpeed: d.wind?.speed,
        visibility: d.visibility,
        pressure: d.main?.pressure,
      },
    });
  } catch (error) {
    console.error('[Weather Service] Error:', error.message);
    res.status(500).json({ error: 'Weather data unavailable' });
  }
});

/**
 * GET /api/weather/forecast?lat=28.55&lon=77.10
 * 5-day forecast
 */
router.get('/forecast', async (req, res) => {
  try {
    const { lat, lon, city } = req.query;

    let url;
    if (city) {
      url = `${BASE_URL}/forecast?q=${city}&units=metric&appid=${OPENWEATHER_KEY}`;
    } else if (lat && lon) {
      url = `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${OPENWEATHER_KEY}`;
    } else {
      return res.status(400).json({ error: 'Provide lat/lon or city' });
    }

    const response = await axios.get(url);
    const items = response.data?.list || [];

    // Group by day (take one reading per day around noon)
    const daily = [];
    const seen = new Set();
    for (const item of items) {
      const date = item.dt_txt?.split(' ')[0];
      if (!seen.has(date)) {
        seen.add(date);
        daily.push({
          date,
          temp: Math.round(item.main?.temp),
          tempMin: Math.round(item.main?.temp_min),
          tempMax: Math.round(item.main?.temp_max),
          description: item.weather?.[0]?.description,
          icon: item.weather?.[0]?.icon,
          iconUrl: `https://openweathermap.org/img/wn/${item.weather?.[0]?.icon}@2x.png`,
          humidity: item.main?.humidity,
          windSpeed: item.wind?.speed,
        });
      }
    }

    res.json({ success: true, city: response.data?.city?.name, data: daily });
  } catch (error) {
    console.error('[Weather Service] Forecast error:', error.message);
    res.status(500).json({ error: 'Forecast data unavailable' });
  }
});

module.exports = router;
