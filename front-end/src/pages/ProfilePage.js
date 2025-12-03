import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

function ProfilePage({ onClose }) {
  const { user, logout } = useContext(AuthContext);
  if (!user) return null;
  return (
    <div className="profile-page">
      <div className="profile-card">
        <h2>{user.username}'s Profile</h2>
        <p>Email: {user.email}</p>
        <button className="btn logout-btn" onClick={logout}>Logout</button>
      </div>
    </div>
  );
}

export default ProfilePage;