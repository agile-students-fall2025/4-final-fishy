import React, { useState, useEffect, useMemo } from 'react';
import { searchUnsplashPhoto } from '../utils/api';
import { useTrips } from '../context/TripContext';
import { useBudgets } from '../context/BudgetContext';
import { useReminders } from '../context/RemindersContext';
import { formatPrettyDate } from '../utils/helpers';

function HomePage({ onNavigate }) {
  const { trips, loading: tripsLoading } = useTrips();
  const { budgets, getTotalSpent, loading: budgetsLoading } = useBudgets();
  const { highPriorityReminders, upcomingReminders } = useReminders();
  const [tripImages, setTripImages] = useState({});


  // Match trips with budgets by tripId (direct link)
  const matchTripWithBudget = (trip) => {
    if (!trip || !trip.id || !budgets || budgets.length === 0) return null;
    
    // Match by tripId - budgets are now directly linked to trips
    // Ensure both are strings for comparison
    const tripId = String(trip.id).trim();
    
    // Try to find matching budget
    const budget = budgets.find(b => {
      if (!b || !b.tripId) {
        // Budget without tripId - likely created before tripId requirement
        return false;
      }
      const budgetTripId = String(b.tripId).trim();
      return budgetTripId === tripId;
    });
    
    return budget || null;
  };

  // Combine trips with budget data
  const tripsWithBudget = useMemo(() => {
    if (!trips || trips.length === 0) return [];
    if (!budgets || budgets.length === 0) {
      // If no budgets, return trips without budget data
      return trips.map(trip => ({
        ...trip,
        budget: 0,
        spent: 0,
        budgetId: null,
        image: tripImages[trip.id] || null
      }));
    }
    
      return trips.map(trip => {
      const budget = matchTripWithBudget(trip);
      const spent = budget ? getTotalSpent(budget) : 0;
      const budgetLimit = budget ? budget.limit : 0;
      
      return {
        ...trip,
        budget: budgetLimit,
        spent: spent,
        budgetId: budget?.id || null,
        image: tripImages[trip.id] || null
      };
    });
  }, [trips, budgets, getTotalSpent, tripImages]);

  // Determine if trip is current (ongoing) or upcoming (future)
  const categorizeTrips = (trips) => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    return trips.reduce((acc, trip) => {
      let startDate = null;
      let endDate = null;
      
      // Parse dates if they exist and are valid
      if (trip.startDate && trip.startDate.trim()) {
        startDate = new Date(trip.startDate);
        if (isNaN(startDate.getTime())) startDate = null;
      }
      if (trip.endDate && trip.endDate.trim()) {
        endDate = new Date(trip.endDate);
        if (isNaN(endDate.getTime())) endDate = null;
      }
      
      // Trip is current if:
      // 1. Today is between start and end date, OR
      // 2. Trip has expenses (spent > 0) and start date has passed, OR
      // 3. Trip has expenses and no dates set (assume it's ongoing)
      let isCurrent = false;
      
      if (startDate && endDate) {
        isCurrent = now >= startDate && now <= endDate;
      } else if (trip.spent > 0) {
        // If there are expenses, consider it current if start date has passed or no start date
        isCurrent = !startDate || now >= startDate;
      }
      
      if (isCurrent) {
        acc.current.push(trip);
      } else {
        acc.upcoming.push(trip);
      }
      
      return acc;
    }, { current: [], upcoming: [] });
  };

  const { current: currentTrips, upcoming: upcomingTrips } = useMemo(() => {
    return categorizeTrips(tripsWithBudget);
  }, [tripsWithBudget]);

  // Fetch images for all destinations
  useEffect(() => {
    const fetchImages = async () => {
      const tripsNeedingImages = trips.filter(trip => 
        trip.destination && !tripImages[trip.id]
      );

      if (tripsNeedingImages.length === 0) return;

      const imagePromises = tripsNeedingImages.map(async (trip) => {
        try {
          const imageUrl = await searchUnsplashPhoto(trip.destination, 800, 600);
          setTripImages(prev => ({ ...prev, [trip.id]: imageUrl }));
        } catch (error) {
          console.error(`Error fetching image for ${trip.destination}:`, error);
          setTripImages(prev => ({ 
            ...prev, 
            [trip.id]: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&h=600&fit=crop&q=80&auto=format' 
          }));
        }
      });

      await Promise.all(imagePromises);
    };

    fetchImages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trips]);

  const loading = tripsLoading || budgetsLoading;

  return (
    <div className="home-page">
      <div className="home-header">
        <div className="home-title-section">
          <h2 className="home-main-title">✈️ Welcome Back!</h2>
          <p className="home-subtitle">Plan your next adventure with TripMate</p>
        </div>
      </div>

      {/* Reminders Widget */}
      {!loading && highPriorityReminders.length > 0 && (
        <div className="reminders-widget">
          <div className="reminders-widget__header">
            <h3>🔔 Important Reminders</h3>
            <button
              className="tm-link"
              onClick={() => onNavigate('reminders')}
            >
              View All →
            </button>
          </div>
          <div className="reminders-widget__list">
            {highPriorityReminders.slice(0, 3).map((reminder) => (
              <div
                key={reminder.id}
                className="reminders-widget__item"
                onClick={() => onNavigate('trips', { tripId: reminder.tripId })}
                style={{ cursor: 'pointer' }}
              >
                <div className="reminders-widget__icon">
                  {reminder.type === 'departure' && '✈️'}
                  {reminder.type === 'return' && '🏠'}
                  {reminder.type === 'ongoing' && '📍'}
                </div>
                <div className="reminders-widget__content">
                  <div className="reminders-widget__title">{reminder.title}</div>
                  <div className="reminders-widget__message">{reminder.message}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="trips-overview">
        {loading && (
          <div className="empty-state">
            <div className="empty-icon">⏳</div>
            <h3>Loading trips...</h3>
          </div>
        )}

        {!loading && currentTrips.length > 0 && (
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
                    <h4 className="trip-destination">{trip.destination || 'Untitled trip'}</h4>
                    <p className="trip-dates">
                      {formatPrettyDate(trip.startDate) || '—'} {trip.endDate ? ` - ${formatPrettyDate(trip.endDate)}` : ''}
                    </p>
                    {trip.budget > 0 ? (
                      <>
                        <div className="budget-info">
                          <span className="spent">${trip.spent.toLocaleString()}</span>
                          <span className="budget">/ ${trip.budget.toLocaleString()}</span>
                        </div>
                        <div className="progress-bar">
                          <div 
                            className="progress-fill" 
                            style={{ width: `${Math.min(100, (trip.spent / trip.budget) * 100)}%` }}
                          ></div>
                        </div>
                      </>
                    ) : (
                      <div className="budget-info">
                        <span className="budget">No budget set</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!loading && upcomingTrips.length > 0 && (
          <div className="trips-section">
            <h3 className="section-title">🗓️ Upcoming Trips</h3>
            <div className="trips-grid">
              {upcomingTrips.map(trip => (
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
                    <h4 className="trip-destination">{trip.destination || 'Untitled trip'}</h4>
                    <p className="trip-dates">
                      {formatPrettyDate(trip.startDate) || '—'} {trip.endDate ? ` - ${formatPrettyDate(trip.endDate)}` : ''}
                    </p>
                    {trip.budget > 0 ? (
                      <div className="budget-info">
                        <span className="spent">${trip.spent.toLocaleString()}</span>
                        <span className="budget">/ ${trip.budget.toLocaleString()}</span>
                      </div>
                    ) : (
                      <div className="budget-info">
                        <span className="budget">No budget set</span>
                      </div>
                    )}
                    <button 
                      className="plan-trip-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onNavigate) {
                          onNavigate('trips', { tripId: trip.id });
                        }
                      }}
                    >
                      View Trip
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!loading && currentTrips.length === 0 && upcomingTrips.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">🌍</div>
            <h3>No trips yet</h3>
            <p>Start planning your first adventure!</p>
            <button 
              className="tm-btn primary"
              onClick={() => {
                if (onNavigate) onNavigate('trips');
              }}
              style={{ marginTop: '1rem' }}
            >
              Create Your First Trip
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default HomePage;
