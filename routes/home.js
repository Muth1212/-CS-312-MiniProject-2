const express = require('express');
const router = express.Router();
const axios = require('axios');

// Function to get latitude and longitude from city name
const getLatLon = async (city) => {
  try {
    const apiKey = process.env.API_KEY;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    const response = await axios.get(url);
    const { lat, lon } = response.data.coord; // Get latitude and longitude
    return { lat, lon };
  } catch (error) {
    console.error("Error fetching coordinates:", error.message);
    return null; // Return null if there's an error
  }
};

// Function to get weather data based on latitude and longitude
const getWeather = async (lat, lon) => {
  try {
    const apiKey = process.env.API_KEY;
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching weather data:", error.message);
    return null;
  }
};

// Route to display form
router.get('/', (req, res) => {
  res.render('form', { weather: null, location: '', error: null });
});

// Route to handle form submission
router.post('/get-weather', async (req, res) => {
  const city = req.body.location;
  const coordinates = await getLatLon(city);

  if (coordinates) {
    const weatherData = await getWeather(coordinates.lat, coordinates.lon);
    if (weatherData) {
      // Convert temperature from Kelvin to Celsius
      const tempCelsius = (weatherData.main.temp - 273.15).toFixed(2);
      res.render('form', {
        weather: { current: { temp: tempCelsius, description: weatherData.weather[0].description } },
        location: city,
        error: null,
      });
    } else {
      res.render('form', {
        weather: null,
        location: city,
        error: "Unable to fetch weather data. Please try again.",
      });
    }
  } else {
    res.render('form', {
      weather: null,
      location: city,
      error: "Could not find location. Please try again.",
    });
  }
});

module.exports = router;
