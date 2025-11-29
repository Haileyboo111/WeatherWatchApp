import React, { useState, useEffect } from 'react';
import './Forecast.css';
import { getDailyAggregation, geocodeLocation } from './api/openweather';

// Convert Kelvin to Fahrenheit
const kelvinToFahrenheit = (k) => +(((k - 273.15) * 9) / 5 + 32).toFixed(0);

// Convert wind degrees to cardinal directions
const degToCardinal = (deg) => {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  return directions[Math.round(deg / 45) % 8];
};

// Format API data to user-friendly structure
const formatWeather = (data, dateObj) => {
  if (!data) return null;
  return {
    date: dateObj.toLocaleDateString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }),
    temperature: {
      min: kelvinToFahrenheit(data.temperature.min),
      max: kelvinToFahrenheit(data.temperature.max),
      morning: kelvinToFahrenheit(data.temperature.morning),
      afternoon: kelvinToFahrenheit(data.temperature.afternoon),
      evening: kelvinToFahrenheit(data.temperature.evening),
      night: kelvinToFahrenheit(data.temperature.night),
    },
    precipitation: data.precipitation.total,
    cloudCover: Math.round(data.cloud_cover.afternoon),
    humidity: Math.round(data.humidity.afternoon),
    wind: {
      speed: data.wind.max.speed,
      direction: degToCardinal(data.wind.max.direction),
    },
  };
};

function Forecast() {
  const [view, setView] = useState('daily'); // daily or weekly
  const [location, setLocation] = useState('');
  const [weatherData, setWeatherData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWeather = async () => {
    if (!location) {
      setError('Please enter a location.');
      return;
    }

    setLoading(true);
    setError(null);
    setWeatherData([]);

    try {
      const geo = await geocodeLocation(location.trim());
      if (!geo) {
        setError('Location not found.');
        setLoading(false);
        return;
      }

      const today = new Date();
      const dates = [];
      const numDays = view === 'daily' ? 1 : 7;

      for (let i = 0; i < numDays; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() + i);
        dates.push(d);
      }

      const pad = (n) => n.toString().padStart(2, '0');
      const requests = dates.map((d) => {
        const dateStr = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
        return getDailyAggregation(geo.lat, geo.lon, dateStr);
      });

      const results = await Promise.all(requests);
      const mapped = results.map((daily, i) => formatWeather(daily, dates[i]));
      setWeatherData(mapped);

    } catch (err) {
      console.error(err);
      setError('Could not fetch weather data.');
    } finally {
      setLoading(false);
    }
  };

  // 🔥 Automatically fetch new weather whenever view changes (daily ↔ weekly)
  useEffect(() => {
    if (location) {
      fetchWeather();
    }
  }, [view]);

  return (
    <section className="page">
      <h2>Weather View</h2>
      <p>Check today's or the weekly weather forecast.</p>

      {/* Location input */}
      <div style={{ textAlign: 'center', marginBottom: '12px' }}>
        <input
          type="text"
          value={location}
          placeholder="Enter location, e.g., Paris, France"
          onChange={(e) => setLocation(e.target.value)}
          style={{
            padding: '8px 12px',
            borderRadius: '12px',
            width: '220px',
            marginRight: '8px',
            border: '1px solid #ccc'
          }}
        />
        <button className="fetch-btn" onClick={fetchWeather}>Set Destination</button>
      </div>

      {/* Toggle buttons */}
      <div className="toggle-buttons">
        <button
          className={view === 'daily' ? 'active' : ''}
          onClick={() => setView('daily')}
        >
          Daily
        </button>
        <button
          className={view === 'weekly' ? 'active' : ''}
          onClick={() => setView('weekly')}
        >
          Weekly
        </button>
      </div>

      {/* Loading, error, and weather display */}
      {loading && <p className="loading">Loading...</p>}
      {error && <p className="error">{error}</p>}

      {weatherData.map((info, i) => (
        <div key={i} className="weather-card">
          <h3>Weather for {info.date}</h3>
          <p>
            Temperature: {info.temperature.min}°F - {info.temperature.max}°F<br />
            Morning: {info.temperature.morning}°F<br />
            Afternoon: {info.temperature.afternoon}°F<br />
            Evening: {info.temperature.evening}°F<br />
            Night: {info.temperature.night}°F
          </p>
          <p>Precipitation: {info.precipitation} mm</p>
          <p>Cloud cover: {info.cloudCover}%</p>
          <p>Wind: {info.wind.speed} m/s {info.wind.direction}</p>
          <p>Humidity: {info.humidity}%</p>
        </div>
      ))}
    </section>
  );
}

export default Forecast;


