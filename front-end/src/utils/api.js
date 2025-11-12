const API = process.env.REACT_APP_API_URL || "http://localhost:4000";
const TRIPS = `${API}/api/trips`;

export async function fetchTrips() {
  const r = await fetch(TRIPS);
  if (!r.ok) throw new Error("Failed to load trips");
  return r.json();
}
export async function saveTrip(trip) {
  const r = await fetch(TRIPS, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(trip),
  });
  if (!r.ok) throw new Error("Failed to save trip");
  return r.json();
}
export async function updateTripById(id, patch) {
  const r = await fetch(`${TRIPS}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  });
  if (!r.ok) throw new Error("Failed to update trip");
  return r.json();
}
export async function deleteTripById(id) {
  const r = await fetch(`${TRIPS}/${id}`, { method: "DELETE" });
  if (!r.ok) throw new Error("Failed to delete trip");
  return r.json();
}
