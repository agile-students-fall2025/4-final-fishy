import React, { useState, useEffect } from 'react';
import { useReminders } from '../context/RemindersContext';
import { useNavigate } from 'react-router-dom';

export default function RemindersPage({ onNavigate }) {
  const {
    reminders,
    upcomingReminders,
    highPriorityReminders,
    notificationPermission,
    notificationsEnabled,
    requestNotificationPermission,
    setNotificationsEnabled,
  } = useReminders();
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all'); // 'all', 'upcoming', 'high'

  const getFilteredReminders = () => {
    switch (filter) {
      case 'upcoming':
        return upcomingReminders;
      case 'high':
        return highPriorityReminders;
      default:
        return reminders;
    }
  };

  const handleEnableNotifications = async () => {
    const granted = await requestNotificationPermission();
    if (granted) {
      setNotificationsEnabled(true);
    }
  };

  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'high':
        return 'reminder-priority-high';
      case 'medium':
        return 'reminder-priority-medium';
      case 'low':
        return 'reminder-priority-low';
      default:
        return 'reminder-priority-info';
    }
  };

  const filteredReminders = getFilteredReminders();

  return (
    <div className="reminders-page container">
      <header className="reminders-header">
        <div>
          <h1>Travel Reminders</h1>
          <p className="reminders-subtitle">Never miss a departure or check-in</p>
        </div>
        <div className="reminders-actions">
          {notificationPermission !== 'granted' && (
            <button
              className="tm-btn primary"
              onClick={handleEnableNotifications}
            >
              🔔 Enable Notifications
            </button>
          )}
          {notificationPermission === 'granted' && (
            <div className="notification-status">
              <span className="notification-badge">✓ Notifications Enabled</span>
              <button
                className="tm-link"
                onClick={() => setNotificationsEnabled(!notificationsEnabled)}
              >
                {notificationsEnabled ? 'Disable' : 'Enable'}
              </button>
            </div>
          )}
        </div>
      </header>

      {reminders.length === 0 ? (
        <div className="reminders-empty">
          <div className="empty-icon">📅</div>
          <h3>No upcoming reminders</h3>
          <p>When you have trips with dates, reminders will appear here</p>
        </div>
      ) : (
        <>
          <div className="reminders-filters">
            <button
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All ({reminders.length})
            </button>
            <button
              className={`filter-btn ${filter === 'upcoming' ? 'active' : ''}`}
              onClick={() => setFilter('upcoming')}
            >
              Upcoming ({upcomingReminders.length})
            </button>
            <button
              className={`filter-btn ${filter === 'high' ? 'active' : ''}`}
              onClick={() => setFilter('high')}
            >
              Important ({highPriorityReminders.length})
            </button>
          </div>

          <div className="reminders-list">
            {filteredReminders.map((reminder) => (
              <div
                key={reminder.id}
                className={`reminder-card ${getPriorityClass(reminder.priority)}`}
                onClick={() => {
                  if (onNavigate) {
                    onNavigate('trips', { tripId: reminder.tripId });
                  } else {
                    navigate('/trips');
                  }
                }}
                style={{ cursor: 'pointer' }}
              >
                <div className="reminder-icon">
                  {reminder.type === 'departure' && '✈️'}
                  {reminder.type === 'return' && '🏠'}
                  {reminder.type === 'ongoing' && '📍'}
                </div>
                <div className="reminder-content">
                  <h3 className="reminder-title">{reminder.title}</h3>
                  <p className="reminder-message">{reminder.message}</p>
                  <div className="reminder-meta">
                    <span className="reminder-date">
                      {formatDate(reminder.date)}
                    </span>
                    {reminder.daysUntil !== undefined && (
                      <span className="reminder-days">
                        {reminder.daysUntil === 0
                          ? 'Today'
                          : reminder.daysUntil === 1
                          ? 'Tomorrow'
                          : `In ${reminder.daysUntil} days`}
                      </span>
                    )}
                  </div>
                </div>
                <div className="reminder-action">
                  <button
                    className="tm-btn ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onNavigate) {
                        onNavigate('trips', { tripId: reminder.tripId });
                      } else {
                        navigate('/trips');
                      }
                    }}
                  >
                    View Trip →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

