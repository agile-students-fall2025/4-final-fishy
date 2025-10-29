import React, { useState } from "react";
import TripCard from "../components/TripCard";
import TripForm from "../components/TripForm";
import { useTrips } from "../context/TripContext";
import { saveTrip, deleteTripById } from "../utils/api";

export default function TripPlanningPage() {
  const { trips, addTrip, deleteTrip } = useTrips();
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [busy, setBusy] = useState(false);

  const handleSave = async (trip) => {
    setBusy(true);
    try {
      const persisted = await saveTrip(trip);
      addTrip(persisted);
      setIsOpen(false);
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async (id) => {
    await deleteTripById(id);
    deleteTrip(id);
  };

  return (
    <div className="tm-wrap">
      <header className="tm-pagehead">
        <div>
          <h1 className="tm-pagehead__title">Trip Planner</h1>
          <p className="tm-muted">Plan destinations, dates and per-day activities.</p>
        </div>
        <button className="tm-btn tm-btn--primary" onClick={() => setIsOpen(true)}>
          Create New Trip
        </button>
      </header>

      <section className="tm-grid">
        {trips.length === 0 && (
          <div className="tm-empty">
            No trips yet — click <strong>Create New Trip</strong> to start.
          </div>
        )}

        {trips.map((t) => (
          <div key={t.id} className="tm-grid__item">
            <TripCard trip={t} onOpen={setSelected} />
            <div className="tm-card__footer">
              <button className="tm-link-danger" onClick={() => handleDelete(t.id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </section>

      {selected && (
        <div className="tm-drawer" onClick={() => setSelected(null)}>
          <div className="tm-drawer__panel" onClick={(e) => e.stopPropagation()}>
            <h2 className="tm-drawer__title">{selected.destination}</h2>
            <p className="tm-muted">
              {selected.startDate || "—"} {selected.endDate ? ` — ${selected.endDate}` : ""}
            </p>

            <ul className="tm-list">
              {(selected.days || []).map((d, i) => (
                <li key={i}>
                  <strong>{d.date || `Day ${i + 1}`}</strong>
                  {(d.activities || []).length === 0 ? (
                    <div className="tm-muted">No activities.</div>
                  ) : (
                    <ul className="tm-sublist">
                      {(d.activities || []).map((a, j) => <li key={j}>{a}</li>)}
                    </ul>
                  )}
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
            <TripForm onCancel={() => setIsOpen(false)} onSave={handleSave} />
            {busy && <div className="tm-overlay">Saving…</div>}
          </div>
        </div>
      )}
    </div>
  );
}
