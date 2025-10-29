import React, { createContext, useContext, useEffect, useState } from 'react';
import { fetchTrips } from '../utils/api';

const TripContext = createContext(null);

export function TripProvider({ children }) {
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    let mounted = true;
    fetchTrips()
      .then((data) => {
        if (mounted && Array.isArray(data)) setTrips(data);
      })
      .catch(() => {
        /* ignore fetch errors for dev */
      });
    return () => {
      mounted = false;
    };
  }, []);

  const addTrip = (trip) => setTrips((s) => [...s, trip]);
  const deleteTrip = (id) => setTrips((s) => s.filter((t) => t.id !== id));

  return (
    <TripContext.Provider value={{ trips, addTrip, deleteTrip }}>
      {children}
    </TripContext.Provider>
  );
}

export function useTrips() {
  const ctx = useContext(TripContext);
  if (!ctx) throw new Error('useTrips must be used inside a TripProvider');
  return ctx;
}
