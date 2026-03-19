import React, { useState } from "react";
import { saveAuth } from "../auth";

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
        ? "http://localhost:5001/api/auth/login"
        : "http://localhost:5001/api/auth/register";

    const payload =
      mode === "login"
        ? { email: form.email, password: form.password }
        : form;

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
        setMessage(data.error || "Request failed");
        return;
      }

      saveAuth(data.token, data.user);
      window.location.href = "/";
    } catch (error) {
      setMessage("Something went wrong");
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f7f5f2",
        padding: "32px",
      }}
    >
      <section
        style={{
          maxWidth: "520px",
          margin: "0 auto",
          background: "#fff",
          borderRadius: "28px",
          padding: "32px",
          boxShadow: "0 14px 34px rgba(0,0,0,0.08)",
        }}
      >
        <h1 style={{ marginTop: 0, fontSize: "2.5rem" }}>
          {mode === "login" ? "Log In" : "Sign Up"}
        </h1>

        <p style={{ color: "#666", marginBottom: "20px" }}>
          Default account: test@email.com / pw
        </p>

        <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
          <button
            onClick={() => setMode("login")}
            style={mode === "login" ? activeTab : tab}
          >
            Log In
          </button>
          <button
            onClick={() => setMode("signup")}
            style={mode === "signup" ? activeTab : tab}
          >
            Sign Up
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "12px" }}
        >
          {mode === "signup" && (
            <input
              name="username"
              placeholder="Username"
              value={form.username}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          )}

          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            style={inputStyle}
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            style={inputStyle}
          />

          <button type="submit" style={primaryButton}>
            {mode === "login" ? "Log In" : "Create Account"}
          </button>
        </form>

        {message && (
          <p style={{ marginTop: "16px", color: "#c0392b" }}>{message}</p>
        )}
      </section>
    </main>
  );
}

const inputStyle = {
  width: "100%",
  border: "1px solid #ddd6ce",
  borderRadius: "14px",
  padding: "12px 14px",
  fontSize: "0.95rem",
  background: "#fff",
  boxSizing: "border-box",
};

const primaryButton = {
  border: "none",
  borderRadius: "999px",
  padding: "12px 18px",
  background: "#1f1f1f",
  color: "#fff",
  fontSize: "0.95rem",
  fontWeight: "600",
  cursor: "pointer",
};

const tab = {
  flex: 1,
  border: "none",
  borderRadius: "999px",
  padding: "10px 14px",
  background: "#ece7e2",
  color: "#222",
  cursor: "pointer",
};

const activeTab = {
  ...tab,
  background: "#1f1f1f",
  color: "#fff",
};