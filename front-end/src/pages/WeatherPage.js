import React, { useState } from 'react';

function WeatherPage() {
  const [selectedLocation, setSelectedLocation] = useState('Tokyo');

  // Mock weather data
  const mockWeatherData = {
    'Tokyo': {
      current: {
        temperature: 22,
        condition: 'Partly Cloudy',
        humidity: 65,
        windSpeed: 12,
        icon: '⛅'
      },
      forecast: [
        { day: 'Today', high: 25, low: 18, condition: 'Partly Cloudy', icon: '⛅' },
        { day: 'Tomorrow', high: 27, low: 20, condition: 'Sunny', icon: '☀️' },
        { day: 'Wednesday', high: 24, low: 17, condition: 'Rainy', icon: '🌧️' },
        { day: 'Thursday', high: 26, low: 19, condition: 'Cloudy', icon: '☁️' },
        { day: 'Friday', high: 28, low: 21, condition: 'Sunny', icon: '☀️' }
      ]
    },
    'Paris': {
      current: {
        temperature: 15,
        condition: 'Rainy',
        humidity: 80,
        windSpeed: 8,
        icon: '🌧️'
      },
      forecast: [
        { day: 'Today', high: 17, low: 12, condition: 'Rainy', icon: '🌧️' },
        { day: 'Tomorrow', high: 19, low: 14, condition: 'Cloudy', icon: '☁️' },
        { day: 'Wednesday', high: 21, low: 16, condition: 'Partly Cloudy', icon: '⛅' },
        { day: 'Thursday', high: 18, low: 13, condition: 'Rainy', icon: '🌧️' },
        { day: 'Friday', high: 20, low: 15, condition: 'Sunny', icon: '☀️' }
      ]
    },
    'New York': {
      current: {
        temperature: 18,
        condition: 'Cloudy',
        humidity: 70,
        windSpeed: 15,
        icon: '☁️'
      },
      forecast: [
        { day: 'Today', high: 20, low: 15, condition: 'Cloudy', icon: '☁️' },
        { day: 'Tomorrow', high: 22, low: 17, condition: 'Sunny', icon: '☀️' },
        { day: 'Wednesday', high: 19, low: 14, condition: 'Rainy', icon: '🌧️' },
        { day: 'Thursday', high: 21, low: 16, condition: 'Partly Cloudy', icon: '⛅' },
        { day: 'Friday', high: 23, low: 18, condition: 'Sunny', icon: '☀️' }
      ]
    }
  };

  const locations = Object.keys(mockWeatherData);
  const currentWeather = mockWeatherData[selectedLocation].current;
  const forecast = mockWeatherData[selectedLocation].forecast;

  return (
    <div className="weather-page">
      <div className="weather-header">
        <h2>Weather Forecast</h2>
        <div className="location-selector">
          <label htmlFor="location-select">Select Location:</label>
          <select 
            id="location-select"
            value={selectedLocation} 
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="location-dropdown"
          >
            {locations.map(location => (
              <option key={location} value={location}>{location}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="current-weather">
        <div className="current-weather-card">
          <div className="weather-main">
            <div className="weather-icon">{currentWeather.icon}</div>
            <div className="weather-temp">{currentWeather.temperature}°C</div>
            <div className="weather-condition">{currentWeather.condition}</div>
            <div className="weather-location">{selectedLocation}</div>
          </div>
          <div className="weather-details">
            <div className="detail-item">
              <span className="detail-label">Humidity</span>
              <span className="detail-value">{currentWeather.humidity}%</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Wind Speed</span>
              <span className="detail-value">{currentWeather.windSpeed} km/h</span>
            </div>
          </div>
        </div>
      </div>

      <div className="forecast-section">
        <h3>5-Day Forecast</h3>
        <div className="forecast-grid">
          {forecast.map((day, index) => (
            <div key={index} className="forecast-card">
              <div className="forecast-day">{day.day}</div>
              <div className="forecast-icon">{day.icon}</div>
              <div className="forecast-condition">{day.condition}</div>
              <div className="forecast-temps">
                <span className="high-temp">{day.high}°</span>
                <span className="low-temp">{day.low}°</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="weather-tips">
        <h3>Travel Tips</h3>
        <div className="tips-grid">
          <div className="tip-card">
            <div className="tip-icon">👕</div>
            <div className="tip-content">
              <h4>Packing</h4>
              <p>Pack layers for variable weather conditions</p>
            </div>
          </div>
          <div className="tip-card">
            <div className="tip-icon">🌂</div>
            <div className="tip-content">
              <h4>Rain Gear</h4>
              <p>Bring an umbrella or rain jacket</p>
            </div>
          </div>
          <div className="tip-card">
            <div className="tip-icon">☀️</div>
            <div className="tip-content">
              <h4>Sun Protection</h4>
              <p>Don't forget sunscreen and sunglasses</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WeatherPage;
