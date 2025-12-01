import React, { useState } from 'react';

function LoginPage({ onLogin, onNavigateRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('http://localhost:4000/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || 'Login failed');
        return;
      }

      // Save user and token in parent state
      onLogin?.({ user: data.user, token: data.token });

      // No alert here
      // You can redirect or update UI instead
    } catch (err) {
      console.error(err);
      alert('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2 className="login-title">Log In</h2>
        <p className="login-subtitle">Welcome back to TripMate</p>

        <form className="tm-form" onSubmit={handleSubmit}>
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

          <div className="tm-actions">
            <button type="submit" className="tm-btn tm-btn--primary" disabled={loading}>
              {loading ? 'Logging in...' : 'Log In'}
            </button>
          </div>
        </form>

        <p className="signup-hint">
          Don't have an account?{' '}
          <span className="signup-link" onClick={onNavigateRegister}>
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;