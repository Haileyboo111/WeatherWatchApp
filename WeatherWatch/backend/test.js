// test.js
const { fetchForecast, fetchWeatherOverview, geocodeDestination } = require('./fetch');

(async () => {
  const lat = 40.7128;
  const lon = -74.0060;

  const forecast = await fetchForecast(lat, lon);
  console.log("Forecast:", forecast);

  const overview = await fetchWeatherOverview(lat, lon);
  console.log("Overview:", overview);

  try {
    const destination = "Chicago, IL";

    console.log(`\nTesting geocode lookup for destination: ${destination}`);

    const geoResult = await geocodeDestination(destination);
    console.log("Geocode Result:", geoResult);

    if (!geoResult || !geoResult.lat || !geoResult.lon) {
      throw new Error("Geocode failed to return valid coordinates.");
    }

    const destForecast = await fetchForecast(geoResult.lat, geoResult.lon);
    console.log("Forecast for Destination:", destForecast);

    const destOverview = await fetchWeatherOverview(geoResult.lat, geoResult.lon);
    console.log("Overview for Destination:", destOverview);

  } catch (err) {
    console.error("Destination Lookup Test Failed:", err.message);
  }

})();
