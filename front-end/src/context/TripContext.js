import React, { createContext, useContext, useReducer } from "react";

const TripContext = createContext();

function reducer(state, action) {
  switch (action.type) {
    case "ADD_TRIP":
      return { ...state, trips: [action.payload, ...state.trips] };
    case "DELETE_TRIP":
      return { ...state, trips: state.trips.filter(t => t.id !== action.id) };
    default:
      return state;
  }
}

const initialState = {
  trips: [
    {
      id: "t_1",
      destination: "Paris, France",
      startDate: "2025-10-15",
      endDate: "2025-10-25",
      days: [
        { date: "2025-10-15", activities: ["Breakfast", "Saint Michel", "Eiffel (night)"] },
        { date: "2025-10-16", activities: ["Seine Cruise", "Montmartre", "Louvre"] },
      ],
    },
  ],
};

export function TripProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const value = {
    trips: state.trips,
    addTrip: (trip) => dispatch({ type: "ADD_TRIP", payload: trip }),
    deleteTrip: (id) => dispatch({ type: "DELETE_TRIP", id }),
  };

  return <TripContext.Provider value={value}>{children}</TripContext.Provider>;
}

export const useTrips = () => useContext(TripContext);
