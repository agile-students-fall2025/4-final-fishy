import React, { useState } from 'react';

function RegistrationPage({ onRegister, onNavigateLogin }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    // Example: Mock registration success
    onRegister?.({ name, email });
    alert('Account created successfully!');
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2 className="login-title">Create Your Account</h2>
        <p className="login-subtitle">Join TripMate and start your journey</p>

        <form className="tm-form" onSubmit={handleSubmit}>
          <div>
            <label className="tm-label">Full Name</label>
            <input
              type="text"
              className="tm-input"
              placeholder="Jane Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="tm-label">Email</label>
            <input
              type="email"
              className="tm-input"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="tm-label">Password</label>
            <input
              type="password"
              className="tm-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="tm-label">Confirm Password</label>
            <input
              type="password"
              className="tm-input"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <div className="tm-actions">
            <button type="submit" className="tm-btn tm-btn--primary">
              Sign Up
            </button>
          </div>
        </form>

        <p className="signup-hint">
          Already have an account?{' '}
          <span className="signup-link" onClick={onNavigateLogin}>
            Log In
          </span>
        </p>
      </div>
    </div>
  );
}

export default RegistrationPage;