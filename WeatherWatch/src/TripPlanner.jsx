import React, { useState } from 'react';
import Calendar from './Calendar';
import './Calendar.css';
import './TripPlanner.css';
import { getDailyAggregation, geocodeLocation } from './api/openweather';

// convert kelvin to fahrenheit
const kelvinToFahrenheit = (k) => +(((k - 273.15) * 9) / 5 + 32).toFixed(0);

// convert wind degrees (0-360) to cardinal directions (N, S, E, W, etc.)
// keeps the UI human readable
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
  const [locationLoading, setLocationLoading] = useState(false);
  const [error, setError] = useState(null);
  const [destinationInput, setDestinationInput] = useState('');
  const [selectedPlace, setSelectedPlace] = useState(null);

  // look up coordinates for the user-entered destination
  const handleDestinationSearch = async (event) => {
    event.preventDefault();
    const query = destinationInput.trim();
    if (!query) {
      setError('Please enter a destination.');
      return;
    }

    setError(null);
    setWeatherData(null);
    setLocationLoading(true);

    try {
      const result = await geocodeLocation(query);
      if (!result) {
        setSelectedPlace(null);
        setError('No locations found for that search.');
        return;
      }

      const label = [result.name, result.state, result.country].filter(Boolean).join(', ');
      const place = { name: label, lat: result.lat, lon: result.lon };
      setSelectedPlace(place);

      // if a date is already selected, refresh the weather for the new destination
      if (selectedDate) {
        await handleDateChange(selectedDate, place);
      }
    } catch (err) {
      console.error(err);
      setSelectedPlace(null);
      setError('Could not look up that destination.');
    } finally {
      setLocationLoading(false);
    }
  };

// called when the user selects a date in the calendar
const handleDateChange = async (date, place = selectedPlace) => {
  // update selected date state, reset previous weather info/errors, show loading state
  setSelectedDate(date);
  setWeatherData(null);
    setError(null);

    if (!place) {
      setError('Please choose a destination first.');
      return;
    }

    setLoading(true);

    try {
      // convert the date to YYYY-MM-DD format for API request
      const pad = (n) => n.toString().padStart(2, '0');
      const dateString = `${date.getFullYear()}-${pad(date.getMonth()+1)}-${pad(date.getDate())}`;

      // fetch daily weather aggregation for the selected date
      const daily = await getDailyAggregation(place.lat, place.lon, dateString);
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
      <h2>Trip Planner</h2>
      <p>Select a date to plan your trip.</p>

      <div className="card trip-card">
        <div className="trip-card__header">
          <div>
            <h3>Destination</h3>
            <p className="muted">Search for a city or address to plan your trip.</p>
          </div>
          {selectedPlace && <span className="trip-destination__pill">Selected: {selectedPlace.name}</span>}
        </div>
        <form className="trip-destination" onSubmit={handleDestinationSearch}>
          <label className="trip-destination__label" htmlFor="destination-input">
            Where to?
          </label>
          <input
            id="destination-input"
            className="trip-input"
            type="text"
            placeholder="e.g., Paris, France"
            value={destinationInput}
            onChange={(e) => setDestinationInput(e.target.value)}
          />
          <button type="submit" className="trip-action" disabled={locationLoading}>
            {locationLoading ? 'Searching...' : 'Set Destination'}
          </button>
        </form>
      </div>

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
                {selectedPlace && (
                  <p className="muted" style={{ marginTop: 4 }}>Destination: {selectedPlace.name}</p>
                )}
                <p>
                  Temperature: {info.temperature.min}°F - {info.temperature.max}°F<br/>
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
