import React, { useState, useEffect } from 'react';
import { fetchWeather } from '../utils/api.js';

function WeatherPage() {
  const [selectedLocation, setSelectedLocation] = useState('Tokyo');
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    const input = e.target.elements.locationInput;
    if (input && input.value.trim()) {
      setSelectedLocation(input.value.trim());
      input.value = '';
    }
  };

  // Quick location options
  const quickLocations = ['Tokyo', 'Paris', 'New York', 'London', 'Sydney', 'Dubai'];

  return (
    <div className="weather-page">
      <div className="weather-header">
        <h2>Weather Forecast</h2>
        <div className="location-selector">
          <form onSubmit={handleLocationSubmit} style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px' }}>
            <label htmlFor="location-input">Search Location:</label>
            <input 
              id="location-input"
              name="locationInput"
              type="text"
              placeholder="Enter city name..."
              style={{ padding: '5px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
            <button type="submit" style={{ padding: '5px 15px', borderRadius: '4px', border: '1px solid #ccc', cursor: 'pointer' }}>
              Search
            </button>
          </form>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
            <span>Quick select:</span>
            {quickLocations.map(location => (
              <button
                key={location}
                onClick={() => setSelectedLocation(location)}
                style={{
                  padding: '5px 10px',
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                  cursor: 'pointer',
                  backgroundColor: selectedLocation === location ? '#007bff' : 'white',
                  color: selectedLocation === location ? 'white' : 'black'
                }}
              >
                {location}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading && (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <p>Loading weather data...</p>
        </div>
      )}

      {error && (
        <div style={{ textAlign: 'center', padding: '20px', color: 'red' }}>
          <p>Error: {error}</p>
        </div>
      )}

      {!loading && !error && weatherData && (
        <>
          <div className="current-weather">
            <div className="current-weather-card">
              <div className="weather-main">
                <div className="weather-icon">{weatherData.current.icon}</div>
                <div className="weather-temp">{weatherData.current.temperature}°C</div>
                <div className="weather-condition">{weatherData.current.condition}</div>
                <div className="weather-location">{weatherData.location || selectedLocation}</div>
              </div>
              <div className="weather-details">
                <div className="detail-item">
                  <span className="detail-label">Humidity</span>
                  <span className="detail-value">{weatherData.current.humidity}%</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Wind Speed</span>
                  <span className="detail-value">{weatherData.current.windSpeed} km/h</span>
                </div>
              </div>
            </div>
          </div>

          <div className="forecast-section">
            <h3>5-Day Forecast</h3>
            <div className="forecast-grid">
              {weatherData.forecast && weatherData.forecast.length > 0 ? (
                weatherData.forecast.map((day, index) => (
                  <div key={index} className="forecast-card">
                    <div className="forecast-day">{day.day}</div>
                    <div className="forecast-icon">{day.icon}</div>
                    <div className="forecast-condition">{day.condition}</div>
                    <div className="forecast-temps">
                      <span className="high-temp">{day.high}°</span>
                      <span className="low-temp">{day.low}°</span>
                    </div>
                  </div>
                ))
              ) : (
                <p>No forecast data available</p>
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
