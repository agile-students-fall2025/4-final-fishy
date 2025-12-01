import React, { useState } from 'react';

function Navigation({ currentPage, onPageChange, onNavigate, user }) {
  const navigate = onNavigate || onPageChange;
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'trips', label: 'Trips', icon: '✈️' },
    { id: 'map', label: 'Map', icon: '🗺️' },
    { id: 'budget', label: 'Budget', icon: '💰' },
    { id: 'weather', label: 'Weather', icon: '🌤️' }
  ];

  const toggleDropdown = () => {
    setShowAccountDropdown(prev => !prev);
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h1>TripMate</h1>
      </div>

      <div className="navbar-nav">
        {navItems.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${currentPage === item.id ? "active" : ""}`}
            onClick={() => onNavigate(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </button>
        ))}

        <div className="account-container">
          {user ? (
            <button
              className={`nav-item ${currentPage === "profile" ? "active" : ""}`}
              onClick={() => onNavigate("profile")}
            >
              <span className="nav-icon">👤</span>
              <span className="nav-label">Profile</span>
            </button>
          ) : (
            <div className="dropdown-wrapper">
              <button className="nav-item" onClick={toggleDropdown}>
                <span className="nav-label">Account ⏷</span>
              </button>

              {showAccountDropdown && (
                <div className="account-dropdown">
                  <button
                    className="dropdown-item"
                    onClick={() => {
                      setShowAccountDropdown(false);
                      onNavigate("login");
                    }}
                  >
                    Login
                  </button>
                  <button
                    className="dropdown-item"
                    onClick={() => {
                      setShowAccountDropdown(false);
                      onNavigate("register");
                    }}
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navigation;