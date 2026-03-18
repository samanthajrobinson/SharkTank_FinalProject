import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOutfit } from '../context/OutfitContext.jsx';

export default function AuthPage() {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [message, setMessage] = useState('');
  const { login, user } = useOutfit();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');

    try {
      await login(form, mode);
      navigate('/saved');
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <main className="container auth-layout">
      <section className="card auth-card">
        <p className="eyebrow">Protected route demo</p>
        <h1>{user ? `Welcome back, ${user.username}` : 'Create an account or log in'}</h1>
        <p>
          This page demonstrates registration, login, hashed passwords, protected routes, and authenticated API requests.
        </p>

        <div className="mode-toggle">
          <button type="button" onClick={() => setMode('login')} className={mode === 'login' ? 'active' : ''}>Login</button>
          <button type="button" onClick={() => setMode('register')} className={mode === 'register' ? 'active' : ''}>Register</button>
        </div>

        <form className="form-grid" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username">Username or Email</label>
            <input
              id="username"
              type="text"
              required
              value={form.username}
              onChange={(event) => setForm((current) => ({ ...current, username: event.target.value }))}
            />
          </div>
          {mode === 'register' ? (
            <div>
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                required
                value={form.email}
                onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
              />
            </div>
          ) : null}
          <div>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              minLength="6"
              required
              value={form.password}
              onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
            />
          </div>
          <button type="submit">{mode === 'login' ? 'Log In' : 'Register'}</button>
        </form>

        {message ? <p className="status-message">{message}</p> : null}
      </section>
    </main>
  );
}
