// back-end/src/routes/weatherRoutes.js
import { Router } from 'express';
import {
  getCurrentWeather,
  getForecast,
  getWeatherAndForecast
} from '../controllers/weatherController.js';

const router = Router();

// Get current weather for a location
router.get('/current/:location', getCurrentWeather);

// Get 5-day forecast for a location
router.get('/forecast/:location', getForecast);

// Get both current weather and forecast (recommended endpoint)
router.get('/:location', getWeatherAndForecast);

export default router;

