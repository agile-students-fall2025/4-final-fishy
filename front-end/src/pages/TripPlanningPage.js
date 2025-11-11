import React, { useState } from "react";
import TripCard from "../components/TripCard";
import TripForm from "../components/TripForm";
import { useTrips } from "../context/TripContext";
import { saveTrip, deleteTripById } from "../utils/api";

export default function TripPlanningPage() {
  const { trips, addTrip, deleteTrip } = useTrips();
  const [isOpen, setIsOpen] = useState(false);     // controls TripForm modal (create/edit)
  const [selected, setSelected] = useState(null);  // holds the trip for view/edit
  const [busy, setBusy] = useState(false);

  // Create or Update depending on presence of trip.id
  const handleSave = async (trip) => {
    setBusy(true);
    try {
      const persisted = await saveTrip(trip); // assume API updates when id exists
      if (trip?.id) {
        // simple replace-in-context: remove then add
        deleteTrip(trip.id);
      }
      addTrip(persisted);
      setIsOpen(false);
      setSelected(null);
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async (id) => {
    await deleteTripById(id);
    deleteTrip(id);
    if (selected?.id === id) setSelected(null);
  };

  return (
    <div className="tm-wrap">
      <header className="tm-pagehead">
        <div>
          <h1 className="tm-pagehead__title">Trip Planner</h1>
          <p className="tm-muted">Plan destinations, dates and per-day activities.</p>
        </div>
        <button
          className="tm-btn tm-btn--primary"
          onClick={() => {
            setSelected(null);   // ensure a clean create form
            setIsOpen(true);
          }}
        >
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
            <div className="tm-card__footer" style={{ display: "flex", gap: 12 }}>
              <button
                className="tm-link"
                onClick={() => {
                  setSelected(t);   // prefill with this trip
                  setIsOpen(true);  // open edit form
                }}
              >
                Edit
              </button>
              <button className="tm-link-danger" onClick={() => handleDelete(t.id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </section>

      {/* READ-ONLY DETAILS MODAL (centered) */}
      {selected && !isOpen && (
        <div className="tm-modal-overlay" onClick={() => setSelected(null)}>
          <div className="tm-modal-centered" onClick={(e) => e.stopPropagation()}>
            <h2 className="tm-modal-title">{selected.destination || "Untitled trip"}</h2>
            <p className="tm-muted" style={{ marginBottom: "0.75rem" }}>
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

            <div className="tm-actions" style={{ justifyContent: "space-between", marginTop: 16 }}>
              <button
                className="tm-btn tm-btn--primary"
                onClick={() => {
                  // open edit form prefilled with this trip
                  setIsOpen(true);
                }}
              >
                Edit Trip
              </button>
              <div style={{ display: "flex", gap: 8 }}>
                <button className="tm-btn" onClick={() => setSelected(null)}>Close</button>
                <button className="tm-btn tm-link-danger" onClick={() => handleDelete(selected.id)}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CREATE/EDIT FORM MODAL */}
      {isOpen && (
        <div className="tm-modal" role="dialog" aria-modal="true" onClick={() => { setIsOpen(false); setSelected(null); }}>
          <div className="tm-modal__panel" onClick={(e) => e.stopPropagation()}>
            <TripForm
              trip={selected || null}  // prefill when editing; null means create
              onCancel={() => { setIsOpen(false); setSelected(null); }}
              onSave={handleSave}
            />
            {busy && <div className="tm-overlay">Saving…</div>}
          </div>
        </div>
      )}
    </div>
  );
}
