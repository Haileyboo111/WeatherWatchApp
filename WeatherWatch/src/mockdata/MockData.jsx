// Simulated weather data for calendar 
// to give an example of output, while we are not connecting the front and backend 

// Mock travel events for the calendar
export const fetchMockEvents = () => {
  return Promise.resolve([
    { id: 1, date: "2025-11-05", title: "Trip to Chicago", description: "Weekend getaway" },
    { id: 2, date: "2025-11-12", title: "Beach Vacation", description: "3-day trip to Florida" },
    { id: 3, date: "2025-11-20", title: "Hiking Adventure", description: "National park trip" },
  ]);
};

// Example weather data for trips
export const mockWeatherData = {
  city: "St. Louis, MO",
  temperature: 67,
  condition: "Cloudy",
  high: 70,
  low: 55,
  humidity: 60,
  windSpeed: 10,
};

// Example forecast for upcoming days
export const mockForecast = [
  { date: "2025-11-05", condition: "Sunny", high: 70, low: 58 },
  { date: "2025-11-06", condition: "Rainy", high: 66, low: 54 },
  { date: "2025-11-07", condition: "Partly Cloudy", high: 68, low: 56 },
  { date: "2025-11-08", condition: "Thunderstorms", high: 64, low: 52 },
];