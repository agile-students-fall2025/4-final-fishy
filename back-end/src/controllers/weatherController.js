// back-end/src/controllers/weatherController.js
import Joi from 'joi';

const API_KEY = process.env.OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

const locationSchema = Joi.object({
  location: Joi.string().min(1).required(),
});

// Helper function to get weather icon emoji based on OpenWeather condition code
function getWeatherIcon(conditionCode) {
  // OpenWeather condition codes: https://openweathermap.org/weather-conditions
  if (conditionCode >= 200 && conditionCode < 300) return '⛈️'; // Thunderstorm
  if (conditionCode >= 300 && conditionCode < 400) return '🌧️'; // Drizzle
  if (conditionCode >= 500 && conditionCode < 600) return '🌧️'; // Rain
  if (conditionCode >= 600 && conditionCode < 700) return '❄️'; // Snow
  if (conditionCode >= 700 && conditionCode < 800) return '🌫️'; // Atmosphere (fog, mist, etc.)
  if (conditionCode === 800) return '☀️'; // Clear
  if (conditionCode === 801) return '⛅'; // Few clouds
  if (conditionCode >= 802 && conditionCode <= 804) return '☁️'; // Cloudy
  return '🌤️'; // Default
}

// Helper function to format condition description
function formatCondition(description) {
  return description
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Get current weather for a location
export async function getCurrentWeather(req, res) {
  try {
    const { value, error } = locationSchema.validate({ location: req.params.location });
    if (error) {
      return res.status(400).json({ error: error.message });
    }

    if (!API_KEY) {
      return res.status(500).json({ error: 'OpenWeather API key not configured' });
    }

    const url = `${BASE_URL}/weather?q=${encodeURIComponent(value.location)}&appid=${API_KEY}&units=metric`;
    const response = await fetch(url);

    if (!response.ok) {
      if (response.status === 404) {
        return res.status(404).json({ error: 'Location not found' });
      }
      const errorData = await response.json().catch(() => ({}));
      return res.status(response.status).json({ 
        error: errorData.message || 'Failed to fetch weather data' 
      });
    }

    const data = await response.json();
    
    // Transform OpenWeather response to match front-end expected format
    const weatherData = {
      current: {
        temperature: Math.round(data.main.temp),
        condition: formatCondition(data.weather[0].description),
        humidity: data.main.humidity,
        windSpeed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
        icon: getWeatherIcon(data.weather[0].id),
      },
      location: data.name,
    };

    res.json(weatherData);
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch current weather', details: e.message });
  }
}

// Get 5-day forecast for a location
export async function getForecast(req, res) {
  try {
    const { value, error } = locationSchema.validate({ location: req.params.location });
    if (error) {
      return res.status(400).json({ error: error.message });
    }

    if (!API_KEY) {
      return res.status(500).json({ error: 'OpenWeather API key not configured' });
    }

    const url = `${BASE_URL}/forecast?q=${encodeURIComponent(value.location)}&appid=${API_KEY}&units=metric`;
    const response = await fetch(url);

    if (!response.ok) {
      if (response.status === 404) {
        return res.status(404).json({ error: 'Location not found' });
      }
      const errorData = await response.json().catch(() => ({}));
      return res.status(response.status).json({ 
        error: errorData.message || 'Failed to fetch forecast data' 
      });
    }

    const data = await response.json();
    
    // Group forecast by day and get daily high/low
    const dailyForecasts = {};
    const today = new Date();
    
    data.list.forEach(item => {
      const date = new Date(item.dt * 1000);
      const dayKey = date.toDateString();
      
      if (!dailyForecasts[dayKey]) {
        dailyForecasts[dayKey] = {
          date: date,
          temps: [],
          conditions: [],
          conditionCodes: [],
        };
      }
      
      dailyForecasts[dayKey].temps.push(item.main.temp_max, item.main.temp_min);
      dailyForecasts[dayKey].conditions.push(item.weather[0].description);
      dailyForecasts[dayKey].conditionCodes.push(item.weather[0].id);
    });

    // Transform to front-end expected format (5 days starting from today)
    const forecast = [];
    const dayNames = ['Today', 'Tomorrow', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    
    for (let i = 0; i < 5; i++) {
      const forecastDate = new Date(today);
      forecastDate.setDate(today.getDate() + i);
      const dayKey = forecastDate.toDateString();
      
      if (dailyForecasts[dayKey]) {
        const dayData = dailyForecasts[dayKey];
        const high = Math.round(Math.max(...dayData.temps));
        const low = Math.round(Math.min(...dayData.temps));
        // Use the most common condition or first one
        const mainCondition = dayData.conditions[Math.floor(dayData.conditions.length / 2)];
        const mainConditionCode = dayData.conditionCodes[Math.floor(dayData.conditionCodes.length / 2)];
        
        forecast.push({
          day: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : forecastDate.toLocaleDateString('en-US', { weekday: 'long' }),
          high,
          low,
          condition: formatCondition(mainCondition),
          icon: getWeatherIcon(mainConditionCode),
        });
      }
    }

    res.json({ forecast, location: data.city.name });
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch forecast', details: e.message });
  }
}

// Get both current weather and forecast
export async function getWeatherAndForecast(req, res) {
  try {
    const { value, error } = locationSchema.validate({ location: req.params.location });
    if (error) {
      return res.status(400).json({ error: error.message });
    }

    if (!API_KEY) {
      return res.status(500).json({ error: 'OpenWeather API key not configured' });
    }

    // Fetch both current weather and forecast in parallel
    const [currentResponse, forecastResponse] = await Promise.all([
      fetch(`${BASE_URL}/weather?q=${encodeURIComponent(value.location)}&appid=${API_KEY}&units=metric`),
      fetch(`${BASE_URL}/forecast?q=${encodeURIComponent(value.location)}&appid=${API_KEY}&units=metric`),
    ]);

    if (!currentResponse.ok) {
      if (currentResponse.status === 404) {
        return res.status(404).json({ error: 'Location not found' });
      }
      const errorData = await currentResponse.json().catch(() => ({}));
      return res.status(currentResponse.status).json({ 
        error: errorData.message || 'Failed to fetch weather data' 
      });
    }

    if (!forecastResponse.ok) {
      if (forecastResponse.status === 404) {
        return res.status(404).json({ error: 'Location not found' });
      }
      const errorData = await forecastResponse.json().catch(() => ({}));
      return res.status(forecastResponse.status).json({ 
        error: errorData.message || 'Failed to fetch forecast data' 
      });
    }

    const [currentData, forecastData] = await Promise.all([
      currentResponse.json(),
      forecastResponse.json(),
    ]);

    // Transform current weather
    const current = {
      temperature: Math.round(currentData.main.temp),
      condition: formatCondition(currentData.weather[0].description),
      humidity: currentData.main.humidity,
      windSpeed: Math.round(currentData.wind.speed * 3.6),
      icon: getWeatherIcon(currentData.weather[0].id),
    };

    // Transform forecast (same logic as getForecast)
    const dailyForecasts = {};
    const today = new Date();
    
    forecastData.list.forEach(item => {
      const date = new Date(item.dt * 1000);
      const dayKey = date.toDateString();
      
      if (!dailyForecasts[dayKey]) {
        dailyForecasts[dayKey] = {
          date: date,
          temps: [],
          conditions: [],
          conditionCodes: [],
        };
      }
      
      dailyForecasts[dayKey].temps.push(item.main.temp_max, item.main.temp_min);
      dailyForecasts[dayKey].conditions.push(item.weather[0].description);
      dailyForecasts[dayKey].conditionCodes.push(item.weather[0].id);
    });

    const forecast = [];
    for (let i = 0; i < 5; i++) {
      const forecastDate = new Date(today);
      forecastDate.setDate(today.getDate() + i);
      const dayKey = forecastDate.toDateString();
      
      if (dailyForecasts[dayKey]) {
        const dayData = dailyForecasts[dayKey];
        const high = Math.round(Math.max(...dayData.temps));
        const low = Math.round(Math.min(...dayData.temps));
        const mainCondition = dayData.conditions[Math.floor(dayData.conditions.length / 2)];
        const mainConditionCode = dayData.conditionCodes[Math.floor(dayData.conditionCodes.length / 2)];
        
        forecast.push({
          day: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : forecastDate.toLocaleDateString('en-US', { weekday: 'long' }),
          high,
          low,
          condition: formatCondition(mainCondition),
          icon: getWeatherIcon(mainConditionCode),
        });
      }
    }

    res.json({
      current,
      forecast,
      location: currentData.name,
    });
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch weather data', details: e.message });
  }
}

