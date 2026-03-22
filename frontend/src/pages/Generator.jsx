import React, { useEffect, useMemo, useState } from "react";
import { authHeaders } from "../auth";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001";

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
      <section className="site-container">
        <section style={{ marginBottom: "28px" }}>
          <h1
            style={{
              fontSize: "3.2rem",
              margin: 0,
              color: "#1f1f1f",
              letterSpacing: "-1px",
            }}
          >
            Outfit Generator
          </h1>

          <p
            style={{
              marginTop: "10px",
              marginBottom: 0,
              color: "#666",
              fontSize: "1.1rem",
            }}
          >
            Generate curated looks from your closet.
          </p>
        </section>

        <section className="section-card">
          <div className="section-header">
            <div>
              <h2
                className="section-title"
                style={{
                  fontSize: "2rem",
                }}
              >
                Generated Looks
              </h2>
              <p className="section-subtext">
                Save your favorites to your profile and community feed.
              </p>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "14px",
                flexWrap: "wrap",
              }}
            >
              <span
                style={{
                  color: "#1f57b8",
                  fontSize: "1rem",
                  fontWeight: "700",
                }}
              >
                {favoriteCount} favorite{favoriteCount === 1 ? "" : "s"}
              </span>

              <button
                className="primary-pill"
                onClick={generateMultipleOutfits}
              >
                Regenerate Looks
              </button>
            </div>
          </div>

          {loading && <div className="empty-state">Generating outfits...</div>}

          {!loading && errorMessage && (
            <div className="status-error">{errorMessage}</div>
          )}

          {!loading && !errorMessage && outfits.length > 0 && (
            <div className="generator-grid">
              {outfits.map((outfit, index) => {
                const favorited = isFavorited(outfit);

                return (
                  <article
                    key={getOutfitSignature(outfit) + index}
                    className="editorial-card fixed-outfit-card"
                    style={{
                      padding: "14px",
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
                          fontSize: "1.4rem",
                          margin: 0,
                        }}
                      >
                        Look {index + 1}
                      </h2>

                      <button
                        type="button"
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

                    <div
                      style={{
                        background: "#f3f1ee",
                        borderRadius: "24px",
                        padding: "16px",
                        width: "100%",
                        height: "600px",
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
                            width: "300px",
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
                              width: "300px",
                              height: "220px",
                              objectFit: "contain",
                              display: "block",
                              filter:
                                "drop-shadow(0 8px 16px rgba(0,0,0,0.08))",
                            }}
                          />
                        </div>
                      )}

                      {outfit.bottom && (
                        <div
                          style={{
                            position: "absolute",
                            top: "170px",
                            left: "50%",
                            transform: "translateX(-50%)",
                            width: "280px",
                            height: "260px",
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
                              width: "280px",
                              height: "260px",
                              objectFit: "contain",
                              display: "block",
                              filter:
                                "drop-shadow(0 8px 16px rgba(0,0,0,0.08))",
                            }}
                          />
                        </div>
                      )}

                      {outfit.shoes && (
                        <div
                          style={{
                            position: "absolute",
                            top: "400px",
                            left: "50%",
                            transform: "translateX(-50%)",
                            width: "160px",
                            height: "90px",
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
                              width: "160px",
                              height: "90px",
                              objectFit: "contain",
                              display: "block",
                              filter:
                                "drop-shadow(0 8px 16px rgba(0,0,0,0.08))",
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          {!loading && !errorMessage && outfits.length === 0 && (
            <div className="empty-state">No outfits generated yet.</div>
          )}
        </section>

        <footer className="footer">
          <span style={{ color: "#1f57b8", fontWeight: "700" }}>FitMatch</span>
          {" • "}CS 341{" • "}Samantha Robinson
        </footer>
      </section>
    </main>
  );
}
