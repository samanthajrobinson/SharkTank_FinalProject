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
        <section className="hero-card">
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
              <h1 className="hero-title" style={{ fontSize: "clamp(3rem, 7vw, 6rem)" }}>
                Profile
              </h1>
              <p className="hero-text">
                Your saved favorite outfits, curated from your personal closet.
              </p>
            </div>

            <div className="kicker-pill">
              {favoriteOutfits.length} saved look
              {favoriteOutfits.length === 1 ? "" : "s"}
            </div>
          </div>
        </section>

        <section className="section-card">
          <div className="section-header">
            <div>
              <h2 className="section-title">Saved Looks</h2>
              <p className="section-subtext">
                Manage your favorited outfits and remove looks you no longer want
                to keep.
              </p>
            </div>
          </div>

          {message ? <div className="status-error">{message}</div> : null}

          {favoriteOutfits.length === 0 ? (
            <div className="empty-state">No favorite outfits saved yet.</div>
          ) : (
            <div className="cards-grid">
              {favoriteOutfits.map((outfit, index) => (
                <article key={outfit._id || index} className="editorial-card">
                  <div className="editorial-card-header">
                    <div>
                      <h2 className="editorial-card-title">
                        {outfit.name || `Saved Look ${index + 1}`}
                      </h2>
                      <p
                        style={{
                          margin: "6px 0 0 0",
                          color: "#777",
                          fontSize: "0.95rem",
                        }}
                      >
                        Favorited outfit
                      </p>
                    </div>

                    <button
                      onClick={() => removeFavorite(outfit)}
                      className="circle-action active"
                      aria-label="Remove from favorites"
                    >
                      ♥
                    </button>
                  </div>

                  <div className="outfit-editorial-grid">
                    <OutfitPiece label="Top" item={outfit.top} type="top" hero />
                    <OutfitPiece
                      label="Bottom"
                      item={outfit.bottom}
                      type="bottom"
                    />
                    <OutfitPiece
                      label="Shoes"
                      item={outfit.shoes}
                      type="shoes"
                    />
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

function OutfitPiece({ label, item, type, hero = false }) {
  const imageStyleByType = {
    top: { maxWidth: "72%", maxHeight: "220px" },
    bottom: { maxWidth: "62%", maxHeight: "220px" },
    shoes: { maxWidth: "72%", maxHeight: "120px" },
  };

  const imageStyle = imageStyleByType[type] || {
    maxWidth: "70%",
    maxHeight: "180px",
  };

  return (
    <section className={`piece-card ${hero ? "hero-piece" : ""}`}>
      <div className="piece-label">{label}</div>

      <div
        className="piece-image-box"
        style={{
          minHeight: type === "shoes" ? "180px" : "300px",
        }}
      >
        {item?.image ? (
          <img
            src={item.image}
            alt={item?.name || label}
            style={{
              ...imageStyle,
              width: "100%",
              height: "auto",
              objectFit: "contain",
              display: "block",
              filter: "drop-shadow(0 10px 18px rgba(0,0,0,0.10))",
            }}
          />
        ) : (
          <div style={{ color: "#999" }}>Missing item</div>
        )}
      </div>

      <p className="piece-name">{item?.name || "Unnamed item"}</p>
    </section>
  );
}