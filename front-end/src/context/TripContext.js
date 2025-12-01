// src/context/TripContext.js
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from 'react';
import {
  fetchTrips,
  saveTrip,
  updateTripById,
  deleteTripById,
} from '../utils/api';

const normalizeDay = (d = {}) => ({
  date: d.date || '',
  activities: Array.isArray(d.activities) ? d.activities : [],
});

const normalizeTrip = (t = {}) => ({
  id: t.id ?? t._id ?? String(t.id || t._id || crypto.randomUUID()),
  destination: t.destination || 'Untitled trip',
  startDate: t.startDate || '',
  endDate: t.endDate || '',
  days: Array.isArray(t.days) ? t.days.map(normalizeDay) : [],
  createdAt: t.createdAt || null,
});

const TripsContext = createContext(null);

export function TripsProvider({ children }) {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchTrips();
      const normalized = Array.isArray(data) ? data.map(normalizeTrip) : [];
      setTrips(normalized);
    } catch (err) {
      setError(err?.message || 'Failed to load trips');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  // CRUD operations
  const createTrip = useCallback(async (payload) => {
    const res = await saveTrip(payload);
    const trip = normalizeTrip(res);
    setTrips((prev) => [trip, ...prev]);
    return trip;
  }, []);

  const updateTrip = useCallback(async (id, patch) => {
    const res = await updateTripById(id, patch);
    const updated = normalizeTrip(res);
    setTrips((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    return updated;
  }, []);

  const deleteTrip = useCallback(async (id) => {
    await deleteTripById(id);
    setTrips((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Legacy methods for backward compatibility
  const addTrip = useCallback((trip) => {
    const normalized = normalizeTrip(trip);
    setTrips((prev) => [normalized, ...prev]);
  }, []);

  const value = useMemo(
    () => ({
      // state
      trips,
      loading,
      error,

      // operations
      reload,
      createTrip,
      updateTrip,
      deleteTrip,

      // legacy compatibility
      addTrip,
    }),
    [trips, loading, error, reload, createTrip, updateTrip, deleteTrip, addTrip]
  );

  return <TripsContext.Provider value={value}>{children}</TripsContext.Provider>;
}

export function useTrips() {
  const ctx = useContext(TripsContext);
  if (!ctx) throw new Error('useTrips must be used within a TripsProvider');
  return ctx;
}
