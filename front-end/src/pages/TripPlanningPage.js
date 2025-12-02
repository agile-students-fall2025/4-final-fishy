import React, { useState, useEffect } from "react";
import TripCard from "../components/TripCard";
import TripForm from "../components/TripForm";
import TripShare from "../components/TripShare";
import { useTrips } from "../context/TripContext";

export default function TripPlanningPage({ initialTripId }) {
  const { trips, loading, error, createTrip, updateTrip, deleteTrip } = useTrips();
  const [isOpen, setIsOpen] = useState(false); // controls TripForm modal (create/edit)
  const [selected, setSelected] = useState(null); // holds the trip for view/edit
  const [busy, setBusy] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [showShare, setShowShare] = useState(false); // controls TripShare modal

  // Auto-select trip when initialTripId is provided
  useEffect(() => {
    if (initialTripId && trips.length > 0) {
      const trip = trips.find(t => t.id === initialTripId);
      if (trip) {
        setSelected(trip);
        // Scroll to the selected trip card if it exists in the grid
        setTimeout(() => {
          const tripCard = document.querySelector(`[data-trip-id="${trip.id}"]`);
          if (tripCard) {
            tripCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 100);
      }
    }
  }, [initialTripId, trips]);
  const openCreateModal = () => {
    setSelected(null);
    setSaveError(null);
    setIsOpen(true);
  };

  const openEditModal = (trip) => {
    setSelected(trip);
    setSaveError(null);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setSelected(null);
    setSaveError(null);
  };

  const closeDetails = () => setSelected(null);

  // Create or Update depending on presence of trip.id
  const handleSave = async (trip) => {
    setBusy(true);
    setSaveError(null);
    try {
      if (trip?.id) {
        // Update existing trip - remove id from payload since it's in the URL
        const { id, ...patch } = trip;
        await updateTrip(trip.id, patch);
      } else {
        // Create new trip
        await createTrip(trip);
      }
      closeModal();
    } catch (err) {
      console.error('Failed to save trip:', err);
      const errorMessage = err?.message || 'Failed to save trip. Please try again.';
      setSaveError(errorMessage);
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
          <div 
            key={trip.id} 
            className="trip-grid__item"
            data-trip-id={trip.id}
            style={{
              border: selected?.id === trip.id ? '2px solid #667eea' : 'none',
              borderRadius: selected?.id === trip.id ? '12px' : '0',
              padding: selected?.id === trip.id ? '4px' : '0',
              transition: 'all 0.3s ease'
            }}
          >
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
                <button className="tm-btn" onClick={() => setShowShare(true)}>
                  📤 Share
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

      {/* SHARE MODAL */}
      {showShare && selected && (
        <div className="tm-modal-overlay" role="dialog" aria-modal="true" onClick={() => setShowShare(false)}>
          <div className="tm-modal tm-modal--opaque trip-share-modal" onClick={(e) => e.stopPropagation()}>
            <TripShare trip={selected} onClose={() => setShowShare(false)} />
          </div>
        </div>
      )}

      {/* CREATE/EDIT FORM MODAL */}
      {isOpen && (
        <div className="tm-modal-overlay" role="dialog" aria-modal="true" onClick={closeModal}>
          <div className="tm-modal tm-modal--opaque trip-modal" onClick={(e) => e.stopPropagation()}>
            <div className="tm-modal-body">
              {saveError && (
                <div className="tm-empty" style={{ color: 'red', marginBottom: '1rem', padding: '0.75rem', backgroundColor: '#fee', border: '1px solid #fcc', borderRadius: '4px' }}>
                  <strong>Error:</strong> {saveError}
                </div>
              )}
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
