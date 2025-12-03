import React from 'react';
import { useAuth } from '../context/AuthContext';

function ProfilePage({ onClose, onLogout }) {
  const { user } = useAuth();
  
  if (!user) {
    return (
      <div className="profile-page">
        <div className="profile-card">
          <h2>No user found. Are you logged in?</h2>
        </div>
      </div>
    );
  }
  return (
    <div className="profile-page">
      <div className="profile-card">
        <h2>{user.username}'s Profile</h2>
        <p>Email: {user.email}</p>
        <button className="btn logout-btn" onClick={onLogout}>Logout</button>
      </div>
    </div>
  );
}

export default ProfilePage;