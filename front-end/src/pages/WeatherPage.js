import React, { useState, useEffect } from 'react';
import { fetchWeather } from '../utils/api.js';
import LocationAutocomplete from '../components/LocationAutocomplete';

function WeatherPage() {
  const [selectedLocation, setSelectedLocation] = useState('Tokyo');
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [locationInputValue, setLocationInputValue] = useState('');

  // Fetch weather data when location changes
  useEffect(() => {
    const loadWeather = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchWeather(selectedLocation);
        setWeatherData(data);
      } catch (err) {
        setError(err.message);
        setWeatherData(null);
      } finally {
        setLoading(false);
      }
    };

    if (selectedLocation) {
      loadWeather();
    }
  }, [selectedLocation]);

  const handleLocationSubmit = (e) => {
    e.preventDefault();
    if (locationInputValue && locationInputValue.trim()) {
      setSelectedLocation(locationInputValue.trim());
      setLocationInputValue('');
    }
  };

  const handleLocationSelect = (placeData) => {
    if (placeData?.name) {
      setSelectedLocation(placeData.name);
      setLocationInputValue('');
    }
  };

  // Quick location options
  const quickLocations = ['Tokyo', 'Paris', 'New York', 'London', 'Sydney', 'Dubai'];

  return (
    <div className="weather-page">
      <div className="weather-header">
        <div className="weather-title-section">
          <h2 className="weather-main-title">🌤️ Weather Forecast</h2>
          <p className="weather-subtitle">Get real-time weather updates for your travel destinations</p>
        </div>
        <div className="location-selector">
          <form onSubmit={handleLocationSubmit} className="weather-search-form">
            <div className="search-input-wrapper">
              <span className="search-icon">🔍</span>
              <LocationAutocomplete
                id="location-input"
                name="locationInput"
                placeholder="Search for a city..."
                className="weather-search-input"
                value={locationInputValue}
                onChange={(e) => setLocationInputValue(e.target.value)}
                onPlaceSelect={handleLocationSelect}
              />
              <button type="submit" className="weather-search-btn">
                Search
              </button>
            </div>
          </form>
          <div className="quick-locations">
            <span className="quick-locations-label">Popular cities:</span>
            <div className="quick-location-buttons">
              {quickLocations.map(location => (
                <button
                  key={location}
                  onClick={() => setSelectedLocation(location)}
                  className={`quick-location-btn ${selectedLocation === location ? 'active' : ''}`}
                >
                  {location}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {loading && (
        <div className="weather-loading">
          <div className="loading-spinner"></div>
          <p>Loading weather data...</p>
        </div>
      )}

      {error && (
        <div className="weather-error">
          <div className="error-icon">⚠️</div>
          <p className="error-message">{error}</p>
          <button onClick={() => setSelectedLocation(selectedLocation)} className="retry-btn">
            Try Again
          </button>
        </div>
      )}

      {!loading && !error && weatherData && (
        <>
          <div className="current-weather">
            <div className="current-weather-card">
              <div className="weather-main">
                <div className="weather-icon-large">{weatherData.current.icon}</div>
                <div className="weather-temp-large">{weatherData.current.temperature}°</div>
                <div className="weather-condition-text">{weatherData.current.condition}</div>
                <div className="weather-location-text">
                  <span className="location-icon">📍</span>
                  {weatherData.location || selectedLocation}
                </div>
              </div>
              <div className="weather-details">
                <div className="detail-item">
                  <div className="detail-icon">💧</div>
                  <div className="detail-info">
                    <span className="detail-label">Humidity</span>
                    <span className="detail-value">{weatherData.current.humidity}%</span>
                  </div>
                </div>
                <div className="detail-item">
                  <div className="detail-icon">💨</div>
                  <div className="detail-info">
                    <span className="detail-label">Wind Speed</span>
                    <span className="detail-value">{weatherData.current.windSpeed} km/h</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="forecast-section">
            <h3 className="forecast-title">📅 5-Day Forecast</h3>
            <div className="forecast-grid">
              {weatherData.forecast && weatherData.forecast.length > 0 ? (
                weatherData.forecast.map((day, index) => (
                  <div key={index} className="forecast-card">
                    <div className="forecast-day">{day.day}</div>
                    <div className="forecast-icon">{day.icon}</div>
                    <div className="forecast-condition">{day.condition}</div>
                    <div className="forecast-temps">
                      <span className="high-temp">{day.high}°</span>
                      <span className="temp-separator">/</span>
                      <span className="low-temp">{day.low}°</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="no-forecast">No forecast data available</p>
              )}
            </div>
          </div>
        </>
      )}

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
