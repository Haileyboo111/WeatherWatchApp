import React, { useState } from 'react';
import Calendar from './Calendar';
import './Calendar.css';
import { getWeatherOverview, getForecast, getDailyAggregation } from './api/openweather';

// convert kelvin to fahrenheit
const kelvinToFahrenheit = (k) => +(((k - 273.15) * 9) / 5 + 32).toFixed(0);


// convert wind degrees (0-360) to cardinal directions (N, S, E, W, etc.)
const degToCardinal = (deg) => {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  return directions[Math.round(deg / 45) % 8];
};

// format the raw weather JSON from the API into a user-friendly structure
const formatWeather = (data, selectedDate) => {

  if (!data) return null;

  return {
    // format the date to a readable string like "Thursday, November 13, 2025"
    date: selectedDate.toLocaleDateString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }),
    // convert and store temperatures in fahrenheit for different times of day
    temperature: {
      min: kelvinToFahrenheit(data.temperature.min),
      max: kelvinToFahrenheit(data.temperature.max),
      morning: kelvinToFahrenheit(data.temperature.morning),
      afternoon: kelvinToFahrenheit(data.temperature.afternoon),
      evening: kelvinToFahrenheit(data.temperature.evening),
      night: kelvinToFahrenheit(data.temperature.night),
    },
    // store precipitation, cloud cover, humidity, and wind info
    precipitation: data.precipitation.total,
    cloudCover: Math.round(data.cloud_cover.afternoon),
    humidity: Math.round(data.humidity.afternoon),
    wind: {
      speed: data.wind.max.speed,
      direction: degToCardinal(data.wind.max.direction),
    }
  };
};

function Forecast() {
  // state to store the currently selected date from the calendar
  const [selectedDate, setSelectedDate] = useState(null);
  // state to store the weather data, loading status, and any errors with the API
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // called when the user selects a date in the calendar
  const handleDateChange = async (date) => {
    // update selected date state, reset previous weather info/errors, show loading state
    setSelectedDate(date);
    setWeatherData(null);
    setError(null);
    setLoading(true);

    try {
      // placeholder lat/lon for now (new york city)
      const lat = 40.7128;
      const lon = -74.0060;

      // convert the date to YYYY-MM-DD format for API request
      const pad = (n) => n.toString().padStart(2, '0');
      const dateString = `${date.getFullYear()}-${pad(date.getMonth()+1)}-${pad(date.getDate())}`;

      // fetch daily weather aggregation for the selected date
      const daily = await getDailyAggregation(lat, lon, dateString);
      setWeatherData(daily);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch weather data.');
    } finally {
      setLoading(false);
    }
  };


  // render the forecast page
  return (
    <section className="page">
      <h2>Forecast</h2>
      <p>Select a date to plan your trip.</p>

      {/* calendar centered on the page */}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 16 }}>
        <Calendar value={selectedDate} onChange={handleDateChange} />
      </div>

      {/* show selected date */}
      {selectedDate && (
        <p style={{ marginTop: 16 }}>
          Selected date: {selectedDate.toLocaleDateString(undefined, { 
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
          })}
        </p>
      )}

      {/* loading state */}
      {loading && <p>Loading weather info...</p>}

      {/* error state */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* display weather data */}
      {weatherData && (
        <div style={{ marginTop: 16 }}>
          {(() => {
            const info = formatWeather(weatherData, selectedDate);
            if (!info) return null;

            return (
              <div>
                <h3>Weather for {info.date}</h3>
                <p>
                  Temperature: {info.temperature.min}–{info.temperature.max}°F<br/>
                  Morning: {info.temperature.morning}°F<br/>
                  Afternoon: {info.temperature.afternoon}°F<br/>
                  Evening: {info.temperature.evening}°F<br/>
                  Night: {info.temperature.night}°F
                </p>
                <p>Precipitation: {info.precipitation} mm</p>
                <p>Cloud cover: {info.cloudCover}%</p>
                <p>Wind: {info.wind.speed} m/s {info.wind.direction}</p>
                <p>Humidity: {info.humidity}%</p>
              </div>
            );
          })()}
        </div>
      )}


      {/* Placeholder when no date is chosen yet */}
      {!selectedDate && !loading && (
        <p style={{ marginTop: 16, opacity: 0.8 }}>
          No date selected yet.
        </p>
      )}
    </section>
  );
}


export default Forecast;
