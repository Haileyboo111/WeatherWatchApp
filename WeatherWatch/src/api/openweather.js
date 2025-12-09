// use axios to send HTTPS request to OpenWeather API
import axios from 'axios';

// import the key from key.js (so that it will be saved privately)
const api_key = import.meta.env.VITE_OPENWEATHER_API_KEY;

// this endpoint provides current forecast weather data
// (current weather, minute forecast for 1 hour, hourly forecast for 48 hours, daily forecast for 8 days and government weather alerts)
export async function getForecast(lat, lon) {
  const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&units=metric&appid=${api_key}`;
  const res = await axios.get(url);
  return res.data;
}

// this endpoint provides daily aggregation data
// aggregated weather data for a particular date from 2nd January 1979 till long-term forecast for 1,5 years ahead
export async function getDailyAggregation(lat, lon, date) {
  const url = `https://api.openweathermap.org/data/3.0/onecall/day_summary?lat=${lat}&lon=${lon}&date=${date}&appid=${api_key}`;
  const res = await axios.get(url);
  return res.data;
}

// this endpoint provides a weather overview
// weather overview with a human-readable weather summary for today and tomorrow's forecast
export async function getWeatherOverview(lat, lon) {
  const url = `https://api.openweathermap.org/data/3.0/onecall/overview?lat=${lat}&lon=${lon}&appid=${api_key}`;
  const res = await axios.get(url);
  return res.data;
}

// geocode a user-entered place name into coordinates
export async function geocodeLocation(query) {
  const url = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=1&appid=${api_key}`;
  const res = await axios.get(url);
  if (!res.data || res.data.length === 0) return null;
  return res.data[0];
}

export async function getAlerts(lat, lon, startDate, endDate) {
  const url = `http://localhost:5001/api/alerts?lat=${lat}&lon=${lon}&startDate=${startDate}&endDate=${endDate}`;
  const res = await axios.get(url);
  return res.data.alerts;
}