import React, { useState } from 'react';
import './Calendar.css';

// Small month-view calendar with simple navigation and selection

function Calendar({ value, onChange }) {
  // Reference for "today"
  const today = new Date();
  // Month currently shown in the calendar
  const [viewDate, setViewDate] = useState(value instanceof Date ? value : today);

  const viewYear = viewDate.getFullYear();
  const viewMonth = viewDate.getMonth(); // 0-11

  // Month boundaries and metrics
  const firstOfMonth = new Date(viewYear, viewMonth, 1);
  const firstWeekday = firstOfMonth.getDay(); // 0 (Sun) - 6 (Sat)
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  // Shallow date comparison (ignores time)
  const isSameDay = (a, b) =>
    a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

  // Move the view backward/forward by one month
  const goPrevMonth = () => setViewDate(new Date(viewYear, viewMonth - 1, 1));
  const goNextMonth = () => setViewDate(new Date(viewYear, viewMonth + 1, 1));

  // Simple 6x7 grid (42 cells). Compute each cell's date.
  const totalCells = 42;
  const cells = Array.from({ length: totalCells }, (_, i) => {
    const dayNumber = i - firstWeekday + 1; // relative to current month
    const date = new Date(viewYear, viewMonth, dayNumber);
    const outside = date.getMonth() !== viewMonth; // not part of current month
    return { date, outside };
  });

  // e.g., "October 2025"
  const monthLabel = new Intl.DateTimeFormat(undefined, { month: 'long', year: 'numeric' })
    .format(new Date(viewYear, viewMonth, 1));

  // Short weekday labels in display order
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="calendar" role="group" aria-label="Calendar">
      {/* Header: navigation + current month label */}
      <div className="calendar__header">
        <button type="button" className="calendar__nav-btn" onClick={goPrevMonth} aria-label="Previous month">◀</button>
        <div className="calendar__month" aria-live="polite">{monthLabel}</div>
        <button type="button" className="calendar__nav-btn" onClick={goNextMonth} aria-label="Next month">▶</button>
      </div>

      {/* Weekday headers + day cells */}
      <div className="calendar__grid" role="grid" aria-readonly>
        {weekdays.map((w) => (
          <div key={w} className="calendar__weekday" role="columnheader" aria-label={w}>
            {w}
          </div>
        ))}

        {cells.map(({ date, outside }, idx) => {
          const selected = isSameDay(value, date);
          const isToday = isSameDay(today, date);
          const classNames = [
            'calendar__day',
            outside ? 'is-outside' : '',
            selected ? 'is-selected' : '',
            isToday ? 'is-today' : ''
          ].filter(Boolean).join(' ');

          return (
            <button
              key={idx}
              type="button"
              className={classNames}
              onClick={() => onChange && onChange(new Date(date.getFullYear(), date.getMonth(), date.getDate()))}
              aria-pressed={selected}
              role="gridcell"
              aria-label={date.toDateString()}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default Calendar;

