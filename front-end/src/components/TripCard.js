// src/components/TripCard.js
import React from "react";
import { formatPrettyDate } from "../utils/helpers";

export default function TripCard({ trip, onOpen }) {
  const start = formatPrettyDate(trip.startDate);
  const end = formatPrettyDate(trip.endDate);
  const dayCount = (trip.days || []).length;
  const activityCount = (trip.days || []).reduce((s, d) => s + (d.activities?.length || 0), 0);

  return (
    <article className="tm-card" onClick={() => onOpen?.(trip)} role="button" tabIndex={0}>
      <h3 className="tm-card__title">{trip.destination || "Untitled trip"}</h3>
      <p className="tm-card__meta">
        {start || "—"} {end ? ` — ${end}` : ""}
      </p>
      <div className="tm-card__stats">
        <span>{dayCount} {dayCount === 1 ? "Day" : "Days"}</span>
        <span>{activityCount} {activityCount === 1 ? "Activity" : "Activities"}</span>
      </div>
    </article>
  );
}
