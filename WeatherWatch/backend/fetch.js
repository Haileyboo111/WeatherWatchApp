// fetch.js
//updated to make work with node js  

const BASE_URL = 'http://localhost:5000';

async function fetchForecast(lat, lon) {
  console.log(`Fetching: ${BASE_URL}/api/forecast?lat=${lat}&lon=${lon}`);
  try {
    const res = await fetch(`${BASE_URL}/api/forecast?lat=${lat}&lon=${lon}`);
    if (!res.ok) throw new Error("Network response not ok");
    return await res.json();
  } catch (err) {
    console.error(err);
    return { error: "Could not fetch forecast" };
  }
}

async function fetchWeatherOverview(lat, lon) {
  console.log(`Fetching: ${BASE_URL}/api/overview?lat=${lat}&lon=${lon}`);
  try {
    const res = await fetch(`${BASE_URL}/api/overview?lat=${lat}&lon=${lon}`);
    if (!res.ok) throw new Error("Network response not ok");
    return await res.json();
  } catch (err) {
    console.error(err);
    return { error: "Could not fetch overview" };
  }
}

// optional test
async function testFetch() {
  const lat = 40.7128;
  const lon = -74.0060;

  const forecast = await fetchForecast(lat, lon);
  console.log("Forecast:", forecast);

  const overview = await fetchWeatherOverview(lat, lon);
  console.log("Overview:", overview);
}

// Uncomment to test
// testFetch();

module.exports = { fetchForecast, fetchWeatherOverview };
