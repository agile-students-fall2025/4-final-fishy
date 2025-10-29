import React from "react";
import { formatPrettyDate } from "../utils/helpers";

export default function TripCard({ trip, onOpen }) {
  const { destination, startDate, endDate, days } = trip;
  const totalActs = days.reduce((s, d) => s + d.activities.length, 0);

  return (
    <button className="tm-card" onClick={() => onOpen?.(trip)} aria-label={`Open ${destination}`}>
      <div className="tm-card__header">
        <h3 className="tm-card__title">{destination}</h3>
        <div className="tm-card__date">
          {formatPrettyDate(startDate)} – {formatPrettyDate(endDate)}
        </div>
      </div>
      <div className="tm-card__body">
        <div className="tm-card__stat">
          <span className="tm-card__stat-num">{days.length}</span>
          <span className="tm-card__stat-label">Days</span>
        </div>
        <div className="tm-card__stat">
          <span className="tm-card__stat-num">{totalActs}</span>
          <span className="tm-card__stat-label">Activities</span>
        </div>
      </div>
    </button>
  );
}
