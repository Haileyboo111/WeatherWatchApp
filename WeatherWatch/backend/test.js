// test.js
const { fetchForecast, fetchWeatherOverview } = require('./fetch');

(async () => {
  const lat = 40.7128;
  const lon = -74.0060;

  const forecast = await fetchForecast(lat, lon);
  console.log("Forecast:", forecast);

  const overview = await fetchWeatherOverview(lat, lon);
  console.log("Overview:", overview);
})();
