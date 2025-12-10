import React, { useEffect, useState } from "react";
import RecommendedActivities from "./RecommendedActivities";
import LocationAutocomplete from "./LocationAutocomplete";

export default function TripForm({ trip, onSave, onCancel }) {
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [days, setDays] = useState([{ date: "", activities: [""] }]);

  const isEditing = Boolean(trip?.id);

  useEffect(() => {
    if (trip) {
      setDestination(trip.destination || "");
      setStartDate(trip.startDate || "");
      setEndDate(trip.endDate || "");
      setDays(
        Array.isArray(trip.days) && trip.days.length
          ? trip.days.map((d) => ({
              date: d.date || "",
              activities:
                Array.isArray(d.activities) && d.activities.length
                  ? d.activities
                  : [""],
            }))
          : [{ date: "", activities: [""] }]
      );
    } else {
      setDestination("");
      setStartDate("");
      setEndDate("");
      setDays([{ date: "", activities: [""] }]);
    }
  }, [trip]);

  const addDay = () => setDays((d) => [...d, { date: "", activities: [""] }]);
  const removeDay = (i) => setDays((d) => d.filter((_, idx) => idx !== i));
  const setDayDate = (i, value) =>
    setDays((d) => d.map((day, idx) => (idx === i ? { ...day, date: value } : day)));

  const addActivity = (i) =>
    setDays((d) =>
      d.map((day, idx) =>
        idx === i ? { ...day, activities: [...day.activities, ""] } : day
      )
    );

  const setActivity = (i, j, value) =>
    setDays((d) =>
      d.map((day, idx) =>
        idx === i
          ? {
              ...day,
              activities: day.activities.map((a, k) => (k === j ? value : a)),
            }
          : day
      )
    );

  const removeActivity = (i, j) =>
    setDays((d) =>
      d.map((day, idx) =>
        idx === i
          ? { ...day, activities: day.activities.filter((_, k) => k !== j) }
          : day
      )
    );

  const handleSubmit = (e) => {
    e.preventDefault();

    const cleanedDays = (days || [])
      .map((d) => ({
        date: d.date || "",
        activities: (d.activities || []).filter((a) => a.trim() !== ""),
      }))
      .filter((d) => d.date || (d.activities && d.activities.length > 0));

    const payload = {
      ...(isEditing && { id: trip.id }),
      destination: (destination || "").trim() || "Untitled trip",
      startDate: startDate || "",
      endDate: endDate || "",
      days: cleanedDays.length ? cleanedDays : [{ date: "", activities: [] }],
    };

    onSave(payload);
  };

  return (
    <form className="tm-form" onSubmit={handleSubmit}>
      <header className="tm-modal__header">
        <h2 className="tm-modal__title">
          {isEditing ? "Edit Trip" : "Create New Trip"}
        </h2>
        <button
          type="button"
          className="tm-icon-btn"
          onClick={onCancel}
          aria-label="Close"
        >
          ✕
        </button>
      </header>

      <label className="tm-label">Destination</label>
      <LocationAutocomplete
        className="tm-input"
        placeholder="e.g., Paris, France"
        value={destination}
        onChange={(e) => setDestination(e.target.value)}
      />

      <div className="tm-row">
        <div className="tm-col">
          <label className="tm-label">Start Date</label>
          <input
            type="date"
            className="tm-input"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div className="tm-col">
          <label className="tm-label">End Date</label>
          <input
            type="date"
            className="tm-input"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>

      <div className="tm-section">
        <h3 className="tm-subtitle">Itinerary</h3>
        <button type="button" className="tm-btn ghost tm-btn--compact" onClick={addDay}>
          + New Day
        </button>
      </div>

      {days.map((day, i) => (
        <div key={i} className="tm-day">
          <div className="tm-row tm-row--middle">
            <div className="tm-col">
              <label className="tm-label">Day {i + 1} Date</label>
              <input
                type="date"
                className="tm-input"
                value={day.date}
                onChange={(e) => setDayDate(i, e.target.value)}
              />
            </div>
            <div className="tm-col tm-col--auto">
              <button
                type="button"
                className="tm-link-danger"
                onClick={() => removeDay(i)}
                disabled={days.length === 1}
              >
                Remove Day
              </button>
            </div>
          </div>

          <div className="tm-activities">
            <label className="tm-label">Activities</label>
            <RecommendedActivities 
              destination={destination}
              onAddActivity={(dayIdx, activity) => {
                const day = days[dayIdx];
                if (day && !day.activities.includes(activity)) {
                  setDays((d) =>
                    d.map((day, idx) =>
                      idx === dayIdx
                        ? { ...day, activities: [...day.activities, activity] }
                        : day
                    )
                  );
                }
              }}
              dayIndex={i}
            />
            {day.activities.map((a, j) => (
              <div key={j} className="tm-row">
                <div className="tm-col">
                  <input
                    className="tm-input"
                    placeholder="Add activity"
                    value={a}
                    onChange={(e) => setActivity(i, j, e.target.value)}
                  />
                </div>
                <div className="tm-col tm-col--auto">
                  <button
                    type="button"
                    className="tm-link"
                    onClick={() => removeActivity(i, j)}
                    disabled={day.activities.length === 1}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}

            <button
              type="button"
              className="tm-btn ghost tm-btn--compact"
              onClick={() => addActivity(i)}
            >
              + Add Activity
            </button>
          </div>
        </div>
      ))}

      <div className="tm-actions">
        <button type="button" className="tm-btn ghost" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="tm-btn primary">
          {isEditing ? "Save Changes" : "Save Trip"}
        </button>
      </div>
    </form>
  );
}
