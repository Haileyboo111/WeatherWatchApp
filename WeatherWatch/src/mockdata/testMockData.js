// testMockData.js
const axios = require("axios");

(async () => {
  try {
    // Call your mock API endpoint
    const response = await axios.get("http://localhost:3000/api/mockWeather");

    console.log("Mock Test Successful");
    console.log("Returned Data:", response.data);

    // Optional quick checks
    if (response.data.daily && response.data.weekly) {
      console.log("Data structure valid: daily & weekly forecasts found.");
    } else {
      console.error("Mock data missing expected keys.");
    }
  } catch (error) {
    console.error("Mock API Test Failed:", error.message);
  }
})();
