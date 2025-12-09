// routes/weather.js
// -----------------
// Backend route templates for Sprint 3
// These routes are ready for integration with front-end components
// Currently include mock responses for development/testing since Node/npm cannot run on SLU computer

import express from 'express';
import { getForecast, getDailyAggregation } from '../open_weather_api.js'; // existing API functions

const router = express.Router();

// -----------------
// /weather/daily
// -----------------
// parameters expected: lat (latitude), lon (longitude), date (optional for daily aggregation)
// Example request: GET /weather/daily?lat=38.63&lon=-90.23
// Notes for teammate:
// - Replace mock response with: await getDailyAggregation(lat, lon, date)
// - Ensure front-end receives JSON object with a "daily" property
router.get('/daily', async (req, res) => {
  const { lat, lon } = req.query;

  if (!lat || !lon) {
    // Return 400 if required parameters are missing
    return res.status(400).json({ error: 'Latitude and longitude are required' });
  }

  try {
    // Placeholder response until real API call is possible
    // Uncomment the line below after Node/npm is installed and .env API key is available
    // const data = await getDailyAggregation(lat, lon, new Date().toISOString().split('T')[0]);

    const data = { daily: `mock daily data for lat=${lat}, lon=${lon}` }; // mock data
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch daily weather data' });
  }
});

// -----------------
// /weather/weekly
// -----------------
// Query parameters expected: lat, lon
// Example request: GET /weather/weekly?lat=38.63&lon=-90.23
// Notes for teammate:
// - Replace mock response with: await getForecast(lat, lon)
// - Front-end expects a JSON object with "weekly" property containing forecast data
router.get('/weekly', async (req, res) => {
  const { lat, lon } = req.query;

  if (!lat || !lon) {
    return res.status(400).json({ error: 'Latitude and longitude are required' });
  }

  try {
    // Placeholder response until real API call is possible
    // const data = await getForecast(lat, lon);

    const data = { weekly: `mock weekly data for lat=${lat}, lon=${lon}` }; // mock data
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch weekly weather data' });
  }
});

// -----------------
// Notes for whoever works on this next;
// 1. Replace mock data with real API calls after Node/npm and .env API key are available
// 2. Ensure front-end receives JSON objects with "daily" or "weekly" properties
// 3. Validate query parameters (lat/lon/date) for real API calls
// 4. Keep error handling in place to avoid crashing the server

export default router;
