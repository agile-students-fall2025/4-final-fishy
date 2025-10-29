import React, { useState } from "react";
import TripCard from "../components/TripCard";
import TripForm from "../components/TripForm";
import { useTrips } from "../context/TripContext";
import { saveTrip } from "../utils/api";

export default function TripPlanningPage() {
  const { trips, addTrip, deleteTrip } = useTrips();
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [busy, setBusy] = useState(false);

  const handleSave = async (trip) => {
    setBusy(true);
    try {
      const persisted = await saveTrip(trip); // swap to real API later
      addTrip(persisted);
      setIsOpen(false);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="tm-wrap">
      <header className="tm-pagehead">
        <h1>Trip Planner</h1>
        <button className="tm-btn tm-btn--primary" onClick={() => setIsOpen(true)}>
          Create New Trip
        </button>
      </header>

      <section className="tm-grid">
        {trips.map((t) => (
          <div key={t.id} className="tm-grid__item">
            <TripCard trip={t} onOpen={setSelected} />
            <button className="tm-link-danger" onClick={() => deleteTrip(t.id)}>Delete</button>
          </div>
        ))}
      </section>

      {selected && (
        <div className="tm-drawer" onClick={() => setSelected(null)}>
          <div className="tm-drawer__panel" onClick={(e) => e.stopPropagation()}>
            <h2 className="tm-drawer__title">Trip Overview</h2>
            <p className="tm-muted">Destination: {selected.destination}</p>
            <ul className="tm-list">
              {selected.days.map((d, i) => (
                <li key={i}>
                  <strong>{d.date || `Day ${i + 1}`}</strong>
                  <ul className="tm-sublist">
                    {d.activities.map((a, j) => (
                      <li key={j}>{a}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
            <button className="tm-btn" onClick={() => setSelected(null)}>Close</button>
          </div>
        </div>
      )}

      {isOpen && (
        <div className="tm-modal" role="dialog" aria-modal="true" onClick={() => setIsOpen(false)}>
          <div className="tm-modal__panel" onClick={(e) => e.stopPropagation()}>
            <button className="tm-close" onClick={() => setIsOpen(false)} aria-label="Close">✕</button>
            <TripForm onCancel={() => setIsOpen(false)} onSave={handleSave} />
            {busy && <div className="tm-overlay">Saving…</div>}
          </div>
        </div>
      )}
    </div>
  );
}
