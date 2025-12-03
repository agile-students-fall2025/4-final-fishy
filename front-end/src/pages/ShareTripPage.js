import React, { useState, useEffect } from 'react';
import { generateTripPDF } from '../utils/pdfGenerator';

const API = process.env.REACT_APP_API_URL || "http://localhost:4000";

export default function ShareTripPage({ tripId }) {
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchTrip = async () => {
      if (!tripId) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const r = await fetch(`${API}/api/trips/public/${tripId}`);
        if (!r.ok) {
          if (r.status === 404) {
            setNotFound(true);
          } else {
            throw new Error('Failed to load trip');
          }
        } else {
          const data = await r.json();
          setTrip(data);
        }
      } catch (err) {
        console.error('Error fetching shared trip:', err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchTrip();
  }, [tripId]);

  if (loading) {
    return (
      <div className="share-trip-page">
        <div className="share-trip-container">
          <div className="share-trip-loading">Loading trip...</div>
        </div>
      </div>
    );
  }

  if (notFound || !trip) {
    return (
      <div className="share-trip-page">
        <div className="share-trip-container">
          <div className="share-trip-error">
            <h2>Trip Not Found</h2>
            <p>The trip you're looking for doesn't exist or has been removed.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="share-trip-page">
      <div className="share-trip-container">
        <header className="share-trip-header">
          <h1>{trip.destination || 'Trip Itinerary'}</h1>
          <p className="share-trip-meta">
            {trip.startDate || '—'} {trip.endDate ? ` - ${trip.endDate}` : ''}
          </p>
          <div className="share-trip-actions">
            <button
              className="tm-btn primary"
              onClick={() => generateTripPDF(trip)}
            >
              📄 Download PDF
            </button>
          </div>
        </header>

        <div className="share-trip-body">
          <ul className="share-trip-list">
            {(trip.days || []).map((day, index) => (
              <li key={index} className="share-trip-day">
                <div className="share-trip-day-header">
                  <strong>{day.date || `Day ${index + 1}`}</strong>
                </div>
                {(day.activities || []).length === 0 ? (
                  <div className="share-trip-no-activities">No activities added.</div>
                ) : (
                  <ul className="share-trip-activities">
                    {(day.activities || []).map((activity, idx) => (
                      <li key={idx}>{activity}</li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>

        <footer className="share-trip-footer">
          <p>Shared via TripMate</p>
        </footer>
      </div>
    </div>
  );
}

