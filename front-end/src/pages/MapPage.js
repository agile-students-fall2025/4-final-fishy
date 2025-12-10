//src/pages/MapPage.js

import React, { useState, useEffect, useCallback } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import "../App.css";
import "./MapPage.css";
import LocationAutocomplete from "../components/LocationAutocomplete";

import {
  fetchLocations,
  createLocation,
  deleteLocation,
  addPhotos,
  updateLocation,
} from "../utils/mapApi";

const containerStyle = {
  width: "100%",
  height: "500px",
  borderRadius: "15px",
};

const defaultCenter = { lat: 25.276987, lng: 55.296249 };

function MapPage() {
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [markers, setMarkers] = useState([]);
  const [newDestination, setNewDestination] = useState("");
  const [destinations, setDestinations] = useState([]);
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [tempNote, setTempNote] = useState("");

  const { isLoaded } = useJsApiLoader({
    id: "google-map-autocomplete",
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });


  // Load data
  useEffect(() => {
    fetchLocations()
      .then((data) => {
        setDestinations(data);
        setMarkers(data.map((loc) => ({ id: loc.id, lat: loc.lat, lng: loc.lng })));
      })
      .catch((err) => console.error("Error loading destinations:", err));
  }, []);

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) =>
          setMapCenter({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          }),
        () => console.warn("Geolocation denied")
      );
    }
  }, []);

  // Add destination manually
  const handleAddDestination = async (placeData = null) => {
    const destinationTitle = placeData?.name || newDestination.trim();
    if (!destinationTitle) return;
    
    try {
      const lat = placeData?.lat || mapCenter.lat;
      const lng = placeData?.lng || mapCenter.lng;
      
      const newDest = await createLocation({
        title: destinationTitle,
        lat: lat,
        lng: lng,
      });
      setDestinations((prev) => [...prev, newDest]);
      setMarkers((prev) => [...prev, { id: newDest.id, lat: newDest.lat, lng: newDest.lng }]);
      setNewDestination("");
      
      // Center map on new location if we have coordinates
      if (placeData?.lat && placeData?.lng) {
        setMapCenter({ lat: lat, lng: lng });
      }
    } catch (err) {
      console.error("Failed:", err);
    }
  };

  // Add destination by clicking map
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
      console.error("Failed:", err);
    }
  }, []);

  // Upload photos
  const handlePhotoUpload = (destId, files) => {
    const readerPromises = Array.from(files).map(
      (file) =>
        new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target.result);
          reader.readAsDataURL(file);
        })
    );

    Promise.all(readerPromises).then(async (base64Photos) => {
      try {
        await addPhotos(destId, base64Photos);
        setDestinations((prev) =>
          prev.map((d) =>
            d.id === destId ? { ...d, photos: [...(d.photos || []), ...base64Photos] } : d
          )
        );
      } catch (err) {
        console.error("Photo upload failed:", err);
      }
    });
  };

  // Note editing
  const handleAddNote = (destId) => {
    setEditingNoteId(destId);
    setTempNote(destinations.find((d) => d.id === destId)?.note || "");
  };

  const handleSaveNote = async (destId) => {
    try {
      await updateLocation(destId, { note: tempNote });
      setDestinations((prev) =>
        prev.map((d) => (d.id === destId ? { ...d, note: tempNote } : d))
      );
      setEditingNoteId(null);
      setTempNote("");
    } catch (err) {
      console.error("Save note failed:", err);
    }
  };

  // Delete destination
  const handleDeleteDestination = async (destId) => {
    try {
      await deleteLocation(destId);
      setDestinations((prev) => prev.filter((d) => d.id !== destId));
      setMarkers((prev) => prev.filter((m) => m.id !== destId));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return (
    <div className="map-page">
      <h2>Travel Memories Map</h2>
      <p>Add destinations, upload photos, and write notes!</p>

      {/* Add Destination */}
      <div className="add-destination">
        <LocationAutocomplete
          placeholder="Add destination..."
          value={newDestination}
          onChange={(e) => setNewDestination(e.target.value)}
          onPlaceSelect={(placeData) => {
            handleAddDestination(placeData);
          }}
          className="destination-input"
        />
        <button onClick={() => handleAddDestination()} className="add-destination-btn">
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
            <Marker position={mapCenter} />
            {markers.map((m) => (
              <Marker key={m.id} position={m} />
            ))}
          </GoogleMap>
        ) : (
          <p>Loading map...</p>
        )}
      </div>

      {/* Destination List */}
      <div className="destination-list">
        {destinations.map((dest) => (
          <div key={dest.id} className="destination-card">
            <div className="destination-header">
              <h3>{dest.title}</h3>
              <button onClick={() => handleDeleteDestination(dest.id)} className="add-destination-btn">
                Delete
              </button>
            </div>

            {/* Photo Upload */}
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => handlePhotoUpload(dest.id, e.target.files)}
            />

            {/* Photo Gallery */}
            {dest.photos?.length > 0 && (
              <div className="photo-gallery">
                {dest.photos.map((p, i) => (
                  <img key={i} src={p} alt="" className="memory-photo" />
                ))}
              </div>
            )}

            {/* Notes */}
            {editingNoteId === dest.id ? (
              <>
                <textarea
                  className="note-input"
                  value={tempNote}
                  onChange={(e) => setTempNote(e.target.value)}
                />
                <button onClick={() => handleSaveNote(dest.id)} className="add-destination-btn">
                  Save
                </button>
              </>
            ) : (
              <>
                {dest.note && <p className="note-text">{dest.note}</p>}
                <button onClick={() => handleAddNote(dest.id)} className="add-destination-btn">
                  {dest.note ? "Edit Note" : "Add Note"}
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default MapPage;
