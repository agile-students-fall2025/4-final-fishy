import React, { useState, useEffect } from 'react';
import { fetchRecommendedActivities } from '../utils/api';

export default function RecommendedActivities({ destination, onAddActivity, dayIndex }) {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!destination || destination.trim() === '') {
      setRecommendations([]);
      return;
    }

    const fetchRecommendations = async () => {
      setLoading(true);
      setError(null);
      try {
        const activities = await fetchRecommendedActivities(destination);
        setRecommendations(activities || []);
      } catch (err) {
        console.error('Error fetching recommendations:', err);
        setError('Failed to load recommendations');
        setRecommendations([]);
      } finally {
        setLoading(false);
      }
    };

    // Debounce the API call
    const timeoutId = setTimeout(fetchRecommendations, 500);
    return () => clearTimeout(timeoutId);
  }, [destination]);

  if (!destination || destination.trim() === '') {
    return null;
  }

  if (loading) {
    return (
      <div className="recommended-activities">
        <h4 className="recommended-activities__title">💡 Recommended Activities</h4>
        <div className="recommended-activities__loading">Loading suggestions...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="recommended-activities">
        <h4 className="recommended-activities__title">💡 Recommended Activities</h4>
        <div className="recommended-activities__error">{error}</div>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <div className="recommended-activities">
      <h4 className="recommended-activities__title">💡 Recommended Activities</h4>
      <p className="recommended-activities__subtitle">Click to add to your itinerary</p>
      <div className="recommended-activities__list">
        {recommendations.map((activity, index) => (
          <button
            key={index}
            type="button"
            className="recommended-activities__item"
            onClick={() => {
              if (onAddActivity && typeof dayIndex === 'number') {
                onAddActivity(dayIndex, activity);
              }
            }}
            title={`Add "${activity}" to your itinerary`}
          >
            <span className="recommended-activities__item-text">{activity}</span>
            <span className="recommended-activities__item-icon">+</span>
          </button>
        ))}
      </div>
    </div>
  );
}

