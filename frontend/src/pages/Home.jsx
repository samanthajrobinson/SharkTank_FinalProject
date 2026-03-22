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
              <h1 className="hero-title">FitMatch</h1>
              <p className="hero-text">
                Browse community favorite outfits from all users and get inspired
                by saved looks across FitMatch.
              </p>
            </div>

            <div className="kicker-pill">2026</div>
          </div>
        </section>

        <section className="section-card">
          <div className="section-header">
            <div>
              <h2 className="section-title">Community Favorites</h2>
              <p className="section-subtext">
                Favorited outfits from all users.
              </p>
            </div>

            <span className="section-subtext">
              {favoriteOutfits.length} saved look
              {favoriteOutfits.length === 1 ? "" : "s"}
            </span>
          </div>

          {message ? <div className="status-error">{message}</div> : null}

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
              <h2 className="section-title">Product Demo</h2>
              <p className="section-subtext">
                A quick look at how FitMatch works.
              </p>
            </div>
          </div>

          <video
            controls
            width="100%"
            style={{
              borderRadius: "24px",
              display: "block",
              width: "100%",
              background: "#000",
            }}
          >
            <source src="/demo.mp4" type="video/mp4" />
          </video>
        </section>

        <footer className="footer">
          FitMatch • CS 341 • Samantha Robinson
        </footer>
      </div>
    </main>
  );
}

function FavoriteOutfitCard({ outfit, index }) {
  return (
    <article className="editorial-card">
      <div className="editorial-card-header">
        <div>
          <h3 className="editorial-card-title">
            {outfit.name || `Saved Look ${index + 1}`}
          </h3>
          <p
            style={{
              margin: "6px 0 0 0",
              color: "#777",
              fontSize: "0.95rem",
            }}
          >
            By {outfit.userId?.username || "Unknown user"}
          </p>
        </div>

        <div className="kicker-pill">Favorite</div>
      </div>

      <div className="outfit-editorial-grid">
        <OutfitPiece label="Top" item={outfit.top} type="top" hero />
        <OutfitPiece label="Bottom" item={outfit.bottom} type="bottom" />
        <OutfitPiece label="Shoes" item={outfit.shoes} type="shoes" />
      </div>
    </article>
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