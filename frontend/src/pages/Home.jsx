import React, { useEffect, useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001";

export default function Home() {
  const [favoriteOutfits, setFavoriteOutfits] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadFavorites();
  }, []);

  async function loadFavorites() {
    try {
      setMessage("");

      const res = await fetch(`${API_BASE}/api/outfits/favorites/all`);
      const text = await res.text();

      let data = null;
      try {
        data = JSON.parse(text);
      } catch {
        data = null;
      }

      if (!res.ok) {
        setMessage(data?.error || "Failed to load favorite outfits.");
        setFavoriteOutfits([]);
        console.error("Favorites route failed:", res.status, text);
        return;
      }

      setFavoriteOutfits(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load favorite outfits:", error);
      setMessage("Failed to load favorite outfits.");
      setFavoriteOutfits([]);
    }
  }

  return (
    <main className="site-page">
      <div className="site-container">
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
                Home
              </h1>

              <p
                style={{
                  marginTop: "10px",
                  marginBottom: 0,
                  color: "#666",
                  fontSize: "1.1rem",
                  maxWidth: "720px",
                }}
              >
                Browse community favorite outfits from all users and get inspired
                by saved looks across FitMatch.
              </p>
            </div>

            <div
              className="kicker-pill"
              style={{
                color: "#1f57b8",
                borderColor: "#1f57b8",
              }}
            >
              2026
            </div>
          </div>
        </section>

        {message ? <div className="status-error">{message}</div> : null}

        <section className="section-card">
          <div className="section-header">
            <div>
              <h2 className="section-title">Community Favorites</h2>
              <p className="section-subtext">
                Favorited outfits shared by FitMatch users.
              </p>
            </div>

            <span
              style={{
                color: "#1f57b8",
                fontSize: "1rem",
                fontWeight: "700",
              }}
            >
              {favoriteOutfits.length} saved look
              {favoriteOutfits.length === 1 ? "" : "s"}
            </span>
          </div>

          {favoriteOutfits.length === 0 ? (
            <div className="empty-state">No favorite outfits yet.</div>
          ) : (
            <div className="cards-grid">
              {favoriteOutfits.map((outfit, index) => (
                <FavoriteOutfitCard
                  key={outfit._id || index}
                  outfit={outfit}
                  index={index}
                />
              ))}
            </div>
          )}
        </section>

        <section className="section-card">
          <div className="section-header">
            <div>
              <h2 className="section-title">Why FitMatch</h2>
              <p className="section-subtext">
                A smarter way to organize your closet and generate outfits.
              </p>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "18px",
            }}
          >
            <article
              style={{
                background: "#f4f1ed",
                borderRadius: "22px",
                padding: "22px",
                border: "1px solid #e6e0d9",
              }}
            >
              <div
                style={{
                  color: "#1f57b8",
                  fontSize: "0.95rem",
                  fontWeight: "800",
                  marginBottom: "10px",
                  letterSpacing: "0.04em",
                }}
              >
                DIGITAL CLOSET
              </div>
              <p
                style={{
                  margin: 0,
                  color: "#444",
                  lineHeight: 1.6,
                }}
              >
                Upload your tops, bottoms, and shoes into one organized space.
              </p>
            </article>

            <article
              style={{
                background: "#f4f1ed",
                borderRadius: "22px",
                padding: "22px",
                border: "1px solid #e6e0d9",
              }}
            >
              <div
                style={{
                  color: "#1f57b8",
                  fontSize: "0.95rem",
                  fontWeight: "800",
                  marginBottom: "10px",
                  letterSpacing: "0.04em",
                }}
              >
                OUTFIT GENERATION
              </div>
              <p
                style={{
                  margin: 0,
                  color: "#444",
                  lineHeight: 1.6,
                }}
              >
                Instantly generate complete looks using your own uploaded pieces.
              </p>
            </article>

            <article
              style={{
                background: "#f4f1ed",
                borderRadius: "22px",
                padding: "22px",
                border: "1px solid #e6e0d9",
              }}
            >
              <div
                style={{
                  color: "#1f57b8",
                  fontSize: "0.95rem",
                  fontWeight: "800",
                  marginBottom: "10px",
                  letterSpacing: "0.04em",
                }}
              >
                COMMUNITY FEED
              </div>
              <p
                style={{
                  margin: 0,
                  color: "#444",
                  lineHeight: 1.6,
                }}
              >
                Explore favorited outfits from other users for inspiration.
              </p>
            </article>
          </div>
        </section>

        <footer className="footer">
          <span style={{ color: "#1f57b8", fontWeight: "700" }}>FitMatch</span>
          {" • "}CS 341{" • "}Samantha Robinson
        </footer>
      </div>
    </main>
  );
}

function FavoriteOutfitCard({ outfit, index }) {
  return (
    <article
      className="editorial-card"
      style={{
        padding: "16px",
      }}
    >
      <div
        className="editorial-card-header"
        style={{
          marginBottom: "10px",
        }}
      >
        <div>
          <h2
            className="editorial-card-title"
            style={{
              fontSize: "1.5rem",
              margin: 0,
            }}
          >
            {outfit.name || `Saved Look ${index + 1}`}
          </h2>

          <p
            style={{
              margin: "6px 0 0 0",
              color: "#1f57b8",
              fontSize: "0.95rem",
              fontWeight: "700",
            }}
          >
            {outfit.userId?.username || "Unknown user"}
          </p>
        </div>

        <div
          className="kicker-pill"
          style={{
            color: "#1f57b8",
            borderColor: "#1f57b8",
          }}
        >
          Favorite
        </div>
      </div>

      <div
        style={{
          background: "#f3f1ee",
          borderRadius: "24px",
          padding: "16px",
          minHeight: "560px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {outfit.top && (
          <div
            style={{
              position: "absolute",
              top: "10px",
              left: "50%",
              transform: "translateX(-50%)",
              width: "82%",
              height: "220px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 2,
            }}
          >
            <img
              src={outfit.top.image}
              alt=""
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                objectFit: "contain",
                display: "block",
                filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.08))",
              }}
            />
          </div>
        )}

        {outfit.bottom && (
          <div
            style={{
              position: "absolute",
              top: "190px",
              left: "50%",
              transform: "translateX(-50%)",
              width: "68%",
              height: "240px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1,
            }}
          >
            <img
              src={outfit.bottom.image}
              alt=""
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                objectFit: "contain",
                display: "block",
                filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.08))",
              }}
            />
          </div>
        )}

        {outfit.shoes && (
          <div
            style={{
              position: "absolute",
              bottom: "12px",
              left: "50%",
              transform: "translateX(-50%)",
              width: "42%",
              height: "110px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 2,
            }}
          >
            <img
              src={outfit.shoes.image}
              alt=""
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                objectFit: "contain",
                display: "block",
                filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.08))",
              }}
            />
          </div>
        )}
      </div>
    </article>
  );
}