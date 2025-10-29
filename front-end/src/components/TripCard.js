import React from "react";
import { formatPrettyDate, pluralize } from "../utils/helpers";

export default function TripCard({ trip, onOpen }) {
  const start = formatPrettyDate(trip.startDate);
  const end = formatPrettyDate(trip.endDate);
  const dayCount = (trip.days || []).length;
  const activityCount = (trip.days || []).reduce((s, d) => s + (d.activities?.length || 0), 0);

  return (
    <article
      className="tm-card tm-card--clickable"
      onClick={() => onOpen?.(trip)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onOpen?.(trip)}
      aria-label={`Open trip ${trip.destination || "Untitled trip"}`}
    >
      <header className="tm-card__header">
        <h3 className="tm-card__title">{trip.destination || "Untitled trip"}</h3>
        {(start || end) && (
          <p className="tm-card__meta">
            {start || "—"} {end ? ` — ${end}` : ""}
          </p>
        )}
      </header>

      <div className="tm-card__stats">
        <span className="tm-chip">{dayCount} {pluralize("Day", dayCount)}</span>
        <span className="tm-chip">{activityCount} {pluralize("Activity", activityCount)}</span>
      </div>
    </article>
  );
}

