import React, { useEffect, useState, useMemo } from "react";
import {
  fetchLocations,
  createLocation,
  deleteLocation,
} from "../utils/mapApi";

function MapComponent() {
  const [locations, setLocations] = useState([]);
  const [title, setTitle] = useState("");
  const [lat, setLat] = useState("25.276987");
  const [lng, setLng] = useState("55.296249");

  // Load from backend on mount
  useEffect(() => {
    fetchLocations()
      .then(setLocations)
      .catch((err) => console.error("Error loading locations:", err));
  }, []);

  async function handleAdd(e) {
    e.preventDefault();
    if (!title.trim()) return;
    const newLoc = await createLocation({
      title: title.trim(),
      lat: Number(lat),
      lng: Number(lng),
    });
    setLocations((prev) => [...prev, newLoc]);
    setTitle("");
  }

  async function handleDelete(id) {
    await deleteLocation(id);
    setLocations((prev) => prev.filter((loc) => loc.id !== id));
  }

  const list = useMemo(
    () =>
      locations.map((loc) => (
        <li key={loc.id} style={{ marginBottom: 6 }}>
          <b>{loc.title}</b> &nbsp;
          <small>({loc.lat}, {loc.lng})</small>
          <button style={{ marginLeft: 8 }} onClick={() => handleDelete(loc.id)}>
            Delete
          </button>
        </li>
      )),
    [locations]
  );

  return (
    <section style={{ padding: "1rem", borderTop: "1px solid #eee", marginTop: 16 }}>
      <h3>Saved Locations (from backend)</h3>

      <form onSubmit={handleAdd} style={{ marginBottom: 12 }}>
        <input
          placeholder="Location title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ marginRight: 6 }}
        />
        <input
          placeholder="Lat"
          value={lat}
          onChange={(e) => setLat(e.target.value)}
          style={{ width: 110, marginRight: 6 }}
        />
        <input
          placeholder="Lng"
          value={lng}
          onChange={(e) => setLng(e.target.value)}
          style={{ width: 110, marginRight: 6 }}
        />
        <button type="submit">Add Location</button>
      </form>

      <ul style={{ paddingLeft: 18 }}>{list}</ul>
    </section>
  );
}

export default MapComponent;
