import React, { useState } from 'react';
import Calendar from './Calendar';
import './Calendar.css';
import './TripPlanner.css';
import { getDailyAggregation, geocodeLocation, getAlerts } from './api/openweather';
import axios from 'axios';
import { useAuth } from './context/AuthContext';
import { convertTemperature, getUnitSymbol, useUnit } from './context/UnitContext';

// convert kelvin to fahrenheit
const kelvinToFahrenheit = (k) => +(((k - 273.15) * 9) / 5 + 32).toFixed(0);

// convert wind degrees (0-360) to cardinal directions (N, S, E, W, etc.)
const degToCardinal = (deg) => {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  return directions[Math.round(deg / 45) % 8];
};

// format the raw weather JSON from the API into a user-friendly structure
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
    }
  };
};

function TripPlanner() {
  const { user } = useAuth();
  const { unit } = useUnit();
  const unitSymbol = getUnitSymbol(unit);

  const [tripStart, setTripStart] = useState(null);
  const [tripEnd, setTripEnd] = useState(null);
  const [tripDates, setTripDates] = useState([]);
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [error, setError] = useState(null);
  const [destinationInput, setDestinationInput] = useState('');
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [alerts, setAlerts] = useState([]);

  // build range of dates
  const buildDateRange = (start, end) => {
    const arr = [];
    let current = new Date(start);
    while (current <= end) {
      arr.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    return arr;
  };

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

      if (tripStart && tripEnd) {
        await fetchWeatherForTrip(place, tripStart, tripEnd);
      }
    } catch (err) {
      console.error(err);
      setSelectedPlace(null);
      setError('Could not look up that destination.');
    } finally {
      setLocationLoading(false);
    }
  };

  const fetchWeatherForTrip = async (place, start, end) => {
    setWeatherData(null);
    setLoading(true);
    setError(null);

    const allDates = buildDateRange(start, end);
    setTripDates(allDates);

    if (!place) {
      setError('Please choose a destination first.');
      setLoading(false);
      return;
    }

    try {
      const pad = (n) => n.toString().padStart(2, '0');
      const requests = allDates.map((d) => {
        const dateString = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
        return getDailyAggregation(place.lat, place.lon, dateString);
      });

      const results = await Promise.all(requests);
      const mapped = results.map((daily, i) => formatWeather(daily, allDates[i]));
      setWeatherData(mapped);

      const startDateStr = `${start.getFullYear()}-${pad(start.getMonth() + 1)}-${pad(start.getDate())}`;
      const endDateStr = `${end.getFullYear()}-${pad(end.getMonth() + 1)}-${pad(end.getDate())}`;
      const alertsData = await getAlerts(place.lat, place.lon, startDateStr, endDateStr);
      setAlerts(alertsData);

    } catch (err) {
      console.error(err);
      setError('Failed to fetch weather data.');
    } finally {
      setLoading(false);
    }
  };

  const fetchAlertsForTrip = async (place, start, end) => {
    if (!place || !start || !end) return;
    
    const pad = (n) => n.toString().padStart(2, '0');
    const startDate = `${start.getFullYear()}-${pad(start.getMonth() + 1)}-${pad(start.getDate())}`;
    const endDate = `${end.getFullYear()}-${pad(end.getMonth() + 1)}-${pad(end.getDate())}`;
    
    try {
      const res = await axios.get(`http://localhost:5001/api/alerts?lat=${place.lat}&lon=${place.lon}&startDate=${startDate}&endDate=${endDate}`);
      setAlerts(res.data.alerts || []);
    } catch (err) {
      console.error('Failed to fetch alerts:', err);
      setAlerts([]);
    }
  };

  // handle calendar clicks
  const handleDateChange = async (clickedDate) => {
    setError(null);

    // first click -> tripStart
    if (!tripStart || (tripStart && tripEnd)) {
      setTripStart(clickedDate);
      setTripEnd(null);
      setTripDates([]);
      setWeatherData(null);
      setSelectedDate(clickedDate);
      return;
    }

    // second click -> tripEnd
    if (!tripEnd) {
      if (clickedDate < tripStart) {
        setTripEnd(tripStart);
        setTripStart(clickedDate);
      } else {
        setTripEnd(clickedDate);
      }
    } else {
      setTripEnd(clickedDate);
    }

    const start = clickedDate < tripStart ? clickedDate : tripStart;
    const end = clickedDate < tripStart ? tripStart : clickedDate;

    setTripDates(buildDateRange(start, end));
    setSelectedDate(clickedDate);

    if (!selectedPlace) {
      setError('Please choose a destination first.');
      return;
    }

    await fetchWeatherForTrip(selectedPlace, start, end);
    await fetchAlertsForTrip(selectedPlace, start, end);
  };

  const handleSaveTrip = async () => {
    if (!user || !selectedPlace || !tripStart) {
      return;
    }
    try {
      await axios.post(`http://localhost:5001/users/${user.id}/history`, {
        location: selectedPlace.name,
        date: tripStart.toLocaleDateString(),
        info: JSON.stringify(weatherData)
      });
      alert('Trip saved successfully!');
    } catch (err) {
      alert('Failed to save trip.');
    }
  };

  // render
  return (
    <section className="page">
      <div className="card trip-planner-card">
        <h2>Trip Planner</h2>
        <p>Select a date to plan your trip.</p>

        {/* Destination Card */}
        <div className="card trip-card">
          <div className="trip-card__header">
            <div>
              <h3>Destination</h3>
              <p className="muted">Search for a city or address to plan your trip.</p>
            </div>
            {selectedPlace && (
              <span className="trip-destination__pill">Selected: {selectedPlace.name}</span>
            )}
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

        {/* Calendar */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 16 }}>
          <Calendar value={selectedDate} onChange={handleDateChange} />
        </div>

      {/* Show trip range */}
      {tripStart && (
        <p style={{ marginTop: 16 }}>
          Trip: {tripStart.toLocaleDateString()} {tripEnd ? `— ${tripEnd.toLocaleDateString()}` : ''}
        </p>
      )}

      {/* Save Trip Button */}
      {user && selectedPlace && tripStart && (
        <button className="trip-action" onClick={handleSaveTrip} style={{ marginBottom: 16 }}>
          Save Trip
        </button>
      )}

      {/* Loading and error */}
      {loading && <p>Loading weather info...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="alerts-container" style={{ marginTop: 16 }}>
          <h3>Severe Weather Alert</h3>
          {alerts.map((alert, i) => (
            <div key={i} className="trip-alert">
              <p><strong>{alert.event}</strong></p>
              <p>{alert.description}</p>
              <p>
                From: {new Date(alert.start * 1000).toLocaleString()}<br />
                To: {new Date(alert.end * 1000).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Weather cards container */}
      <div className="weather-cards-container">
        {weatherData &&
          tripDates.map((date, i) => {
            const info = weatherData[i];
            if (!info) return null;
            return (
              <div key={i} className="card weather-card" style={{ marginTop: 16 }}>
                <h3>Weather for {info.date}</h3>
                {selectedPlace && (
                  <div>
                    <p className="muted" style={{ marginTop: 4 }}>
                      Destination: {selectedPlace.name}
                    </p>
                    <p>Precipitation: {info.precipitation} mm</p>
                    <p>Cloud cover: {info.cloudCover}%</p>
                    <p>Wind: {info.wind.speed} m/s {info.wind.direction}</p>
                    <p>Humidity: {info.humidity}%</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
  </section>
);
}

export default TripPlanner;