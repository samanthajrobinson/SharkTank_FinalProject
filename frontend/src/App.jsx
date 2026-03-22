import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
  useLocation,
} from "react-router-dom";

import Home from "./pages/Home";
import Closet from "./pages/Closet";
import Generator from "./pages/Generator";
import Profile from "./pages/Profile";
import SignUp from "./pages/SignUp";
import { clearAuth, getUser } from "./auth";

export default function App() {
  const [user, setUser] = useState(getUser());

  function logout() {
    clearAuth();
    setUser(null);
    window.location.href = "/";
  }

  return (
    <Router>
      <div id="app-shell">
        <AppLayout user={user} logout={logout} />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/signup"
            element={!user ? <SignUp /> : <Navigate to="/closet" />}
          />
          <Route
            path="/closet"
            element={user ? <Closet /> : <Navigate to="/signup" />}
          />
          <Route
            path="/generator"
            element={user ? <Generator /> : <Navigate to="/signup" />}
          />
          <Route
            path="/profile"
            element={user ? <Profile /> : <Navigate to="/signup" />}
          />
        </Routes>
      </div>
    </Router>
  );
}

function AppLayout({ user, logout }) {
  const location = useLocation();

  function getNavClass(path) {
    return location.pathname === path ? "nav-pill active" : "nav-pill";
  }

  return (
    <header className="site-header">
      <div className="site-container">
        <nav className="top-nav">
          <div className="nav-links">
            <Link to="/" className={getNavClass("/")}>
              Home
            </Link>

            {!user && (
              <Link to="/signup" className={getNavClass("/signup")}>
                Sign Up
              </Link>
            )}

            {user && (
              <>
                <Link to="/closet" className={getNavClass("/closet")}>
                  Closet
                </Link>

                <Link to="/generator" className={getNavClass("/generator")}>
                  Generator
                </Link>

                <Link to="/profile" className={getNavClass("/profile")}>
                  Profile
                </Link>
              </>
            )}
          </div>

          {user ? (
            <button type="button" onClick={logout} className="primary-pill">
              Log Out
            </button>
          ) : null}
        </nav>
      </div>
    </header>
  );
}