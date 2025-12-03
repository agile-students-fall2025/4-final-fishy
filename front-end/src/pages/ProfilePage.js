import React from 'react';

function ProfilePage({ user, onClose, onLogout }) {
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