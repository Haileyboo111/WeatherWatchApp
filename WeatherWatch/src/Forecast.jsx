import React, { useState, useEffect } from 'react';
import './Forecast.css';
import { getDailyAggregation, geocodeLocation, getWeatherOverview } from './api/openweather';
import { convertTemperature, getUnitSymbol, useUnit } from './context/UnitContext';

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
  const [apiSummary, setApiSummary] = useState(null);
  const { unit } = useUnit();
  const unitSymbol = getUnitSymbol(unit);

  const parseApiSummary = (data) => {
    if (!data || typeof data !== 'object') return null;
    const candidates = [
      data.summary,
      data.overview,
      data.weather_overview,
      data.text,
      data.daily?.[0]?.summary,
      data.daily_overview?.[0]?.summary,
      data.forecast?.[0]?.summary,
    ];
    const found = candidates.find((val) => typeof val === 'string' && val.trim());
    return found ? found.trim() : null;
  };

  const buildFallbackSummary = (info) => {
    if (!info) return null;
    const high = convertTemperature(info.temperature.max, unit);
    const low = convertTemperature(info.temperature.min, unit);
    return `High ${high}${unitSymbol}, low ${low}${unitSymbol}. Precipitation ${info.precipitation} mm. Wind ${info.wind.speed} m/s ${info.wind.direction}. Humidity ${info.humidity}%.`;
  };

  const fetchWeather = async () => {
    if (!location) {
      setError('Please enter a location.');
      return;
    }

    setLoading(true);
    setError(null);
    setWeatherData([]);
    setApiSummary(null);

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

      const overviewPromise = getWeatherOverview(geo.lat, geo.lon).catch((err) => {
        console.error('Could not fetch overview', err);
        return null;
      });
      const resultsPromise = Promise.all(requests);

      const [overviewData, results] = await Promise.all([overviewPromise, resultsPromise]);
      const mapped = results.map((daily, i) => formatWeather(daily, dates[i]));
      setWeatherData(mapped);
      setApiSummary(parseApiSummary(overviewData));

    } catch (err) {
      console.error(err);
      setError('Could not fetch weather data.');
    } finally {
      setLoading(false);
    }
  };

  // Automatically fetch new weather whenever view changes (daily or weekly)
  useEffect(() => {
    if (location) {
      fetchWeather();
    }
  }, [view]);

  const summaryText = apiSummary || buildFallbackSummary(weatherData[0]);

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
      {summaryText && (
        <div className="weather-summary">
          <strong>Summary:</strong> {summaryText}
        </div>
      )}

      {weatherData.map((info, i) => (
        <div key={i} className="weather-card">
          <h3>Weather for {info.date}</h3>
          <p>
            Temperature: {convertTemperature(info.temperature.min, unit)}{unitSymbol} - {convertTemperature(info.temperature.max, unit)}{unitSymbol}<br />
            Morning: {convertTemperature(info.temperature.morning, unit)}{unitSymbol}<br />
            Afternoon: {convertTemperature(info.temperature.afternoon, unit)}{unitSymbol}<br />
            Evening: {convertTemperature(info.temperature.evening, unit)}{unitSymbol}<br />
            Night: {convertTemperature(info.temperature.night, unit)}{unitSymbol}
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
