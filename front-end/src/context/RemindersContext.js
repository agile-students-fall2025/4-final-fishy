import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from 'react';
import { useTrips } from './TripContext';

const RemindersContext = createContext(null);

// Calculate reminders based on trip dates
function calculateReminders(trips) {
  const reminders = [];
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  trips.forEach((trip) => {
    if (!trip.startDate && !trip.endDate) return;

    const startDate = trip.startDate ? new Date(trip.startDate) : null;
    const endDate = trip.endDate ? new Date(trip.endDate) : null;

    if (startDate) {
      startDate.setHours(0, 0, 0, 0);
    }
    if (endDate) {
      endDate.setHours(0, 0, 0, 0);
    }

    // Calculate days until trip
    if (startDate && startDate >= now) {
      const daysUntil = Math.ceil((startDate - now) / (1000 * 60 * 60 * 24));
      
      // Reminder types based on days until trip
      if (daysUntil === 0) {
        reminders.push({
          id: `departure-${trip.id}`,
          tripId: trip.id,
          trip: trip,
          type: 'departure',
          title: `🚀 Departure Today!`,
          message: `Your trip to ${trip.destination || 'your destination'} starts today!`,
          date: startDate,
          daysUntil: 0,
          priority: 'high',
        });
      } else if (daysUntil === 1) {
        reminders.push({
          id: `departure-${trip.id}`,
          tripId: trip.id,
          trip: trip,
          type: 'departure',
          title: `✈️ Departure Tomorrow`,
          message: `Your trip to ${trip.destination || 'your destination'} starts tomorrow!`,
          date: startDate,
          daysUntil: 1,
          priority: 'high',
        });
      } else if (daysUntil <= 3) {
        reminders.push({
          id: `departure-${trip.id}`,
          tripId: trip.id,
          trip: trip,
          type: 'departure',
          title: `⏰ Departure in ${daysUntil} days`,
          message: `Your trip to ${trip.destination || 'your destination'} starts in ${daysUntil} days`,
          date: startDate,
          daysUntil: daysUntil,
          priority: 'medium',
        });
      } else if (daysUntil <= 7) {
        reminders.push({
          id: `departure-${trip.id}`,
          tripId: trip.id,
          trip: trip,
          type: 'departure',
          title: `📅 Departure in ${daysUntil} days`,
          message: `Your trip to ${trip.destination || 'your destination'} starts in ${daysUntil} days`,
          date: startDate,
          daysUntil: daysUntil,
          priority: 'low',
        });
      }
    }

    // Check-in reminders (if trip has started but not ended)
    if (startDate && endDate && startDate <= now && endDate >= now) {
      reminders.push({
        id: `ongoing-${trip.id}`,
        tripId: trip.id,
        trip: trip,
        type: 'ongoing',
        title: `📍 Trip in Progress`,
        message: `You're currently on your trip to ${trip.destination || 'your destination'}`,
        date: now,
        daysUntil: 0,
        priority: 'info',
      });
    }

    // Return reminders
    if (endDate && endDate >= now) {
      const daysUntilReturn = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));
      if (daysUntilReturn === 1) {
        reminders.push({
          id: `return-${trip.id}`,
          tripId: trip.id,
          trip: trip,
          type: 'return',
          title: `🏠 Return Tomorrow`,
          message: `Your trip to ${trip.destination || 'your destination'} ends tomorrow`,
          date: endDate,
          daysUntil: 1,
          priority: 'medium',
        });
      }
    }
  });

  // Sort by date (soonest first)
  return reminders.sort((a, b) => {
    if (a.date && b.date) {
      return a.date - b.date;
    }
    return a.daysUntil - b.daysUntil;
  });
}

export function RemindersProvider({ children }) {
  const { trips } = useTrips();
  const [notificationPermission, setNotificationPermission] = useState(
    typeof Notification !== 'undefined' ? Notification.permission : 'default'
  );
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  // Calculate reminders from trips
  const reminders = useMemo(() => {
    return calculateReminders(trips);
  }, [trips]);

  // Request notification permission
  const requestNotificationPermission = useCallback(async () => {
    if (typeof Notification === 'undefined') {
      console.warn('This browser does not support notifications');
      return false;
    }

    if (Notification.permission === 'granted') {
      setNotificationPermission('granted');
      setNotificationsEnabled(true);
      return true;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      if (permission === 'granted') {
        setNotificationsEnabled(true);
        return true;
      }
    }

    return false;
  }, []);

  // Show browser notification
  const showNotification = useCallback((reminder) => {
    if (typeof Notification !== 'undefined' && Notification.permission === 'granted' && notificationsEnabled) {
      new Notification(reminder.title, {
        body: reminder.message,
        icon: '/favicon.ico',
        tag: reminder.id,
        requireInteraction: reminder.priority === 'high',
      });
    }
  }, [notificationsEnabled]);

  // Check for reminders and show notifications
  useEffect(() => {
    if (!notificationsEnabled || reminders.length === 0) return;

    // Show notifications for high priority reminders (today and tomorrow)
    const highPriorityReminders = reminders.filter(
      r => r.priority === 'high' && r.daysUntil <= 1
    );

    highPriorityReminders.forEach((reminder) => {
      // Only show notification once per reminder
      const notificationKey = `notification-${reminder.id}`;
      const lastShown = localStorage.getItem(notificationKey);
      const now = Date.now();
      
      // Show notification if not shown in the last hour
      if (!lastShown || (now - parseInt(lastShown)) > 60 * 60 * 1000) {
        showNotification(reminder);
        localStorage.setItem(notificationKey, now.toString());
      }
    });
  }, [reminders, notificationsEnabled, showNotification]);

  // Get upcoming reminders (next 7 days)
  const upcomingReminders = useMemo(() => {
    return reminders.filter(r => r.daysUntil <= 7);
  }, [reminders]);

  // Get high priority reminders
  const highPriorityReminders = useMemo(() => {
    return reminders.filter(r => r.priority === 'high' || r.priority === 'medium');
  }, [reminders]);

  const value = useMemo(
    () => ({
      reminders,
      upcomingReminders,
      highPriorityReminders,
      notificationPermission,
      notificationsEnabled,
      requestNotificationPermission,
      setNotificationsEnabled,
      showNotification,
    }),
    [
      reminders,
      upcomingReminders,
      highPriorityReminders,
      notificationPermission,
      notificationsEnabled,
      requestNotificationPermission,
      showNotification,
    ]
  );

  return <RemindersContext.Provider value={value}>{children}</RemindersContext.Provider>;
}

export function useReminders() {
  const ctx = useContext(RemindersContext);
  if (!ctx) throw new Error('useReminders must be used within a RemindersProvider');
  return ctx;
}

