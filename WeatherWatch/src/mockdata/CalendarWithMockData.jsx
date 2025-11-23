import React, { useState, useEffect } from 'react';
import Calendar from '../Calendar';
import { fetchMockEvents, mockWeatherData, mockForecast } from './MockData';

function CalendarWithMockData() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchMockEvents().then((data) => {
      console.log('Fetched events:', data);
      setEvents(data);
    });
  }, []);

  const dateString = selectedDate.toISOString().split('T')[0];
  
  const eventsForSelectedDate = events.filter(
    (event) => event.date === dateString
  );

  //finds weather forecast for selected date
  const weatherForDate = mockForecast.find(
    (forecast) => forecast.date === dateString
  );

  return (
    <div>
      <Calendar value={selectedDate} onChange={setSelectedDate} />
      <div style={{ marginTop: '1rem' }}>
        <h3>Trips for {selectedDate.toDateString()}:</h3>
        {eventsForSelectedDate.length ? (
          <ul>
            {eventsForSelectedDate.map((event) => (
              <li key={event.id}>
                {event.title}: {event.description}
              </li>
            ))}
          </ul>
        ) : (
          <p>No trips planned.</p>
        )}

        <h3>Weather for {selectedDate.toDateString()}:</h3>
        {weatherForDate ? (
          <div>
            <p><strong>Condition:</strong> {weatherForDate.condition}</p>
            <p><strong>High:</strong> {weatherForDate.high}°F</p>
            <p><strong>Low:</strong> {weatherForDate.low}°F</p>
          </div>
        ) : (
          <p>No weather data available for this date.</p>
        )}

        <h3>Current Weather ({mockWeatherData.city}):</h3>
        <div>
          <p><strong>Temperature:</strong> {mockWeatherData.temperature}°F</p>
          <p><strong>Condition:</strong> {mockWeatherData.condition}</p>
          <p><strong>High/Low:</strong> {mockWeatherData.high}°F / {mockWeatherData.low}°F</p>
          <p><strong>Humidity:</strong> {mockWeatherData.humidity}%</p>
          <p><strong>Wind Speed:</strong> {mockWeatherData.windSpeed} mph</p>
        </div>
      </div>
    </div>
  );
}

export default CalendarWithMockData;