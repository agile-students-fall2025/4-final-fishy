import React, { useState, useEffect } from 'react';
import { searchUnsplashPhoto } from '../utils/api';

function HomePage({ onNavigate }) {
  // Mock data for trips
  const [mockTrips, setMockTrips] = useState([
    {
      id: 1,
      destination: 'Tokyo, Japan',
      startDate: '2024-03-15',
      endDate: '2024-03-22',
      budget: 2500,
      spent: 1800,
      image: null // Will be fetched from Unsplash
    },
    {
      id: 2,
      destination: 'Paris, France',
      startDate: '2024-04-10',
      endDate: '2024-04-17',
      budget: 3000,
      spent: 0,
      image: null
    },
    {
      id: 3,
      destination: 'New York, USA',
      startDate: '2024-05-05',
      endDate: '2024-05-12',
      budget: 2000,
      spent: 0,
      image: null
    }
  ]);

  // Fetch images for all destinations when component mounts
  useEffect(() => {
    const fetchImages = async () => {
      const initialTrips = [
        {
          id: 1,
          destination: 'Tokyo, Japan',
          startDate: '2024-03-15',
          endDate: '2024-03-22',
          budget: 2500,
          spent: 1800,
          image: null
        },
        {
          id: 2,
          destination: 'Paris, France',
          startDate: '2024-04-10',
          endDate: '2024-04-17',
          budget: 3000,
          spent: 0,
          image: null
        },
        {
          id: 3,
          destination: 'New York, USA',
          startDate: '2024-05-05',
          endDate: '2024-05-12',
          budget: 2000,
          spent: 0,
          image: null
        }
      ];

      const tripsWithImages = await Promise.all(
        initialTrips.map(async (trip) => {
          try {
            const imageUrl = await searchUnsplashPhoto(trip.destination, 800, 600);
            return { ...trip, image: imageUrl };
          } catch (error) {
            console.error(`Error fetching image for ${trip.destination}:`, error);
            // Return trip with fallback image
            return { 
              ...trip, 
              image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&h=600&fit=crop&q=80&auto=format' 
            };
          }
        })
      );
      setMockTrips(tripsWithImages);
    };

    fetchImages();
  }, []); // Empty dependency array means this runs once on mount

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
                <div 
                  key={trip.id} 
                  className="trip-card"
                  onClick={() => {
                    if (onNavigate) {
                      onNavigate('trips', { tripId: trip.id });
                    }
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="trip-image-wrapper">
                    <img 
                      src={trip.image || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&h=600&fit=crop&q=80&auto=format'} 
                      alt={trip.destination}
                      loading="lazy"
                      onError={(e) => {
                        // Fallback to a generic travel image if the destination image fails to load
                        e.target.src = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&h=600&fit=crop&q=80&auto=format';
                      }}
                    />
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
                    <img 
                      src={trip.image || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&h=600&fit=crop&q=80&auto=format'} 
                      alt={trip.destination}
                      loading="lazy"
                      onError={(e) => {
                        // Fallback to a generic travel image if the destination image fails to load
                        e.target.src = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&h=600&fit=crop&q=80&auto=format';
                      }}
                    />
                  </div>
                  <div className="trip-info">
                    <h4 className="trip-destination">{trip.destination}</h4>
                    <p className="trip-dates">{trip.startDate} - {trip.endDate}</p>
                    <div className="budget-info">
                      <span className="budget">Budget: ${trip.budget}</span>
                    </div>
                    <button 
                      className="plan-trip-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onNavigate) onNavigate('trips');
                      }}
                    >
                      Plan Trip
                    </button>
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
