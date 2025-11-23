// server.js
// this is the backend server for the weather app,

require('dotenv').config();
const API_KEY = process.env.API_KEY;

// uses Express to handle HTTP requests from the front end
// and Axios (via open-weather-api) to fetch data from source 
const express = require('express');
const cors = require('cors');
const { getForecast, getWeatherOverview } = require('./open_weather_api'); // open weather file 

const app = express();
app.use(cors()); // allow requests from front end 

// route to get forecasts 
app.get('/api/forecast', async (req, res) => { 
  console.log("Forecasts request received:", req.query); // log statement to check where requests are failing 
  // tagged as need to work on this next sprint 
  const { lat, lon } = req.query;
  if (!lat || !lon) return res.status(400).json({ error: "Lat & lon required" });

  try {
    // call the backend API function (API_KEY already handled in open_weather_api.js)
    const data = await getForecast(parseFloat(lat), parseFloat(lon));
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not fetch forecast" });
  }
});

// route to get weather overview, will return a readable summary of the weather 
app.get('/api/overview', async (req, res) => {
  console.log("Overview request received:", req.query); // log 
  const { lat, lon } = req.query;
  if (!lat || !lon) return res.status(400).json({ error: "Lat & lon required" });

  try {
    // call the backend API function
    const data = await getWeatherOverview(parseFloat(lat), parseFloat(lon));
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not fetch overview" });
  }
});

// start server 
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
