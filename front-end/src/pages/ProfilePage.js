import React from 'react';

function ProfilePage({ user, onClose, onLogout }) {
  return (
    <div className="profile-page">
      <div className="profile-card">
        <button className="close-btn" onClick={onClose}>×</button>
        <h2>{user.username}'s Profile</h2>
        <p>Email: {user.email}</p>
        <button className="btn logout-btn" onClick={onLogout}>Logout</button>
      </div>
    </div>
  );
}

export default ProfilePage;