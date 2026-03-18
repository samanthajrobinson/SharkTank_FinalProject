import { NavLink } from 'react-router-dom';
import { useOutfit } from '../context/OutfitContext.jsx';

export default function Navbar() {
  const { user, logout } = useOutfit();

  return (
    <header className="hero-header">
      <div className="container nav-wrap">
        <div>
          <p className="eyebrow">Shark Tank Prototype</p>
          <NavLink className="brand" to="/">
            FitMatch
          </NavLink>
        </div>

        <nav className="navbar">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/generator">Generator</NavLink>
          <NavLink to="/saved">Saved Looks</NavLink>
          <NavLink to="/auth">{user ? 'Account' : 'Login'}</NavLink>
        </nav>

        <div className="user-chip-wrap">
          {user ? (
            <>
              <span className="user-chip">{user.username}</span>
              <button className="ghost-button" onClick={logout}>Log Out</button>
            </>
          ) : (
            <span className="user-chip muted">Guest Mode</span>
          )}
        </div>
      </div>
    </header>
  );
}
