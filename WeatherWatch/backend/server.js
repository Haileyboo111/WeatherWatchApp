// server.js
// this is the backend server for the weather app,

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { getForecast, getWeatherOverview } = require('./open_weather_api');
const usersRouter = require('./routes/users'); // import user routes

const app = express();

// CORS configuration to allow any requests from frontend
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// middleware to parse JSON bodies and log requests
app.use(express.json());
app.use((req, res, next) => {
  console.log("Request received:", req.method, req.url);
  next();
});

// mount user routes, now all /users routes go to routes/users.js
app.use('/users', usersRouter);

// weather routes, fetch data from OpenWeather API
app.get('/api/forecast', async (req, res) => {

  const { lat, lon } = req.query;
  // validate query parameters
  if (!lat || !lon) return res.status(400).json({ error: "Lat & lon required" });

  // fetch forecast data
  try {
    const data = await getForecast(parseFloat(lat), parseFloat(lon));
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not fetch forecast" });
  }
});

app.get('/api/overview', async (req, res) => {
  const { lat, lon } = req.query;
  // validate query parameters
  if (!lat || !lon) return res.status(400).json({ error: "Lat & lon required" });
  // fetch overview data
  try {
    const data = await getWeatherOverview(parseFloat(lat), parseFloat(lon));
      res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not fetch overview" });
  }
});

// start server 
const PORT = 5001;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
