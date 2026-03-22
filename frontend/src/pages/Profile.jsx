import React, { useEffect, useState } from "react";
import { authHeaders } from "../auth";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5001";

export default function Profile() {
  const [favoriteOutfits, setFavoriteOutfits] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadFavorites();
  }, []);

  async function loadFavorites() {
    try {
      setMessage("");

      const res = await fetch(`${API_BASE}/api/outfits/mine`, {
        headers: {
          ...authHeaders(),
        },
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Failed to load favorite outfits.");
        setFavoriteOutfits([]);
        return;
      }

      const favoritesOnly = (Array.isArray(data) ? data : []).filter(
        (outfit) => outfit.favorite,
      );

      setFavoriteOutfits(favoritesOnly);
    } catch (error) {
      console.error("Failed to load favorite outfits:", error);
      setMessage("Failed to load favorite outfits.");
      setFavoriteOutfits([]);
    }
  }

  async function removeFavorite(outfitToRemove) {
    try {
      const res = await fetch(`${API_BASE}/api/outfits/unfavorite`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...authHeaders(),
        },
        body: JSON.stringify({
          top: outfitToRemove.top,
          bottom: outfitToRemove.bottom,
          shoes: outfitToRemove.shoes,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Failed to remove favorite outfit.");
        return;
      }

      setFavoriteOutfits((prev) =>
        prev.filter((outfit) => outfit._id !== outfitToRemove._id),
      );
    } catch (error) {
      console.error("Failed to remove favorite outfit:", error);
      setMessage("Failed to remove favorite outfit.");
    }
  }

  return (
    <main className="site-page">
      <div className="site-container">
        <section style={{ marginBottom: "28px" }}>
          <h1
            style={{
              fontSize: "2.4rem",
              margin: 0,
              color: "#1f1f1f",
              letterSpacing: "-1px",
            }}
          >
            Your Profile
          </h1>

          <p
            style={{
              marginTop: "8px",
              marginBottom: 0,
              color: "#666",
              fontSize: "1.1rem",
            }}
          >
            View and manage your favorited outfits.
          </p>
        </section>

        {message ? <div className="status-error">{message}</div> : null}

        <section className="section-card">
          {favoriteOutfits.length === 0 ? (
            <div className="empty-state">No favorite outfits saved yet.</div>
          ) : (
            <div className="cards-grid">
              {favoriteOutfits.map((outfit, index) => (
                <article
                  key={outfit._id || index}
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
                    <h2
                      className="editorial-card-title"
                      style={{
                        fontSize: "1.5rem",
                        margin: 0,
                      }}
                    >
                      {outfit.name || `Saved Look ${index + 1}`}
                    </h2>

                    <button
                      onClick={() => removeFavorite(outfit)}
                      className="circle-action active"
                      aria-label="Remove from favorites"
                    >
                      ♥
                    </button>
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
                          height: "30s0px",
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
              ))}
            </div>
          )}
        </section>

        <footer className="footer">
          FitMatch • CS 341 • Samantha Robinson
        </footer>
      </div>
    </main>
  );
}