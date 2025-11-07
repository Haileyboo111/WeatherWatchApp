import React, { useState } from 'react';
import './Forecast.css';
import { getForecast, getDailyAggregation } from './api/openweather';

//kelvin to fahrenheit
const kToF = (k) => +(((k - 273.15) * 9) / 5 + 32).toFixed(0);
//celsius to fahrenheit
const cToF = (c) => +((c*9) / 5 + 32).toFixed(0);

function Forecast() {
  const [view, setView] = useState('daily'); // "daily" or "weekly"
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  //default location
  const lat = 40.7128;
  const lon = -74.0060;

  const fetchWeather = async () => {
    setLoading(true);
    setError(null);
    setWeather(null);

    try {
      if (view === 'daily') {
        const today = new Date();
        const pad = (n) => n.toString().padStart(2, '0');
        const dateStr = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;
        const data = await getDailyAggregation(lat, lon, dateStr);
        setWeather({ mode: 'daily', data });
      } else {
        const data = await getForecast(lat, lon);
        setWeather({ mode: 'weekly', data });
      }
    } catch (err) {
      console.error(err);
      setError('Could not fetch weather data.');
    } finally {
      setLoading(false);
    }
  };

  const renderWeather = () => {
    if (!weather) return null;

    if (weather.mode === 'daily') {
      const t = weather.data.temperature;
      return (
        <div className="weather-card">
          <h3>Today's Weather</h3>
          <p>Min: {kToF(t.min)}°F | Max: {kToF(t.max)}°F</p>
          <p>Morning: {kToF(t.morning)}°F | Afternoon: {kToF(t.afternoon)}°F</p>
          <p>Evening: {kToF(t.evening)}°F | Night: {kToF(t.night)}°F</p>
        </div>
      );
    }

    if (weather.mode === 'weekly') {
      return (
        <div>
          <h3>7-Day Forecast</h3>
          <div className="week-grid">
            {weather.data.daily?.map((day, i) => (
              <div key={i} className="day-card">
                <p>{new Date(day.dt * 1000).toLocaleDateString(undefined, { weekday: 'short' })}</p>
                <p>{cToF(day.temp.min)}°F - {cToF(day.temp.max)}°F</p>
                <p>{day.weather[0].main}</p>
              </div>
            ))}
          </div>
        </div>
      );
    }
  };

  return (
    <section className="page">
      <h2>Weather View</h2>
      <p>Check today's or the weekly weather forecast.</p>

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

      <button onClick={fetchWeather} className="fetch-btn">
        Show {view === 'daily' ? 'Today’s' : 'Weekly'} Weather
      </button>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {renderWeather()}
    </section>
  );
}

export default Forecast;

