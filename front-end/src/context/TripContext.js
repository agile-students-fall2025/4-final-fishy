// src/context/TripContext.js
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { fetchTrips } from "../utils/api";

const TripsContext = createContext();

export function TripsProvider({ children }) {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const data = await fetchTrips();
        if (alive) setTrips(Array.isArray(data) ? data : []);
      } catch (e) {
        if (alive) setError(e.message || "Failed to load trips");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  const addTrip = (trip) => setTrips((prev) => [trip, ...prev]);
  const deleteTrip = (id) => setTrips((prev) => prev.filter((t) => t.id !== id));
  const updateTrip = (id, patch) =>
    setTrips((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));

  const value = useMemo(() => ({ trips, addTrip, deleteTrip, updateTrip, loading, error }), [trips, loading, error]);
  return <TripsContext.Provider value={value}>{children}</TripsContext.Provider>;
}

export function useTrips() {
  const ctx = useContext(TripsContext);
  if (!ctx) throw new Error("useTrips must be used inside <TripsProvider>");
  return ctx;
}
