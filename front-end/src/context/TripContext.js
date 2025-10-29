// src/context/TripContext.js
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const TripsContext = createContext();

const STORAGE_KEY = "tripmate.trips.v1";

export function TripsProvider({ children }) {
  const [trips, setTrips] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trips));
    } catch {}
  }, [trips]);

  const addTrip = (trip) => setTrips((prev) => [trip, ...prev]);
  const deleteTrip = (id) => setTrips((prev) => prev.filter((t) => t.id !== id));
  const updateTrip = (id, patch) =>
    setTrips((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));

  const value = useMemo(() => ({ trips, addTrip, deleteTrip, updateTrip }), [trips]);

  return <TripsContext.Provider value={value}>{children}</TripsContext.Provider>;
}

export function useTrips() {
  const ctx = useContext(TripsContext);
  if (!ctx) throw new Error("useTrips must be used inside <TripsProvider>");
  return ctx;
}
