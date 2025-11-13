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
      <div className="home-header">
        <div className="home-title-section">
          <h2 className="home-main-title">✈️ Welcome Back!</h2>
          <p className="home-subtitle">Plan your next adventure with TripMate</p>
        </div>
      </div>

      <div className="trips-overview">
        {currentTrips.length > 0 && (
          <div className="trips-section">
            <h3 className="section-title">📍 Current Trips</h3>
            <div className="trips-grid">
              {currentTrips.map(trip => (
                <div key={trip.id} className="trip-card">
                  <div className="trip-image-wrapper">
                    <img src={trip.image} alt={trip.destination} />
                  </div>
                  <div className="trip-info">
                    <h4 className="trip-destination">{trip.destination}</h4>
                    <p className="trip-dates">{trip.startDate} - {trip.endDate}</p>
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
        )}

        {upcomingTrips.length > 0 && (
          <div className="trips-section">
            <h3 className="section-title">🗓️ Upcoming Trips</h3>
            <div className="trips-grid">
              {upcomingTrips.map(trip => (
                <div key={trip.id} className="trip-card">
                  <div className="trip-image-wrapper">
                    <img src={trip.image} alt={trip.destination} />
                  </div>
                  <div className="trip-info">
                    <h4 className="trip-destination">{trip.destination}</h4>
                    <p className="trip-dates">{trip.startDate} - {trip.endDate}</p>
                    <div className="budget-info">
                      <span className="budget">Budget: ${trip.budget}</span>
                    </div>
                    <button className="plan-trip-btn">Plan Trip</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentTrips.length === 0 && upcomingTrips.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">🌍</div>
            <h3>No trips yet</h3>
            <p>Start planning your first adventure!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default HomePage;
