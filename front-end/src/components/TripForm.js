import React, { useState } from "react";
import { makeId } from "../utils/helpers";

export default function TripForm({ onCancel, onSave }) {
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [days, setDays] = useState([{ id: makeId("day"), date: "", activities: [""] }]);

  const addDay = () => setDays((d) => [...d, { id: makeId("day"), date: "", activities: [""] }]);
  const removeDay = (id) => setDays((d) => d.filter((x) => x.id !== id));

  const updateDayField = (id, field, value) =>
    setDays((list) => list.map((d) => (d.id === id ? { ...d, [field]: value } : d)));

  const addActivity = (id) =>
    setDays((list) => list.map((d) => (d.id === id ? { ...d, activities: [...d.activities, ""] } : d)));

  const updateActivity = (id, idx, value) =>
    setDays((list) =>
      list.map((d) => (d.id === id ? { ...d, activities: d.activities.map((a, i) => (i === idx ? value : a)) } : d))
    );

  const removeActivity = (id, idx) =>
    setDays((list) =>
      list.map((d) => (d.id === id ? { ...d, activities: d.activities.filter((_, i) => i !== idx) } : d))
    );

  const handleSubmit = (e) => {
    e.preventDefault();
    const trip = {
      id: makeId("trip"),
      destination: destination.trim() || "Untitled Trip",
      startDate,
      endDate,
      days: days
        .filter((d) => d.date || d.activities.some((a) => a.trim()))
        .map((d) => ({ date: d.date, activities: d.activities.filter((a) => a.trim()) })),
    };
    onSave?.(trip);
  };

  return (
    <form className="tm-form" onSubmit={handleSubmit}>
      <h2 className="tm-form__title">Create New Trip</h2>

      <label className="tm-field">
        <span>Destination</span>
        <input
          type="text"
          placeholder="e.g., Paris, France"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
        />
      </label>

      <div className="tm-row">
        <label className="tm-field">
          <span>Start Date</span>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        </label>
        <label className="tm-field">
          <span>End Date</span>
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </label>
      </div>

      <div className="tm-section">
        <div className="tm-section__header">
          <h3>Itinerary</h3>
          <button type="button" className="tm-btn" onClick={addDay}>+ New Day</button>
        </div>

        {days.map((d, di) => (
          <div key={d.id} className="tm-day">
            <div className="tm-row tm-row--gap">
              <label className="tm-field">
                <span>Day {di + 1} Date</span>
                <input type="date" value={d.date} onChange={(e) => updateDayField(d.id, "date", e.target.value)} />
              </label>
              <button type="button" className="tm-btn tm-btn--ghost" onClick={() => removeDay(d.id)}>
                Remove Day
              </button>
            </div>

            <div className="tm-acts">
              {d.activities.map((a, ai) => (
                <div key={ai} className="tm-row tm-row--gap">
                  <label className="tm-field tm-field--flex">
                    <span>Activity</span>
                    <input
                      type="text"
                      placeholder="Add activity"
                      value={a}
                      onChange={(e) => updateActivity(d.id, ai, e.target.value)}
                    />
                  </label>
                  <button type="button" className="tm-btn tm-btn--ghost" onClick={() => removeActivity(d.id, ai)}>
                    Remove
                  </button>
                </div>
              ))}
              <button type="button" className="tm-btn" onClick={() => addActivity(d.id)}>+ Add Activity</button>
            </div>
          </div>
        ))}
      </div>

      <div className="tm-actions">
        <button type="button" className="tm-btn tm-btn--ghost" onClick={onCancel}>Cancel</button>
        <button type="submit" className="tm-btn tm-btn--primary">Save</button>
      </div>
    </form>
  );
}
