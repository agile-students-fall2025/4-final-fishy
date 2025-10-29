// File: src/pages/MapPage.js
// Feature: Interactive Map + Destination + Add Task (User Story #5 + Restore Tasks)

import React, { useState, useEffect, useCallback } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import "../App.css";

const containerStyle = {
  width: "100%",
  height: "400px",
  borderRadius: "15px",
};

const defaultCenter = { lat: 25.276987, lng: 55.296249 }; // Dubai fallback

function MapPage() {
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [markers, setMarkers] = useState([]);
  const [newDestination, setNewDestination] = useState("");
  const [destinations, setDestinations] = useState([]);
  const [tasks, setTasks] = useState({});

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  });

  // ✅ Load from localStorage
  useEffect(() => {
    const savedMarkers = JSON.parse(localStorage.getItem("mapMarkers")) || [];
    const savedDestinations = JSON.parse(localStorage.getItem("destinations")) || [];
    const savedTasks = JSON.parse(localStorage.getItem("destinationTasks")) || {};
    setMarkers(savedMarkers);
    setDestinations(savedDestinations);
    setTasks(savedTasks);
  }, []);

  // ✅ Save to localStorage
  useEffect(() => {
    localStorage.setItem("mapMarkers", JSON.stringify(markers));
  }, [markers]);

  useEffect(() => {
    localStorage.setItem("destinations", JSON.stringify(destinations));
  }, [destinations]);

  useEffect(() => {
    localStorage.setItem("destinationTasks", JSON.stringify(tasks));
  }, [tasks]);

  // ✅ Geolocation
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setMapCenter({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        () => console.warn("Geolocation permission denied.")
      );
    }
  }, []);

  // ✅ Add new destination
  const handleAddDestination = () => {
    if (!newDestination.trim()) return;
    const destination = { id: Date.now(), name: newDestination.trim() };
    setDestinations((prev) => [...prev, destination]);
    setNewDestination("");
  };

  // ✅ Add marker by clicking map
  const handleMapClick = useCallback((event) => {
    const newMarker = {
      id: Date.now(),
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    };
    setMarkers((prev) => [...prev, newMarker]);
  }, []);

  // ✅ Add task for a specific destination
  const handleAddTask = (destId, newTask) => {
    if (!newTask.trim()) return;
    setTasks((prev) => ({
      ...prev,
      [destId]: [...(prev[destId] || []), newTask.trim()],
    }));
  };

  return (
    <div className="map-page">
      <div className="welcome-section">
        <h2>Interactive Travel Map</h2>
        <p>View your current location and organize your destinations & tasks.</p>
      </div>

      {/* Add Destination */}
      <div className="add-destination">
        <input
          type="text"
          placeholder="Add destination..."
          value={newDestination}
          onChange={(e) => setNewDestination(e.target.value)}
          className="destination-input"
        />
        <button onClick={handleAddDestination} className="add-destination-btn">
          Add
        </button>
      </div>

      {/* Interactive Google Map */}
      <div className="map-container">
        {isLoaded ? (
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={mapCenter}
            zoom={12}
            onClick={handleMapClick}
          >
            {/* User's current location */}
            <Marker
              position={mapCenter}
              icon={{ url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png" }}
            />

            {/* Saved Markers */}
            {markers.map((marker) => (
              <Marker key={marker.id} position={{ lat: marker.lat, lng: marker.lng }} />
            ))}
          </GoogleMap>
        ) : (
          <p>Loading map...</p>
        )}
      </div>

      {/* Destination List with Tasks */}
      <div className="destination-list">
        {destinations.length === 0 && (
          <p className="no-data">No destinations yet. Add one above.</p>
        )}
        {destinations.map((dest) => (
          <div key={dest.id} className="destination-card">
            <div className="destination-header">
              <h3>{dest.name}</h3>
            </div>
            <ul className="task-list">
              {(tasks[dest.id] || []).map((task, i) => (
                <li key={i}>• {task}</li>
              ))}
            </ul>
            <TaskInput destId={dest.id} onAddTask={handleAddTask} />
          </div>
        ))}
      </div>
    </div>
  );
}

// Subcomponent: Task input for each destination
function TaskInput({ destId, onAddTask }) {
  const [newTask, setNewTask] = useState("");

  const handleAdd = () => {
    onAddTask(destId, newTask);
    setNewTask("");
  };

  return (
    <div className="add-task-section">
      <input
        type="text"
        placeholder="Add a task..."
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        className="destination-input"
      />
      <button onClick={handleAdd} className="add-destination-btn">
        Add Task
      </button>
    </div>
  );
}

export default MapPage;
