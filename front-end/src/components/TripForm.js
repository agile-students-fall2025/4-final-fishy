// src/components/TripForm.js
import React, { useState } from "react";
import { makeId } from "../utils/helpers";

export default function TripForm({ onSave, onCancel }) {
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate]   = useState("");
  const [endDate, setEndDate]       = useState("");

  const [days, setDays] = useState([{ date: "", activities: [""] }]);

  const addDay = () => setDays((d) => [...d, { date: "", activities: [""] }]);
  const removeDay = (i) => setDays((d) => d.filter((_, idx) => idx !== i));

  const setDayDate = (i, value) =>
    setDays((d) => d.map((day, idx) => (idx === i ? { ...day, date: value } : day)));

  const addActivity = (i) =>
    setDays((d) =>
      d.map((day, idx) => (idx === i ? { ...day, activities: [...day.activities, ""] } : day))
    );

  const setActivity = (i, j, value) =>
    setDays((d) =>
      d.map((day, idx) =>
        idx === i
          ? { ...day, activities: day.activities.map((a, k) => (k === j ? value : a)) }
          : day
      )
    );

  const removeActivity = (i, j) =>
    setDays((d) =>
      d.map((day, idx) =>
        idx === i ? { ...day, activities: day.activities.filter((_, k) => k !== j) } : day
      )
    );

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanedDays = days
      .map((d) => ({ date: d.date, activities: d.activities.filter((a) => a.trim() !== "") }))
      .filter((d) => d.date || d.activities.length);

    const trip = {
      id: makeId("trip"),
      destination: destination.trim() || "Untitled trip",
      startDate,
      endDate,
      days: cleanedDays.length ? cleanedDays : [{ date: "", activities: [] }],
      createdAt: new Date().toISOString(),
    };
    onSave(trip);
  };

  return (
    <form className="tm-form" onSubmit={handleSubmit}>
      <h2 className="tm-modal__title">Create New Trip</h2>

      <label className="tm-label">Destination</label>
      <input
        className="tm-input"
        placeholder="e.g., Paris, France"
        value={destination}
        onChange={(e) => setDestination(e.target.value)}
      />

      <div className="tm-row">
        <div className="tm-col">
          <label className="tm-label">Start Date</label>
          <input type="date" className="tm-input" value={startDate}
                 onChange={(e) => setStartDate(e.target.value)} />
        </div>
        <div className="tm-col">
          <label className="tm-label">End Date</label>
          <input type="date" className="tm-input" value={endDate}
                 onChange={(e) => setEndDate(e.target.value)} />
        </div>
      </div>

      <h3 className="tm-subtitle">Itinerary</h3>
      <button type="button" className="tm-btn tm-btn--ghost" onClick={addDay}>+ New Day</button>

      {days.map((day, i) => (
        <div key={i} className="tm-day">
          <div className="tm-row">
            <div className="tm-col">
              <label className="tm-label">Day {i + 1} Date</label>
              <input type="date" className="tm-input" value={day.date}
                     onChange={(e) => setDayDate(i, e.target.value)} />
            </div>
            <div className="tm-col tm-col--auto">
              <button type="button" className="tm-link-danger"
                      onClick={() => removeDay(i)} disabled={days.length === 1}>
                Remove Day
              </button>
            </div>
          </div>

          <div className="tm-activities">
            <label className="tm-label">Activity</label>
            {day.activities.map((a, j) => (
              <div key={j} className="tm-row">
                <div className="tm-col">
                  <input className="tm-input" placeholder="Add activity" value={a}
                         onChange={(e) => setActivity(i, j, e.target.value)} />
                </div>
                <div className="tm-col tm-col--auto">
                  <button type="button" className="tm-link"
                          onClick={() => removeActivity(i, j)}
                          disabled={day.activities.length === 1}>
                    Remove
                  </button>
                </div>
              </div>
            ))}
            <button type="button" className="tm-btn tm-btn--ghost"
                    onClick={() => addActivity(i)}>
              + Add Activity
            </button>
          </div>
        </div>
      ))}

      <div className="tm-actions">
        <button type="button" className="tm-btn" onClick={onCancel}>Cancel</button>
        <button type="submit" className="tm-btn tm-btn--primary">Save</button>
      </div>
    </form>
  );
}
