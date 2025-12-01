import React, { useState, useEffect } from "react";
import TripCard from "../components/TripCard";
import TripForm from "../components/TripForm";
import { useTrips } from "../context/TripContext";

export default function TripPlanningPage({ initialTripId }) {
  const { trips, loading, error, createTrip, updateTrip, deleteTrip } = useTrips();
  const [isOpen, setIsOpen] = useState(false); // controls TripForm modal (create/edit)
  const [selected, setSelected] = useState(null); // holds the trip for view/edit
  const [busy, setBusy] = useState(false);

  // Auto-select trip when initialTripId is provided
  useEffect(() => {
    if (initialTripId && trips.length > 0) {
      const trip = trips.find(t => t.id === initialTripId);
      if (trip) {
        setSelected(trip);
      }
    }
  }, [initialTripId, trips]);
  const openCreateModal = () => {
    setSelected(null);
    setIsOpen(true);
  };

  const openEditModal = (trip) => {
    setSelected(trip);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setSelected(null);
  };

  const closeDetails = () => setSelected(null);

  // Create or Update depending on presence of trip.id
  const handleSave = async (trip) => {
    setBusy(true);
    try {
      if (trip?.id) {
        // Update existing trip
        await updateTrip(trip.id, trip);
      } else {
        // Create new trip
        await createTrip(trip);
      }
      closeModal();
    } catch (err) {
      console.error('Failed to save trip:', err);
      // Error is handled by context
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTrip(id);
      if (selected?.id === id) closeDetails();
    } catch (err) {
      console.error('Failed to delete trip:', err);
      // Error is handled by context
    }
  };

  return (
    <div className="trip-page container">
      <header className="trip-toolbar">
        <h1>Trip Planner</h1>
        <p className="trip-toolbar__sub">Organise destinations, dates and daily activities.</p>
        <button 
          className="tm-btn primary" 
          onClick={openCreateModal}
          disabled={loading}
        >
          + Create Trip
        </button>
      </header>

      {error && (
        <div className="tm-empty" style={{ color: 'red', marginBottom: '1rem' }}>
          Error: {String(error)}
        </div>
      )}

      <section className="trip-grid">
        {loading && trips.length === 0 && (
          <div className="tm-empty">Loading trips...</div>
        )}

        {!loading && trips.length === 0 && (
          <div className="tm-empty">
            No trips yet — click <strong>Create Trip</strong> to start.
          </div>
        )}

        {trips.map((trip) => (
          <div key={trip.id} className="trip-grid__item">
            <TripCard trip={trip} onOpen={setSelected} />
            <div className="trip-card__footer">
              <button 
                className="tm-link" 
                onClick={() => openEditModal(trip)}
                disabled={busy || loading}
              >
                Edit
              </button>
              <button 
                className="tm-link-danger" 
                onClick={() => handleDelete(trip.id)}
                disabled={busy || loading}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </section>

      {/* READ-ONLY DETAILS MODAL */}
      {selected && !isOpen && (
        <div className="tm-modal-overlay" onClick={closeDetails}>
          <div
            className="tm-modal tm-modal-lg tm-modal--opaque trip-detail-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <header className="trip-detail__header">
              <div>
                <h2>{selected.destination || "Untitled trip"}</h2>
                <p className="trip-detail__meta">
                  {selected.startDate || "—"} {selected.endDate ? ` — ${selected.endDate}` : ""}
                </p>
              </div>
              <div className="trip-detail__actions">
                <button className="tm-btn ghost" onClick={closeDetails}>
                  Close
                </button>
                <button className="tm-btn primary" onClick={() => setIsOpen(true)}>
                  Edit Trip
                </button>
                <button className="tm-btn danger" onClick={() => handleDelete(selected.id)}>
                  Delete
                </button>
              </div>
            </header>

            <div className="trip-detail__body">
              <ul className="trip-detail__list">
                {(selected.days || []).map((day, index) => (
                  <li key={index}>
                    <div className="trip-day__header">
                      <strong>{day.date || `Day ${index + 1}`}</strong>
                    </div>
                    {(day.activities || []).length === 0 ? (
                      <div className="tm-muted">No activities added.</div>
                    ) : (
                      <ul className="trip-detail__sublist">
                        {(day.activities || []).map((activity, idx) => (
                          <li key={idx}>{activity}</li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* CREATE/EDIT FORM MODAL */}
      {isOpen && (
        <div className="tm-modal-overlay" role="dialog" aria-modal="true" onClick={closeModal}>
          <div className="tm-modal tm-modal--opaque trip-modal" onClick={(e) => e.stopPropagation()}>
            <div className="tm-modal-body">
              <TripForm
                trip={selected || null} // prefill when editing; null means create
                onCancel={closeModal}
                onSave={handleSave}
              />
            </div>
            {busy && <div className="tm-overlay">Saving…</div>}
          </div>
        </div>
      )}
    </div>
  );
}
