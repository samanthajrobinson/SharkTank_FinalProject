import React, { useEffect, useMemo, useState } from "react";
import { authHeaders } from "../auth";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5001";

export default function Generator() {
  const [outfits, setOutfits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    loadFavoriteIds();
    generateMultipleOutfits();
  }, []);

  function getOutfitSignature(outfit) {
    const topId =
      outfit?.top?._id || outfit?.top?.id || outfit?.top?.name || "top";
    const bottomId =
      outfit?.bottom?._id ||
      outfit?.bottom?.id ||
      outfit?.bottom?.name ||
      "bottom";
    const shoesId =
      outfit?.shoes?._id || outfit?.shoes?.id || outfit?.shoes?.name || "shoes";

    return `${topId}-${bottomId}-${shoesId}`;
  }

  async function loadFavoriteIds() {
    try {
      const res = await fetch(`${API_BASE}/api/outfits/mine`, {
        headers: {
          ...authHeaders(),
        },
      });

      const data = await res.json();

      if (!res.ok) {
        setFavoriteIds([]);
        return;
      }

      const ids = (Array.isArray(data) ? data : [])
        .filter((outfit) => outfit.favorite)
        .map((outfit) => getOutfitSignature(outfit))
        .filter(Boolean);

      setFavoriteIds(ids);
    } catch (error) {
      console.error("Failed to load favorites:", error);
      setFavoriteIds([]);
    }
  }

  async function generateMultipleOutfits() {
    setLoading(true);
    setErrorMessage("");

    try {
      const res = await fetch(`${API_BASE}/api/outfits/generate-multiple`, {
        method: "GET",
        headers: {
          ...authHeaders(),
        },
      });

      const data = await res.json();

      if (!res.ok) {
        setOutfits([]);
        setErrorMessage(
          data.error ||
            "No outfits could be generated yet. Make sure you have at least one top, one bottom, and one pair of shoes.",
        );
        return;
      }

      setOutfits(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      setOutfits([]);
      setErrorMessage("Failed to generate outfits.");
    } finally {
      setLoading(false);
    }
  }

  function isFavorited(outfit) {
    return favoriteIds.includes(getOutfitSignature(outfit));
  }

  async function saveFavoriteToDB(outfit) {
    const res = await fetch(`${API_BASE}/api/outfits/favorite`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders(),
      },
      body: JSON.stringify({
        top: outfit.top,
        bottom: outfit.bottom,
        shoes: outfit.shoes,
        name: outfit.name || "",
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Failed to save favorite");
    }

    return data;
  }

  async function removeFavoriteFromDB(outfit) {
    const res = await fetch(`${API_BASE}/api/outfits/unfavorite`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders(),
      },
      body: JSON.stringify({
        top: outfit.top,
        bottom: outfit.bottom,
        shoes: outfit.shoes,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Failed to unfavorite");
    }

    return data;
  }

  async function toggleFavorite(outfit) {
    try {
      const signature = getOutfitSignature(outfit);

      if (favoriteIds.includes(signature)) {
        await removeFavoriteFromDB(outfit);
        setFavoriteIds((prev) => prev.filter((id) => id !== signature));
      } else {
        await saveFavoriteToDB(outfit);
        setFavoriteIds((prev) => [...prev, signature]);
      }
    } catch (error) {
      console.error("Failed to update favorite:", error);
    }
  }

  const favoriteCount = useMemo(() => favoriteIds.length, [favoriteIds]);

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
                Generator
              </h1>
              <p className="hero-text">
                Curated looks generated from your own closet, with favorites saved
                directly to your profile and community feed.
              </p>
            </div>

            <div className="kicker-pill">
              {favoriteCount} favorite{favoriteCount === 1 ? "" : "s"}
            </div>
          </div>
        </section>

        <section className="section-card">
          <div className="section-header">
            <div>
              <h2 className="section-title">Outfit Generator</h2>
              <p className="section-subtext">
                Generate styled looks using your uploaded tops, bottoms, and shoes.
              </p>
            </div>

            <button className="primary-pill" onClick={generateMultipleOutfits}>
              Regenerate Looks
            </button>
          </div>

          {loading && (
            <div className="empty-state">Generating outfits...</div>
          )}

          {!loading && errorMessage && (
            <div className="status-error">{errorMessage}</div>
          )}

          {!loading && !errorMessage && outfits.length > 0 && (
            <div className="cards-grid">
              {outfits.map((outfit, index) => {
                const favorited = isFavorited(outfit);

                return (
                  <article
                    key={getOutfitSignature(outfit) + index}
                    className="editorial-card"
                  >
                    <div className="editorial-card-header">
                      <div>
                        <h2 className="editorial-card-title">
                          Look {index + 1}
                        </h2>
                        <p
                          style={{
                            margin: "6px 0 0 0",
                            color: "#777",
                            fontSize: "0.95rem",
                          }}
                        >
                          Generated from your closet
                        </p>
                      </div>

                      <button
                        onClick={() => toggleFavorite(outfit)}
                        aria-label={
                          favorited
                            ? "Remove from favorites"
                            : "Save to favorites"
                        }
                        className={`circle-action ${favorited ? "active" : ""}`}
                      >
                        ♥
                      </button>
                    </div>

                    <div className="outfit-editorial-grid">
                      <OutfitPiece
                        label="Top"
                        item={outfit.top}
                        type="top"
                        hero
                      />
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
                );
              })}
            </div>
          )}

          {!loading && !errorMessage && outfits.length === 0 && (
            <div className="empty-state">
              No outfits generated yet.
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