import React, { createContext, useContext, useMemo, useState } from 'react';

const UnitContext = createContext({
  unit: 'fahrenheit',
  toggleUnit: () => {},
});

const getStoredUnit = () => {
  if (typeof localStorage === 'undefined') {
    return 'fahrenheit';
  }
  const stored = localStorage.getItem('weatherwatch_unit');
  return stored === 'celsius' ? 'celsius' : 'fahrenheit';
};

export const UnitProvider = ({ children }) => {
  const [unit, setUnit] = useState(getStoredUnit);

  const toggleUnit = () => {
    setUnit((prev) => {
      const next = prev === 'fahrenheit' ? 'celsius' : 'fahrenheit';
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('weatherwatch_unit', next);
      }
      return next;
    });
  };

  const value = useMemo(() => ({ unit, toggleUnit }), [unit]);

  return <UnitContext.Provider value={value}>{children}</UnitContext.Provider>;
};

export const useUnit = () => useContext(UnitContext);

export const getUnitSymbol = (unit) => (unit === 'celsius' ? '°C' : '°F');

export const convertTemperature = (value, targetUnit) => {
  if (value === undefined || value === null) return value;
  const numeric = Number(value);
  if (Number.isNaN(numeric)) return value;

  if (targetUnit === 'celsius') {
    return Math.round(((numeric - 32) * 5) / 9);
  }
  return Math.round(numeric);
};

