// server.js
// this is the backend server for the weather app,

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { getForecast, getWeatherOverview, getWeatherAlerts } = require('./open_weather_api');
//const { Configuration, OpenAIApi } = require('openai');
const OpenAI = require("openai");
const usersRouter = require('./routes/users'); // import user routes

const app = express();

// CORS configuration to allow requests from local dev ports
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'],
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

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post('/api/weather-summary', async (req, res) => {
  const { weatherData } = req.body;
  if (!weatherData) return res.status(400).json({ error: "weatherData is required" });

  const prompt = `Generate a friendly 2-3 sentence weather summary for this data: ${JSON.stringify(weatherData)}`;

  try {
    const response = await openai.responses.create({
      model: "gpt-5-nano",
      input: prompt,
      store: true,
    });
    const summary = response.output_text || "No summary generated.";
    res.json({ summary });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate summary" });
  }
});

app.get('/api/alerts', async (req, res) => {
  const { lat, lon, startDate, endDate } = req.query;

  if (!lat || !lon || !startDate || !endDate) {
    return res.status(400).json({ error: "lat, lon, startDate, endDate required" });
  }

  try {
    const alerts = await getWeatherAlerts(lat, lon);
    const start = new Date(startDate).getTime()/1000;
    const end = new Date(endDate).getTime()/1000;
    const filtered = alerts.filter(a => a.end >= start && a.start <= end);

    res.json({ alerts: filtered });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not fetch alerts" });
  }
});

// start server 
const PORT = 5001;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
