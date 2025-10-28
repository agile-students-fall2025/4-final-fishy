import React from 'react';

function Navigation({ currentPage, onPageChange }) {
  const navItems = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'trips', label: 'Trips', icon: '✈️' },
    { id: 'map', label: 'Map', icon: '🗺️' },
    { id: 'budget', label: 'Budget', icon: '💰' },
    { id: 'weather', label: 'Weather', icon: '🌤️' }
  ];

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h1>TripMate</h1>
      </div>
      <div className="navbar-nav">
        {navItems.map(item => (
          <button
            key={item.id}
            className={`nav-item ${currentPage === item.id ? 'active' : ''}`}
            onClick={() => onPageChange(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}

export default Navigation;
