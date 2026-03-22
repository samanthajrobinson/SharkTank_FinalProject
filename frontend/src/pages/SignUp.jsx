import React, { useState } from "react";
import { saveAuth } from "../auth";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001";

export default function SignUp() {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");

    const endpoint =
      mode === "login"
        ? `${API_BASE}/api/auth/login`
        : `${API_BASE}/api/auth/register`;

    const payload =
      mode === "login"
        ? { email: form.email, password: form.password }
        : {
            username: form.username,
            email: form.email,
            password: form.password,
          };

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || data.message || "Request failed");
        return;
      }

      saveAuth(data.token, data.user);
      window.location.href = "/";
    } catch (error) {
      setMessage("Something went wrong");
    }
  }

  return (
    <main className="site-page">
      <section className="site-container" style={{ maxWidth: "620px" }}>
        <section style={{ marginBottom: "28px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: "16px",
              flexWrap: "wrap",
            }}
          >
            <div>
              <h1
                style={{
                  fontSize: "3.5rem",
                  margin: 0,
                  color: "#1f1f1f",
                  letterSpacing: "-1px",
                }}
              >
                {mode === "login" ? "Log In" : "Sign Up"}
              </h1>

              <p
                style={{
                  marginTop: "10px",
                  marginBottom: 0,
                  color: "#666",
                  fontSize: "1.1rem",
                }}
              >
                Access your digital closet and generate personalized looks.
              </p>
            </div>

            <div className="kicker-pill">FitMatch</div>
          </div>
        </section>

        <section className="section-card">
          <div
            style={{
              marginBottom: "22px",
              padding: "18px 20px",
              borderRadius: "22px",
              background: "#f4f1ed",
              border: "1px solid #e6e0d9",
            }}
          >
          </div>

          <div
            style={{
              display: "flex",
              gap: "10px",
              marginBottom: "22px",
            }}
          >
            <button
              type="button"
              onClick={() => setMode("login")}
              style={mode === "login" ? activeTab : tab}
            >
              Log In
            </button>

            <button
              type="button"
              onClick={() => setMode("signup")}
              style={mode === "signup" ? activeTab : tab}
            >
              Sign Up
            </button>
          </div>

          <form
            onSubmit={handleSubmit}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "14px",
            }}
          >
            {mode === "signup" && (
              <input
                name="username"
                placeholder="Username"
                value={form.username}
                onChange={handleChange}
                required
                className="field2"
              />
            )}

            <input
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              className="field2"
            />

            <input
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              className="field2"
            />

            <button
              type="submit"
              className="primary-pill"
              style={{
                marginTop: "6px",
                padding: "14px 18px",
                fontSize: "1rem",
              }}
            >
              {mode === "login" ? "Log In" : "Create Account"}
            </button>
          </form>

          {message ? (
            <div
              style={{
                marginTop: "18px",
                background: "#fbeaea",
                color: "#9f2d2d",
                borderRadius: "16px",
                padding: "14px 16px",
              }}
            >
              {message}
            </div>
          ) : null}
        </section>

        <footer className="footer">
          <span style={{ color: "#1f57b8", fontWeight: "700" }}>FitMatch</span>
          {" • "}CS 341{" • "}Samantha Robinson
        </footer>
      </section>
    </main>
  );
}

const tab = {
  flex: 1,
  border: "none",
  borderRadius: "999px",
  padding: "12px 14px",
  background: "#ece7e2",
  color: "#222",
  cursor: "pointer",
  fontWeight: "700",
};

const activeTab = {
  ...tab,
  background: "#1f1f1f",
  color: "#fff",
};
