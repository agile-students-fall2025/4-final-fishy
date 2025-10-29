// File: src/pages/MapPage.js
// Feature: Photo upload + Add/Edit notes for each destination (User Story #15)

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
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [tempNote, setTempNote] = useState("");

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  });

  // Load from localStorage
  useEffect(() => {
    setMarkers(JSON.parse(localStorage.getItem("mapMarkers")) || []);
    setDestinations(JSON.parse(localStorage.getItem("destinations")) || []);
    setTasks(JSON.parse(localStorage.getItem("destinationTasks")) || {});
  }, []);

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("mapMarkers", JSON.stringify(markers));
      localStorage.setItem("destinations", JSON.stringify(destinations));
      localStorage.setItem("destinationTasks", JSON.stringify(tasks));
    } catch (e) {
      console.warn("Storage quota exceeded, clearing old data.");
      localStorage.clear();
    }
  }, [markers, destinations, tasks]);

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) =>
          setMapCenter({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          }),
        () => console.warn("Geolocation permission denied.")
      );
    }
  }, []);

  // Add new destination
  const handleAddDestination = () => {
    if (!newDestination.trim()) return;
    const destination = {
      id: Date.now(),
      name: newDestination.trim(),
      photos: [],
      note: "",
    };
    setDestinations((prev) => [...prev, destination]);
    setNewDestination("");
  };

  // Add marker by map click
  const handleMapClick = useCallback((event) => {
    const newMarker = {
      id: Date.now(),
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    };
    setMarkers((prev) => [...prev, newMarker]);
  }, []);

  // Add task per destination
  const handleAddTask = (destId, newTask) => {
    if (!newTask.trim()) return;
    setTasks((prev) => ({
      ...prev,
      [destId]: [...(prev[destId] || []), newTask.trim()],
    }));
  };

  // Compress and upload photos
  const handlePhotoUpload = (destId, files) => {
    const readerPromises = Array.from(files).map(
      (file) =>
        new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            const img = new Image();
            img.src = e.target.result;
            img.onload = () => {
              const canvas = document.createElement("canvas");
              const MAX_WIDTH = 300;
              const scaleSize = MAX_WIDTH / img.width;
              canvas.width = MAX_WIDTH;
              canvas.height = img.height * scaleSize;
              const ctx = canvas.getContext("2d");
              ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
              const compressed = canvas.toDataURL("image/jpeg", 0.7);
              resolve(compressed);
            };
          };
          reader.readAsDataURL(file);
        })
    );

    Promise.all(readerPromises).then((base64Photos) => {
      setDestinations((prev) =>
        prev.map((dest) =>
          dest.id === destId
            ? { ...dest, photos: [...(dest.photos || []), ...base64Photos] }
            : dest
        )
      );
    });
  };

  // Note handling
  const handleAddNote = (destId) => {
    setEditingNoteId(destId);
    const currentNote =
      destinations.find((dest) => dest.id === destId)?.note || "";
    setTempNote(currentNote);
  };

  const handleSaveNote = (destId) => {
    setDestinations((prev) =>
      prev.map((dest) =>
        dest.id === destId ? { ...dest, note: tempNote } : dest
      )
    );
    setEditingNoteId(null);
    setTempNote("");
  };

  return (
    <div className="map-page">
      <div className="welcome-section">
        <h2>Travel Memories Map</h2>
        <p>
          Add destinations, upload photos, and write or edit notes to remember
          your adventures!
        </p>
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

      {/* Map */}
      <div className="map-container">
        {isLoaded ? (
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={mapCenter}
            zoom={12}
            onClick={handleMapClick}
          >
            <Marker
              position={mapCenter}
              icon={{
                url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
              }}
            />
            {markers.map((marker) => (
              <Marker key={marker.id} position={marker} />
            ))}
          </GoogleMap>
        ) : (
          <p>Loading map...</p>
        )}
      </div>

      {/* Destination List */}
      <div className="destination-list">
        {destinations.length === 0 && (
          <p className="no-data">No destinations yet. Add one above.</p>
        )}
        {destinations.map((dest) => (
          <div key={dest.id} className="destination-card">
            <div className="destination-header">
              <h3>{dest.name}</h3>
            </div>

            {/* Photo Upload */}
            <div className="upload-section">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => handlePhotoUpload(dest.id, e.target.files)}
              />
            </div>

            {/* Show uploaded photos */}
            {dest.photos && dest.photos.length > 0 && (
              <div className="photo-gallery">
                {dest.photos.map((photo, i) => (
                  <img
                    key={i}
                    src={photo}
                    alt="memory"
                    className="memory-photo"
                  />
                ))}
              </div>
            )}

            {/* Notes Add/Edit */}
            <div className="note-section">
              {editingNoteId === dest.id ? (
                <>
                  <textarea
                    className="note-input"
                    placeholder="Write your travel note..."
                    value={tempNote}
                    onChange={(e) => setTempNote(e.target.value)}
                  />
                  <button
                    className="add-destination-btn"
                    onClick={() => handleSaveNote(dest.id)}
                  >
                    Save
                  </button>
                </>
              ) : (
                <>
                  {dest.note ? (
                    <>
                      <p className="note-text">{dest.note}</p>
                      <button
                        className="add-destination-btn"
                        onClick={() => handleAddNote(dest.id)}
                      >
                        Edit Note
                      </button>
                    </>
                  ) : (
                    <button
                      className="add-destination-btn"
                      onClick={() => handleAddNote(dest.id)}
                    >
                      Add Note
                    </button>
                  )}
                </>
              )}
            </div>

            {/* Task Section */}
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

// Add Task Subcomponent
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
