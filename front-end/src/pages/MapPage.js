// File: src/pages/MapPage.js

import React, { useState } from "react";

function MapPage() {
  const [destinations, setDestinations] = useState([]);
  const [newDestination, setNewDestination] = useState("");
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [tasks, setTasks] = useState({});
  const [newTask, setNewTask] = useState("");

  const handleAddDestination = () => {
    if (!newDestination.trim()) return;
    const destination = {
      id: Date.now(),
      name: newDestination.trim(),
      coords: null, // Placeholder for API integration later
    };
    setDestinations((prev) => [...prev, destination]);
    setNewDestination("");
  };

  const handleSelectDestination = (id) => {
    setSelectedDestination(id === selectedDestination ? null : id);
  };

  const handleAddTask = (destinationId) => {
    if (!newTask.trim()) return;
    setTasks((prev) => ({
      ...prev,
      [destinationId]: [...(prev[destinationId] || []), newTask.trim()],
    }));
    setNewTask("");
  };

  return (
    <div className="map-page">
      <div className="welcome-section">
        <h2>Travel Map</h2>
        <p>View your destinations and organize your trip tasks.</p>
      </div>

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

      <div className="map-container">
        <p>[Interactive Map Placeholder – connect Google Maps later]</p>
      </div>

      <div className="destination-list">
        {destinations.length === 0 && (
          <p className="no-data">No destinations yet. Add one above.</p>
        )}

        {destinations.map((dest) => (
          <div key={dest.id} className="destination-card">
            <div
              className="destination-header"
              onClick={() => handleSelectDestination(dest.id)}
            >
              <h3>{dest.name}</h3>
              <span>{selectedDestination === dest.id ? "▲" : "▼"}</span>
            </div>

            {selectedDestination === dest.id && (
              <div className="destination-tasks">
                <ul>
                  {(tasks[dest.id] || []).map((task, index) => (
                    <li key={index}>• {task}</li>
                  ))}
                  {(!tasks[dest.id] || tasks[dest.id].length === 0) && (
                    <li className="no-tasks">No tasks yet</li>
                  )}
                </ul>

                <div className="task-input">
                  <input
                    type="text"
                    placeholder="Add a task..."
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                  />
                  <button onClick={() => handleAddTask(dest.id)}>Add Task</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default MapPage;
