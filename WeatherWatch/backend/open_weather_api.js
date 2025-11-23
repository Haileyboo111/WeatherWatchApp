// use axios to send HTTPS request to OpenWeather API
const axios = require('axios');

// import the key from .env (so that it will be saved privately)
require('dotenv').config();
const api_key = process.env.API_KEY;

// placeholder variables to test each endpoint
const lat = 40.7128;
const lon = -74.0060;
const time = 1759353600;
const date = '2025-10-07';

// this endpoint provides current forecast weather data
// (current weather, minute forecast for 1 hour, hourly forecast for 48 hours, daily forecast for 8 days and government weather alerts)
async function getForecast(lat, lon){
  const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${api_key}`;
  const res = await axios.get(url);
  return res.data;
}

// this endpoint provides weather data for a timestamp
// get access to weather data for any timestamp from 1st January 1979 till 4 days ahead forecast
async function getTimestamp(lat, lon, time){
  const url = `https://api.openweathermap.org/data/3.0/onecall/timemachine?lat=${lat}&lon=${lon}&dt=${time}&appid=${api_key}`;
  const res = await axios.get(url);
  return res.data;
}

// this endpoint provides daily aggregation data
// aggregated weather data for a particular date from 2nd January 1979 till long-term forecast for 1,5 years ahead
async function getDailyAggregation(lat, lon, date){
  const url = `https://api.openweathermap.org/data/3.0/onecall/day_summary?lat=${lat}&lon=${lon}&date=${date}&appid=${api_key}`;
  const res = await axios.get(url);
  return res.data;
}

// this endpoint provides a weather overview
// weather overview with a human-readable weather summary for today and tomorrow's forecast
async function getWeatherOverview(lat, lon){
  const url = `https://api.openweathermap.org/data/3.0/onecall/overview?lat=${lat}&lon=${lon}&appid=${api_key}`;
  const res = await axios.get(url);
  return res.data;
}

/* test placeholder commented out for now */
// Uncomment the lines to test endpoints locally
/*
(async function testEndpoints() {
  try {
    console.log('Forecast');
    const forecast = await getForecast(lat, lon);
    console.log(forecast.current);

    // the non working endpoints are commented out for now...
    // console.log('Timestamp');
    // const timestamp = await getTimestamp(lat, lon, time);
    // console.log(timestamp);

    // console.log('Daily Aggregation');
    // const daily = await getDailyAggregation(lat, lon, date);
    // console.log(daily);

    console.log('Overview');
    const overview = await getWeatherOverview(lat, lon);
    console.log(overview);

  } catch (err) {
    console.error('\nError:', err.response?.data || err.message);
  }
})();
*/

module.exports = { getForecast, getTimestamp, getDailyAggregation, getWeatherOverview };
