// File: src/pages/MapPage.js
// Feature: Travel Map connected to backend (GET, POST, PUT, DELETE)

import React, { useState, useEffect, useCallback } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import "../App.css";
import "./MapPage.css";

import {
  fetchLocations,
  createLocation,
  deleteLocation,
  addTask,
  addPhotos,
  updateLocation,
} from "../utils/mapApi";

const containerStyle = {
  width: "100%",
  height: "500px",
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

  // Load from backend
  useEffect(() => {
    fetchLocations()
      .then((data) => {
        setDestinations(data);
        // Create marker objects for map display
        const loadedMarkers = data.map((loc) => ({
          id: loc.id,
          lat: loc.lat,
          lng: loc.lng,
        }));
        setMarkers(loadedMarkers);
      })
      .catch((err) => console.error("Error fetching destinations:", err));
  }, []);

  // Get user location (for centering the map)
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

  // Add new destination (POST to backend)
  const handleAddDestination = async () => {
    if (!newDestination.trim()) return;
    try {
      const newDest = await createLocation({
        title: newDestination.trim(),
        lat: mapCenter.lat,
        lng: mapCenter.lng,
      });
      setDestinations((prev) => [...prev, newDest]);
      setMarkers((prev) => [
        ...prev,
        { id: newDest.id, lat: newDest.lat, lng: newDest.lng },
      ]);
      setNewDestination("");
    } catch (err) {
      console.error("Add destination failed:", err);
    }
  };

  // Add marker manually by clicking on map
  const handleMapClick = useCallback(async (event) => {
    try {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      const newDest = await createLocation({
        title: `Pinned Location ${Date.now()}`,
        lat,
        lng,
      });
      setDestinations((prev) => [...prev, newDest]);
      setMarkers((prev) => [...prev, { id: newDest.id, lat, lng }]);
    } catch (err) {
      console.error("Map click add failed:", err);
    }
  }, []);

  // Add task (POST)
  const handleAddTask = async (destId, newTask) => {
    if (!newTask.trim()) return;
    try {
      const added = await addTask(destId, newTask.trim());
      setTasks((prev) => ({
        ...prev,
        [destId]: [...(prev[destId] || []), added.text],
      }));
    } catch (err) {
      console.error("Task add failed:", err);
    }
  };

  // Upload photos (POST)
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

    Promise.all(readerPromises).then(async (base64Photos) => {
      try {
        await addPhotos(destId, base64Photos);
        setDestinations((prev) =>
          prev.map((dest) =>
            dest.id === destId
              ? { ...dest, photos: [...(dest.photos || []), ...base64Photos] }
              : dest
          )
        );
      } catch (err) {
        console.error("Photo upload failed:", err);
      }
    });
  };

  // Add/Edit Note (PUT)
  const handleAddNote = (destId) => {
    setEditingNoteId(destId);
    const currentNote =
      destinations.find((dest) => dest.id === destId)?.note || "";
    setTempNote(currentNote);
  };

  const handleSaveNote = async (destId) => {
    try {
      await updateLocation(destId, { note: tempNote });
      setDestinations((prev) =>
        prev.map((dest) =>
          dest.id === destId ? { ...dest, note: tempNote } : dest
        )
      );
      setEditingNoteId(null);
      setTempNote("");
    } catch (err) {
      console.error("Save note failed:", err);
    }
  };

  // Delete destination (DELETE)
  const handleDeleteDestination = async (destId) => {
    try {
      await deleteLocation(destId);
      setDestinations((prev) => prev.filter((d) => d.id !== destId));
      setMarkers((prev) => prev.filter((m) => m.id !== destId));
    } catch (err) {
      console.error("Delete destination failed:", err);
    }
  };

  return (
    <div className="map-page">
      <div className="welcome-section">
        <h2>Travel Memories Map</h2>
        <p>
          Add destinations, upload photos, and write or edit notes to remember
          your adventures! (Data now saves on the server 🎯)
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
              <h3>{dest.title || dest.name}</h3>
              <button
                className="add-destination-btn"
                onClick={() => handleDeleteDestination(dest.id)}
              >
                Delete
              </button>
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
