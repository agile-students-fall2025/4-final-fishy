const API = process.env.REACT_APP_API_URL || "http://localhost:4000";
const MAP = `${API}/api/map`;

export async function fetchLocations() {
  const r = await fetch(`${MAP}/locations`);
  if (!r.ok) throw new Error("Failed to load locations");
  return r.json();
}

export async function createLocation(payload) {
  const r = await fetch(`${MAP}/locations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!r.ok) throw new Error("Failed to create location");
  return r.json();
}

export async function updateLocation(id, patch) {
  const r = await fetch(`${MAP}/locations/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  });
  if (!r.ok) throw new Error("Failed to update location");
  return r.json();
}

export async function deleteLocation(id) {
  const r = await fetch(`${MAP}/locations/${id}`, { method: "DELETE" });
  if (!r.ok) throw new Error("Failed to delete location");
  return r.json();
}

export async function addTask(locationId, text) {
  const r = await fetch(`${MAP}/locations/${locationId}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  if (!r.ok) throw new Error("Failed to add task");
  return r.json();
}

export async function deleteTask(locationId, taskId) {
  const r = await fetch(`${MAP}/locations/${locationId}/tasks/${taskId}`, {
    method: "DELETE",
  });
  if (!r.ok) throw new Error("Failed to delete task");
  return r.json();
}

export async function addPhotos(locationId, photos) {
  const r = await fetch(`${MAP}/locations/${locationId}/photos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ photos }), // photos = ["data:image/jpeg;base64,..."]
  });
  if (!r.ok) throw new Error("Failed to upload photos");
  return r.json();
}
