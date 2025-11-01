import React, { useState } from 'react';

function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (email === 'test@example.com' && password === 'password') {
      onLogin?.({ email });
    } else {
      alert('Invalid email or password');
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2 className="login-title">Welcome Back </h2>
        <p className="login-subtitle">Log in to continue your adventures</p>
        <br></br>
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
            <button type="submit" className="tm-btn tm-btn--primary">
              Log In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
