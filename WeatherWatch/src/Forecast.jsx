import React, { useState } from 'react';
import Calendar from './Calendar';
import './Calendar.css';

function Forecast() {
  // Holds the date picked in the calendar
  const [selectedDate, setSelectedDate] = useState(null);

  return (
    <section className="page">
      <h2>Forecast</h2>
      <p>Select a date to plan your trip.</p>

      {/* Calendar centered on the page */}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 16 }}>
        {/* Calendar component with selected date state */}
        <Calendar value={selectedDate} onChange={setSelectedDate} />
      </div>

      {/* Show a date when one is selected */}
      {selectedDate && (
        <p style={{ marginTop: 16 }}>
          Selected date: {selectedDate.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      )}

      {/* Placeholder when no date is chosen yet */}
      {!selectedDate && (
        <p style={{ marginTop: 16, opacity: 0.8 }}>
          No date selected yet.
        </p>
      )}
    </section>
  );
}

export default Forecast;
