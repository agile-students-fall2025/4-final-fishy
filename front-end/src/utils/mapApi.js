// src/utils/mapApi.js
import { getAuthHeaders } from "./api";

const API = process.env.REACT_APP_API_URL || "http://localhost:4000";
const MAP = `${API}/api/map`;

// GET all locations
export async function fetchLocations() {
  const r = await fetch(`${MAP}/locations`, {
    headers: getAuthHeaders(),
  });
  if (!r.ok) {
    if (r.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      throw new Error("Unauthorized. Please log in again.");
    }
    throw new Error("Failed to load locations");
  }
  return r.json();
}

// POST create location
export async function createLocation(payload) {
  const r = await fetch(`${MAP}/locations`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  if (!r.ok) {
    if (r.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      throw new Error("Unauthorized. Please log in again.");
    }
    throw new Error("Failed to create location");
  }
  return r.json();
}

// PUT update location
export async function updateLocation(id, patch) {
  const r = await fetch(`${MAP}/locations/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(patch),
  });
  if (!r.ok) {
    if (r.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      throw new Error("Unauthorized. Please log in again.");
    }
    throw new Error("Failed to update location");
  }
  return r.json();
}

// DELETE location
export async function deleteLocation(id) {
  const r = await fetch(`${MAP}/locations/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!r.ok) {
    if (r.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      throw new Error("Unauthorized. Please log in again.");
    }
    throw new Error("Failed to delete location");
  }
  return r.json();
}

// POST add photos
export async function addPhotos(locationId, photos) {
  const r = await fetch(`${MAP}/locations/${locationId}/photos`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ photos }),
  });
  if (!r.ok) {
    if (r.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      throw new Error("Unauthorized. Please log in again.");
    }
    throw new Error("Failed to upload photos");
  }
  return r.json();
}
