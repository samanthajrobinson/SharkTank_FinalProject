import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from "react-router-dom";

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
      <AppLayout user={user} logout={logout} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={!user ? <SignUp /> : <Navigate to="/closet" />} />
        <Route path="/closet" element={user ? <Closet /> : <Navigate to="/signup" />} />
        <Route path="/generator" element={user ? <Generator /> : <Navigate to="/signup" />} />
        <Route path="/profile" element={user ? <Profile /> : <Navigate to="/signup" />} />
      </Routes>
    </Router>
  );
}

function AppLayout({ user, logout }) {
  const location = useLocation();

  const navLinkStyle = (isActive) => ({
    textDecoration: "none",
    color: isActive ? "#ffffff" : "#2a2a2a",
    background: isActive ? "#1f1f1f" : "transparent",
    padding: "10px 16px",
    borderRadius: "999px",
    fontWeight: "600",
    fontSize: "1rem",
    transition: "0.2s ease",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
  });

  return (
    <div
      style={{
        maxWidth: "1280px",
        margin: "0 auto",
        padding: "20px 32px 0 32px",
      }}
    >
      <nav
        style={{
          background: "rgba(255,255,255,0.72)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          border: "1px solid rgba(255,255,255,0.65)",
          borderRadius: "24px",
          padding: "14px 18px",
          boxShadow: "0 10px 28px rgba(0,0,0,0.06)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "16px",
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            flexWrap: "wrap",
          }}
        >
          <Link to="/" style={navLinkStyle(location.pathname === "/")}>
            Home
          </Link>

          {!user && (
            <Link to="/signup" style={navLinkStyle(location.pathname === "/signup")}>
              Sign Up
            </Link>
          )}

          {user && (
            <>
              <Link
                to="/closet"
                style={navLinkStyle(location.pathname === "/closet")}
              >
                Closet
              </Link>

              <Link
                to="/generator"
                style={navLinkStyle(location.pathname === "/generator")}
              >
                Generator
              </Link>

              <Link
                to="/profile"
                style={navLinkStyle(location.pathname === "/profile")}
              >
                Profile
              </Link>
            </>
          )}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginLeft: "auto",
          }}
        >
          {user && (
            <>
              <button
                onClick={logout}
                style={{
                  border: "none",
                  borderRadius: "999px",
                  padding: "12px 18px",
                  background: "#1f1f1f",
                  color: "#ffffff",
                  fontWeight: "600",
                  fontSize: "0.95rem",
                  cursor: "pointer",
                  boxShadow: "0 8px 18px rgba(0,0,0,0.12)",
                }}
              >
                Log Out
              </button>
            </>
          )}
        </div>
      </nav>
    </div>
  );
}