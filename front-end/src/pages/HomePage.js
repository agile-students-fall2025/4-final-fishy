import React from 'react';

function HomePage() {
  // Mock data for trips
  const mockTrips = [
    {
      id: 1,
      destination: 'Tokyo, Japan',
      startDate: '2024-03-15',
      endDate: '2024-03-22',
      budget: 2500,
      spent: 1800,
      image: 'https://picsum.photos/300/200?random=1'
    },
    {
      id: 2,
      destination: 'Paris, France',
      startDate: '2024-04-10',
      endDate: '2024-04-17',
      budget: 3000,
      spent: 0,
      image: 'https://picsum.photos/300/200?random=2'
    },
    {
      id: 3,
      destination: 'New York, USA',
      startDate: '2024-05-05',
      endDate: '2024-05-12',
      budget: 2000,
      spent: 0,
      image: 'https://picsum.photos/300/200?random=3'
    }
  ];

  const upcomingTrips = mockTrips.filter(trip => trip.spent === 0);
  const currentTrips = mockTrips.filter(trip => trip.spent > 0);

  return (
    <div className="home-page">
      <div className="welcome-section">
        <h2>Welcome back!</h2>
        <p>Plan your next adventure with TripMate</p>
      </div>

      <div className="trips-overview">
        <div className="trips-section">
          <h3>Current Trips</h3>
          <div className="trips-grid">
            {currentTrips.map(trip => (
              <div key={trip.id} className="trip-card">
                <img src={trip.image} alt={trip.destination} />
                <div className="trip-info">
                  <h4>{trip.destination}</h4>
                  <p>{trip.startDate} - {trip.endDate}</p>
                  <div className="budget-info">
                    <span className="spent">${trip.spent}</span>
                    <span className="budget">/ ${trip.budget}</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${(trip.spent / trip.budget) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="trips-section">
          <h3>Upcoming Trips</h3>
          <div className="trips-grid">
            {upcomingTrips.map(trip => (
              <div key={trip.id} className="trip-card">
                <img src={trip.image} alt={trip.destination} />
                <div className="trip-info">
                  <h4>{trip.destination}</h4>
                  <p>{trip.startDate} - {trip.endDate}</p>
                  <div className="budget-info">
                    <span className="budget">Budget: ${trip.budget}</span>
                  </div>
                  <button className="plan-trip-btn">Plan Trip</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="action-buttons">
          <button className="action-btn">
            <span className="action-icon">✈️</span>
            <span>Plan New Trip</span>
          </button>
          <button className="action-btn">
            <span className="action-icon">🗺️</span>
            <span>View Map</span>
          </button>
          <button className="action-btn">
            <span className="action-icon">💰</span>
            <span>Track Budget</span>
          </button>
          <button className="action-btn">
            <span className="action-icon">🌤️</span>
            <span>Check Weather</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
